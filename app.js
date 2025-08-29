// require('dotenv').config()
// console.log(process.env.SECRET)

if (process.env.NODE_ENY != "production") {
    require("dotenv").config();
}

const express = require("express")
const app = express();
const mongoose = require("mongoose");
// const Listing = require("../MajorProjects/models/listing.js")
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
// const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
// const { listingSchema,reviewSchema } = require("./schema.js");
// const Review=require("./models/review.js")
const session = require("express-session")
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")


// database create

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
// console.log(dbUrl);


async function main() {
    await mongoose.connect(MONGO_URL);
    // await mongoose.connect(dbUrl);
}

main().then(() => {
    console.log("connected to DB")
})
    .catch((err) => {
        console.log(err);
    })

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
})

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err)
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false, // Corrected
    saveUninitialized: true, // Keeps this option as is
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 1000,
        httpOnly: true,
    }
};

// route create
// app.get("/", (req, res) => {
//     res.send("hi i am  root")
// })



app.use(session(sessionOptions));
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




// Middleware
app.use((req, res, next) => {
    // console.log("req.user:", req.user);
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    // console.log("res.locals.currUser:", res.locals.currUser);
    next();
});



// fakeuser create

// app.get("/demousercreate", async (req, res) => {
//     // await User.deleteOne({ username: "vagadiya-rushil" });
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "vr "
//     });
//     let registerUser = await User.register(fakeUser, "helloword");
//     res.send(registerUser);
// });




app.use("/listings", listingRouter)  // badha listings na route mate hum ye aek line ko use karenge 
// and badha listings na route listing.js file ma 6e and hum usko ye line app.use("/listings",listings) ki help se badha riute no use karu saki

app.use("/listings/:id/reviews", reviewRouter)
app.use("/", userRouter)

// app.get("/testListing",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My New Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute,Goa",
//         // image:"",
//         country:"India"
//     })
//     await sampleListing.save();
//     console.log("sample was saved")
//     res.send("successful testing");
// })


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
})

// Middleware for error handling

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);
})

// server start
app.listen(3012, () => {
    console.log("server is Listening to port 3000");
});
