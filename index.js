'use strict';

const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const classConstructor = require('./class');
const functions = require('./functions');
const prompts = require('./prompts');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'George1!',
  database: 'employee_tracker_db'
});

connection.connect(err => {
  if (err) throw err;
  userSelect();
});

async function userSelect() {
  const { selection } = await inquirer.prompt(prompts.select);
  switch (selection) {
    case 'View all employees':
      await viewEmployees();
      break;
    default:
      connection.end();
  }
}

async function viewEmployees() {
  connection.query(
    'SELECT E1.id AS ID, CONCAT(E1.first_name, " ", E1.last_name) AS "Employee Name", role.title AS Position, department.name AS Department, role.salary AS Salary, CONCAT(E2.first_name, " ", E2.last_name) AS Manager FROM employee E1 LEFT JOIN employee E2 ON E1.manager_id = E2.id INNER JOIN role ON E1.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY E1.id;',
    (err, res) => {
      if (err) throw err;
      console.log('\n');
      console.table(res);
    }
  );
  userSelect();
}

module.exports = {
  userSelect
};
