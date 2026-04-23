const Listing = require("../models/listing.js");
const isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing.owner.equals(req.user._id)) {
    console.log("Unauthorized access attempt by user:", req.user._id);
    console.log("Listing owner:", listing.owner);
    req.flash("error", "You don't have permission!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
module.exports = { isOwner };
