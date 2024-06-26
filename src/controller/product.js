const {
  user,
  product,
  product_variant,
  product_price,
  product_category,
  category,
  transactions,
  transaction_items,
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
    const userID = req.user.id;

    const dataVariant = JSON.parse(data.variant);
    const listVariantName = dataVariant.map((d) => d.name);
    const db = await transactions.findAll({});
    let validasiVariant = await product_variant.findAll({
      where: {
        name: listVariantName,
      },
    });
    // if (validasiVariant.length === 0) {
    const bodyProduct = {
      name: data.name,
      image: data.image,
      createBy: userID,
      updateBy: userID,
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
        stockTotal: d.stock,
        stock: d.stock,
        stockOut: 0,
        stockSelling: 0,
        stockReject: 0,
        product_id: resultProduct.id,
      };
    });

    let resultVariant = await product_variant.bulkCreate(bodyVariant);
    resultVariant = JSON.parse(JSON.stringify(resultVariant));

    const bodyPrice = {
      product_id: resultProduct.id,
      purchase_price: Number(data.purchase_price),
      selling_price: Number(data.selling_price),
    };

    const resultPrice = await product_price.create(bodyPrice);

    const bodyProductCategory = {
      product_id: resultProduct.id,
      category_id: data.category_id,
    };

    const resultProductCategory = await product_category.create({
      ...bodyProductCategory,
    });

    const amount = resultVariant
      .map((d) => Number(d.stock))
      .reduce((a, b) => a + b, 0);
    const price = Number(data.purchase_price) * amount;

    let bodyTransaction = {
      no_transaction: `AD000${db.length + 1}`,
      type: "IN",
      methods: "Add Product",
      total_price: price,
      createBy: userID,
      information: "Buying",
      explanation: "*",
      description: "Create Product",
    };

    const fieldsTransaction = await transactions.create({
      ...bodyTransaction,
    });

    const bodyTransactionItems = resultVariant.map((d) => {
      return {
        transactions_id: fieldsTransaction.id,
        product_id: fieldsProduct.id,
        variant_id: d.id,
        price_id: resultPrice.id,
        price: Number(data.purchase_price) * d.stock,
        amount: d.stock,
      };
    });

    const fieldsTransactionProduct = await transaction_items.bulkCreate(
      bodyTransactionItems
    );

    const result = {
      resultProduct,
      resultVariant,
      resultPrice,
      resultProductCategory,
      fieldsTransaction,
      fieldsTransactionProduct,
    };

    body = JSON.parse(JSON.stringify(result));
    res.status(200).send({
      status: "Success ",
      message: "create product data",
      data: {
        ...body,
      },
    });
    // } else if (validasiVariant.length !== 0) {
    //   res.status(412).send({
    //     status: "failed",
    //     message: "variant data is same",
    //     data: {
    //       ...result,
    //     },
    //   });
    // }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "failed create product data",
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
    const userID = req.user.id;

    const dataVariant = JSON.parse(data.variant);
    const listVariantName = dataVariant.map((d) => d.name);
    const db = await transactions.findAll({});
    let validasiVariant = await product_variant.findAll({
      where: {
        name: listVariantName,
      },
    });
    // if (validasiVariant.length === 0) {
    const bodyProduct = {
      name: data.name,
      image: image,
      createBy: userID,
      updateBy: userID,
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
        stockTotal: d.stock,
        stock: d.stock,
        stockOut: 0,
        stockSelling: 0,
        stockReject: 0,
        product_id: resultProduct.id,
      };
    });

    const resultVariant = await product_variant.bulkCreate(bodyVariant);

    const bodyPrice = {
      product_id: resultProduct.id,
      purchase_price: Number(data.purchase_price),
      selling_price: Number(data.selling_price),
    };

    const resultPrice = await product_price.create(bodyPrice);

    const bodyProductCategory = {
      product_id: resultProduct.id,
      category_id: data.category_id,
    };

    const resultProductCategory = await product_category.create({
      ...bodyProductCategory,
    });

    const amount = resultVariant
      .map((d) => Number(d.stock))
      .reduce((a, b) => a + b, 0);
    const price = Number(data.purchase_price) * amount;

    let bodyTransaction = {
      no_transaction: `AD000${db.length + 1}`,
      type: "IN",
      methods: "Add Product",
      total_price: price,
      createBy: userID,
      information: "Buying",
      explanation: "*",
      description: "Create Product",
    };

    const fieldsTransaction = await transactions.create({
      ...bodyTransaction,
    });

    const bodyTransactionItems = resultVariant.map((d) => {
      return {
        transactions_id: fieldsTransaction.id,
        product_id: fieldsProduct.id,
        variant_id: d.id,
        price_id: resultPrice.id,
        price: Number(data.purchase_price) * d.stock,
        amount: d.stock,
      };
    });

    const fieldsTransactionProduct = await transaction_items.bulkCreate(
      bodyTransactionItems
    );

    const result = {
      resultProduct,
      resultVariant,
      resultPrice,
      resultProductCategory,
      fieldsTransaction,
      fieldsTransactionProduct,
    };

    body = JSON.parse(JSON.stringify(result));
    res.status(200).send({
      status: "Success ",
      message: "create product data",
      data: {
        ...body,
      },
    });
    // } else if (validasiVariant.length !== 0) {
    //   res.status(412).send({
    //     status: "failed",
    //     message: "variant data is same",
    //     data: {
    //       ...result,
    //     },
    //   });
    // }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "failed create product data",
      message: "server error",
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    let data = await product.findAll({
      include: [
        {
          model: product_variant,
          as: "variant",
          attributes: {
            exclude: ["product_id", "createdAt", "updatedAt"],
          },
        },
        {
          model: user,
          as: "createby",
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
        {
          model: user,
          as: "updateby",
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
        {
          model: product_price,
          as: "list_price",
          attributes: {
            exclude: ["updatedAt"],
          },
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

    const result = data.map((d) => {
      const price = d.list_price.sort((a, b) =>
        a.createdAt < b.createdAt ? 1 : -1
      )[0];
      return {
        ...d,
        price_id: price.id,
        selling_price: price.selling_price,
        purchase_price: price.purchase_price,
      };
    });

    res.status(200).send({
      status: "success ",
      message: "Get data product",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getProductCashier = async (req, res) => {
  try {
    let data = await product.findAll({
      include: [
        {
          model: product_variant,
          as: "variant",
          attributes: {
            exclude: ["product_id", "createdAt", "updatedAt"],
          },
        },
        {
          model: user,
          as: "createby",
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
        {
          model: user,
          as: "updateby",
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
        {
          model: product_price,
          as: "list_price",
          attributes: {
            exclude: ["updatedAt"],
          },
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

    let result = data.map((d) => {
      const price = d.list_price.sort((a, b) =>
        a.createdAt < b.createdAt ? 1 : -1
      )[0];
      const variant = d.variant.filter((t) => t.stock !== 0);

      return {
        ...d,
        price_id: price.id,
        selling_price: price.selling_price,
        purchase_price: price.purchase_price,
        variant: variant,
      };
    });

    result = result.filter((d) => d.variant.length !== 0);

    res.status(200).send({
      status: "success ",
      message: "Get data product",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
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
            exclude: ["product_id", "createdAt", "updatedAt"],
          },
        },
        {
          model: user,
          as: "createby",
          attributes: {
            exclude: ["product_id", "createdAt", "updatedAt"],
          },
        },
        {
          model: user,
          as: "updateby",
          attributes: {
            exclude: ["product_id", "createdAt", "updatedAt"],
          },
        },
        {
          model: product_price,
          as: "list_price",
          attributes: {
            exclude: ["updatedAt"],
          },
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

    const price = data.list_price.sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : -1
    )[0];
    const result = {
      ...data,
      price_id: price.id,
      selling_price: price.selling_price,
      purchase_price: price.purchase_price,
    };

    res.status(200).send({
      status: "success",
      message: "Get data product",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { ...data } = req.body;

    await product.update(req.body, {
      where: {
        id,
      },
    });

    const dataVariant = data.variant.map((d) => {
      return {
        id: d.id,
        name: d.name,
      };
    });

    for (let i = 0; i < dataVariant.length; i++) {
      await product_variant.update(dataVariant[i], {
        where: {
          id: dataVariant[i].id,
        },
      });
    }

    res.status(200).send({
      status: "success",
      message: `Update  informasi id: ${id}`,
      data: req.body,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
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
