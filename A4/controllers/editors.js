//"StAuth10222: I Sechan Bae, 000803348 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else."

const express = require('express');
var router = express.Router()
const UsersModel=require('../models/users.js');
const ArticlesModel=require("../models/articles");
// Display the editors page
router.get("/", async function(req, res)
{
  const usersData=await UsersModel.getAllUsers();
  req.TPL.users=usersData;
  const articlesData=await ArticlesModel.getAllArticles();
  req.TPL.articles=articlesData;
  res.render("editors",req.TPL);
});
//delete user 
router.get("/deleteUser",async function(req,res){
  await UsersModel.deleteUser(req.query.username,req.query.password);
  res.redirect("/editors");
});
//delete article
router.get("/deleteArticle",async function(req,res){
  await ArticlesModel.deleteArticle(req.query.title,req.query.author);
  res.redirect("/editors");
});
module.exports = router;
