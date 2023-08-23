const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const conn = require("./connection");
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));

router.use(bodyParser.json());

router.get("/", (rep, res) => {
  conn.query(`SELECT * FROM  feedback`, function (error, results, fields) {
    // Handle errors
    if (error) throw error;

    // Send the results as a JSON response
    res.send(JSON.stringify(results));
  });
});

router.get("/check/:question/:answer/:stuID", (req, res) => {
  conn.query(`SELECT * FROM  feedback WHERE question_id = ? AND answer_id = ? AND student_id = ?`,
  [req.params.question, req.params.answer, req.params.stuID], 
  function (error, results, fields) {
    // Handle errors
    if (error) throw error;

    // Send the results as a JSON response
    res.send(JSON.stringify(results));
  });
});



router.get("/report/:id", (req, res) => {
  conn.query(
    `
    SELECT s.id AS survey_id,
       q.id AS question_id, 
       q.questions AS question,
       SUM(CASE WHEN a.answers = 'Strongly agree' THEN 1 ELSE 0 END) AS Strongly_agree,
       SUM(CASE WHEN a.answers = 'Agree' THEN 1 ELSE 0 END) AS Agree,
       SUM(CASE WHEN a.answers = 'Neutral' THEN 1 ELSE 0 END) AS Neutral,
       SUM(CASE WHEN a.answers = 'Disagree' THEN 1 ELSE 0 END) AS Disagree,
       SUM(CASE WHEN a.answers = 'Strongly disagree' THEN 1 ELSE 0 END) AS Strongly_disagree,
       COUNT(a.answers) AS total_answers
    FROM feedback f
    INNER JOIN questions q ON f.question_id = q.id
    INNER JOIN answers a ON f.answer_id = a.id
    INNER JOIN survey s ON q.survey_id = s.id
    WHERE s.id = ?
    GROUP BY s.id, q.id, q.questions
    `,
    [req.params.id],
    function (error, results, fields) {
      // Handle errors
      if (error) throw error;

      // Check if any questions exist in the survey
      if (results.length === 0) {
        return res.status(404).json({ message: "No questions found in the survey." });
      }

      // Send the results as a JSON response
      res.send(JSON.stringify(results));
    }
  );
});

router.get("/question/:surveyId/:questionId", (req, res) => {
  conn.query(
    `
    SELECT q.id AS question_id,
       SUM(CASE WHEN a.answers = 'Strongly agree' THEN 1 ELSE 0 END) AS Strongly_agree,
       SUM(CASE WHEN a.answers = 'Agree' THEN 1 ELSE 0 END) AS Agree,
       SUM(CASE WHEN a.answers = 'Neutral' THEN 1 ELSE 0 END) AS Neutral,
       SUM(CASE WHEN a.answers = 'Disagree' THEN 1 ELSE 0 END) AS Disagree,
       SUM(CASE WHEN a.answers = 'Strongly disagree' THEN 1 ELSE 0 END) AS Strongly_disagree
    FROM feedback f
    INNER JOIN questions q ON f.question_id = q.id
    INNER JOIN answers a ON f.answer_id = a.id
    INNER JOIN survey s ON q.survey_id = s.id
    WHERE s.id = ? AND q.id = ?
    GROUP BY q.id
    `,
    [req.params.surveyId, req.params.questionId],
    function (error, results, fields) {
      // Handle errors
      if (error) throw error;

      // Check if the question exists in the survey
      if (results.length === 0) {
        return res.status(404).json({ message: "Question not found in the survey." });
      }

      // Send the result as a JSON response
      res.send(JSON.stringify(results[0]));
    }
  );
});


router.get("/students/:id/", (req, res) => {
  conn.query(
    `
    SELECT s.id AS student_id, s.name AS student_name, fac.fcl_Name, COUNT(f.id) AS total_answers
    FROM students s
    LEFT JOIN feedback f ON s.id = f.student_id
    LEFT JOIN answers a ON f.answer_id = a.id
    LEFT JOIN questions q ON f.question_id = q.id
    LEFT JOIN faculty fac ON s.faculty_id = fac.id
    WHERE q.survey_id = ?
    GROUP BY s.id, s.name, fac.fcl_Name
    `,
    [req.params.id],
    function (error, results, fields) {
      // Handle errors
      if (error) throw error;

      // Send the results as a JSON response
      res.send(JSON.stringify(results));
    }
  );
});

router.get("/:id", (rep, res) => {
  conn.query(
    "SELECT * FROM feedback WHERE id = ?",
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
    "SELECT * FROM feedback WHERE id = ?",
    [rep.params.id],
    function (error, results, fields) {
      // Handle errors
      if (error) throw error;
      console.log(results);
      if (results.length > 0) {
        conn.query(
          "DELETE FROM `feedback` WHERE id = ?",
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
    "INSERT INTO feedback SET ?",
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
    "SELECT * FROM feedback WHERE id = ?",
    [rep.params.id],
    function (error, results, fields) {
      // Handle errors
      if (error) throw error;
      console.log(results);
      if (results.length > 0) {
        conn.query(
          "UPDATE feedback SET ? WHERE id = ?",
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
