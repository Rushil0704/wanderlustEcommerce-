const User=require("../models/user")

// signup or register ke liye

module.exports.renderSignupForm=(req, res) => {
    res.render("users/signup"); // Render the signup.ejs template
}

module.exports.signup=async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "welcome to Wanderlust!");
            res.redirect("/listings");
        })
       
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }

}

// Login ke liye

module.exports.renderLoginForm=(req, res) => {
    res.render("users/login.ejs")
}

module.exports.LoginForm=async (req, res) => {
    req.flash("success","welcome back to wanderlust!");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl)
    // res.redirect("/listings")
}

// Logout ke liye

module.exports.LogoutForm=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
}