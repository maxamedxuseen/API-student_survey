const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const conn = require("./connection");
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));

router.use(bodyParser.json());



router.get("/",(rep,res)=>{

  conn.query('SELECT * FROM  questions', function (error, results, fields) {
    // Handle errors
    if (error) throw error;

    // Send the results as a JSON response
    res.send(JSON.stringify(results));
  });
  
})

// router.get("/", (rep, res) => {
//   conn.query(
//     `SELECT b.id, b.name, b.description, b.pages, b.cover, b.aqris, b.tijaabi, b.price, b.catagory, b.status as status_id, s.status as status, c.cat_name as catagory_name  FROM questions b
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
//     `SELECT * FROM questions b
//   ORDER BY b.id DESC`,
//     function (error, results, fields) {
//       // Handle errors
//       if (error) throw error;

//       // Send the results as a JSON response
//       res.send(JSON.stringify(results));
//     }
//   );
// });

router.get("/n/:sid", (req, res) => {
  conn.query('SELECT * FROM questions WHERE survey_id = ?', [req.params.sid], function (error, results, fields) {
    if (error) {
      console.error(error);
      res.status(500).send('Error retrieving questions');
    } else if (results.length > 0) {
      res.send(JSON.stringify(results));
    } else {
      res.status(404).send('No questions found for survey ID ' + req.params.sid);
    }
  });
});

/// Get by Id
router.get("/:id",(rep,res)=>{

  conn.query('SELECT * FROM  questions WHERE id = ?', [rep.params.id], function (error, results, fields) {
    // Handle errors
    if (error) throw error;

    // Send the results as a JSON response
    res.send(JSON.stringify(results));
  });
})

// delete by ID
router.delete("/:id", (rep, res) => {
  conn.query(
    "SELECT * FROM questions WHERE id = ?",
    [rep.params.id],
    function (error, results, fields) {
      // Handle errors
      if (error) throw error;
      console.log(results);
      if (results.length > 0) {
        conn.query(
          "DELETE FROM `questions` WHERE id = ?",
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
  conn.query("INSERT INTO questions SET ?", emp, function (error, results, fields) {
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
    "SELECT * FROM questions WHERE id = ?",
    [rep.params.id],
    function (error, results, fields) {
      // Handle errors
      if (error) throw error;
      console.log(results);
      if (results.length > 0) {
        conn.query(
          "UPDATE questions SET ? WHERE id = ?",
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
