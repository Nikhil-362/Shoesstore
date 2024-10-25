const express = require("express");
const {
  ownerRegister,
  login,
  admin,
  editId,
  deleteId,
} = require("../controllers/adminController");
const { isOwner } = require("../middleware/isOwner");
const router = express.Router();
const { isLoggedin } = require("../middleware/isLoggedin");



//Get
router.get("/", isOwner, admin);
router.get("/login", (req, res) => res.render("adminPages/both"));
router.get("/edit/:id", editId);

//Post
router.post("/register", ownerRegister);
router.post("/login", login);
router.post("/delete/:id", isLoggedin, deleteId);




module.exports = router;
