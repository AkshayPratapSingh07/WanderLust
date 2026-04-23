const mongoose = require("mongoose");
const Listing = require("../models/listing");
const getCoords = require("../controllers/geocodingController").getCoords;

mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust");

async function updateListings() {
  const listings = await Listing.find({ geometry: { $exists: false } });

  for (let listing of listings) {
    if (!listing.location) continue;

    const coords = await getCoords(listing.location);

    if (coords) {
      listing.geometry = {
        type: "Point",
        coordinates: [Number(coords.lng), Number(coords.lat)],
      };

      await listing.save();
      console.log("Updated:", listing.title);
    }
  }

  console.log("Done updating listings");
  mongoose.connection.close();
}


updateListings();
