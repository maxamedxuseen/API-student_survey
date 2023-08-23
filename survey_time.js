const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const conn = require("./connection");
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));

router.use(bodyParser.json());



router.get("/",(rep,res)=>{

  conn.query('SELECT * FROM  survey_time', function (error, results, fields) {
    // Handle errors
    if (error) throw error;

    // Send the results as a JSON response
    res.send(JSON.stringify(results));
  });
  
})

// router.get("/", (rep, res) => {
//   conn.query(
//     `SELECT b.id, b.name, b.description, b.pages, b.cover, b.aqris, b.tijaabi, b.price, b.catagory, b.status as status_id, s.status as status, c.cat_name as catagory_name  FROM survey_time b
//   INNER JOIN item_status s on b.status = s.id
//   INNER JOIN catagories c on b.catagory = c.id
//   WHERE 1`,
//     function (error, results, fields) {
//       // Handle errors
//       if (error) throw error;

//       // Send the results as a JSON response
//       res.send(JSON.stringify(results));
//     }
//   );
// });


// router.get("/leatest/", (rep, res) => {
//   conn.query(
//     `SELECT * FROM survey_time b
//   ORDER BY b.id DESC`,
//     function (error, results, fields) {
//       // Handle errors
//       if (error) throw error;

//       // Send the results as a JSON response
//       res.send(JSON.stringify(results));
//     }
//   );
// });
/// Get by Id
router.get("/:id",(rep,res)=>{

  conn.query('SELECT * FROM  survey_time WHERE id = ?', [rep.params.id], function (error, results, fields) {
    // Handle errors
    if (error) throw error;

    // Send the results as a JSON response
    res.send(JSON.stringify(results));
  });
})

// delete by ID
router.delete("/:id", (rep, res) => {
  conn.query(
    "SELECT * FROM survey_time WHERE id = ?",
    [rep.params.id],
    function (error, results, fields) {
      // Handle errors
      if (error) throw error;
      console.log(results);
      if (results.length > 0) {
        conn.query(
          "DELETE FROM `survey_time` WHERE id = ?",
          [rep.params.id],
          function (error, result, fields) {
            // Handle errors
            if (error) throw error;

            // Send the results as a JSON response
            res.send(JSON.stringify(Res_code(200, "Deleted successfully")));
          }
        );
      } else {
        res.send(JSON.stringify(Res_code(400, "it does not exist")));
      }
    }
  );
});
// Add new record
router.post("/", (req, res) => {
  const emp = req.body;
  conn.query("INSERT INTO survey_time SET ?", emp, function (error, results, fields) {
    // Handle errors
    if (error) {
      Res_code(400, "Something went wrong");
      console.log(error);
    }

    // Send the results as a JSON response
    res.send(JSON.stringify(Res_code(200, `it has been added`)));
  });
});

// Update ---
router.put("/:id", (rep, res) => {
  conn.query(
    "SELECT * FROM survey_time WHERE id = ?",
    [rep.params.id],
    function (error, results, fields) {
      // Handle errors
      if (error) throw error;
      console.log(results);
      if (results.length > 0) {
        conn.query(
          "UPDATE survey_time SET ? WHERE id = ?",
          [rep.body, rep.params.id],
          function (error, results, fields) {
            // Handle errors
            if (error) throw error;

            // Send the results as a JSON response
            res.send(JSON.stringify(Res_code(200, "it has been updated")));
          }
        );
      } else {
        res.send(JSON.stringify(Res_code(400, "it does not exist")));
      }
    }
  );
});

function Res_code(code, massage) {
  let result = {
    status: code,
    massage: massage,
  };

  return result;
}

module.exports = router;
