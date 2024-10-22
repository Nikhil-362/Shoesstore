const mongoose = require("mongoose");

const productsModel = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  bgColor: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
  },
  sizes: {
    type: Array,
    default: [],
  },
  image: Buffer,

  // admin: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "owners",
  // }],

  admin: {
    type: Array,
    default: [],
  }
});


module.exports = mongoose.model("products", productsModel);
