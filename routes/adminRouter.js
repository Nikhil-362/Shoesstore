const express = require("express");
const { ownerRegister, login } = require("../controllers/adminController");
const { isOwner } = require("../middleware/isOwner");
const ownerModel = require("../model/owner-model");
const productsModel = require("../model/products-model");
const router = express.Router();
const {isLoggedin} = require("../middleware/isLoggedin")

router.get("/", isOwner, async (req, res) => {
  try {
    const admin = await ownerModel
      .findOne({ email: req.userOwner.email })
      .populate("products");

    if (!admin) {
      req.flash("error", "Admin not found.");
      return res.redirect("/login");
    }

    res.render("createProd", {
      products: admin.products,
      user: req.session.findUser,
    });
  } catch (error) {
    console.error("Error fetching products for admin:", error);
    req.flash("error", "An error occurred while fetching products.");
    res.status(500).redirect("/admin");
  }
});

router.get("/login", (req, res) => {
  res.render("both");
});

router.post("/register", ownerRegister);
router.post("/login", login);

router.get("/edit/:id", async (req, res) => {
  const product = await productsModel.findOne({ _id: req.params.id });
  console.log(product);
  res.render("edit", { product });
});

router.post("/delete/:id", isLoggedin , async (req, res) => {
  try {
    const productId = req.params.id;
    await productsModel.findByIdAndDelete(productId);

    const admin = await ownerModel.findOneAndUpdate(
        { email: req.user.email },
        { $pull: { products: req.params.id } },
        { new: true } // Returns the updated document
      );
      

    // console.log(req.user.email);
    // console.log(admin);

    req.flash("success", "Product deleted successfully.");
    res.redirect("/admin");
  } catch (error) {
    console.error("Error deleting product:", error);
    req.flash("error", "An error occurred while deleting the product.");
    res.redirect("/admin");
  }
});

module.exports = router;
