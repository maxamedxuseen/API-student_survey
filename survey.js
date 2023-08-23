const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const conn = require("./connection");
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));

router.use(bodyParser.json());

router.get("/", (req, res) => {
  conn.query(
    `
    SELECT s.id, s.survey_name, c.category, su.year_name
    FROM survey s
    INNER JOIN category c ON s.catagory_id = c.id
    INNER JOIN survey_time su ON s.survey_timeId = su.id`,
    function (error, results, fields) {
      // Handle errors
      if (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ error: "An error occurred while processing your request." });
      } else {
        // Send the results as a JSON response
        res.json(results);
      }
    }
  );
});

// Get by Id
router.get("/:id", (rep, res) => {
  conn.query(
    `SELECT s.id, s.survey_name, c.category, su.year_name
    FROM survey s
    INNER JOIN category c ON s.catagory_id = c.id
    INNER JOIN survey_time su ON s.survey_timeId = su.id
    WHERE su.id = ?`,
    [rep.params.id],
    function (error, results, fields) {
      // Handle errors
      if (error) throw error;

      // Send the results as a JSON response
      res.send(JSON.stringify(results));
    }
  );
});
router.get("/:surveyId/:timeId", (req, res) => {
  const surveyId = req.params.surveyId;
  const timeId = req.params.timeId;

  conn.query(
    `SELECT s.id, s.survey_name, c.category, su.year_name
    FROM survey s
    INNER JOIN category c ON s.catagory_id = c.id
    INNER JOIN survey_time su ON s.survey_timeId = su.id
    WHERE s.id = ? AND su.id = ?`,
    [surveyId, timeId],
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
    "SELECT * FROM survey WHERE id = ?",
    [rep.params.id],
    function (error, results, fields) {
      // Handle errors
      if (error) throw error;
      console.log(results);
      if (results.length > 0) {
        conn.query(
          "DELETE FROM `survey` WHERE id = ?",
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
router.delete("delete/:id", (req, res) => {
  const surveyId = req.params.id;

  // Delete the questions associated with the survey first
  conn.query(
    "DELETE FROM `questions` WHERE survey_id = ?",
    [surveyId],
    function (error, result, fields) {
      // Handle errors
      if (error) {
        console.log("Error deleting questions:", error);
        return res.send(JSON.stringify(Res_code(500, "Internal Server Error")));
      }

      // After questions are deleted, delete the survey from the `survey` table
      conn.query(
        "DELETE FROM `survey` WHERE id = ?",
        [surveyId],
        function (error, result, fields) {
          // Handle errors
          if (error) {
            console.log("Error deleting survey:", error);
            return res.send(JSON.stringify(Res_code(500, "Internal Server Error")));
          }

          // Check if the survey was found and deleted
          if (result.affectedRows > 0) {
            res.send(JSON.stringify(Res_code(200, "Deleted successfully")));
          } else {
            res.send(JSON.stringify(Res_code(400, "Survey not found")));
          }
        }
      );
    }
  );
});

// Add new record
// Get by Id
router.post("/", (req, res) => {
  const emp = req.body;
  conn.query(
    "INSERT INTO survey SET ?",
    emp,
    function (error, results, fields) {
      // Handle errors
      if (error) {
        Res_code(400, "Something went wrong");
        console.log(error);
      }

      // Send the results as a JSON response
      res.send(results);
    }
  );
});

// Update ---
router.put("/:id", (rep, res) => {
  conn.query(
    "UPDATE survey SET ? WHERE id = ?",
    [rep.body, rep.params.id],
    function (error, results, fields) {
      // Handle errors
      if (error) throw error;

      // Send the results as a JSON response
      res.send(JSON.stringify(Res_code(200, "it has been updated")));
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
