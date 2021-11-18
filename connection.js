const mysql = require('mysql2');
const cTable = require('console.table'); 

require('dotenv').config();

const dbconnection = mysql.createConnection(
    {
      host: 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'staff_db'
    },
    console.log(`Connected to the staff_db database.`),
    console.log("================================="),
    console.log("+                               +"),
    console.log("+  EMPLOYEE MANAGEMENT SYSTEM   +"),
    console.log("+                               +"),
    console.log("=================================\n")
  );

dbconnection.connect(err => {
    if (err) throw err;
});

module.exports = dbconnection;
