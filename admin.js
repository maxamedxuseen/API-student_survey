const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser")
const conn = require("./connection");
const router = express.Router();
router.use(bodyParser.urlencoded({extended:false}))

router.use(bodyParser.json())



router.get("/",(rep,res)=>{

  conn.query('SELECT * FROM admin', function (error, results, fields) {
    // Handle errors
    if (error) throw error;

    // Send the results as a JSON response
    res.send(JSON.stringify(results));
  });
  
})
// Get by Id
router.get("/:id",(rep,res)=>{

  conn.query('SELECT * FROM admin WHERE id = ?', [rep.params.id], function (error, results, fields) {
    // Handle errors
    if (error) throw error;

    // Send the results as a JSON response
    res.send(JSON.stringify(results));
  });
})


// delete by ID
router.delete("/:id",(rep,res)=>{

  conn.query('SELECT * FROM admin WHERE id = ?', [rep.params.id], function (error, results, fields) {
    // Handle errors
    if (error) throw error;
    console.log(results);
    if(results.length > 0){

      conn.query('DELETE FROM `admin` WHERE id = ?', [rep.params.id], function (error, result, fields) {
        // Handle errors
        if (error) throw error;
    
        // Send the results as a JSON response
        res.send(JSON.stringify(Res_code(200,"Deleted successfully")));
      });
      
    }else{
      res.send(JSON.stringify(Res_code(400,"that employee does not exist")))
    }
    
  });
 
})

router.get("/login/:username/:password",(rep,res)=>{

  conn.query('SELECT * FROM admin e where e.username = ? and e.password = ?',[rep.params.username,rep.params.password] , function (error, results, fields) {
    // Handle errors

    if (error) throw error;
    // Send the results as a JSON 
  
    if(results.length >0){
      res.send(JSON.stringify(results));
    }else{
      res.send(JSON.stringify(Res_code(300,"no user in found")))
      console.log("user :"+rep.params.username+"\npass :"+rep.params.password);
    }
    
    
  });
})


// Add new record
// Get by Id
router.post("/",(req,res)=>{
const emp = req.body
  conn.query('INSERT INTO admin SET ?',emp , function (error, results, fields) {
    // Handle errors
    if (error) {
      Res_code(400,'Something went wrong')
      console.log(error);
    }

    // Send the results as a JSON response
    res.send(JSON.stringify(Res_code(200,`${req.body.name} has been added`)));
  });
})


// Update ---
router.put("/:id",(rep,res)=>{

    conn.query('UPDATE admin SET ? WHERE id = ?', [rep.body,rep.params.id], function (error, results, fields) {
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