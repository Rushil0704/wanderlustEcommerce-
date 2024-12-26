const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js")
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js")
const multer = require('multer')
const { storage } = require("../cloudconfig.js")
const upload = multer({ storage })

router.route("/")
    .get(wrapAsync(listingController.index))    // index.route
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));  // create route



// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm)

router.route("/:id")
    .get(wrapAsync(listingController.showListing))   // show Route
    .put(isLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.UpdateListing))     // Update Route                                                        // and after navi updated vale me pass kar denge or ...req.body.listing meand deconstructor                
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.DeleteListing)) // Delete Route

// index route
// router.get("/", wrapAsync(listingController.index));


// Show Route
// router.get("/:id", wrapAsync(listingController.showListing));


// Create Route
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing))


// Edit Route 
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.EditListing))


// Update Route
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.UpdateListing))                                                            // and after navi updated vale me pass kar denge or ...req.body.listing meand deconstructor                                                    


// Delete Route                                                       
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.DeleteListing))


module.exports = router;