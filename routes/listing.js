const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listingController = require("../controllers/listingController.js");
const { isLoggedIn } = require("../middleware/isLoggedIn.js");
const { isOwner } = require("../middleware/isOwner.js");
const { validateListing } = require("../middleware/validateListing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// ================= INDEX & CREATE =================

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    validateListing,
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing),
  );

// ================= NEW =================

router.get("/new", isLoggedIn, listingController.renderNewForm);

// ================= SHOW, UPDATE, DELETE =================

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing),
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// ================= EDIT =================

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing),
);

module.exports = router;
