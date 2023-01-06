//"StAuth10222: I Sechan Bae, 000803348 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else."
const express = require('express');
var router = express.Router()
const UsersModel=require("../models/users");
// Displays the login page
router.get("/", async function(req, res)
{
  // if we had an error during form submit, display it, clear it from session
  req.TPL.login_error = req.session.login_error;
  req.session.login_error = "";

  // render the login page
  res.render("login", req.TPL);
});

// Attempts to login a user
// - The action for the form submit on the login page.
router.post("/attemptlogin", async function(req, res)
{
  const data=await UsersModel.login(req.body.username,req.body.password);
  if (data)
  {
    // set a session key username to login the user
    req.session.username = req.body.username;
    req.session.level=data.level;
    // re-direct the logged-in user to the members page
    res.redirect("/"+data.level+"s");
  }
  else
  {
    // if we have an error, reload the login page with an error
    req.session.login_error = "Invalid username and/or password!";
    res.redirect("/login");
  }

});

// Logout a user
// - Destroys the session key username that is used to determine if a user
// is logged in, re-directs them to the home page.
router.get("/logout", async function(req, res)
{
  delete(req.session.username);
  res.redirect("/home");
});

module.exports = router;
