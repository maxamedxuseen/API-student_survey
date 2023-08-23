const express = require("express");
const app = express();
var cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const conn = require("./connection");

const port = process.env.port || 2000;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

const adminRoute = require("./admin");
const alumniRoute = require("./alumni");
const surveyTimeRoute = require("./survey_time");
const super_useroute = require("./super_user");
const studentsRoute = require("./students");
const facultyRoute = require("./faculty");
const departmentRoute = require("./department");
const surveyRoute = require("./survey");
const questionRoute = require("./questions");
const answerRoute = require("./answers.js");
const anouncmentRoute = require("./anouncment");
const categoryRoute = require("./category");
const statusRoute = require("./status");
const feedbackRoute = require("./feedback");

app.use(cors({ origin: "*" }));

app.use("/api/admin", adminRoute);
app.use("/api/alumni", alumniRoute);
app.use("/api/survey_time", surveyTimeRoute);
app.use("/api/super_user", super_useroute);
app.use("/api/students", studentsRoute);
app.use("/api/faculty", facultyRoute);
app.use("/api/department", departmentRoute);
app.use("/api/survey", surveyRoute);
app.use("/api/questions", questionRoute);
app.use("/api/answers", answerRoute);
app.use("/api/anouncment", anouncmentRoute);
app.use("/api/category", categoryRoute);
app.use("/api/status", statusRoute);
app.use("/api/feedback", feedbackRoute);
function Res_code(code, massage) {
  let result = {
    status: code,
    massage: massage,
  };

  return result;
}

app.listen(port, () => {
  console.log(`Server is listening on port : ${port}`);
});
