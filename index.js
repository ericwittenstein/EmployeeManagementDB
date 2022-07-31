// initial imports
const cTable = require("console.table");
const mysql = require("mysql2");
const inquirer = require("inquirer");

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
	// retun that the connection has been established, and psot the banner
	console.log(`Connected to the company_db database \n\n    --------------------------
    EMPLOYEE MANAGEMENT SYSTEM
    -------------------------- \n`)
);

// for SELECT IFNULL(X,Y): if x ISN'T null, return x; if x IS null, return y

// TODO: add a role (prompt for name, salary, dept)
// TODO: add an employee (prompt for first, last, role, manager)
// TODO: update employee role (prompt for employee, enter new role)

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
	console.log("\n");
	db.query(
		`SELECT department.id, department.name AS "Department" from department`,
		function showTable(err, output) {
			console.table(output);
			menu();
		}
	);
}

// function to view all roles
function viewAllRole() {
	console.log("\n");
	db.query(
		`SELECT role.title AS Job_Title, role.id AS ID, department.name AS Department, role.salary AS Salary FROM role JOIN department ON role.department_id = department.id ORDER BY role.id`,
		function showTable(err, output) {
			console.table(output);
			menu();
		}
	);
}

// function to view all employees
function viewAllEmpl() {
	console.log("\n");
	db.query(
		`SELECT employee.id AS Employee_ID, CONCAT (employee.first_name," ", employee.last_name) AS Name, role.title AS Title, department.name AS Department, role.salary AS Salary, CONCAT(manager.first_name, " ", manager.last_name) AS Manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id ORDER BY employee.id`,
		function showTable(err, output) {
			console.table(output);
			menu();
		}
	);
}

// function to add a new department
function addNewDept() {
	console.log("\n");
	inquirer
		.prompt([
			{
				type: "input",
				name: "addDept",
				message:
					"What is the name of the department you would like to add? ",
				default: "New Department",
			},
		])
		.then((newDeptToAdd) => {
			const newDept = newDeptToAdd.addDept;

			db.query(
				`INSERT INTO department(name) VALUES (?)`,
				newDept,
				function deptAdded() {
					console.log(`${newDept} added to department list \n`);
					menu();
				}
			);
		});
}

// this returns an array of the departments, at least in theory
let getDepts = new Promise((resolve, reject) => {
    let numOfDepts = db.query(`SELECT COUNT(*) FROM department`);
    let departmentsArray = {name: 0, value: ""};
    for (var i = 0; i < numOfDepts; i++) {
    departmentsArray[i] = {
        name: `${db.query('SELECT name FROM department')}`,
        value: `${db.query('SELECT id FROM department')}`,
    }
    // departmentsArray[0] = await db.query(queryText);
    console.log(departmentsArray);
    resolve(departmentsArray);
    }
});

// function to add a new role
function addNewRole() {
	console.log("\n");
	inquirer
		.prompt([
			{
				type: "input",
				name: "addRoleName",
				message:
					"What is the name of the role you would like to add? ",
				default: "New Role",
			},
            {
                type: "input",
				name: "addRoleSalary",
				message:
					"What is the salary for this new role? $",
				default: "100000",
            },
            {
                type: "list",
				name: "addRoleDept",
				message:
					"What department would you like this role to be added to? ",
				choices: getDepts,
            }
		])
		.then((newRoleToAdd) => {
			const newRoleName = newRoleToAdd.addRoleName;
            const newRoleSalary = newRoleToAdd.addRoleSalary;
            const newRoleDept = newRoleToAdd.addRoleDept;

			db.query(
				`INSERT INTO role(title, salary, department_id) VALUES (?)`,
				(newRoleName, newRoleSalary, newRoleDept),
				function roleAdded() {
					console.log(`${newRole} added to roles list \n`);
					menu();
				}
			);
		});
}

// call for the app to run
menu();
