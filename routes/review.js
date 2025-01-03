const express= require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { reviewSchema } = require("../schema.js");
const Review=require("../models/review.js")
const Listing = require("../models/listing.js")  // Model
const { validateReview, isLoggedIn,isReviewAuthor } =require("../middleware.js")

const reviewController=require("../controllers/review.js")

// Reviews
// Post Reviews Route
router.post("/",isLoggedIn, validateReview,wrapAsync(reviewController.createReview));

// Delete Review Route

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destryReview))

module.exports=router;