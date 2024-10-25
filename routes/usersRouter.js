const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  guest,
} = require("../controllers/authController");

// Get
router.get("/", (req, res) => res.send("owner Router"));
router.get("/register", (req, res) => res.render("registration/register"));
router.get("/login", (req, res) => res.render("registration/login"));
router.get("/logout", logout);
router.get("/guest", guest);

//Post
router.post("/register", register);
router.post("/login", login);

module.exports = router;
