const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/authController");


router.get("/", (req, res) => {
  res.send("owner Router");
});

// Register Route
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

router.get("/login", async (req, res) => {
  res.render("login")
});

router.get("/register", async (req, res) => {
  res.render("register")
});



module.exports = router;
