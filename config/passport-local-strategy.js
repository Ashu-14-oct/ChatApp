const passport = require("passport");
const { findOne } = require("../models/user");
const User = require("../models/user");

const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async function (email, password, done) {
      try {
        const user = await User.findOne({ email: email });
        if (!user || user.password != password) {
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        console.log(err);
        return done(err);
      }
    }
  )
);

//serialize the user
passport.serializeUser(function (user, done) {
  done(null, user._id);
});

//deserialize the user
passport.deserializeUser(async function (id, done) {
  try{
    const user = await User.findById(id);
    return done(null, user);
  }catch(err){
    console.log(err);
        return done(err);
  }
});

//middleware for auth check
passport.checkAuthentication = function (req, res, next) {
  if (req.isAuthenticated) {
    return next();
  }

  return res.redirect("/");
};

//for setting authenticated user in locals
passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated) {
    res.locals.user = req.user;
  }

  next();
};

module.exports = passport;
