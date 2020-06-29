const connection = require("./db/connection");
const inquirer = require("inquirer");

function start() {
  inquirer
    .prompt([
      {
        message: "What would you like to do?",
        type: "list",
        name: "start",
        choices: ["Add a department", "Add a role", "Add an Employee"],
      },
    ])
    .then((response) => {
      console.log(response.start);

      if (response.start === "Add a department") {
        console.log("department");
        addDepartment();
      } else if (response.start === "Add a role") {
        console.log("role");
        addRole();
      } else if (response.start === "Add an Employee") {
        console.log("Employee");
        addEmployee();
      }
    });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        message: "What is the department's name?",
        type: "input",
        name: "departmentName",
      },
    ])
    .then((response) => {
      connection.query(
        "INSERT INTO department (name) VALUES (?)",
        response.departmentName,
        (err, result) => {
          if (err) throw err;
          console.log("Inserted as ID " + result.insertId);
        }
      );
    });
}

function addRole() {
  connection.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          message: "What is the title?",
          type: "input",
          name: "title",
        },
        {
          message: "What is the salary?",
          type: "input",
          name: "salary",
        },
        {
          message: "What is the department's name?",
          type: "list",
          name: "department_id",
          choices: results.map((department) => {
            return {
              name: department.name,
              value: department.id,
            };
          }),
        },
      ])
      .then((response) => {
        connection.query("INSERT INTO role SET ?", response, (err, result) => {
          if (err) throw err;
          console.log("Inserted as ID" + result.insertId);
        });
      });
  });
}

function addEmployee() {
  getRoles((roles) => {
    getEmployees((employees) => {
      // console.log(results);

      (employeeSelections = employees.map((employee) => {
        return {
          name: employee.first_name + " " + employee.last_name,
          value: employee.id,
        };
      })),
        employeeSelections.unshift({ name: "None", value: null });
      inquirer
        .prompt([
          {
            message: "What is the first name?",
            type: "input",
            name: "first_name",
          },
          {
            message: "What is the last name?",
            type: "input",
            name: "last_name",
          },
          {
            message: "Select a role",
            type: "list",
            name: "role_id",
            choices: roles.map((role) => {
              //console.log(role);
              return {
                name: role.title,
                value: role.id,
              };
            }),
          },
          {
            message: "Manager",
            type: "list",
            name: "manager_id",
            choices: employeeSelections,
          },
        ])
        .then((response) => {
          connection.query(
            "INSERT INTO employee SET ?",
            response,
            (err, result) => {
              if (err) throw err;
              console.log("Inserted as ID" + result.insertId);
            }
          );
        });
    });
  });
}

function getRoles(cb) {
  connection.query("SELECT * FROM role", (err, results) => {
    if (err) throw err;
    cb(results);
  });
}

function getEmployees(cb) {
  connection.query("SELECT * FROM role", (err, results) => {
    if (err) throw err;
    cb(results);
  });
}

function viewDepartment() {}

function viewRoles() {
  getRoles((roles) => {
    // Loop over the roles and print info from each one to the terminal
    console.table(roles);
  });
}

function viewEmployee() {}

start();
