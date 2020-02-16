'use strict';

const inquirer = require('inquirer');
const prompts = require('./prompts');
const index = require('./index');
const classConstructor = require('./class');

async function userSelect(connection) {
  const { selection } = await inquirer.prompt(prompts.select);
  switch (selection) {
    case 'View data':
      viewDataChoice(connection);
      break;
    case 'Add data':
      addDataChoice(connection);
      break;
    default:
      connection.end(connection);
  }
}

async function viewDataChoice(connection) {
  const { selection } = await inquirer.prompt(prompts.viewDataChoicePrompts);
  switch (selection) {
    case 'All departments':
      viewData(connection, 'department');
      break;
    case 'All roles':
      viewData(connection, 'role');
      break;
    case 'All employees':
      viewEmployees(connection);
      break;
    case 'Employees by manager':
      chooseManager(connection);
      break;
    default:
      userSelect(connection);
  }
}

async function chooseManager(connection) {
  connection.query('SELECT * FROM employee', async (err, res) => {
    if (err) throw err;
    let managerFullName;
    const { manager } = await inquirer.prompt([
      {
        name: 'manager',
        type: 'rawlist',
        choices: () => res.map(res => `${res.first_name} ${res.last_name}`),
        message: 'Whose team would you like to see?'
      }
    ]);
    let managerId;
    for (const row of res) {
      row.fullName = `${row.first_name} ${row.last_name}`;
      if (row.fullName === manager) {
        managerId = row.id;
        managerFullName = row.fullName;
        continue;
      }
    }
    // console.log(managerId);
    connection.query(
      `SELECT CONCAT(first_name, ' ', last_name) AS 'Employees managed by ${managerFullName}:' FROM employee WHERE manager_id = ${managerId}`,
      (err, res) => {
        if (err) throw err;
        console.log(`\n`);
        console.table(res);
      }
    );
    viewDataChoice(connection);
  });
}

function viewData(connection, tableName) {
  connection.query(`SELECT * FROM ${tableName};`, (err, res) => {
    if (err) throw err;
    console.log(`\n${tableName} table:\n`);
    console.table(res);
    viewDataChoice(connection);
  });
}

async function addDataChoice(connection) {
  const { selection } = await inquirer.prompt(prompts.addDataPrompt);
  switch (selection) {
    case 'Department':
      addDepartment(connection);
      break;
    case 'Role':
      addRole(connection);
      break;
    case 'Employee':
      addEmployee(connection);
      break;
    default:
      userSelect(connection);
  }
}

async function addEmployee(connection) {
  const newEmployeeName = await inquirer.prompt(prompts.addEmployeePrompts);
  console.log(newEmployeeName);
  connection.query('SELECT * FROM role', async (err, res) => {
    if (err) throw err;
    const { role } = await inquirer.prompt([
      {
        name: 'role',
        type: 'rawlist',
        choices: () => res.map(res => res.title),
        message: 'What role will this employee have?'
      }
    ]);
    let roleId;
    for (const row of res) {
      if (row.title === role) {
        roleId = row.id;
        continue;
      }
    }
    connection.query('SELECT * FROM employee', async (err, res) => {
      if (err) throw err;
      const { manager } = await inquirer.prompt([
        {
          name: 'manager',
          type: 'rawlist',
          choices: () => res.map(res => `${res.first_name} ${res.last_name}`),
          message: 'To whom will this employee be accountable?'
        }
      ]);
      let managerId;
      for (const row of res) {
        row.fullName = `${row.first_name} ${row.last_name}`;
        if (row.fullName === manager) {
          managerId = row.id;
          continue;
        }
      }
      const newEmployee = new classConstructor.Employee(
        newEmployeeName.firstName,
        newEmployeeName.lastName,
        roleId,
        managerId
      );
      console.log('\nAdding a new employee...');
      connection.query(
        'INSERT INTO employee SET ?',
        newEmployee,
        (err, res) => {
          if (err) throw err;
          console.log(`\n${res.affectedRows} employee added.\n`);
          viewEmployees(connection);
        }
      );
    });
  });
}

async function addRole(connection) {
  connection.query('SELECT * FROM department', async (err, res) => {
    if (err) throw err;
    const departments = await inquirer.prompt([
      {
        name: 'department',
        type: 'rawlist',
        choices: () => res.map(res => res.name),
        message: 'To which department does this role belong?'
      }
    ]);
    let roleId;
    for (const row of res) {
      if (row.name === departments.department) {
        roleId = row.id;
        continue;
      }
    }
    const role = await inquirer.prompt(prompts.whichRole);
    const newRole = new classConstructor.Role(role.role, role.salary, roleId);
    console.log('\nAdding a role...\n');
    connection.query('INSERT INTO role SET ?', newRole, (err, res) => {
      if (err) throw err;
      console.log(`\n${res.affectedRows} role added.\n`);
      userSelect(connection);
    });
  });
}

async function addDepartment(connection) {
  const { name } = await inquirer.prompt(prompts.whichDepartment);
  const department = new classConstructor.Department(name);
  console.log('\nAdding a department...\n');
  connection.query('INSERT INTO department SET ?', department, (err, res) => {
    if (err) throw err;
    console.log(`\n${res.affectedRows} department added.\n`);
    userSelect(connection);
  });
}

async function viewEmployees(connection) {
  connection.query(
    `SELECT
      E1.id AS ID, CONCAT(E1.first_name, " ", E1.last_name) AS "Employee Name", role.title AS Position, department.name AS Department, role.salary AS Salary, CONCAT(E2.first_name, " ", E2.last_name) AS Manager
      FROM employee E1 LEFT JOIN employee E2
      ON E1.manager_id = E2.id
      INNER JOIN role
      ON E1.role_id = role.id
      INNER JOIN department
      ON role.department_id = department.id
      ORDER BY E1.id;`,
    (err, res) => {
      if (err) throw err;
      console.log('\n');
      console.table(res);
    }
  );
  viewDataChoice(connection);
}

module.exports = {
  userSelect,
  addDataChoice,
  addRole,
  addDepartment,
  viewEmployees
};
