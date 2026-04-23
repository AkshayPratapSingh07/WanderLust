const Review = require("../models/review");
const isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review.author.equals(req.user._id)) {
    console.log("Unauthorized access attempt by user:", req.user._id);
    console.log("Review author:", review.author);
    req.flash("error", "You don't have permission!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
module.exports = { isReviewAuthor };
