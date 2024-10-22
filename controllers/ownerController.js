const ownersModel = require("../model/owner-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.ownerRegister =  async (req, res) => {
    try {
        const { username, password, email } = req.body;

        
          const findUser = await ownersModel.findOne({email });
        console.log(findUser);
          if(findUser){
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

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Server error. Please try again later.");
    }
} 