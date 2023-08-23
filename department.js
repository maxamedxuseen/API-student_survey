const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser")
const conn = require("./connection");
const router = express.Router();
router.use(bodyParser.urlencoded({extended:false}))

router.use(bodyParser.json())



router.get("/",(rep,res)=>{

  conn.query('SELECT * FROM department', function (error, results, fields) {
    // Handle errors
    if (error) throw error;

    // Send the results as a JSON response
    res.send(JSON.stringify(results));
  });
  
})
// Get by Id
router.get("/:id",(rep,res)=>{

  conn.query('SELECT * FROM department WHERE id = ?', [rep.params.id], function (error, results, fields) {
    // Handle errors
    if (error) throw error;

    // Send the results as a JSON response
    res.send(JSON.stringify(results));
  });
})


// delete by ID
router.delete("/:id",(rep,res)=>{

  conn.query('SELECT * FROM department WHERE id = ?', [rep.params.id], function (error, results, fields) {
    // Handle errors
    if (error) throw error;
    console.log(results);
    if(results.length > 0){

      conn.query('DELETE FROM `department` WHERE id = ?', [rep.params.id], function (error, result, fields) {
        // Handle errors
        if (error) throw error;
    
        // Send the results as a JSON response
        res.send(JSON.stringify(Res_code(200,"Deleted successfully")));
      });
      
    }else{
      res.send(JSON.stringify(Res_code(400,"it does not exist")))
    }
    
  });
 
})
// Add new record
// Get by Id
router.post("/",(req,res)=>{
const emp = req.body
  conn.query('INSERT INTO department SET ?',emp , function (error, results, fields) {
    // Handle errors
    if (error) {
      Res_code(400,'Something went wrong')
      console.log(error);
    }

    // Send the results as a JSON response
    res.send(JSON.stringify(Res_code(200,`it has been added`)));
  });
})


// Update ---
router.put("/:id",(rep,res)=>{

    conn.query('UPDATE department SET ? WHERE id = ?', [rep.body,rep.params.id], function (error, results, fields) {
      // Handle errors
      if (error) throw error;
  
      // Send the results as a JSON response
      res.send(JSON.stringify(Res_code(200,"it has been updated")));
    });
  })


function Res_code(code,massage){
  let result = {
    "status":code,
    "massage":massage
  }

  return result;
}


module.exports = router;