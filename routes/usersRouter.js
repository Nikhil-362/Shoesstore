const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  guest,
} = require("../controllers/authController");

// Register Route
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/guest", guest);

router.get("/", (req, res) => res.send("owner Router"));
router.get("/login", (req, res) => res.render("login"));
router.get("/register", (req, res) => res.render("register"));

module.exports = router;
