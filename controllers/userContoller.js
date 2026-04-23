const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup");
};

module.exports.createUser = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;

    email = email.toLowerCase().trim();

    // Check email uniqueness
    const existingEmail = await User.exists({ email });
    if (existingEmail) {
      req.flash("error", "Email already registered!");
      return res.redirect("/signup");
    }

    //  Create user
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);

    //  Login
    await new Promise((resolve, reject) => {
      req.login(registeredUser, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    //  Redirect logi
    const redirectUrl =
      res.locals.returnTo && res.locals.returnTo.startsWith("/")
        ? res.locals.returnTo
        : "/listings";

    delete req.session.returnTo;

    req.flash("success", `Welcome, ${registeredUser.username}!`);
    return res.redirect(redirectUrl);
  } catch (err) {
    console.error(err);

    if (err.name === "UserExistsError") {
      req.flash("error", "Username already taken!");
    } else {
      req.flash("error", "Signup failed. Please try again.");
    }

    return res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.loginUser = (req, res) => {
  req.flash("success", "Welcome back!");

  let redirectUrl = res.locals.returnTo || "/listings";

  console.log("Redirecting to:", redirectUrl);

  if (
    !redirectUrl ||
    redirectUrl.includes("/login") ||
    redirectUrl.includes("/signup")
  ) {
    redirectUrl = "/listings";
  }

  delete req.session.returnTo;

  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
  req.logout(function (err) {
    if (err) {
      req.flash("error", "Error logging out!");
      return res.redirect("/listings");
    }
    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
  });
};
