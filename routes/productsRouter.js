const express = require("express");
const { create, update } = require("../controllers/productsController");
const { isOwner } = require("../middleware/isOwner");
const router = express.Router();
const upload = require("../config/multer-config");
const productsModel = require("../model/products-model");

router.get("/", (req, res) => {
  res.send("products Router");
});

router.get("/preview/:id", async (req, res) => {
  const product = await productsModel.findOne({ _id: req.params.id})
  res.render("productPage", {product});
});

router.post("/create", upload.single("image"), isOwner, create);
router.post("/update/:id", upload.single("image"), update);

module.exports = router;
