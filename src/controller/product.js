const {
  product,
  product_variant,
  product_price,
  product_category,
  category,
} = require("../../models");

exports.addProduct = async (req, res) => {
  /*
    body = {
    "name": "foom ice tea",
    "image" : "123.jpg",
    "purchase_price": 90000,
    "selling_price": 100000,
    "variant": [
        {
            "name" : "3mg",
            "stock" : 10
        },
        {
            "name" : "6mg",
            "stock" : 10
        }
    ],
    "category_id": "73dc3b1b-6fb5-4778-baef-cfd61d0201c4"
  }
    */
  try {
    const { ...data } = req.body;

    const bodyProduct = {
      name: data.name,
      image: data.image,
      purchase_price: data.purchase_price,
      selling_price: data.selling_price,
    };

    const fieldsProduct = await product.create({
      ...bodyProduct,
    });

    let resultProduct = await product.findOne({
      where: {
        id: fieldsProduct.id,
      },
    });

    const bodyVariant = data.variant.map((d) => {
      return {
        ...d,
        product_id: fieldsProduct.id,
      };
    });

    const resultVariant = await product_variant.bulkCreate(bodyVariant);

    const bodyProductCategory = {
      product_id: resultProduct.id,
      category_id: data.category_id,
    };

    const resultProductCategory = await product_category.create({
      ...bodyProductCategory,
    });

    const result = {
      resultProduct,
      resultVariant,
      resultProductCategory,
    };

    let body = JSON.parse(JSON.stringify(result));
    res.send({
      status: "Success",
      data: {
        ...body,
      },
    });
  } catch (error) {
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.addProductImg = async (req, res) => {
  /*  body = {
    "name": "foom ice tea",
    "image" : "123.jpg",
    "variant": [
        {
            "name" : "3mg",
            "stock" : 10,
            "selling_price": 100000,
            "purchase_price": 120000
        },
        {
            "name" : "6mg",
            "stock" : 10,
            "selling_price": 100000,
            "purchase_price": 120000        }
    ],
    "category_id": "73dc3b1b-6fb5-4778-baef-cfd61d0201c4"
  } */

  try {
    const { ...data } = req.body;
    const image = req.file.filename;

    const dataVariant = JSON.parse(data.variant);
    const listVariantName = dataVariant.map((d) => d.name);
    let validasiVariant = await product_variant.findAll({
      where: {
        name: listVariantName,
      },
    });

    if (validasiVariant.length === 0) {
      const bodyProduct = {
        name: data.name,
        image: image,
      };

      const fieldsProduct = await product.create({
        ...bodyProduct,
      });

      let resultProduct = await product.findOne({
        where: {
          id: fieldsProduct.id,
        },
      });

      const bodyVariant = dataVariant.map((d) => {
        return {
          name: d.name,
          stock: d.stock,
          product_id: resultProduct.id,
        };
      });

      const resultVariant = await product_variant.bulkCreate(bodyVariant);

      const bodyPrice = dataVariant.map((d) => {
        const idVariant = resultVariant.find((t) => t.name === d.name);

        return {
          variant_id: idVariant.id,
          purchase_price: Number(d.purchase_price),
          selling_price: Number(d.selling_price),
        };
      });

      const resultPrice = await product_price.bulkCreate(bodyPrice);

      const bodyProductCategory = {
        product_id: resultProduct.id,
        category_id: data.category_id,
      };

      const resultProductCategory = await product_category.create({
        ...bodyProductCategory,
      });

      const result = {
        resultProduct,
        resultVariant,
        resultPrice,
        resultProductCategory,
      };

      body = JSON.parse(JSON.stringify(result));
      res.send({
        status: "Success",
        data: {
          ...result,
        },
      });
    } else if (validasiVariant.length !== 0) {
      console.log("false");
    }
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const data = await product.findAll({
      include: [
        {
          model: product_variant,
          as: "variant",
          attributes: {
            exclude: ["product_id", "createdAt", "updatedAt"],
          },
          include: [
            {
              model: product_price,
              as: "list_price",
              attributes: {
                exclude: ["id", "updatedAt"],
              },
            },
          ],
        },
        {
          model: product_category,
          as: "category",
          attributes: {
            exclude: ["createdAt", "updatedAt", "id", "product_id"],
          },
          include: [
            {
              model: category,
              as: "category_name",
              attributes: {
                exclude: ["id", "createdAt", "updatedAt"],
              },
            },
          ],
        },
      ],
      // attributes: {
      //   exclude: ["createdAt", "updatedAt"],
      // },
    });

    const result = data.map((i) => {
      const variant = i.variant.map((d) => {
        const list_price = d.list_price.sort((a, b) =>
          a.createdAt < b.createdAt ? 1 : -1
        );
        return {
          ...d,
          list_price,
        };
      });

      return {
        ...i,
        variant,
      };
    });

    res.send({
      status: "success",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getProductId = async (req, res) => {
  try {
    const { id } = req.params;
    let data = await product.findOne({
      where: {
        id,
      },
      include: [
        {
          model: product_variant,
          as: "variant",
          attributes: {
            exclude: ["id", "product_id", "createdAt", "updatedAt"],
          },
          include: [
            {
              model: product_price,
              as: "list_price",
              attributes: {
                exclude: ["id", "updatedAt"],
              },
            },
          ],
        },
        {
          model: product_category,
          as: "category",
          attributes: {
            exclude: ["createdAt", "updatedAt", "id", "product_id"],
          },
          include: [
            {
              model: category,
              as: "category_name",
              attributes: {
                exclude: ["id", "createdAt", "updatedAt"],
              },
            },
          ],
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    res.send({
      status: "success",
      data,
    });
  } catch (error) {
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await product.update(req.body, {
      where: {
        id,
      },
    });

    const body = {
      category_id: req.body.category_id,
    };

    let data = await product_category.update(body, {
      where: {
        product_id: id,
      },
    });

    res.send({
      status: "success",
      message: `Update  informasi id: ${id}`,
      data: req.body,
    });
  } catch (error) {
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const body = await product.destroy({
      where: {
        id,
      },
    });

    if (body === 1) {
      res.send({
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
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};
