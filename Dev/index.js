const connection = require("./db/connection");
const inquirer = require("inquirer");

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

function addEmployee() {}

addRole();
