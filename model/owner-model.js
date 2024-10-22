const mongoose = require("mongoose");

const ownersModel = mongoose.Schema({
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

  products:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:"products",
  }],
  contact: {
    type: Number,
    default: undefined,
  },

  picture: {
    type: String,
  },

  gstin: {
    type: String,
  },
});

module.exports = mongoose.model("Owners", ownersModel);
