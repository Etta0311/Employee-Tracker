// importing mySQL, inquirer & console.table
const myaction = require('myaction2');
const cTable = require('console.table'); 
const inquirer = require('inquirer'); 
// importing .env file 
require('dotenv').config();

// create connection to MySQL
const dbconnection = myaction.createConnection(
  {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'staff_db'
  });

  dbconnection.connect(err => {
    if (err) throw err;
    console.log(`Connected to the staff_db database.`),
    console.log("================================="),
    console.log("+                               +"),
    console.log("+  EMPLOYEE MANAGEMENT SYSTEM   +"),
    console.log("+                               +"),
    console.log("=================================\n"),
    manu();
});

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
                'Update an employee manager',
                "View employees by department",
                'Delete a department',
                'Delete a role',
                'Delete an employee',
                'View department budgets',
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

      if (choices === "Update an employee manager") {
        updateManagerrole();
      }

      if (choices === "View employees by department") {
        employeeDepartment();
      }

      if (choices === "Delete a department") {
        deleteDepartment();
      }

      if (choices === "Delete a role") {
        deleteRole();
      }

      if (choices === "Delete an employee") {
        deleteEmployee();
      }

      if (choices === "View department budgets") {
        viewBudget();
      }

      if (choices === "Finished & Quit") {
        connection.end()
    };
  });
};

manageDepartments = () => {
  console.log('Showing all departments\n');
  const action = `SELECT department.id AS id, department.name AS department FROM department`; 

  connection.promise().query(action, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    manu();
  });
};

// function to show all roles 
manageRoles = () => {
  console.log('Showing all roles...\n');

  const action = `SELECT role.id, role.title, department.name AS department
               FROM role
               INNER JOIN department ON role.department_id = department.id`;
  
  connection.promise().query(action, (err, rows) => {
    if (err) throw err; 
    console.table(rows); 
    manu();
  })
};

// function to show all employees 
manageEmployees = () => {
  console.log('Showing all employees...\n'); 
  const action = `SELECT employee.id, 
                      employee.first_name, 
                      employee.last_name, 
                      role.title, 
                      department.name AS department,
                      role.salary, 
                      CONCAT (manager.first_name, " ", manager.last_name) AS manager
               FROM employee
                      LEFT JOIN role ON employee.role_id = role.id
                      LEFT JOIN department ON role.department_id = department.id
                      LEFT JOIN employee manager ON employee.manager_id = manager.id`;

  connection.promise().query(action, (err, rows) => {
    if (err) throw err; 
    console.table(rows);
    manu();
  });
};

// function to add a department 
addnewDepartment = () => {
  inquirer.prompt([
    {
      type: 'input', 
      name: 'addDept',
      message: "What department do you want to add?",
      validate: addDept => {
        if (addDept) {
            return true;
        } else {
            console.log('Please enter a department');
            return false;
        }
      }
    }
  ])
    .then(answer => {
      const action = `INSERT INTO department (name)
                  VALUES (?)`;
      connection.query(action, answer.addDept, (err, result) => {
        if (err) throw err;
        console.log('Added ' + answer.addDept + " to departments!"); 

        manageDepartments();
    });
  });
};

// function to add a role 
addnewRole = () => {
  inquirer.prompt([
    {
      type: 'input', 
      name: 'role',
      message: "What role do you want to add?",
      validate: addRole => {
        if (addRole) {
            return true;
        } else {
            console.log('Please enter a role');
            return false;
        }
      }
    },
    {
      type: 'input', 
      name: 'salary',
      message: "What is the salary of this role?",
      validate: addSalary => {
        if (isNAN(addSalary)) {
            return true;
        } else {
            console.log('Please enter a salary');
            return false;
        }
      }
    }
  ])
    .then(answer => {
      const params = [answer.role, answer.salary];

      const roleaction = `SELECT name, id FROM department`; 

      connection.promise().query(roleaction, (err, data) => {
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
          .then(deptChoice => {
            const dept = deptChoice.dept;
            params.push(dept);

            const action = `INSERT INTO role (title, salary, department_id)
                        VALUES (?, ?, ?)`;

            connection.query(action, params, (err, result) => {
              if (err) throw err;
              console.log('Added' + answer.role + " to roles!"); 

              manageRoles();
       });
     });
   });
 });
};

// function to add an employee 
addnewEmployee = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'fistName',
      message: "What is the employee's first name?",
      validate: addFirst => {
        if (addFirst) {
            return true;
        } else {
            console.log('Please enter a first name');
            return false;
        }
      }
    },
    {
      type: 'input',
      name: 'lastName',
      message: "What is the employee's last name?",
      validate: addLast => {
        if (addLast) {
            return true;
        } else {
            console.log('Please enter a last name');
            return false;
        }
      }
    }
  ])
    .then(answer => {
    const params = [answer.fistName, answer.lastName]

    // grab roles from roles table
    const roleaction = `SELECT role.id, role.title FROM role`;
  
    connection.promise().query(roleaction, (err, data) => {
      if (err) throw err; 
      
      const roles = data.map(({ id, title }) => ({ name: title, value: id }));

      inquirer.prompt([
            {
              type: 'list',
              name: 'role',
              message: "What is the employee's role?",
              choices: roles
            }
          ])
            .then(roleChoice => {
              const role = roleChoice.role;
              params.push(role);

              const manageraction = `SELECT * FROM employee`;

              connection.promise().query(manageraction, (err, data) => {
                if (err) throw err;

                const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

                // console.log(managers);

                inquirer.prompt([
                  {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the employee's manager?",
                    choices: managers
                  }
                ])
                  .then(managerChoice => {
                    const manager = managerChoice.manager;
                    params.push(manager);

                    const action = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES (?, ?, ?, ?)`;

                    connection.query(action, params, (err, result) => {
                    if (err) throw err;
                    console.log("Employee has been added!")

                    manageEmployees();
              });
            });
          });
        });
     });
  });
};

// function to update an employee 
updateEmployee = () => {
  // get employees from employee table 
  const employeeaction = `SELECT * FROM employee`;

  connection.promise().query(employeeaction, (err, data) => {
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
      .then(empChoice => {
        const employee = empChoice.name;
        const params = []; 
        params.push(employee);

        const roleaction = `SELECT * FROM role`;

        connection.promise().query(roleaction, (err, data) => {
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
                .then(roleChoice => {
                const role = roleChoice.role;
                params.push(role); 
                
                let employee = params[0]
                params[0] = role
                params[1] = employee 
                

                // console.log(params)

                const action = `UPDATE employee SET role_id = ? WHERE id = ?`;

                connection.query(action, params, (err, result) => {
                  if (err) throw err;
                console.log("Employee has been updated!");
              
                showEmployees();
          });
        });
      });
    });
  });
};

// function to update an employee 
updateManager = () => {
  // get employees from employee table 
  const employeeaction = `SELECT * FROM employee`;

  connection.promise().query(employeeaction, (err, data) => {
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
      .then(empChoice => {
        const employee = empChoice.name;
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
                  message: "Who is the employee's manager?",
                  choices: managers
                }
              ])
                  .then(managerChoice => {
                    const manager = managerChoice.manager;
                    params.push(manager); 
                    
                    let employee = params[0]
                    params[0] = manager
                    params[1] = employee 
                    

                    // console.log(params)

                    const action = `UPDATE employee SET manager_id = ? WHERE id = ?`;

                    connection.query(action, params, (err, result) => {
                      if (err) throw err;
                    console.log("Employee has been updated!");
                  
                    showEmployees();
          });
        });
      });
    });
  });
};

// function to view employee by department
employeeDepartment = () => {
  console.log('Showing employee by departments...\n');
  const action = `SELECT employee.first_name, 
                      employee.last_name, 
                      department.name AS department
               FROM employee 
               LEFT JOIN role ON employee.role_id = role.id 
               LEFT JOIN department ON role.department_id = department.id`;

  connection.promise().query(action, (err, rows) => {
    if (err) throw err; 
    console.table(rows); 
    manu();
  });          
};

// function to delete department
deleteDepartment = () => {
  const deptaction = `SELECT * FROM department`; 

  connection.promise().query(deptaction, (err, data) => {
    if (err) throw err; 

    const dept = data.map(({ name, id }) => ({ name: name, value: id }));

    inquirer.prompt([
      {
        type: 'list', 
        name: 'dept',
        message: "What department do you want to delete?",
        choices: dept
      }
    ])
      .then(deptChoice => {
        const dept = deptChoice.dept;
        const action = `DELETE FROM department WHERE id = ?`;

        connection.query(action, dept, (err, result) => {
          if (err) throw err;
          console.log("Successfully deleted!"); 

        showDepartments();
      });
    });
  });
};

// function to delete role
deleteRole = () => {
  const roleaction = `SELECT * FROM role`; 

  connection.promise().query(roleaction, (err, data) => {
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
      .then(roleChoice => {
        const role = roleChoice.role;
        const action = `DELETE FROM role WHERE id = ?`;

        connection.query(action, role, (err, result) => {
          if (err) throw err;
          console.log("Successfully deleted!"); 

          showRoles();
      });
    });
  });
};

// function to delete employees
deleteEmployee = () => {
  // get employees from employee table 
  const employeeaction = `SELECT * FROM employee`;

  connection.promise().query(employeeaction, (err, data) => {
    if (err) throw err; 

  const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: "Which employee would you like to delete?",
        choices: employees
      }
    ])
      .then(empChoice => {
        const employee = empChoice.name;

        const action = `DELETE FROM employee WHERE id = ?`;

        connection.query(action, employee, (err, result) => {
          if (err) throw err;
          console.log("Successfully Deleted!");
        
          showEmployees();
    });
  });
 });
};

// view department budget 
viewBudget = () => {
  console.log('Showing budget by department...\n');

  const action = `SELECT department_id AS id, 
                      department.name AS department,
                      SUM(salary) AS budget
               FROM  role  
               JOIN department ON role.department_id = department.id GROUP BY  department_id`;
  
  connection.promise().query(action, (err, rows) => {
    if (err) throw err; 
    console.table(rows);

    manu(); 
  });            
};
