const ownersModel = require("../model/owner-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");

module.exports.ownerRegister = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    console.log(username, password, email);
    const findUser = await ownersModel.findOne({ email });
    console.log(findUser);
    if (findUser) {
      //User already exists
      return res.send("User already exists");
    }

    // Generate Salt and Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    // Create a new user
    const user = await ownersModel.create({
      username,
      password: hashedPassword,
      email
    });

    // Create JWT Token
    const token = jwt.sign({ email: user.email, id: user._id }, "ABCD", {
      expiresIn: "1h"
    });

    // // Send the token as a cookie
    res.cookie("token", token, { httpOnly: true });

    res.status(201).send("User created successfully");
    req.flash("success", "Admin login successfully")
    res.redirect("/products/create")

  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Server error. Please try again later.");
  }
}

module.exports.login = async (req, res) => {

  const { email, password } = req.body;

  try {
    const findUser = await ownersModel.findOne({ email });

    // Check if the user exists
    if (!findUser) {
      req.flash("error", "User does not exist.");
      return res.status(404).redirect("/admin/login");  
    }

    bcrypt.compare(password, findUser.password, (err, result) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        req.flash("error", "An error occurred during login. Please try again later.");
        return res.status(500).redirect("/users/login"); 
      }

      if (result) {
        const token = generateToken(findUser);
        res.cookie("token", token, { httpOnly: true });

        req.flash("success", "Welcome Admin! You are logged in.");
        req.session.findUser = findUser;

        return res.redirect("/admin");
      } else {
        req.flash("error", "Incorrect username or password.");
        return res.status(401).redirect("/admin/login");  
      }
    });
  } catch (error) {
    console.error("Error during login:", error);
    req.flash("error", "Server error. Please try again later.");
    return res.status(500).redirect("/admin/login"); 
  }

} 
