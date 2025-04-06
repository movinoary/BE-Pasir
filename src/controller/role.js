const { roles } = require("../../models");

exports.addRole = async (req, res) => {
  /*
      body = {
        "name": "hr",
        "permission": {"server": ["category", "product", "transaction"], "client":["cashier", "inventory", "transaction", "closing", "settings"]}
    }
      */
  try {
    const { ...data } = req.body;

    const permission = JSON.stringify(data.permission);

    let body = await roles.create({
      ...data,
      permission,
    });

    body = JSON.parse(JSON.stringify(body));
    res.status(200).send({
      status: "Success",
      message: "create role data",
      data: {
        ...body,
      },
    });
  } catch (error) {
    res.status(400).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.getRole = async (req, res) => {
  try {
    let data = await roles.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    // Add debugging
    console.log('Raw data from DB:', data);
    data = JSON.parse(JSON.stringify(data));
    console.log('After first parse:', data);

    const resData = data.map((d) => {
      console.log('Processing role:', d.id);
      console.log('Permission before parse:', typeof d.permission, d.permission);

      // If permission is already an object, return it as is
      if (typeof d.permission === 'object' && d.permission !== null) {
        return {
          ...d,
          permission: d.permission,
        };
      }

      const permission = JSON.parse(d.permission);
      console.log('Permission after parse:', permission);

      return {
        ...d,
        permission,
      };
    });

    res.status(200).send({
      status: "success",
      message: "Get data all roles",
      data: resData,
    });
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(400).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { ...data } = req.body;

    let body;
    const permission = JSON.stringify(data?.permission);
    if (data?.permission !== undefined && data?.name !== undefined) {
      body = {
        name: data.name,
        permission,
      };
    } else if (data?.permission === undefined && data?.name !== undefined) {
      body = {
        name: data.name,
      };
    } else if (data?.permission !== undefined && data?.name === undefined) {
      body = {
        permission,
      };
    }

    await roles.update(body, {
      where: {
        id,
      },
    });

    res.status(200).send({
      status: "success",
      message: `Update  informasi id: ${id}`,
      data: body,
    });
  } catch (error) {
    res.status(400).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const body = await roles.destroy({
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
