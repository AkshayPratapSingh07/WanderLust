const sampleReviews = [
  "Amazing stay! Highly recommended.",
  "The place was clean and beautiful.",
  "Host was very friendly and helpful.",
  "Great location, will visit again!",
  "Not worth the price.",
  "Had an awesome experience here.",
  "The view was breathtaking!",
  "Comfortable and cozy stay.",
  "Could be better, but overall okay.",
  "Absolutely loved it!",
];
const Review = require("../models/review");
const Listing = require("../models/listing");
const mongoose = require("mongoose");

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const addRandomReviews = async () => {
  const listings = await Listing.find();

  for (let listing of listings) {
    let numReviews = Math.floor(Math.random() * 1) + 1; // 1–5 reviews

    for (let i = 0; i < numReviews; i++) {
      const newReview = new Review({
        comment: getRandom(sampleReviews),
        rating: Math.floor(Math.random() * 5) + 1,
        author: "69dfe63d69c08a0e3ca6119a", // 🔥 replace with real user ID
      });

      await newReview.save();

      listing.reviews.push(newReview._id);
    }

    await listing.save();
  }

  console.log("✅ Random reviews added!");
};

mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust").then(async () => {
  console.log("DB Connected");
  await addRandomReviews();
  mongoose.connection.close();
});
