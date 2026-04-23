const mongoose = require('mongoose');
const sampleData = require('./data.js') 

const Mongo_URL = "mongodb://127.0.0.1:27017/Wanderlust"
const Listing = require('../models/listing'); 
const data = require('./data');

main().then(() => {
    console.log("Connected to MongoDB");           
}).catch(err => {
    console.error("MongoDB connection error:", err);
});

async function main(){
    await mongoose.connect(Mongo_URL)
}


const initDB = async () => {
  await Listing.deleteMany({});

  sampleData.data = sampleData.data.map((listing) => ({
    ...listing,
    owner: "69e0cd5b9ce76517f84e9237",
  }));

  await Listing.insertMany(sampleData.data);
};
initDB();