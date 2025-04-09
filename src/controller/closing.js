const {
  user,
  transactions,
  transaction_items,
  product,
  product_variant,
  product_price,
} = require("../../models");

exports.getClosingRangeDate = async (req, res) => {
  try {
    const num = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      "29",
      "30",
      "31",
    ];

    let { startDate, endDate } = req.query;
    startDate = startDate.split("-");
    endDate = endDate.split("-");

    if (startDate[1] === endDate[1]) {
      const IdxStart = num.findIndex((d) => d === startDate[2]);
      const rangeStart = num.splice(IdxStart);
      const IdxEnd = rangeStart.findIndex((d) => d === endDate[2]);
      const rangeEnd = rangeStart.splice(0, IdxEnd + 1);

      let arrDate = rangeEnd.map((d) => {
        return `${startDate[0]}-${startDate[1]}-${d}`;
      });

      let data = await transactions.findAll({
        where: {
          type: "OUT",
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

      let result = [];

      for (let i = 0; i < arrDate.length; i++) {
        let filter = filterDate.filter((d) => d.date === arrDate[i]);
        result.push(...filter);
      }

      result = result.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));

      res.status(200).send({ status: "success", data: result });
    } else if (startDate[1] !== endDate[1]) {
      res
        .status(400)
        .send({ status: "failed", message: "Please Select Same Month" });
    }
  } catch (error) {
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
    res.status(400).send({ status: "failed", message: "Server Error" });
  }
};
