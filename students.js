const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser")
const conn = require("./connection");
const router = express.Router();
router.use(bodyParser.urlencoded({extended:false}))

router.use(bodyParser.json())



router.get("/",(rep,res)=>{

  conn.query('SELECT * FROM students', function (error, results, fields) {
    // Handle errors
    if (error) throw error;

    // Send the results as a JSON response
    res.send(JSON.stringify(results));
  });
  
})
// Get by Id
router.get("/:id",(rep,res)=>{

  conn.query('SELECT * FROM students WHERE id = ?', [rep.params.id], function (error, results, fields) {
    // Handle errors
    if (error) throw error;

    // Send the results as a JSON response
    res.send(JSON.stringify(results));
  });
})


// Get by uuid
router.get("/uuid/:uu",(rep,res)=>{

  conn.query('SELECT * FROM students WHERE uuid = ?', [rep.params.uu], function (error, results, fields) {
    // Handle errors
    if (error) throw error;

    // Send the results as a JSON response
    res.send(JSON.stringify(results[0]));
  });
})


// delete by ID
router.delete("/:id",(rep,res)=>{

  conn.query('SELECT * FROM students WHERE id = ?', [rep.params.id], function (error, results, fields) {
    // Handle errors
    if (error) throw error;
    console.log(results);
    if(results.length > 0){

      conn.query('DELETE FROM `students` WHERE id = ?', [rep.params.id], function (error, result, fields) {
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
  conn.query('INSERT INTO students SET ?',emp , function (error, results, fields) {
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

    conn.query('UPDATE students SET ? WHERE id = ?', [rep.body,rep.params.id], function (error, results, fields) {
      // Handle errors
      if (error) throw error;
  
      // Send the results as a JSON response
      res.send(JSON.stringify(Res_code(200,"it has been updated")));
    });
  })


  
  // router.get("/login/:uni_id/:Date",(rep,res)=>{

  //   conn.query('SELECT * FROM students e where e.uni_id = ? and e.date_of_birth = ?',[rep.params.uni_id,rep.params.password] , function (error, results, fields) {
  //     // Handle errors

  //     if (error) throw error;
  //     // Send the results as a JSON 
    
  //     if(results.length >0){
  //       res.send(JSON.stringify(results[0]));
  //     }else{
  //       res.send(Res_code(300,"no user in found"))
  //       // console.log("user :"+rep.params.username+"\npass :"+rep.params.password);
  //     }
      
      
  //   });
  // })
//---------------------------------------------------------------------------------------------
  // router.get("/login/:uni_id/:Date", (req, res) => {
  //   conn.query(
  //     'SELECT * FROM students e WHERE e.uni_id = ? AND e.date_of_birth = ?',
  //     [req.params.uni_id, req.params.Date],
  //     function (error, results, fields) {
  //       if (error) throw error;
  
  //       if (results.length > 0) {
  //         // Parse the date string into a JavaScript Date object
  //         const dateOfBirth = new Date(results[0].date_of_birth);
  
  //         // Get the year, month, and day from the Date object
  //         const year = dateOfBirth.getFullYear();
  //         const month = String(dateOfBirth.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  //         const day = String(dateOfBirth.getDate()).padStart(2, '0');
  
  //         // Create the desired date string in the format "YYYY-MM-DD"
  //         const formattedDate = `${year}-${month}-${day}`;
  
  //         // Create a new property in the response JSON with the formatted date
  //         const responseData = { ...results[0], formattedDate };
  
  //         // Send the modified results as JSON
  //         res.send(JSON.stringify(responseData));
  //       } else {
  //         res.send(Res_code(300, "no user found"));
  //       }
  //     }
  //   );
  // });
  //----------------------------------------------------------------------------------

  router.get("/login/:uni_id/:Date", (req, res) => {
    conn.query(
      'SELECT s.*, f.fcl_Name FROM students s JOIN faculty f ON s.faculty_id = f.id WHERE s.uni_id = ? AND s.date_of_birth = ?',
      [req.params.uni_id, req.params.Date],
      function (error, results, fields) {
        if (error) throw error;
  
        if (results.length > 0) {
          // Parse the date string into a JavaScript Date object
          const dateOfBirth = new Date(results[0].date_of_birth);
  
          // Get the year, month, and day from the Date object
          const year = dateOfBirth.getFullYear();
          const month = String(dateOfBirth.getMonth() + 1).padStart(2, '0'); // Months are 0-based
          const day = String(dateOfBirth.getDate()).padStart(2, '0');
  
          // Create the desired date string in the format "YYYY-MM-DD"
          const formattedDate = `${year}-${month}-${day}`;
  
          // Create a new property in the response JSON with the formatted date and faculty name
          const responseData = { ...results[0], formattedDate, faculty_name: results[0].faculty_name };
  
          // We don't need the original faculty_id anymore since we have faculty_name
          delete responseData.faculty_id;
  
          // Send the modified results as JSON
          res.send(JSON.stringify(responseData));
        } else {
          res.send(Res_code(300, "no user found"));
        }
      }
    );
  });
  


  //

  // router.get("/subs/:id", (rep, res) => {
  //   conn.query(
  //     `SELECT c.id, c.name,c.uni_id
  //     FROM students c
  //     INNER JOIN payment p ON c.id = p.customer
  //     WHERE MONTH(p.paidDate) = MONTH(NOW()) AND YEAR(p.paidDate) = YEAR(NOW()) AND c.id = ?`,
  //     [rep.params.id],
  //     function (error, results, fields) {
  //       // Handle errors
  //       if (error) throw error;
  
  //       if (results.length > 0) {
  //         console.log("paid");
  //         res.send(JSON.stringify(true));
  //       } else {
  //         res.send(JSON.stringify(false));
  //       }
  
  //       // Send the results as a JSON response
  //     }
  //   );
  // });


function Res_code(code,massage){
  let result = {
    "status":code,
    "massage":massage
  }

  return result;
}


module.exports = router;