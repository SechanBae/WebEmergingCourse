//"StAuth10222: I Sechan Bae, 000803348 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else."
const express = require('express');
var router = express.Router()
const UsersModel=require("../models/users");

router.get("/", async function(req, res)
{
  req.TPL.signup_error = req.session.signup_error;
  req.session.signup_error = "";
  req.TPL.signup_success = req.session.signup_success;
  req.session.signup_success = "";
  req.TPL.signup_login = req.session.signup_login;
  req.session.signup_login= "";
  res.render("signup", req.TPL);
});

router.post("/signupForm",async function(req,res){
    if(req.body.username&&req.body.password){
        await UsersModel.register(req.body.username,req.body.password);
        req.session.signup_success="Account created.";
        req.session.signup_login= "Login";
        console.log(req.session);
        res.redirect("/signup");
    }
    else{
        req.session.signup_error="Username/Password cannot be empty";
        console.log(req.session);
        res.redirect("/signup");
    }
});
module.exports=router;