const express = require("express");
const { uploadImg } = require("../middleware/updaloadImage");
const {
  register,
  login,
  logout,
  forgetPassword,
  checkAuth,
} = require("../controller/auth");
const {
  addCategory,
  updateCategory,
  getCategory,
  getCategoryId,
  deleteCategory,
} = require("../controller/category");
const {
  addProduct,
  updateProduct,
  getProduct,
  getProductId,
  deleteProduct,
  addProductImg,
} = require("../controller/product");
const {
  addTransaction,
  getTransaction,
  getTransactionId,
  getTransactionProduct,
  getTransactionDate,
} = require("../controller/transaction");
const { auth } = require("../middleware/auth");

const router = express.Router();

// AUTH
router.post("/register", register);
router.post("/login", login);
router.delete("/logout", logout);
router.patch("/forget-password/:id", forgetPassword);
router.get("/check-auth", auth, checkAuth);

// CATEGORY
router.post("/category/add", auth, addCategory);
router.patch("/category/update/:id", auth, updateCategory);
router.get("/category/get", auth, getCategory);
router.get("/category/get/:id", auth, getCategoryId);
router.delete("/category/delete/:id", auth, deleteCategory);

// PRODUCT
router.post("/product/add", auth, addProduct);
router.post("/product/add-img", auth, uploadImg("image"), addProductImg);
router.patch("/product/update/:id", auth, updateProduct);
router.get("/product/get", auth, getProduct);
router.get("/product/get/:id", auth, getProductId);
router.delete("/product/delete/:id", auth, deleteProduct);

// TRANSACTION
router.post("/transaction/add", auth, addTransaction);
router.get("/transaction/get/", auth, getTransaction);
router.get("/transaction/get/:id", auth, getTransactionId);
router.get("/transaction/get-product/:id", auth, getTransactionProduct);
router.get("/transaction/get-date/:date", auth, getTransactionDate);

module.exports = router;

// // if (pathname.include(permission)) {
// req.user = verified;
// next();
// // } else {
// //   res.status(400).send({ message: "Failed permission " });
// // }
