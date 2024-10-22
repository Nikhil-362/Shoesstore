const userModel = require("../model/user-model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");

module.exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    console.log(username, password, email);

    if (!username || !password || !email)
      return res.send("Please Enter the details");

    const find = await userModel.findOne({ email });
    if (find) return res.send("User Already Exist, Please Login");

    //   Generate Salt and Hash Password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        const user = await userModel.create({
          username,
          password: hash,
          email,
        });

        const token = generateToken(user);

        // Send the token as a cookie
        res.cookie("token", token, { httpOnly: true });

        res.status(201).send("User created successfully");
      });
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Server error. Please try again later.");
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    req.flash("error", "Please enter both email and password.");
    return res.redirect("/users/login"); // Ensure this is the correct path
  }
  
  try {
    const findUser = await userModel.findOne({ email });
  
    if (!findUser) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/users/login"); // Ensure this is the correct path
    }
  
    // Compare hashed password
    bcrypt.compare(password, findUser.password, (err, result) => {
      if (err) {
        console.error(err);
        req.flash("error", "Something went wrong, please try again.");
        return res.redirect("/users/login");
      }
  
      if (result) {
        const token = generateToken(findUser);
        res.cookie("token", token, { httpOnly: true });
        req.flash("success", "You are now logged in.");
        req.session.findUser = findUser;
        return res.redirect("/");
      } else {
        req.flash("error", "Invalid email or password.");
        return res.redirect("/users/login");
      }
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "An error occurred during login. Please try again.");
    res.redirect("/users/login");
  }
  
};

module.exports.logout = async (req, res) => {
  res.cookie("token", " ")
  req.session.findUser = null;
  req.flash("success", "logout successfully")
  res.redirect("/")
};
