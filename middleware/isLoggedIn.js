const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  const url = req.originalUrl;

  if (
    !req.session.returnTo &&
    !url.startsWith("/login") &&
    !url.startsWith("/signup")
  ) {
    req.session.returnTo = url;
  }

  req.flash("error", "You must be signed in first!");
  return res.redirect("/login");
};

const saveRedirectUrl = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports = { isLoggedIn, saveRedirectUrl };
