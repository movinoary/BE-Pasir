const {
  category,
  product,
  product_category,
  product_variant,
  product_price,
} = require("../../models");

exports.addCategory = async (req, res) => {
  /*
    body = {
        "name": "liquid saltnic"
    }
    */
  try {
    const { ...data } = req.body;

    const fields = await category.create({
      ...data,
    });

    let body = await category.findOne({
      where: {
        id: fields.id,
      },
    });

    body = JSON.parse(JSON.stringify(body));
    res.status(200).send({
      status: "Success",
      message: "create category data",
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

exports.getCategory = async (req, res) => {
  try {
    const data = await category.findAll({
      include: [
        {
          model: product_category,
          as: "list_product",
          attributes: {
            exclude: ["id", "category_id", "createdAt", "updatedAt"],
          },
          // include: [
          //   {
          //     model: product,
          //     as: "product",
          //     attributes: {
          //       exclude: ["id", "category_id", "createdAt", "updatedAt"],
          //     },
          //     include: [
          //       {
          //         model: product_variant,
          //         as: "variant",
          //         attributes: {
          //           exclude: ["id", "product_id", "createdAt", "updatedAt"],
          //         },
          //         include: [
          //           {
          //             model: product_price,
          //             as: "list_price",
          //             attributes: {
          //               exclude: ["id", "updatedAt"],
          //             },
          //           },
          //         ],
          //       },
          //     ],
          //   },
          // ],
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.status(200).send({
      status: "success ",
      message: "Get data category product",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getCategoryId = async (req, res) => {
  try {
    const { id } = req.params;
    let data = await category.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: product_category,
          as: "list_product",
          attributes: {
            exclude: ["id", "category_id", "createdAt", "updatedAt"],
          },
          include: [
            {
              model: product,
              as: "product",
              attributes: {
                exclude: ["id", "category_id", "createdAt", "updatedAt"],
              },
              include: [
                {
                  model: product_variant,
                  as: "variant",
                  attributes: {
                    exclude: ["id", "product_id", "createdAt", "updatedAt"],
                  },
                },
              ],
            },
          ],
        },
      ],
    });

    data = JSON.parse(JSON.stringify(data));

    res.status(200).send({
      status: "success ",
      message: "Get data category product",
      ...data,
    });
  } catch (error) {
    res.status(400).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await category.update(req.body, {
      where: {
        id,
      },
    });

    res.status(200).send({
      status: "success",
      message: `Update  informasi id: ${id}`,
      data: req.body,
    });
  } catch (error) {
    res.status(400).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const body = await category.destroy({
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
