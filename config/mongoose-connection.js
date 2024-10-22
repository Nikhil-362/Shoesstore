const mongoose = require("mongoose");
const config = require("config");
const dbgr = require('debug')("development:mongoose");

mongoose
.connect(`${config.get("MONGODB_URL")}`)
.then(() => {
    dbgr("Successfully Connected");
  })
  .catch((err) => {
    dbgr("Error connecting to MongoDB:", err);
  });

module.exports = mongoose.connection;
