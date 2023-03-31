const User = require("../models/user");

module.exports.home = function (req, res) {

  res.render("home", {
    title: "Home",
  });
};



module.exports.signIn = function (req, res) {
  return res.redirect("/");
};

module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect("/user/hello");
  }
  res.render("sign_up", {
    title: "Sign Up",
  });
};

module.exports.signOut = function(req, res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
}

module.exports.createUser = async function (req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      console.log("User is already made using the email!");
      return;
    }

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    console.log(newUser);
    return res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};
