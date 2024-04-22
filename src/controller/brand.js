const {brands} = require("../../models")

exports.addBrand = async (req, res) => {
    try {
        const { ...data } = req.body;
        
        let body = await brands.create(
            {
              name: data.name,
            }
        );

        body = JSON.parse(JSON.stringify(body));
        res.status(200).send({
          status: "Success",
          message: "create category data",
          data: {
            ...body,
          },
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
          status: "failed",
          message: "server error",
        });
    }
};

exports.getBrand = async (req, res) => {
  try {
    let data = await brands.findAll(
      {
        attributes: {
          exclude:  ["createdAt", "updatedAt"]
        }
      }
    );
    data = JSON.parse(JSON.stringify(data))

    res.status(200).send({
      status: "success ",
      message: "Get data all brand",
      data: data,
    });
  }catch (error) {
    console.log(error);
    res.status(400).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.updateBrand = async (req, res) => {
  try {
    const { id } = req.params;

    await brands.update(
      req.body,
      {
        where: {
          id,
        }
      }
    );
    res.status(200).send({
      status: "success",
      message: `Update  informasi id: ${id}`,
      data: req.body,
    });
  }catch (error) {
    console.log(error);
    res.status(400).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const body = await brands.destroy(
      {
        where: {
          id,
        }
      }
    );
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
    console.log(error);
    res.status(400).send({
      status: "failed",
      message: "Server Error",
    });
  }
};