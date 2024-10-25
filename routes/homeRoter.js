const express = require("express");
const router = express.Router();
const { isLoggedin } = require("../middleware/isLoggedin");
const { home, shop, addToCart, cart, cartRemoveId } = require("../controllers/homeController");

router.get("/", home);
router.get("/shop", isLoggedin, shop);
router.get("/both", async (req, res) =>   res.render("adminPages/both") );
router.get("/addtocart/:id", isLoggedin, addToCart);
router.get("/cart/remove/:id", isLoggedin, cartRemoveId);
router.get("/cart", isLoggedin, cart);

module.exports = router;
