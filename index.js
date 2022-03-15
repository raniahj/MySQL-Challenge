// imports
const mysql = require('mysql2')
const inquirer = require('inquirer'); 
const cTable = require('console.table'); 

const db = mysql.createConnection(
    {
      host: "localhost",
      user: "root",
      password: "Aw^y*CW8!ib173",
      database: "employee_db",
    },
    console.log("Welcome to the Employee Database")
  );

db.connect(function (err) {
    if (err) throw err;
    initialPrompt();
  });

 // Function for Initial Prompt
 function initialPrompt (){
    inquirer.prompt ([
      {
        type: 'list',
        name: 'choices', 
        message: 'What would you like to do?',
        choices: ['View all departments', 
                  'View all roles', 
                  'View all employees', 
                  'Add a department', 
                  'Add a role', 
                  'Add an employee', 
                  'Update an employee role',
                  'Update an employee manager',
                  "View employees by department",
                  'Delete a department',
                  'Delete a role',
                  'Delete an employee',
                  'View department budgets',
                  'End']
      }
    ])
      .then((answers) => {
        const { choices } = answers; 
  
        if (choices === "View all departments") {
          viewDepartments();
        }
  
        if (choices === "View all roles") {
          viewRoles();
        }
  
        if (choices === "View all employees") {
          viewEmployees();
        }
  
        if (choices === "Add a department") {
          addDepartment();
        }
  
        if (choices === "Add a role") {
          addRole();
        }
  
        if (choices === "Add an employee") {
          addEmployee();
        }
  
        if (choices === "Update an employee role") {
          updateEmployee();
        }
  
        if (choices === "Update an employee manager") {
          updateManager();
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
  
        if (choices === "End") {
          connection.end()
        };
    }).then(function (res) {
      //mainMenu(res.choices)
  });
  };
  

// function to show all departments 
viewDepartments = () => {
    console.log('Showing all departments');
    const sql = `SELECT department.id AS id, department.name AS department FROM department`; 
  
    db.query("SELECT * FROM department", function (error, res) {
      console.table(res);
      initialPrompt();
    });
  };
  
  // function to show all roles 
  viewRoles = () => {
    console.log('Showing all roles');
  
    const sql = `SELECT roles.id, roles.title, department.name AS department
                 FROM roles
                 INNER JOIN department ON roles.department_id = department.id`;
    
    db.query("SELECT * FROM roles", function (error, res) {
        console.table(res); 
      initialPrompt();
    })
  };
  
  // function to show all employees 
  viewEmployees = () => {
    console.log('Showing all employees...\n'); 
    const sql = `SELECT employee.id, 
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
  
    db.query("SELECT * FROM employee", function (error, res) {
        console.table(res);
      initialPrompt();
    });
  };
  

// Function to Add Department
function addDepartment() {
    inquirer.prompt([{
            type: "input",
            message: "What is the new department name?",
            name: "name"
        }])
        .then(function (response) {
            newDepartment(response);
        });
};

function newDepartment(data) {
    db.query("INSERT INTO department SET ?", {
            name: data.name
        },
        function (error, res) {
            if (error) throw error;
        });
};

// Function to Add Role
function addRole() {
    viewDepartments();
    viewRoles();
    inquirer.prompt([
        {
            type: 'input',
            name: 'addRole',
            message: "What role would you like to add?",
            validate: (input) => {
                if (input === '') {
                    return "Please make sure you enter the role you are trying to add here."
                }
                return true;
            }
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: "What is the salary for this role?",
            validate: (input) => {
                if (input === '') {
                    return "Please make sure you enter the salary for the role you are trying to add here."
                }
                return true;
            }
        },
        {
            type: 'input',
            name: 'addDepartmentID',
            message: "What is the department ID for the role you want to add?",
            validate: (input) => {
                if (input === '') {
                    return "Please make sure you enter the department ID for the role you are trying to add here."
                }
                return true;
            }
        }
    ]).then(function(data) {
        console.log('Add Role Data', data);
        db.query(`INSERT INTO role (title, salary, department_id) values ("${data.addRole}", ${data.roleSalary}, ${data.addDepartmentID})`,  function (err, results) {
            console.log("Successfully added new role.");
            viewRoles();
        });
    })
};

// Function to Add Employee
function addEmployee() {
    inquirer.prompt([{
                type: 'input',
                message: "What is the employee's first name?",
                name: "firstName",
            },
            {
                type: 'input',
                message: "What is the employee's last name?",
                name: "lastName",
            },
            {
                type: "list",
                message: "What is the title of the employee?",
                name: "title",
                choices: roles
            },
            {
                type: "list",
                message: "Who is the manager of the employee?",
                name: "manager",
                choices: employees
            }
        ])
        .then(function (response) {
            newEmployee(response);
        });
};

function newEmployee(data) {
    db.query("INSERT INTO employee SET ?", {
        first_name: data.firstName,
        last_name: data.lastName,
        roles_id: data.title,
        manager_id: data.manager
    }, function (error, res) {
        if (error) throw error;
    });
    endOrMain();
}

// Function to Update Role
function updateRole() {
    inquirer.prompt([{
                type: "list",
                message: "Which employee is updating their role?",
                name: "employeeID",
                choices: employees
            },
            {
                type: "list",
                message: "What is the new role?",
                name: "titleID",
                choices: roles
            }
        ])
        .then(function (response) {
            updateEmployeesRole(response);
        });
};

function updateEmployeesRole(data) {
    db.query(`UPDATE employee SET roles_id = ${data.titleID} WHERE id =${data.employeeID}`,
        function (error, res) {
            if (error) throw error;
        });
    endOrMain();
};


function end() {
    console.log("Exiting Employee Database");
    db.end();
    process.exit();
};