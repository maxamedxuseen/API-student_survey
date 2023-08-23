const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const conn = require("./connection");
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));

router.use(bodyParser.json());

router.get("/",(rep,res)=>{

  conn.query('SELECT * FROM anouncment', function (error, results, fields) {
    // Handle errors
    if (error) throw error;

    // Send the results as a JSON response
    res.send(JSON.stringify(results));
  });
  
})


// router.get("/", (rep, res) => {
//   conn.query(
//     `SELECT ch.id, ch.chepter_name, ch.book, ch.maqal, b.name FROM anouncment ch
//   INNER JOIN books b on ch.book = b.id
//   WHERE 1`,
//     function (error, results, fields) {
//       // Handle errors
//       if (error) throw error;

//       // Send the results as a JSON response
//       res.send(JSON.stringify(results));
//     }
//   );
// });

// router.get("/byboook/:id", (rep, res) => {
//   conn.query(
//     `SELECT ch.id, ch.chepter_name, ch.book, ch.maqal, b.name,b.cover FROM anouncment ch
//     INNER JOIN books b on ch.book = b.id
//     WHERE b.id = ?`,
//     [rep.params.id],
//     function (error, results, fields) {
//       // Handle errors
//       if (error) throw error;

//       // Send the results as a JSON response
//       res.send(JSON.stringify(results));
//     }
//   );
// });

// Get by Id
router.get("/:id", (rep, res) => {
  conn.query(
    "SELECT * FROM anouncment WHERE id = ?",
    [rep.params.id],
    function (error, results, fields) {
      // Handle errors
      if (error) throw error;

      // Send the results as a JSON response
      res.send(JSON.stringify(results));
    }
  );
});

// delete by ID
router.delete("/:id", (rep, res) => {
  conn.query(
    "SELECT * FROM anouncment WHERE id = ?",
    [rep.params.id],
    function (error, results, fields) {
      // Handle errors
      if (error) throw error;
      console.log(results);
      if (results.length > 0) {
        conn.query(
          "DELETE FROM `anouncment` WHERE id = ?",
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
  conn.query(
    "INSERT INTO anouncment SET ?",
    emp,
    function (error, results, fields) {
      // Handle errors
      if (error) {
        Res_code(400, "Something went wrong");
        console.log(error);
      }

      // Send the results as a JSON response
      res.send(JSON.stringify(Res_code(200, `it has been added`)));
    }
  );
});

// Update ---
router.put("/:id", (rep, res) => {
  conn.query(
    "SELECT * FROM anouncment WHERE id = ?",
    [rep.params.id],
    function (error, results, fields) {
      // Handle errors
      if (error) throw error;
      console.log(results);
      if (results.length > 0) {
        conn.query(
          "UPDATE anouncment SET ? WHERE id = ?",
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
