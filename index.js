// initial imports
const cTable = require("console.table");
const express = require("express");
const mysql = require("mysql2");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password here
    password: "bulldog",
    database: "company_db",
  },
  console.log(`Connected to the company_db database.`)
);

// for SELECT IFNULL(X,Y): if x ISN'T null, return x; if x IS null, return y

// on start, give menu
// view all depts (show ids and names)
// view all roles (show id , title, dept, salary)
// view all employees (show id, first, last, role, dept, salary, manager)
// add a department (prompt for name)
// add a role (prompt for name, salary, dept)
// add an employee (prompt for first, last, role, manager)
// update employee role (prompt for employee, enter new role)


// default error response
app.use((req, res) => {
  res.status(404).end();
});

// initializes the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
