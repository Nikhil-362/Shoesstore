const express = require("express");
const router = express.Router();
const productsModel = require("../model/products-model");
const userModel = require("../model/user-model");
const cookieParser = require("cookie-parser");
const { isLoggedin } = require("../middleware/isLoggedin");

router.get("/", async (req, res) => {
  
  const images = [
    { url: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { url: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { url: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }
  ];

  const shoes = await productsModel.find().limit(6);
  res.render("home", { shoes, user: req.cookies.token, images});
  // res.render("home", { products, user: req.session.findUser });
});

router.get("/both", async (req, res) => {
  res.render("both");
});

router.get("/shop", isLoggedin, async (req, res) => {
  const products = await productsModel.find();
  const users = await userModel
    .findOne({ email: req.user.email })
    .select("-password -image");

  console.log(users.carts, "users");
  res.render("shop", { products, carts: users.carts });
});

router.get("/addtocart/:id", isLoggedin, async (req, res) => {
  try {
    const user = await userModel
      .findOne({ email: req.user.email })
      .select("-image");

    user.carts.push(req.params.id);
    await user.save();
    req.flash("success", "Added to Cart");
    res.redirect("/shop");
  } catch (error) {
    req.flash("error", error);
    res.redirect("/shop");
  }
});

router.get("/cart", isLoggedin, async (req, res) => {
  const user = await userModel
    .findOne({ email: req.user.email })
    .populate("carts");

  res.render("cart", { cartItems: user.carts });
});

router.get("/cart/remove/:id", isLoggedin, async (req, res) => {
  try {
    const user = await userModel.findOneAndUpdate(
      { email: req.user.email },
      { $pull: { carts: req.params.id } },
      { new: true } // Return the updated user document
    );

    if (!user) {
      return res.status(404).send("User not found");
    }

    // console.log("Updated user:", user);
    res.redirect("/cart");
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
