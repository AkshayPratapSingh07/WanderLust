const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const reviewController = require("../controllers/reviewContoller.js");
const { isLoggedIn } = require("../middleware/isLoggedIn.js");
const { validateReview } = require("../middleware/validateReview.js");
const { isReviewAuthor } = require("../middleware/isReviewAuthor.js");

// ================= CREATE REVIEW =================

router.post(
  "/:id/reviews",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview),
);

// ================= DELETE REVIEW =================

router.delete(
  "/:id/reviews/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview),
);

module.exports = router;
