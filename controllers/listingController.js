const { link } = require("joi");
const Listing = require("../models/listing.js");
const { getCoords } = require("./geocodingController");






module.exports.index = async (req, res) => {
  try {
    let { category, search } = req.query;

    let filter = {};

    //  CATEGORY FILTER
    if (category) {
      filter.category = {
        $in: Array.isArray(category) ? category : [category],
      };
    }

    //  SEARCH FILTER
    if (search && search.trim() !== "") {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } }
      ];
    }

    const allListings = await Listing.find(filter);
  if (allListings.length === 0) {
  req.flash("error", "No listings found for your search 😕");

  return res.render("listings/index",{
    allListings: [],
    search: search || "",
    selectedCategories: Array.isArray(category)
      ? category
      : category
      ? [category]
      : [],
  });
}

    res.render("listings/index", {
      allListings,
      search: search || "",   // ✅ ALWAYS SEND THIS
      selectedCategories: Array.isArray(category)
        ? category
        : category
        ? [category]
        : [],
    });

  } catch (err) {
    console.log(err);
    res.redirect("/listings");
  }
};


module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};



module.exports.createListing = async (req, res) => {
  try {
    const { listing } = req.body;

    //  Basic validation
    if (!listing || !listing.location) {
      req.flash("error", "Location is required");
      return res.redirect("/listings/new");
    }

    
    if (!listing.category) {
      req.flash("error", "Please select at least one category");
      return res.redirect("/listings/new");
    }

    if (!Array.isArray(listing.category)) {
      listing.category = [listing.category];
    }

    //  Get coordinates
    const coords = await getCoords(listing.location);

    if (!coords) {
      req.flash("error", "Invalid location");
      return res.redirect("/listings/new");
    }

    // Handle image s
    let imageData = {
      filename: "default",
      url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    };

    if (req.file) {
      imageData = {
        filename: req.file.filename,
        url: req.file.path,
      };
    }

    //  Create listing
    const newListing = new Listing({
      ...listing,
      owner: req.user?._id, // safe access
      image: imageData,
      geometry: {
        type: "Point",
        coordinates: [coords.lng, coords.lat],
      },
    });

    await newListing.save();

    req.flash("success", "Listing created successfully!");
    res.redirect("/listings");
  } catch (err) {
    console.error("Create Listing Error:", err);
    req.flash("error", err.message || "Something went wrong");
    res.redirect("/listings/new");
  }
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.editListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  let originalImageURL = listing.image.url;

  originalImageURL = originalImageURL
    ? originalImageURL.replace("/upload", "/upload/h_300,w_250")
    : null;
  res.render("listings/edit.ejs", { listing, originalImageURL });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

 
  let category = req.body.listing.category;

  if (!category) {
    category = []; // user selected nothing → clear categories
  } else if (!Array.isArray(category)) {
    category = [category]; // single checkbox case
  }

  req.body.listing.category = category;

  // Update listing
  let listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true },
  );

  //  Image update
  if (req.file) {
    listing.image = {
      filename: req.file.filename,
      url: req.file.path,
    };

    await listing.save();
  }

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;

  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};
