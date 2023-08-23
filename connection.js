const mysql = require('mysql');
require('dotenv').config();


const connection = mysql.createConnection({
  host: process.env.Host,
  user: process.env.user,
  password: process.env.pass,
  database: process.env.DB
});

connection.connect((err)=>{
  if(!err){
    console.log("DB connected");
  }else{
    console.log("DB not connected \nError :"+ JSON.stringify(err));
  }
})

module.exports = connection;