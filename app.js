if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const MongoStore = require("connect-mongo").default;
const session = require("express-session");
const express = require("express");
const flash = require("connect-flash");
const app = express();
const engine = require("ejs-mate");
const path = require("path");
const sessionSecret = process.env.SECRET_KEY || "fallbacksecret123";
const DB_URL = process.env.ATLASDB_URL;
const User = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError.js");

const methodOverride = require("method-override");
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");

app.set("view engine", "ejs");
app.engine("ejs", engine);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

console.log("ENV CHECK:");
console.log("SECRET_KEY:", process.env.SECRET_KEY);
console.log("ATLASDB_URL:", process.env.ATLASDB_URL);
console.log("NODE_ENV:", process.env.NODE_ENV);

const store = new MongoStore({
  mongoUrl: DB_URL,
  crypto: {
    secret: sessionSecret,
  },
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

const sessionOptions = {
  store,
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  res.locals.selectedCategory = [];
  res.locals.search = "";
  next();
});

main()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

async function main() {
  await mongoose.connect(DB_URL);
}

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port " + (process.env.PORT || 3000));
});

app.get("/fakeUser", async (req, res) => {
  try {
    const user = new User({
      username: "fakeuserr",
      email: "fakeuseer@example.com",
    });
    let result = await User.register(user, "password");
    res.send(result); // or res.send("Fake user created");
  } catch (err) {
    res.send(err);
  }
});

app.use("/listings", listingRoutes);
app.use("/listings", reviewRoutes);
app.use("/", userRoutes);

app.all("/*splat", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});


app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;

  res.status(statusCode).render("listings/error.ejs", {
    statusCode,
    message,
  });
});
