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

-- department_id refers to the id in the department table
CREATE TABLE role (
   id INT NOT NULL PRIMARY KEY,
   title VARCHAR(30) NOT NULL,
   salary DECIMAL NOT NULL,
   department_id INT,
   FOREIGN KEY (department_id) REFERENCES department(id) 
);

-- role_id refers to the id in the role table
-- manager_id refers to the manager of the employee, returns null if no manager
CREATE TABLE employee (
  id INT NOT NULL PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT, 
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);