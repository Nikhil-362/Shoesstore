const ownersModel = require("../model/owner-model");
const jwt = require("jsonwebtoken");

module.exports.isOwner = async (req, res, next) => {
    // Check if cookies exist and if the token is available
    if (!req.cookies || !req.cookies.token) {
        req.flash("error", "You must be logged in to access this page.");
        return res.redirect("/admin/login");
    }

    try {
        // Verify the token
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);

        // Find the user in the database
        const user = await ownersModel
            .findOne({ email: decoded.email })
            .select("-password"); // Exclude password from the result

        if (!user) {
            req.flash("error", "Invalid Admin. Please login again.");
            return res.redirect("/admin/login");
        }

        // Attach the user to the request object
        req.userOwner = user;
        next(); // Call the next middleware or route handler
    } catch (error) {
        console.error("Error during authentication:", error);
        req.flash("error", "Invalid Admin. Please login again.");
        return res.redirect("/admin/login");
    }
};
