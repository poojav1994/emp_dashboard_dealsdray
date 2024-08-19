var express = require("express");
var router = express.Router();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "employeedashboard",
});
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// Route to validate user credentials
router.post("/", async function (req, res, next) {
  const { username, password } = req.body;
  console.log("-------", username, password);
  try {
    const connection = await pool.getConnection();
    const query = "SELECT * FROM t_login WHERE f_userName = ? AND f_pwd = ?";
    const [rows] = await connection.execute(query, [username, password]);
    connection.release();

    if (rows.length > 0) {
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error validating user" });
  }
});

module.exports = router;

// Route to register a new user (insert username and password)
// router.post("/register", async function (req, res, next) {
//   const { username, password } = req.body;

//   try {
//     const connection = await pool.getConnection();
//     const query = "INSERT INTO t_login (f_userName, f_pwd) VALUES (?, ?)";
//     const [result] = await connection.execute(query, [username, password]);
//     connection.release();

//     res
//       .status(201)
//       .json({ message: "User registered successfully", id: result.insertId });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error registering user" });
//   }
// });
