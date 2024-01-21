const { user, roles, transactions } = require("../../models");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const data = req.body;
    const validasiEmail = await user.findOne({
      where: {
        email: data.email,
      },
    });

    if (validasiEmail === null) {
      const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        role_id: Joi.string().min(3).required(),
      });

      const { error } = schema.validate(data);

      if (error) {
        return res.status(400).send({
          status: "error",
          message: error.details[0].message,
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);

      const newUser = await user.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role_id: data.role_id,
      });

      res.status(200).send({
        status: "success",
        message: "account created",
        data: {
          name: newUser.name,
          email: newUser.email,
          role: newUser.role_id,
        },
      });
    } else {
      res.status(500).send({
        status: "failed",
        message: "account already created",
      });
    }
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.login = async (req, res) => {
  const data = req.body;

  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  const { error } = schema.validate(data);

  if (error) {
    return res.status(400).send({
      status: "error",
      message: error.details[0].message,
    });
  }

  try {
    const userExist = await user.findOne({
      where: {
        email: data.email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!userExist) {
      return res.status(400).send({
        status: "Failed",
        message: "Email doesnt match",
      });
    }

    const isValid = await bcrypt.compare(data.password, userExist.password);

    if (!isValid) {
      return res.status(400).send({
        status: "Failed",
        message: "Password doesnt match",
      });
    }

    const role = await roles.findOne({
      where: {
        id: userExist?.role_id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    const permission = JSON.parse(role.permission);

    const dataToken = {
      id: userExist.id,
      type: role.name,
      permission,
    };

    const token = jwt.sign(dataToken, process.env.TOKEN_KEY);

    res.status(200).send({
      status: "success...",
      message: "login success",
      data: {
        id: userExist.id,
        user: {
          id: userExist.dataValues.id,
          role: role.name,
          name: userExist.dataValues.name,
          email: userExist.dataValues.email,
          permission: permission,
        },
        token,
      },
    });
  } catch (error) {
    console.log(error)
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).send({
      status: "success",
      message: "See You Later",
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
    });
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    const data = req.body;
    const { id } = req.params;

    const schema = Joi.object({
      password: Joi.string().min(8).required(),
    });
    const { error } = schema.validate(data);

    if (error) {
      return res.status(400).send({
        status: "error",
        message: error.details[0].message,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const body = {
      password: hashedPassword,
    };

    await user.update(body, {
      where: {
        id,
      },
    });

    res.status(200).send({
      status: "success",
      message: `Update  informasi id: ${id}`,
      data: {
        ...data,
      },
      hashedPassword,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.checkAuth = async (req, res) => {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];
    const verified = jwt.verify(token, process.env.TOKEN_KEY);

    let dataUser = await user.findOne({
      where: {
        id: verified.id,
      },
      include: [
        {
          model: roles,
          as: "role",
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    let dataTransaction = await transactions.findAll({
      where: {
        createBy: verified.id,
      },
    });

    if (!dataUser) {
      return res.status(404).send({
        status: "failed",
      });
    }
    dataUser = JSON.parse(JSON.stringify(dataUser));
    const role = JSON.parse(dataUser.role.permission);
    dataTransaction = JSON.parse(JSON.stringify(dataTransaction));

    const transactionIn = dataTransaction.filter((d) => d.type === "IN");
    const transactionOut = dataTransaction.filter((d) => d.type === "OUT");

    dataTransaction = {
      manyTransaction: dataTransaction.length,
      manyTransactionIn: transactionIn.length,
      manyTransactionOut: transactionOut.length,
    };

    dataUser = {
      ...dataUser,
      token,
      role: {
        ...dataUser.role,
        permission: role,
      },
      dataTransaction,
    };

    res.send({
      status: "success",
      data: dataUser,
    });
  } catch (error) {
    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
