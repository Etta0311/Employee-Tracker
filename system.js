// importing mySQL, inquirer & console.table
const mysql = require('mysql2')
const cTable = require('console.table'); 
const inquirer = require('inquirer'); 
// importing .env file 
require('dotenv').config();

// create connection to MySQL
const dbconnection = mysql.createConnection(
  {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'staff_db'
  });

  dbconnection.connect(err => {
    if (err) throw err;
    console.log(`Connected to the staff_db database.`),
    console.log("============================================="),
    console.log("+                                           +"),
    console.log("+         EMPLOYEE MANAGEMENT SYSTEM        +"),
    console.log("+         - COMPANY MANAGEMENT USE -        +"),
    console.log("+                                           +"),
    console.log("=============================================\n"),
    manu();
});

// STARTING MANU
const manu = () => {
  inquirer.prompt ([
    {
      type: 'list',
      name: 'choices', 
      message: 'Select a section to continue.',
      choices: ['View all departments', 
                'View all roles', 
                'View all employees', 
                'Add a new department', 
                'Add a new role', 
                'Add an new employee', 
                'Update an employee role',
                'Assign manager for employee (New/Exist)',
                'Delete a department',
                'Delete a role',
                'Delete an employee',
                'Finished & Quit']
    }
  ])
    .then((answers) => {
      const { choices } = answers; 

      if (choices === "View all departments") {
        manageDepartments();
      }

      if (choices === "View all roles") {
        manageRoles();
      }

      if (choices === "View all employees") {
        manageEmployees();
      }

      if (choices === "Add a new department") {
        addnewDepartment();
      }

      if (choices === "Add a new role") {
        addnewRole();
      }

      if (choices === "Add an new employee") {
        addnewEmployee();
      }

      if (choices === "Update an employee role") {
        updateEmployeerole();
      }

      if (choices === "Assign manager for employee (New/Exist)") {
        updateManagerrole();
      }

      if (choices === "Delete a department") {
        deleteDepartment();
      }

      if (choices === "Delete a role") {
        deleteaRole();
      }

      if (choices === "Delete an employee") {
        deleteanEmployee();
      }

      if (choices === "Finished & Quit") {
        connection.end()
    };
  });
};

// Choice - view all Department
manageDepartments = () => {
  console.log('Viewing all departments\n');
  const action = `SELECT department.id AS id, department.name AS department FROM department`; 

  connection.promise().query(action, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    manu();
  });
};

// Choice - view all roles
manageRoles = () => {
  console.log('Viewing all roles...\n');

  const action = `SELECT roles.id, roles.title, department.name AS department
                  FROM roles
                  INNER JOIN department ON roles.department_id = department.id`;
  
  connection.promise().query(action, (err, rows) => {
    if (err) throw err; 
    console.table(rows); 
    manu();
  })
};

// Choice - view all employees 
manageEmployees = () => {
  console.log('Viewing all employees...\n'); 
  const action = `SELECT employee.id, 
                         employee.first_name, 
                         employee.last_name, 
                         roles.title, 
                         department.name AS department,
                         roles.salary, 
                         CONCAT (manager.first_name, " ", manager.last_name) AS manager
                  FROM employee
                         LEFT JOIN roles ON employee.role_id = roles.id
                         LEFT JOIN department ON roles.department_id = department.id
                         LEFT JOIN employee manager ON employee.manager_id = manager.id`;

  connection.promise().query(action, (err, rows) => {
    if (err) throw err; 
    console.table(rows);
    manu();
  });
};

// Choice -  Add a Department 
addnewDepartment = () => {
  inquirer.prompt([
    {
      type: 'input', 
      name: 'addDepartment',
      message: "What's the name of department do you want to add?",
      validate: addDepartment => {
        if (addDepartment) {
            return true;
        } else {
            console.log('Please enter a valid department name.');
            return false;
        }
      }
    }
  ])
    .then(answer => {
      const action = `INSERT INTO department (name)
                      VALUES (?)`;
      connection.query(action, answer.addDepartment, (err, result) => {
        if (err) throw err;
        console.log("New Department Created."); 

        manageDepartments();
    });
  });
};

// Choice - Add a Role 
addnewRole = () => {
  inquirer.prompt([
    {
      type: 'input', 
      name: 'role',
      message: "What's the Job Title of the new role you want to add?",
      validate: addNewRole => {
        if (addNewRole) {
            return true;
        } else {
            console.log('Please enter a valid name.');
            return false;
        }
      }
    },
    {
      type: 'input', 
      name: 'salary',
      message: "What's the salary of this new role?",
      validate: addSalary => {
        if (isNAN(addSalary)) {
            return true;
        } else {
            console.log('Please enter a valid value.');
            return false;
        }
      }
    }
  ])
    .then(answer => {
      const params = [answer.role, answer.salary];

      const action = `SELECT name, id FROM department`; 

      connection.promise().query(action, (err, data) => {
        if (err) throw err; 
    
        const dept = data.map(({ name, id }) => ({ name: name, value: id }));

        inquirer.prompt([
        {
          type: 'list', 
          name: 'dept',
          message: "What department is this role in?",
          choices: dept
        }
        ])
          .then(deptselected => {
            const dept = deptselected.dept;
            params.push(dept);

            const action = `INSERT INTO roles (title, salary, department_id)
                            VALUES (?, ?, ?)`;

            connection.query(action, params, (err, result) => {
              if (err) throw err;
              console.log("New Role has been added."); 

              manageRoles();
       });
     });
   });
 });
};

// Choice - Add a New Employee
addnewEmployee = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: "What is the employee's first name?",
      validate: addFirstN => {
        if (addFirstN) {
            return true;
        } else {
            console.log('Please provide the first name for record.');
            return false;
        }
      }
    },
    {
      type: 'input',
      name: 'lastName',
      message: "What is the employee's last name?",
      validate: addLastN => {
        if (addLastN) {
            return true;
        } else {
            console.log('Please provide the last name for record.');
            return false;
        }
      }
    }
  ])
    .then(answer => {
    const params = [answer.firstName, answer.lastName]

    const action = `SELECT roles.id, roles.title FROM roles`;
  
    connection.promise().query(action, (err, data) => {
      if (err) throw err; 
      
      const roles = data.map(({ id, title }) => ({ name: title, value: id }));

      inquirer.prompt([
            {
              type: 'list',
              name: 'role',
              message: "What is this employee's role?",
              choices: roles
            }
          ])
            .then(roleselected => {
              const role = roleselected.role;
              params.push(role);

              const manageraction = `SELECT * FROM employee`;

              connection.promise().query(manageraction, (err, data) => {
                if (err) throw err;

                const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

                inquirer.prompt([
                  {
                    type: 'list',
                    name: 'manager',
                    message: "Choose the manager of this employee.",
                    choices: managers
                  }
                ])
                  .then(selectmanager => {
                    const manager = selectmanager.manager;
                    params.push(manager);

                    const action = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                    VALUES (?, ?, ?, ?)`;

                    connection.query(action, params, (err, result) => {
                    if (err) throw err;
                    console.log("Employee info has been set.")

                    manageEmployees();
              });
            });
          });
        });
     });
  });
};

// Choice - Updat an Employee Profile
updateEmployee = () => {
  
  const action = `SELECT * FROM employee`;

  connection.promise().query(action, (err, data) => {
    if (err) throw err; 

  const employeeslist = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: "Which employee you are going to update?",
        choices: employeeslist
      }
    ])
      .then(Selectemployee => {
        const employee = Selectemployee.name;
        const params = []; 
        params.push(employee);

        const action = `SELECT * FROM roles`;

        connection.promise().query(action, (err, data) => {
          if (err) throw err; 

          const roles = data.map(({ id, title }) => ({ name: title, value: id }));
          
            inquirer.prompt([
              {
                type: 'list',
                name: 'role',
                message: "What is the employee's new role?",
                choices: roles
              }
            ])
                .then(roleselected => {
                const role = roleselected.role;
                params.push(role); 
                
                let employee = params[0]
                params[0] = role
                params[1] = employee 

                const action = `UPDATE employee SET role_id = ? WHERE id = ?`;

                connection.query(action, params, (err, result) => {
                  if (err) throw err;
                console.log("Employee's Profile has been updated.");
              
                manageEmployees();
          });
        });
      });
    });
  });
};

// Choice - Update Employee's Manager
updateManager = () => {

  const action = `SELECT * FROM employee`;

  connection.promise().query(action, (err, data) => {
    if (err) throw err; 

  const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: "Which employee would you like to update?",
        choices: employees
      }
    ])
      .then(Selectemployee => {
        const employee = Selectemployee.name;
        const params = []; 
        params.push(employee);

        const manageraction = `SELECT * FROM employee`;

          connection.promise().query(manageraction, (err, data) => {
            if (err) throw err; 

          const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
            
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'manager',
                  message: "Assign one manager for this employee.",
                  choices: managers
                }
              ])
                  .then(selectmanager => {
                    const manager = selectmanager.manager;
                    params.push(manager); 
                    
                    let employee = params[0]
                    params[0] = manager
                    params[1] = employee 

                    const action = `UPDATE employee SET manager_id = ? WHERE id = ?`;

                    connection.query(action, params, (err, result) => {
                      if (err) throw err;
                    console.log("Employee's Profile has been updated.");
                  
                    manageEmployees();
          });
        });
      });
    });
  });
};

// Choice - Delete whole department
deleteDepartment = () => {
  const action = `SELECT * FROM department`; 

  connection.promise().query(action, (err, data) => {
    if (err) throw err; 

    const deptlist = data.map(({ name, id }) => ({ name: name, value: id }));

    inquirer.prompt([
      {
        type: 'list', 
        name: 'dept',
        message: "Choose the department you asked to delete",
        choices: deptlist
      }
    ])
      .then(deptselected => {
        const dept = deptselected.dept;
        const action = `DELETE FROM department WHERE id = ?`;

        connection.query(action, dept, (err, result) => {
          if (err) throw err;
          console.log("Department deleted successfully."); 

        manageDepartments();
      });
    });
  });
};

// Choice - Delete a role
deleteaRole = () => {

  const action = `SELECT * FROM roles`; 

  connection.promise().query(action, (err, data) => {
    if (err) throw err; 

    const role = data.map(({ title, id }) => ({ name: title, value: id }));

    inquirer.prompt([
      {
        type: 'list', 
        name: 'role',
        message: "What role do you want to delete?",
        choices: role
      }
    ])
      .then(roleselected => {
        const Title = roleselected.role;
        const action = `DELETE FROM roles WHERE id = ?`;

        connection.query(action, Title, (err, result) => {
          if (err) throw err;
          console.log("Job Role deleted successfully."); 

          manageRoles();
      });
    });
  });
};

// Choice - Delete an employee
deleteanEmployee = () => {

  const action = `SELECT * FROM employee`;

  connection.promise().query(action, (err, data) => {
    if (err) throw err; 

  const employeeslist = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: "Choose the employee you are going to delete.",
        choices: employeeslist
      }
    ])
      .then(Selectemployee => {
        const employee = Selectemployee.name;

        const action = `DELETE FROM employee WHERE id = ?`;

        connection.query(action, employee, (err, result) => {
          if (err) throw err;
          console.log("Employee deleted successfully.");
        
          manageEmployees();
    });
  });
 });
};