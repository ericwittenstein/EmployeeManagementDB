// initial imports
const cTable = require("console.table");
const mysql = require("mysql2");
const inquirer = require("inquirer");
const figlet = require("figlet");

const log = console.log;

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
	log(`Connected to the company_db database.`)
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

// initial function to call the banner and get the ball rolling
function init() {
	figlet("EMPLOYEE MANAGEMENT SYSTEM", (err, text) => {
		if (err) {
			log(err);
		}
		log(text);
	});
	menu();
}

// menu function to ask what the user would like to do
function menu() {
	inquirer
		.prompt([
			{
				type: "list",
				name: "menu",
				message:
					"What would you like to do? Use arrow keys to navigate, and ENTER to select",
				choices: [
					"View all departments",
					"View all roles",
					"View all employees",
					"Add new department",
					"Add new role",
					"Add new employee",
					"Update existing employee role",
				],
			},
		])
		.then((answers) => {
			// switch cases based on answers
			switch (answers.menu) {
				case "View all departments":
					viewAllDept();
					break;
				case "View all roles":
					viewAllRole();
					break;
				case "View all employees":
					viewAllEmpl();
					break;
				case "Add new department":
					addNewDept();
					break;
				case "Add new role":
					addNewRole();
					break;
				case "Add new employee":
					addNewEmpl();
					break;
				case "Update existing employee role":
					updateRole();
					break;
			}
		});
}

// function to view all departments
function viewAllDept() {
	log("\n");
    db.query(
		`SELECT department.id, department.name AS "Department" from department`,
		function showTable(err, output) {
			console.table(output);
			menu();
		}
	);
}



// call for the app to run
init();
