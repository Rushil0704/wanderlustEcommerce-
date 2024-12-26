const Listing=require("../models/listing")
const Review=require("../models/review")


// Post Review Route
module.exports.createReview=async (req, res) => {
    // console.log(req.params.id)
    const listing = await Listing.findById(req.params.id);
    // if (!listing) {
    //     throw new ExpressError(404, "Listing not found");
    // }

    const newReview = new Review(req.body.reviews);
    newReview.author=req.user._id;
    console.log(newReview)
    listing.reviews.push(newReview); // Push the ObjectId of the new review
    await newReview.save();
    await listing.save();

    console.log("New review saved");
    req.flash("success","New Review Created")
    res.redirect(`/listings/${listing._id}`);
}

// Delete Review Route

module.exports.destryReview=async(req,res)=>{
    let { id, reviewId }=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success","Review Deleted")
    res.redirect(`/listings/${id}`);
}