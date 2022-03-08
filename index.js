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
 function initialPrompt() {
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
                  'No Action']
      }
    ])
      .then((answers) => {
        const { choices } = answers; 
  
        if (choices === "View all departments") {
          showDepartments();
        }
  
        if (choices === "View all roles") {
          showRoles();
        }
  
        if (choices === "View all employees") {
          showEmployees();
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
  
        if (choices === "No Action") {
          connection.end()
        };
    });
  };
  // Function for Main Menu
function mainMenu(options) {
    switch (options) {
        case "viewAllDepartments":
            viewAllDepartments();
            break;
        case "viewAllRoles":
            viewAllRoles();
            break;
        case "viewAllEmployees":
            viewAllEmployees();
            break;
        case "addDepartment":
            addDepartment();
            break;
        case "addRole":
            addRole();
            break;
        case "addEmployee":
            addEmployee();
            break;
        case "updateRole":
            updateRole();
            break;
        case "end":
            end();
    };
};

// Function to View all Departments
function viewAllDepartments() {
    db.query("SELECT * FROM department", function (error, res) {
        console.table(res);
        endOrMain();
    });
};

// Function to View all Roles
function viewAllRoles() {
    db.query("SELECT * FROM roles", function (error, res) {
        console.table(res);
        endOrMain();
    });
};

// Function to View all Employees
function viewAllEmployees() {
    db.query("SELECT * FROM employee", function (error, res) {
        console.table(res);
        endOrMain();
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
    endOrMain();
};

// Function to Add Role
function addRole() {
    inquirer.prompt([{
                type: "input",
                message: "What is the name of the new role?",
                name: "title"
            },
            {
                type: "input",
                message: "What is the salary of the new role?",
                name: "salary"

            },
            {
                type: "list",
                message: "Which department is the new role in?",
                name: "id",
                choices: departments
            }
        ])
        .then(function (response) {
            addNewRole(response);
        });
};

function addNewRole(data) {
    db.query("INSERT INTO role SET ?", {
        title: data.title,
        salary: data.salary,
        department_id: data.id
    }, function (error, res) {
        if (error) throw error;
    });
    endOrMain();
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

// Function to End or back to Main
function endOrMain() {
    confirm("Do you want to continue?")
        .then(function confirmed() {
            initialPrompt();
        }, function cancelled() {
            end();
        });
};

function end() {
    console.log("Exiting Employee Manager");
    db.end();
    process.exit();
};