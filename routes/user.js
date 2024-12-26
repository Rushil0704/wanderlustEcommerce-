const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } =require("../middleware.js");

const userController=require("../controllers/users.js")



router.route("/signup")
.get(userController.renderSignupForm)
.post( wrapAsync(userController.signup))

router.route("/login")
.get( userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
}),
   userController.LoginForm 
)



// router.post("/login", passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
// }), (req, res) => {
//     console.log(req.user);  // Debugging: Log the user object
//     req.flash("success", "Logged in successfully!");
//     res.redirect("/listings");
// });



// signup or register ke liye
// router.get("/signup",userController.renderSignupForm);

// router.post("/signup", wrapAsync(userController.signup))


//  login ke liye
// router.get("/login", userController.renderLoginForm)

// router.post("/login",saveRedirectUrl,passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
// }),
//    userController.LoginForm 
// )


// logout ke liye
router.get("/logout",userController.LogoutForm)

module.exports = router;



// const express = require("express");
// const router = express.Router();
// const User = require("../models/user");
// const wrapAsync = require("../utils/wrapAsync");
// const passport = require("passport");

// // Signup route
// router.get("/signup", (req, res) => {
//   res.render("users/signup");
// });

// router.post("/signup", wrapAsync(async (req, res) => {
//   try {
//     const { username, email, password } = req.body;
//     const newUser = new User({ email, username });
//     const registeredUser = await User.register(newUser, password);
//     req.flash("success", "Welcome to Wanderlust!");
//     res.redirect("/listings");
//   } catch (e) {
//     req.flash("error", e.message);
//     res.redirect("/signup");
//   }
// }));

// // Login route
// router.get("/login", (req, res) => {
//   res.render("users/login");
// });

// router.post(
//   "/login",
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   (req, res) => {
//     req.flash("success", "Welcome back to Wanderlust!");
//     res.redirect("/listings");
//   }
// );

// module.exports = router;

