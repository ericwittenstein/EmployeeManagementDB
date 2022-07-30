// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database

const chalk = require("chalk");
const figlet = require("figlet");
const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql = require("mysql2");
const { up } = require("inquirer/lib/utils/readline");

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "root1234",
    database: "emtracker_db",
  },
  console.log(`Connected to the emtracker_db database.`)
);

// chalk & figma opening message / calls the prompt question
function init() {
  console.log(
    chalk.magentaBright(
      "************************************************************************************************************************************************"
    )
  );
  console.log(
    chalk.magentaBright(
      figlet.textSync("Employee-Tracker-App", {
        horizontalLayout: "full",
        font: "crawford",
      })
    )
  );
  console.log(
    chalk.magentaBright(`                                                                                                                  
************************************************************************************************************************************************`)
  );
  prompt();
}

// main set of questions that leads into a switch case to determine what to do next based off of choice selected
function prompt() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choices",
        message: "Here are your choices:",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
        ],
      },
    ])
    .then((answers) => {
      switch (answers.choices) {
        // query shows all depts
        case "View All Departments":
          db.query(
            'SELECT department.id, department.job_name AS "department" FROM department',
            function (err, results) {
              console.table(results);
              prompt();
            }
          );
          break;
        // query shows all roles
        case "View All Roles":
          db.query(
            'SELECT jobrole.id, jobrole.title, department.job_name AS "department", jobrole.salary FROM jobrole JOIN department ON jobrole.department_id = department.id ORDER BY jobrole.id ASC',
            function (err, results) {
              console.table(results);
              prompt();
            }
          );
          break;
        // query shows all employees
        case "View All Employees":
          db.query(
            'SELECT employee.id, employee.first_name AS "First Name", employee.last_name AS "Last Name", jobrole.title AS "Title", department.job_name AS "Department", jobrole.salary AS "Salary", CONCAT (manager.first_name," ",manager.last_name) AS "Manager" FROM employee LEFT JOIN jobrole ON employee.role_id = jobrole.id LEFT JOIN department ON jobrole.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id ORDER BY employee.id ASC',
            function (err, results) {
              console.table(results);
              prompt();
            }
          );
          break;
        // query adds a dept
        case "Add a Department":
          inquirer
            .prompt([
              {
                type: "input",
                name: "addDept",
                message: "What is the name of the department?",
                validate: (answer) => {
                  if (answer === "") {
                    return `Please enter a name for the department`;
                  }
                  return true;
                },
              },
            ])
            .then((depAnswer) => {
              let newDept = depAnswer.addDept;

              db.query(
                "INSERT INTO department(job_name) VALUES (?)",
                newDept,
                (err, result) => {
                  console.log(
                    `${depAnswer.addDept} succesfully added to the dapartment list`
                  );
                  // console.table('SELECT * FROM department');
                  prompt();
                }
              );
            });
          break;
        // queries add a new role .. couldn't get it working need to move on
        case "Add a Role":
          break;
        // queries add a new employee .. couldn't get it working need to move on
        case "Add an Employee":
          break;
        // query to assign employee to new role .. not finished
        case "Update an Employee Role":
          return function update() {
            db.query("SELECT * FROM employee", (err, result) => {
              const editEmp = result.map(({ first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
              }));

              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "update",
                    message: "What employee would you like to update?",
                    choices: editEmp,
                  },
                ])
                .then((empUpdate) => {
                  let who = empUpdate.update;
                  const updateArr = [who];

                  db.query("SELECT * FROM jobrole", (err, result) => {
                    if (err) {
                      throw err;
                    }

                    const newRole = result.map(({ title, id }) => ({
                      name: title,
                      value: id,
                    }));

                    inquirer
                      .prompt([
                        {
                          type: "list",
                          name: "role",
                          message: "What is their new role?",
                          choices: newRole,
                        },
                      ])
                      .then((roleAnswer) => {
                        let newRole = roleAnswer.role;
                        updateArr.push(newRole);
                        prompt();
                      });
                  });
                });
            });
          };
      }
    });
}

init();
