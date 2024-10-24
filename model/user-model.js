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
  },
  googleId: {
    type: String,
    unique: true,
  },

  orders: {
    type: Array,
    default: [],
  },
  carts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
  ],
});

module.exports = mongoose.model("users", userModel);
