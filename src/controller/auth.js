const { user } = require("../../models");
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
        data: {
          name: newUser.name,
          email: newUser.email,
          role: newUser.role_id,
          // password: hashedPassword,
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
        message: "Username doesnt match",
      });
    }

    const isValid = await bcrypt.compare(data.password, userExist.password);

    if (!isValid) {
      return res.status(400).send({
        status: "Failed",
        message: "Password doesnt match",
      });
    }

    const dataToken = {
      id: userExist.id,
    };

    const token = jwt.sign(dataToken, process.env.TOKEN_KEY);

    res.status(200).send({
      status: "success...",
      data: {
        id: userExist.id,
        user: {
          id: userExist.dataValues.id,
          role: userExist.dataValues.role,
          name: userExist.dataValues.name,
          email: userExist.dataValues.email,
        },
        token,
      },
    });
  } catch (error) {
    console.log(error);
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
    const id = req.query.id;

    let dataUser = await user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    if (!dataUser) {
      return res.status(404).send({
        status: "failed",
      });
    }
    dataUser = JSON.parse(JSON.stringify(dataUser));

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
