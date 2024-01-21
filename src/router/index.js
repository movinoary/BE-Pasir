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
  getProductCashier,
} = require("../controller/product");
const {
  addTransaction,
  getTransaction,
  getTransactionId,
  getTransactionProduct,
  getTransactionDate,
  getTransactionProductDate,
} = require("../controller/transaction");
const {
  getUser,
  updateUser,
  deleteUser,
  getUserID,
} = require("../controller/user");
const {
  getRole,
  addRole,
  updateRole,
  deleteRole,
} = require("../controller/role");
const { auth } = require("../middleware/auth");
const { getClosingRangeDate } = require("../controller/closing");

const router = express.Router();

// AUTH
router.post("/register", register);
router.post("/login", login);
router.delete("/logout", logout);
router.patch("/forget-password/:id", forgetPassword);
router.get("/check-auth", auth, checkAuth);

// USER
router.get("/user/get", auth, getUser);
router.get("/user/get/:id", auth, getUserID);
router.patch("/user/update/:id", auth, updateUser);
router.delete("/user/delete/:id", auth, deleteUser);

// ROLE
router.get("/role/get", auth, getRole);
router.post("/role/add", auth, addRole);
router.patch("/role/update/:id", auth, updateRole);
router.delete("/role/delete/:id", auth, deleteRole);

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
router.get("/product/get-cashier", auth, getProductCashier);
router.get("/product/get/:id", auth, getProductId);
router.delete("/product/delete/:id", auth, deleteProduct);

// TRANSACTION
router.post("/transaction/add", auth, addTransaction);
router.get("/transaction/get/", auth, getTransaction);
router.get("/transaction/get/:id", auth, getTransactionId);
router.get("/transaction/get-product/:id", auth, getTransactionProduct);
router.get("/transaction/get-transaction-date/:date", auth, getTransactionDate);
router.get(
  "/transaction/get-product-date/:date",
  auth,
  getTransactionProductDate
);

// CLOSING
router.get("/closing/range", getClosingRangeDate);

module.exports = router;

// // if (pathname.include(permission)) {
// req.user = verified;
// next();
// // } else {
// //   res.status(400).send({ message: "Failed permission " });
// // }
