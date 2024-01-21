const { user, roles } = require("../../models");

exports.getUser = async (req, res) => {
  try {
    let data = await user.findAll({
      include: [
        {
          model: roles,
          as: "role",
          attributes: {
            exclude: ["id", "createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["role_id", "createdAt", "updatedAt"],
      },
    });

    data = JSON.parse(JSON.stringify(data));
    const resData = data.map((d) => {
      const permission = JSON.parse(d.role.permission);

      return {
        ...d,
        role: {
          ...d.role,
          permission,
        },
      };
    });

    res.status(200).send({
      status: "success ",
      message: "Get data all users",
      data: resData,
    });
  } catch (error) {
    res.status(400).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getUserID = async (req, res) => {
  try {
    const { id } = req.params;

    let data = await user.findOne({
      where: {
        id,
      },
      include: [
        {
          model: roles,
          as: "role",
          attributes: {
            exclude: ["id", "createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    res.status(200).send({
      status: "success ",
      message: "Get data all users",
      data: data,
    });
  } catch (error) {
    res.status(400).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { ...data } = req.body;

    await user.update(data, {
      where: {
        id,
      },
    });

    res.status(200).send({
      status: "success",
      message: `Update  informasi id: ${id}`,
      data: { ...data },
    });
  } catch (error) {
    res.status(400).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const body = await user.destroy({
      where: {
        id,
      },
    });

    if (body === 1) {
      res.status(200).send({
        status: "success",
        message: `Delete informasi  id:${id}`,
      });
    } else {
      res.status(500).send({
        status: "failed",
        message: "id not found",
      });
    }
  } catch (error) {
    res.status(400).send({
      status: "failed",
      message: "Server Error",
    });
  }
};
