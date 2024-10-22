const jwt = require("jsonwebtoken");
const userModel = require("../model/user-model");

module.exports.isLoggedin = async (req, res, next) => {
  // Check if token is available in cookies
  if (!req.cookies.token) {
    req.flash('error', "You need to login to access this page.");
    return res.redirect("/")
  }

  try {
    const decode = jwt.verify(req.cookies.token, process.env.JWT_KEY);

    let user = await userModel
      .findOne({ email: decode.email })
      .select("-password");

    if (!user) {
      return res.status(401).send("Invalid user. Please login again.");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error during authentication:", error);
    req.flash('error', 'Invalid token. Please login again.');
    res.redirect("/")
  }
};
