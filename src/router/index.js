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
} = require("../controller/transaction");
const { auth } = require("../middleware/auth");

const router = express.Router();

// AUTH
router.post("/register", register);
router.post("/login", login);
router.delete("/logout", logout);
router.patch("/forget-password/:id", forgetPassword);
router.get("/check-auth", checkAuth);

// CATEGORY
router.post("/add-category", auth, addCategory);
router.patch("/update-category/:id", auth, updateCategory);
router.get("/get-category/", auth, getCategory);
router.get("/get-category/:id", auth, getCategoryId);
router.delete("/delete-category/:id", auth, deleteCategory);

// PRODUCT
router.post("/add-product", auth, addProduct);
router.post("/add-product-img", auth, uploadImg("image"), addProductImg);
router.patch("/update-product/:id", auth, updateProduct);
router.get("/get-product/", auth, getProduct);
router.get("/get-product/:id", auth, getProductId);
router.delete("/delete-product/:id", auth, deleteProduct);

// TRANSACTION
router.post("/add-transaction", auth, addTransaction);
router.get("/get-transaction/", auth, getTransaction);
router.get("/get-transaction/:id", auth, getTransactionId);
router.get("/get-transaction-product/:id", auth, getTransactionProduct);

module.exports = router;
