var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const ownersRouter = require("./routes/adminRouter");
const productsRouter = require("./routes/productsRouter");
const usersRouter = require("./routes/usersRouter");
const home = require("./routes/homeRoter");
require("dotenv").config();
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

const db = require("./config/mongoose-connection");
const userModel = require("./model/user-model");
const { generateToken } = require("./utils/generateToken");

var app = express();

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

var GoogleStrategy = require("passport-google-oauth20").Strategy;

// console.log(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);


// Serialize and deserialize user
passport.serializeUser(function (user, done) {
  done(null, user.id); // Storing user id in the session
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id); // Retrieve full user object
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

var GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://shoesstore-q13e.onrender.com/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        // Step 1: Check if user already exists in the database
        let user = await userModel.findOne({ googleId: profile.id });

        if (user) {
          // Step 2a: If user exists, return the user object
          return cb(null, user);
        } else {
          // Step 2b: If user does not exist, create a new user
          user = await userModel.create({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
          });

          // Step 3: Save the new user to the database
          await user.save();

          // Return the newly created user
          return cb(null, user);
        }
      } catch (err) {
        // Handle any errors during the process
        return cb(err, null);
      }
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    console.log(req.user);
    const token = generateToken(req.user);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/shop");
  }
);


app.use(flash());

app.use((req, res, next) => {
  res.locals.errorMessage = req.flash("error");
  res.locals.successMessage = req.flash("success");
  next();
});

// view engine setup
app.set("views", path.join(__dirname, "views"));

console.log(__dirname);

app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", home);
app.use("/admin", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);

app.use((req, res, next) => {
  res.status(404).render("404", { title: "404 - Page Not Found" });
});

console.log("process.env.NODE_ENV", process.env.NODE_ENV);

module.exports = app;
