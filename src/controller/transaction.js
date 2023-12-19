const {
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
    const { ...data } = req.body;

    // start update product variant (update stock)
    const dbProductVariant = await product_variant.findAll({});
    const db = await transactions.findAll({});

    const productVariant = data.product.map((d) => {
      return {
        id: d.variant_id,
        variant_id: d.variant_id,
        amount: d.amount,
        purchase_price: d.purchase_price,
        selling_price: d.price_sell,
      };
    });

    let validationStock = [];
    let bodyProductVariant = [];

    if (data.type === "OUT") {
      for (let i = 0; i < productVariant.length; i++) {
        const beforeStock = dbProductVariant.find(
          (d) => d.id === productVariant[i].variant_id
        ).stock;
        const afterStock = beforeStock - productVariant[i].amount;
        const stock = {
          beforeStock,
          afterStock,
        };
        console.log(stock);
        const body = {
          id: productVariant[i].id,
          stock: afterStock,
        };
        bodyProductVariant.push(body);

        if (afterStock <= 0) {
          validationStock.push(false);
        } else {
          validationStock.push(true);
        }
      }
    } else if (data.type === "IN") {
      for (let i = 0; i < productVariant.length; i++) {
        const beforeStock = dbProductVariant[i].stock;
        const afterStock = beforeStock + productVariant[i].amount;
        const body = {
          id: productVariant[i].id,
          stock: afterStock,
        };
        bodyProductVariant.push(body);

        if (afterStock <= 0) {
          validationStock.push(false);
        } else {
          validationStock.push(true);
          const productPrice = data.product.map((d) => {
            return {
              variant_id: d.variant_id,
              purchase_price: d.purchase_price,
              selling_price: d.selling_price,
            };
          });

          await product_price.bulkCreate(productPrice);
        }
      }
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
      };

      const fieldsTransaction = await transactions.create({
        ...bodyTransaction,
      });

      // transaction item
      const bodyTransactionProduct = data.product.map((d) => {
        return {
          ...d,
          transactions_id: fieldsTransaction.id,
        };
      });

      const fieldsTransactionProduct = await transaction_items.bulkCreate(
        bodyTransactionProduct
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
    res.status(400).send({ status: "failed", message: "server error" });
  }
};

exports.getTransaction = async (req, res) => {
  try {
    const data = await transactions.findAll({
      include: [
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

    res.status(200).send({ status: "success", data });
  } catch (error) {
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
        exclude: ["createdAt", "updatedAt"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    res.status(200).send({ status: "success", ...data });
  } catch (error) {
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
          model: transactions,
          as: "transaction",
          attributes: {
            exclude: ["id", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    res.status(200).send({ status: "success", data: data });
  } catch (error) {
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
    res.status(400).send({ status: "failed", message: "Server Error" });
  }
};
