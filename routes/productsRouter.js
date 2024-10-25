const express = require("express");
const { create, update, preview } = require("../controllers/productsController");
const { isOwner } = require("../middleware/isOwner");
const router = express.Router();
const upload = require("../config/multer-config");
const productsModel = require("../model/products-model");


//Get
router.get("/", (req, res) => res.send("products Router"));
router.get("/preview/:id", preview);

//Post
router.post("/create", upload.single("image"), isOwner, create);
router.post("/update/:id", upload.single("image"), update);

module.exports = router;
