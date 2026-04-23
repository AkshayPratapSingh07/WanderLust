const mongoose = require("mongoose");
const review = require("./review");
let schema = mongoose.Schema;

let listingSchema = new schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: [
      {
        type: String,
        enum: [
          "Trending",
          "Farm",
          "Mountains",
          "Bed & Breakfast",
          "Campgrounds",
          "Amazing pools",
          "Iconic cities",
          "Beach",
          "Castles",
          "Off-the-grid",
          "Luxe",
        ],
      },
    ],
    validate: [(arr) => arr.length > 0, "At least one category is required"],
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    filename: String,
    url: String,
    // default: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    // set: (v) => (!v || v.trim() === "" ? "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" : v),
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await review.deleteMany({
      _id: {
        $in: listing.reviews,
      },
    });
  } else {
    console.log("No document found to delete reviews for.");
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
