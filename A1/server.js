// "StAuth10222: I Sechan Bae, 000803348 certify that this material is my original work.
// No other person's work has been used without due acknowledgement. I have not made 
// my work available to anyone else."
const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");
const express = require('express');
const app = express();
var db;
app.use(express.json());

//get collection
app.get("/api", async function(req,res)
{
  const data = 
    await db.all("SELECT rowid as id, title, release_year,time_viewed FROM Collection");
  res.json(data);
});

//put collection
app.put("/api",async function(req,res){
    let data=req.body;
    var stmt=await db.prepare("DELETE FROM Collection");
    await stmt.run();
    stmt =await db.prepare("INSERT INTO Collection (title,release_year,time_viewed) VALUES (?,?,?)");
    for(let i=0;i<data.length;i++){
        await stmt.run(data[i].title,data[i].release_year,data[i].time_viewed);
    }
    res.json({
        "status":"REPLACE COLLECTION SUCCESSFUL"
    });
});

//post collection
app.post("/api",async function(req,res){
    let data=req.body;
    var stmt =await db.prepare("INSERT INTO Collection (title,release_year,time_viewed) VALUES (?,?,?)");
    await stmt.run(data.title,data.release_year,data.time_viewed);
    
    res.json({
        "status":"CREATE ENTRY SUCCESSFUL"
    });
});

//delete collection
app.delete("/api",async function(req,res){
    var stmt=await db.prepare("DELETE FROM Collection");
    await stmt.run();
    
    res.json({
        "status":"DELETE COLLECTION SUCCESSFUL"
    });
});

//get item
app.get("/api/:id",async function(req,res){
    const data=await db.get("SELECT rowid as id, * FROM Collection WHERE rowid=?",req.params.id);
    res.json(data);
});

//put item
app.put("/api/:id",async function(req,res){
  let data=req.body;
  var stmt=await db.prepare("UPDATE Collection SET title=?,release_year=?,time_viewed=? WHERE rowid=?");
  await stmt.run(data.title,data.release_year,data.time_viewed,req.params.id);
  
  res.json({
      "status":"UPDATE ITEM SUCCESSFUL"
  });
});

//delete item
app.delete("/api/:id",async function(req,res){
  var stmt=await db.prepare("DELETE FROM Collection WHERE rowid=?");
  await stmt.run(req.params.id);
  
  res.json({
      "status":"DELETE ITEM SUCCESSFUL"
  });
});




// creates the database and table of data to be managed, then starts the server
async function startup()
{
  // create the database connection
  db = await sqlite.open({
    filename: 'api.db',
    driver: sqlite3.Database
  });
  
  // create 
  await db.run("DROP TABLE IF EXISTS Collection");
  await db.run("CREATE TABLE Collection (rowid INTEGER PRIMARY KEY, title TEXT, release_year TEXT, time_viewed TEXT)");

  // start the server
  const server = app.listen(3000, function(){
    console.log("RESTful API listening on port 3000!")
  });
}

startup();
