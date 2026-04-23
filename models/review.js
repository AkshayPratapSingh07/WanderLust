const mongoose = require("mongoose");
let schema = mongoose.Schema;

let reviewSchema = new schema({
  comment: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },

  CreatedAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Review", reviewSchema);
