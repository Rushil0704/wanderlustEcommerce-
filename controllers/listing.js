const Listing=require("../models/listing")

// index route

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

// new route

module.exports.renderNewForm=(req, res) => {
    // console.log(req.user)
    res.render("listings/new.ejs")
}

// show route

module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews", populate: {
            path: "author",
        },
    })
        .populate("Owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist")
        res.redirect("/listings")
    }
    console.log(listing)
    res.render("listings/show.ejs", { listing });
}

// create route

// module.exports.createListing=async (req, res, next) => {
//     // let {title,description,image,price,country,location}=req.body;
//     // let listing=req.body.listing
//     let url=req.file.path;
//     let filename=req.file.filename;
//     console.log(url,"..",filename)
//     // const newListing = new Listing(req.body.listing)
//     // // console.log(req.user);
//     // newListing.Owner = req.user._id;
//     // await newListing.save();
//     req.flash("success", "New Listing Created")
//     res.redirect("/listings")
// }

module.exports.createListing = async (req, res, next) => {
    // console.log(req.body);  // Check what is being sent
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url,"..",filename)

    // // Ensure price is present
    // if (!req.body.listing.price) {
    //     req.flash("error", "Price is required");
    //     return res.redirect("/listings/new");
    // }

    const newListing = new Listing(req.body.listing);
    newListing.image = { url, filename };
    newListing.Owner = req.user._id;
    await newListing.save();

    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}


// Edit Route

module.exports.EditListing=async (req, res) => {
    let { id } = req.params;
    // const listing = await Listing.findById(id);
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist")
        res.redirect("/listings")
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_100,w_100")
    originalImageUrl=originalImageUrl.replace("&w=800","&w=200&h=200")
    console.log(listing.image);
    res.render("listings/edit.ejs", { listing,originalImageUrl })
}

// Update Route

module.exports.UpdateListing=async (req, res) => {    // (isLoggedIn is middleware)
    let { id } = req.params;
   let listing= await Listing.findByIdAndUpdate(id, { ...req.body.listing })  // ...req.body.listing aek javascript ke object he and in badha parameter he
   if(typeof req.file!== "undefined"){
   let url = req.file.path;
   let filename = req.file.filename;
   listing.image={ url, filename }
   await listing.save();
   }
   req.flash("success", "Listing Updated")
    res.redirect(`/listings/${id}`)                                   // and after deconsrucor karke parameter ko individual value  me conver karenge
}

// Delete Route

module.exports.DeleteListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted")
    res.redirect("/listings")
}