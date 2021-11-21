DROP DATABASE IF EXISTS staff_db;
CREATE DATABASE staff_db;

USE staff_db;

SET GLOBAL FOREIGN_KEY_CHECKS=0;

CREATE TABLE department (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,2),
  department_id INT,
  CONSTRAINT fk_department 
  FOREIGN KEY (department_id) 
  REFERENCES department(id) 
  ON DELETE SET NULL
);

CREATE TABLE employee (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT,
  CONSTRAINT fk_roles 
  FOREIGN KEY (role_id) 
  REFERENCES roles(id) 
  ON DELETE SET NULL,
  CONSTRAINT fk_manager 
  FOREIGN KEY (manager_id) 
  REFERENCES employee(id) 
  ON DELETE SET NULL
);