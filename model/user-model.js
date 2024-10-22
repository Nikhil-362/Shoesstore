const mongoose = require("mongoose");

const userModel = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  carts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
  ],
  orders: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("users", userModel);
