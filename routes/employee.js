const express = require("express");
const mysql = require("mysql2/promise");
const router = express.Router();

// Use the same connection pool from your main app file
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "employeedashboard",
});

// Route to create a new employee (POST)
router.post("/", async (req, res) => {
  const {
    f_image,
    f_Name,
    f_Email,
    f_Mobile,
    f_Designation,
    f_Gender,
    f_Course,
    f_Createdate,
  } = req.body;
  try {
    const connection = await pool.getConnection();
    const query =
      "INSERT INTO t_Employee (f_image, f_Name, f_Email, f_Mobile, f_Designation, f_gender, f_Course, f_Createdate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const [result] = await connection.execute(query, [
      f_image,
      f_Name,
      f_Email,
      f_Mobile,
      f_Designation,
      f_Gender,
      f_Course,
      f_Createdate,
    ]);
    connection.release();

    res
      .status(201)
      .json({ message: "Employee created successfully", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating employee" });
  }
});

// Route to get all employees (GET)
router.get("/", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute("SELECT * FROM t_Employee");
    connection.release();

    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching employees" });
  }
});

// Route to get a particular employee by ID (GET)
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const connection = await pool.getConnection();
    const query = "SELECT * FROM t_Employee WHERE f_id = ?";
    const [rows] = await connection.execute(query, [id]);
    connection.release();

    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching employee" });
  }
});

// Route to update an employee (PATCH)
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    f_image,
    f_Name,
    f_Email,
    f_Mobile,
    f_Designation,
    f_Gender,
    f_Course,
    f_Createdate,
  } = req.body;

  try {
    const connection = await pool.getConnection();
    const query = `UPDATE t_Employee 
       SET f_image = ?, f_Name = ?, f_Email = ?, f_Mobile = ?, f_Designation = ?, f_Gender = ?, f_Course = ? ,f_Createdate =?
       WHERE f_id = ?`;
    const [result] = await connection.execute(query, [
      f_image,
      f_Name,
      f_Email,
      f_Mobile,
      f_Designation,
      f_Gender,
      f_Course,
      f_Createdate,
      id,
    ]);
    connection.release();

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Employee updated successfully" });
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating employee" });
  }
});

// Route to delete an employee (DELETE)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const connection = await pool.getConnection();
    const query = "DELETE FROM t_Employee WHERE f_id = ?";
    const [result] = await connection.execute(query, [id]);
    connection.release();

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Employee deleted successfully" });
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting employee" });
  }
});

module.exports = router;

// // Convert the image buffer to a Base64 string
// const employees = rows.map((row) => {
//   if (row.f_image && row.f_image.data) {
//     // Convert buffer to Base64
//     const base64Image = Buffer.from(row.f_image.data).toString("base64");
//     console.log(base64Image);
//     // // Create the data URL for the image
//     // const mimeType = "image/jpeg"; // Adjust this based on the actual image type
//     // row.f_image = `data:${mimeType};base64,${base64Image}`;
//   }
//   return row;
// });
