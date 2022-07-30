-- deletes any existing database of the same name if it exists
DROP DATABASE IF EXISTS company_db;
-- creates a new db named company_db
CREATE DATABASE company_db;
-- selects that new db for use (now inside that db)
USE company_db;

CREATE TABLE department (
    id INT NOT NULL PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
   id INT NOT NULL PRIMARY KEY,
   title VARCHAR(30) NOT NULL,
   salary DECIMAL NOT NULL,
   department_id INT --refers to the id in the department table
   FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

CREATE TABLE employee (
  id INT NOT NULL PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL, --refers to the id in the role table
  manager_id INT --refers to the manager of the employee, returns null if no manager
  FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);