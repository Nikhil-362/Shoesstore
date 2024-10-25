const ownerModel = require("../model/owner-model");
const productsModel = require("../model/products-model");

module.exports.create = async (req, res) => {
  try {
    const { title, price, bgColor, sizes } = req.body;
    const image = req.file ? req.file.buffer : null;

    if (!title || !price || !bgColor || !image) {
      req.flash("error", "Please provide all required details (title, price, bgColor, and image).");
      return res.status(400).redirect("/admin");
    }

    const newProduct = await productsModel.create({
      title,
      price,
      bgColor,
      image,
      sizes,
      admin: req.userOwner._id
    });

    const admin = await ownerModel.findOne({ email: req.userOwner.email });
    admin.products.push(newProduct._id);
    await admin.save();

    req.flash("success", "Product created successfully.");
    res.redirect("/admin");
  } catch (error) {
    console.error(error);
    req.flash("error", "An error occurred while creating the product.");
    res.status(500).redirect("/admin");
  }
};

module.exports.update = async (req, res) => {
  try {
    const { title, price, bgColor, sizes } = req.body;
    const image = req.file ? req.file.buffer : null;

    const divide = sizes.split(',').map(num => num.trim());
    
    // const removeSpace = sizes.replaceAll(" ","");

    const updatedProduct = await productsModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        title,
        price,
        bgColor,
        sizes: divide,
        ...(image && { image }),
      },
      { new: true }
    );

    console.log(updatedProduct, "!!!!!!!!!!!!!");

    if (!updatedProduct) {
      req.flash("error", "Failed to update the product. Please try again later.");
      return res.redirect("/admin");
    }

    req.flash("success", "Product updated successfully.");
    res.redirect("/shop");
  } catch (error) {
    console.error(error);
    req.flash("error", "An error occurred while updating the product.");
    res.redirect("/admin");
  }
};

module.exports.preview = async (req, res) => {
  const product = await productsModel.findOne({ _id: req.params.id})
  res.render("userPages/productPage", {product});
}
