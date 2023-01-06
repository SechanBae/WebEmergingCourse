//"StAuth10222: I Sechan Bae, 000803348 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else."
var sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");
async function startup()
{
  db = await sqlite.open({
    filename: 'database.db',
    driver: sqlite3.Database
  });
}

startup();
//get all users
async function getAllUsers(){
    const results=db.all("SELECT * FROM Users");
    return results;
}
//delete
async function deleteUser(username,password){
    await db.run("DELETE FROM Users WHERE username=? AND password=?",[username,password]);
}
// Login
async function login(username,password)
{
  const results = db.get("SELECT * FROM Users WHERE username=? AND password=?",[username,password]);
  return results;
}

// Register
async function register(username,password)
{ 
  await db.run("INSERT INTO Users (username,password) VALUES (?,?)",
               [username,password]);
}

module.exports = {login
                 ,register,
                getAllUsers,deleteUser};
