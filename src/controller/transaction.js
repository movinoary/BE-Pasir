const {
  user,
  transactions,
  transaction_items,
  product,
  product_variant,
  product_price,
} = require("../../models");

exports.addTransaction = async (req, res) => {
  /*
    {
        "type" : "IN",
        "product": [
            {
                "product_id": "9529c4ca-fece-48e6-8d5d-5164cae6cb17",
                "variant_id": "f18bfd4d-9ede-49d0-81f7-e20f2f37fd85",
                "amount": 2,
                "price_sell": 90000,
                "price_buy": 100000
            },
                    {
                "product_id": "9529c4ca-fece-48e6-8d5d-5164cae6cb17",
                "variant_id": "adc71b23-7930-4ee8-b343-91ae4c5186ba",
                "amount": 2,
                "price_sell": 90000,
                "price_buy": 100000
            }
        ]
    }
      */
  try {
    let { ...data } = req.body;
    const userID = req.user.id;

    const dbProductVariant = await product_variant.findAll({});
    const db = await transactions.findAll({});

    const productVariant = data.product.map((d) => {
      const id = (d.variant_id && d.variant_id) || d.id_variant;
      return {
        id: id,
        variant_id: id,
        amount: d.amount,
      };
    });

    let validationStock = [];
    let bodyProductVariant = [];
    let resultProductPrice;

    if (data.type === "OUT") {
      for (let i = 0; i < productVariant.length; i++) {
        const beforeStock = dbProductVariant.find(
          (d) => d.id === productVariant[i].variant_id
        );
        const afterStock = beforeStock.stock - productVariant[i].amount;
        const outStock = beforeStock.stockOut + productVariant[i].amount;

        let body;
        if (data.information.toLowerCase() === "selling") {
          const sellingStock =
            beforeStock.stockSelling + productVariant[i].amount;
          body = {
            id: productVariant[i].id,
            stock: afterStock,
            stockOut: outStock,
            stockSelling: sellingStock,
          };

          bodyProductVariant.push(body);
        } else if (data.information.toLowerCase() === "reject") {
          const rejectStock =
            beforeStock.stockReject + productVariant[i].amount;

          body = {
            id: productVariant[i].id,
            stock: afterStock,
            stockOut: outStock,
            stockReject: rejectStock,
          };
          bodyProductVariant.push(body);
        }
        if (afterStock < 0) {
          validationStock.push(false);
        } else {
          validationStock.push(true);
        }
      }
    } else if (data.type === "IN") {
      for (let i = 0; i < productVariant.length; i++) {
        const idVariant =
          (productVariant[i].variant_id && productVariant[i].variant_id) ||
          productVariant[i].id_variant;

        const beforeStock = dbProductVariant.find((d) => d.id === idVariant);
        const afterStock = beforeStock.stock + productVariant[i].amount;
        const totalStock = beforeStock.stockTotal + productVariant[i].amount;
        const body = {
          id: productVariant[i].id,
          stockTotal: totalStock,
          stock: afterStock,
        };
        bodyProductVariant.push(body);

        if (afterStock <= 0) {
          validationStock.push(false);
        } else {
          validationStock.push(true);
        }
      }
      let filterProduct = data.product.map((d) => d.product_id);
      filterProduct = [...new Set(filterProduct)];

      const productPrice = filterProduct.map((d) => {
        const findProduct = data.product.find(
          (t) => t.id_product || t.product_id === d
        );
        return {
          product_id: findProduct.product_id,
          purchase_price: findProduct.purchase_price,
          selling_price: findProduct.selling_price,
        };
      });

      resultProductPrice = await product_price.bulkCreate(productPrice);
      resultProductPrice = JSON.parse(JSON.stringify(resultProductPrice));
      const productInputIDPrice = data.product.map((d) => {
        const findId = resultProductPrice.find(
          (t) => t.product_id === d.product_id
        );

        return {
          ...d,
          price_id: findId.id,
        };
      });

      data = {
        ...data,
        product: productInputIDPrice,
      };
    }

    validationStock = validationStock.find((d) => d === false);

    if (validationStock === undefined || validationStock === null) {
      for (let i = 0; i < productVariant.length; i++) {
        await product_variant.update(bodyProductVariant[i], {
          where: {
            id: bodyProductVariant[i].id,
          },
        });
      }
      // end update product variant (update stock)

      // transaction

      const totalPrice = data.product
        .map((d) => d.price)
        .reduce((a, b) => a + b);

      let bodyTransaction = {
        no_transaction: `PT000${db.length + 1}`,
        type: data.type,
        methods: data.methods,
        total_price: totalPrice,
        createBy: userID,
        information: data.information,
        explanation: data.explanation,
        description: data.description,
      };

      const fieldsTransaction = await transactions.create({
        ...bodyTransaction,
      });

      // transaction item
      const bodyTransactionItems = data.product.map((d) => {
        let price;
        if (data.type === "IN") {
          price = d.purchase_price * d.amount;
        } else if (data.type === "OUT") {
          if (data.information.toLowerCase() === "selling") {
            price = d.selling_price * d.amount;
          } else if (data.information.toLowerCase() === "reject") {
            price = d.purchase_price * d.amount;
          }
        }

        const variant_id = d.variant_id || d.id_variant;
        const product_id = d.product_id || d.id_product;
        const price_id = d.price_id || d.id_price;

        return {
          ...d,
          transactions_id: fieldsTransaction.id,
          product_id,
          variant_id,
          price_id,
          price: price,
        };
      });

      const fieldsTransactionProduct = await transaction_items.bulkCreate(
        bodyTransactionItems
      );

      const results = {
        fieldsTransaction,
        fieldsTransactionProduct,
      };

      let body = JSON.parse(JSON.stringify(results));
      res.status(200).send({
        status: "Success",
        data: {
          ...body,
        },
      });
    } else {
      res.status(404).send({
        status: "failed",
        message: "Purchase stock exceeds capacity",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: "failed", message: "server error" });
  }
};

exports.getTransaction = async (req, res) => {
  try {
    let data = await transactions.findAll({
      include: [
        {
          model: user,
          as: "create_by",
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
        {
          model: transaction_items,
          as: "items",
          attributes: {
            exclude: [
              "id",
              "transactions_id",
              "product_id",
              "variant_id",
              "createdAt",
              "updatedAt",
            ],
          },
          include: [
            {
              model: product,
              as: "product",
              attributes: {
                exclude: ["id", "createdAt", "updatedAt"],
              },
            },
            {
              model: product_price,
              as: "prices",
              attributes: {
                exclude: ["id", "createdAt", "updatedAt"],
              },
            },
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
      // attributes: {
      //   exclude: ["createdAt", "updatedAt"],
      // },
    });
    data = JSON.parse(JSON.stringify(data));
    data = data.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));

    res.status(200).send({ status: "success", data: data });
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: "failed", message: "Server Error" });
  }
};

exports.getTransactionId = async (req, res) => {
  try {
    const { id } = req.params;
    let data = await transactions.findOne({
      where: {
        id,
      },
      include: [
        {
          model: user,
          as: "create_by",
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
        {
          model: transaction_items,
          as: "items",
          attributes: {
            exclude: [
              "id",
              "transactions_id",
              "product_id",
              "variant_id",
              "createdAt",
              "updatedAt",
            ],
          },
          include: [
            {
              model: product,
              as: "product",
              attributes: {
                exclude: ["id", "createdAt", "updatedAt"],
              },
            },
            {
              model: product_price,
              as: "prices",
              attributes: {
                exclude: ["id", "createdAt", "updatedAt"],
              },
            },
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
      attributes: {
        exclude: ["updatedAt"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    res.status(200).send({ status: "success", data });
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: "failed", message: "Server Error" });
  }
};

exports.getTransactionProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let data = await transaction_items.findAll({
      where: {
        product_id: id,
      },
      include: [
        {
          model: product,
          as: "product",
          attributes: {
            exclude: ["id", "createdAt", "updatedAt"],
          },
        },
        {
          model: product_variant,
          as: "variant",
          attributes: {
            exclude: ["id", "product_id", "createdAt", "updatedAt"],
          },
        },
        {
          model: product_price,
          as: "prices",
          attributes: {
            exclude: ["id", "createdAt", "updatedAt"],
          },
        },
        {
          model: transactions,
          as: "transaction",
          attributes: {
            exclude: ["id", "updatedAt"],
          },
          include: [
            {
              model: user,
              as: "create_by",
              attributes: {
                exclude: ["password", "createdAt", "updatedAt"],
              },
            },
          ],
        },
      ],
      attributes: {
        exclude: ["transactions_id", "product_id", "variant_id", "price_id"],
      },
    });

    data = JSON.parse(JSON.stringify(data));
    data = data.sort((a, b) =>
      a.transaction.no_transaction > b.transaction.no_transaction ? -1 : 1
    );

    res.status(200).send({ status: "success", data: data });
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: "failed", message: "Server Error" });
  }
};

exports.getTransactionProductDate = async (req, res) => {
  try {
    const { date } = req.params;
    let dataTransaction = await transaction_items.findAll({
      include: [
        {
          model: transactions,
          as: "transaction",
          attributes: {
            exclude: ["id", "createdAt", "updatedAt"],
          },
        },
        {
          model: product_price,
          as: "prices",
          attributes: {
            exclude: ["id", "createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["id", "transactions_id", "updatedAt"],
      },
    });
    let dataProduct = await product.findAll({
      include: [
        {
          model: product_price,
          as: "list_price",
          attributes: {
            exclude: ["updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["createBy", "updateBy", "createdAt", "updatedAt"],
      },
    });
    let dataVariant = await product_variant.findAll({
      attributes: {
        exclude: ["createBy", "updateBy", "createdAt", "updatedAt"],
      },
    });
    // let dataPrice = await product_price.findAll({
    //   attributes: {
    //     exclude: ["createdAt", "updatedAt"],
    //   },
    // });

    dataTransaction = JSON.parse(JSON.stringify(dataTransaction));
    const filterDate = dataTransaction.map((d) => {
      return {
        ...d,
        date: d.createdAt.split("T")[0],
      };
    });
    let afterFIlter = filterDate.filter((d) => d.date === date);
    let filterOut = afterFIlter.filter((d) => d.transaction.type === "OUT");

    dataProduct = JSON.parse(JSON.stringify(dataProduct));
    dataVariant = JSON.parse(JSON.stringify(dataVariant));

    let productVariantRes = dataVariant.map((t) => {
      const variantTransaction = filterOut.filter((x) => x.variant_id === t.id);
      const variantOut = variantTransaction
        .map((d) => d.amount)
        .reduce((a, b) => a + b, 0);
      const priceTotal = variantTransaction
        .map((d) => d.price)
        .reduce((a, b) => a + b, 0);
      const priceProduct = variantTransaction?.map((d) => {
        return {
          purchase_price: d?.prices?.purchase_price,
          selling_price: d?.prices?.selling_price,
        };
      })[0];
      const provit = priceTotal - priceProduct?.purchase_price * variantOut;

      return {
        ...t,
        variantOut: variantOut,
        priceTotal,
        purchase_price: priceProduct?.purchase_price,
        selling_price: priceProduct?.selling_price,
        provit: provit || 0,
      };
    });

    let productDataRes = dataProduct.map((t) => {
      const productTransaction = filterOut.filter((d) => d.product_id === t.id);
      const totalPrice = productTransaction
        .map((d) => d.price)
        .reduce((a, b) => a + b, 0);
      const totalItemOut = productTransaction
        .map((d) => d.amount)
        .reduce((a, b) => a + b, 0);
      let variant = productVariantRes.filter((d) => d.product_id === t.id);
      variant = variant.map((d) => {
        let purchase_price = d.purchase_price || t.list_price[0].purchase_price;
        let selling_price = d.selling_price || t.list_price[0].selling_price;

        return {
          ...d,
          purchase_price,
          selling_price,
        };
      });

      return {
        id: t.id,
        name: t.name,
        image: t.image,
        totalTransaction: productTransaction.length,
        totalItemOut,
        totalPrice: totalPrice,
        variant,
      };
    });

    res.status(200).send({
      status: "success",
      data: productDataRes,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: "failed", message: "Server Error" });
  }
};

exports.getTransactionDate = async (req, res) => {
  try {
    const { date } = req.params;
    let data = await transactions.findAll({
      include: [
        {
          model: user,
          as: "create_by",
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
        {
          model: transaction_items,
          as: "items",
          attributes: {
            exclude: [
              "id",
              "transactions_id",
              "product_id",
              "variant_id",
              "createdAt",
              "updatedAt",
            ],
          },
          include: [
            {
              model: product,
              as: "product",
              attributes: {
                exclude: ["id", "createdAt", "updatedAt"],
              },
            },
            {
              model: product_price,
              as: "prices",
              attributes: {
                exclude: ["id", "createdAt", "updatedAt"],
              },
            },
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
      // attributes: {
      //   exclude: ["createdAt", "updatedAt"],
      // },
    });
    data = JSON.parse(JSON.stringify(data));

    const filterDate = data.map((d) => {
      return {
        ...d,
        date: d.createdAt.split("T")[0],
      };
    });

    data = filterDate.filter((d) => d.date === date);
    data = data.filter((d) => d.type === "OUT");

    data = data.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));

    res.status(200).send({ status: "success", data: data });
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: "failed", message: "Server Error" });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    await transactions.update(req.body, {
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
    console.log(error);
    res.status(400).send({ status: "failed", message: "Server Error" });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const body = await transactions.destroy({
      where: {
        id,
      },
    });

    if (body === 1) {
      res
        .status(200)
        .send({ status: "success", message: `Delete informasi  id:${id}` });
    } else {
      res.status(500).send({
        status: "failed",
        message: "id not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: "failed", message: "Server Error" });
  }
};
