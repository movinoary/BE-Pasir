require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./src/router/index.js");

const app = express();

const port = 5020;

app.use(express.json());
app.use(cors());
app.use("/api/pasir-v1/", router);
app.use("/public", express.static("public"));

app.listen(port, () => console.log(`Listening on port ${port}!`));
