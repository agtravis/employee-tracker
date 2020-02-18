'use strict';

const inquirer = require('inquirer');
const prompts = require('./prompts');
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
    case 'Update or delete data':
      updateOrDelete(connection);
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
    case 'Departmental budgets':
      viewDepartmentBudget(connection);
      break;
    default:
      userSelect(connection);
  }
}

function viewData(connection, tableName) {
  connection.query(`SELECT * FROM ${tableName};`, (err, res) => {
    if (err) throw err;
    console.log(`\n${tableName} table:\n`);
    console.table(res);
    viewDataChoice(connection);
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

async function chooseManager(connection) {
  connection.query(
    `SELECT E1.id, E1.first_name, E1.last_name,
  CONCAT(E2.first_name, " ", E2.last_name) AS Manager FROM employee E1
  LEFT JOIN employee E2 ON E1.manager_id = E2.id
  INNER JOIN role ON E1.role_id = role.id
  INNER JOIN department ON role.department_id = department.id
  WHERE CONCAT(E2.first_name, " ", E2.last_name) IS NOT NULL`,
    async (err, res) => {
      if (err) throw err;
      const choices = [];
      for (let i = 0; i < res.length; ++i) {
        if (!choices.includes(res[i].Manager)) {
          choices.push(res[i].Manager);
        }
      }
      let managerFullName;
      const { manager } = await inquirer.prompt([
        {
          name: 'manager',
          type: 'rawlist',
          choices: choices,
          message: 'Whose team would you like to see?'
        }
      ]);
      let managerId;
      connection.query(`SELECT * FROM employee`, (err, res) => {
        if (err) throw err;
        for (const row of res) {
          row.fullName = `${row.first_name} ${row.last_name}`;
          if (row.fullName === manager) {
            managerId = row.id;
            managerFullName = row.fullName;
            continue;
          }
        }
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
  );
}

async function viewDepartmentBudget(connection) {
  connection.query('SELECT * FROM department', async (err, res) => {
    if (err) throw err;
    const choices = res.map(res => `${res.name}`);
    choices.push('All departments');
    const { department } = await inquirer.prompt([
      {
        name: 'department',
        type: 'rawlist',
        choices: choices,
        message: 'For which department would you like to see the budget?'
      }
    ]);
    let query = ``;
    if (department === 'All departments') {
      query = `SELECT sum(salary) AS total
      FROM employee INNER JOIN role
      ON employee.role_id = role.id
      INNER JOIN department ON role.department_id = department.id;`;
    } else {
      query = `SELECT sum(salary) AS total
      FROM employee INNER JOIN role
      ON employee.role_id = role.id
      INNER JOIN department ON role.department_id = department.id
      WHERE department.name = '${department}';`;
    }
    connection.query(query, async (err, res) => {
      if (err) throw err;
      if (res[0].total === null) {
        res[0].total = '0';
      }
      console.log(
        `\nThe current budget for the ${department} department is $${res[0].total}\n`
      );
      viewDataChoice(connection);
    });
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

async function addEmployee(connection) {
  const newEmployeeName = await inquirer.prompt(prompts.addEmployeePrompts);
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
      let managerFullName;
      const choices = res.map(res => `${res.first_name} ${res.last_name}`);
      choices.push('None');
      const { manager } = await inquirer.prompt([
        {
          name: 'manager',
          type: 'rawlist',
          choices: choices,
          message: 'To whom will this employee be accountable?'
        }
      ]);
      let managerId;
      if (manager === 'None') {
        managerId = null;
      } else {
        for (const row of res) {
          row.fullName = `${row.first_name} ${row.last_name}`;
          if (row.fullName === manager) {
            managerId = row.id;
            managerFullName = row.fullName;
            continue;
          }
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

async function updateOrDelete(connection) {
  const { selection } = await inquirer.prompt(prompts.updateOrDeletePrompts);
  switch (selection) {
    case 'Update data':
      updateData(connection);
      break;
    case 'Delete data':
      deleteData(connection);
      break;
    default:
      userSelect(connection);
  }
}

async function updateData(connection) {
  const { selection } = await inquirer.prompt(prompts.updateChoicePrompts);
  switch (selection) {
    case 'An employee role':
      updateEmployeeRole(connection);
      break;
    case "An employee's manager":
      updateEmployeeManager(connection);
      break;
    default:
      updateOrDelete(connection);
  }
}

async function updateEmployeeRole(connection) {
  connection.query('SELECT * FROM employee', async (err, res) => {
    if (err) throw err;
    let employeeFullName;
    const { employee } = await inquirer.prompt([
      {
        name: 'employee',
        type: 'rawlist',
        choices: () => res.map(res => `${res.first_name} ${res.last_name}`),
        message: 'Whose role would you like to change?'
      }
    ]);
    let employeeId;
    for (const row of res) {
      row.fullName = `${row.first_name} ${row.last_name}`;
      if (row.fullName === employee) {
        employeeId = row.id;
        employeeFullName = row.fullName;
        continue;
      }
    }
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
      connection.query(
        `
      UPDATE employee
      SET role_id = ?
      WHERE id = ?;`,
        [roleId, employeeId],
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} employee updated.\n\n`);
          connection.query(
            `SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS Employee, role.title AS 'New Role'
            FROM employee INNER JOIN role ON employee.role_id = role.id
            WHERE employee.id = ?;`,
            employeeId,
            (err, res) => {
              if (err) throw err;
              console.table(res);
              updateData(connection);
            }
          );
        }
      );
    });
  });
}

async function updateEmployeeManager(connection) {
  connection.query('SELECT * FROM employee', async (err, res) => {
    if (err) throw err;
    let employeeFullName;
    const { employee } = await inquirer.prompt([
      {
        name: 'employee',
        type: 'rawlist',
        choices: () => res.map(res => `${res.first_name} ${res.last_name}`),
        message: 'Which employee has a new manager?'
      }
    ]);
    let employeeId;
    for (const row of res) {
      row.fullName = `${row.first_name} ${row.last_name}`;
      if (row.fullName === employee) {
        employeeId = row.id;
        employeeFullName = row.fullName;
        continue;
      }
    }
    connection.query('SELECT * FROM employee', async (err, res) => {
      if (err) throw err;
      let managerFullName;
      const choices = res.map(res => `${res.first_name} ${res.last_name}`);
      choices.push('None');
      const { manager } = await inquirer.prompt([
        {
          name: 'manager',
          type: 'rawlist',
          choices: choices,
          message: 'Who is their new manager?'
        }
      ]);
      let managerId;
      if (manager === 'None') {
        managerId = null;
      } else {
        for (const row of res) {
          row.fullName = `${row.first_name} ${row.last_name}`;
          if (row.fullName === manager) {
            managerId = row.id;
            managerFullName = row.fullName;
            continue;
          }
        }
      }
      connection.query(
        `
      UPDATE employee
      SET manager_id = ?
      WHERE id = ?;`,
        [managerId, employeeId],
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} employee updated.\n\n`);
          connection.query(
            `SELECT CONCAT(e1.first_name, ' ', e1.last_name) AS Employee, CONCAT(e2.first_name, ' ', e2.last_name) AS 'New Manager'
            FROM employee e1 INNER JOIN employee e2 ON e1.manager_id = e2.id
            WHERE e1.id = ?;`,
            employeeId,
            (err, res) => {
              if (err) throw err;
              console.table(res);
              updateData(connection);
            }
          );
        }
      );
    });
  });
}

async function deleteData(connection) {
  const { selection } = await inquirer.prompt(prompts.deleteDataPrompts);
  switch (selection) {
    case 'A department':
      deleteDepartment(connection);
      break;
    case 'A role':
      deleteRole(connection);
      break;
    case 'An employee':
      deleteEmployee(connection);
      break;
    default:
      updateOrDelete(connection);
  }
}

async function deleteDepartment(connection) {
  connection.query(
    `SELECT * FROM role RIGHT JOIN department
  ON role.department_id = department.id
  WHERE role.id IS NULL;`,
    async (err, res) => {
      if (err) throw err;
      const choices = res.map(res => `${res.name}`);
      choices.push('Go back');
      const { department } = await inquirer.prompt([
        {
          name: 'department',
          type: 'rawlist',
          choices: choices,
          message:
            'Which department would you like to delete?\n(Only departments with no roles can be deleted)'
        }
      ]);
      if (department === 'Go back') {
        deleteData(connection);
      } else {
        connection.query(
          `DELETE FROM department WHERE name = '${department}';
      `,
          (err, res) => {
            if (err) throw err;
            console.log(
              `\n${res.affectedRows} department deleted (${department})\n`
            );
            deleteData(connection);
          }
        );
      }
    }
  );
}

async function deleteRole(connection) {
  connection.query(
    `SELECT * FROM employee RIGHT JOIN  role
    ON employee.role_id = role.id
    WHERE employee.id IS NULL;`,
    async (err, res) => {
      if (err) throw err;
      const choices = res.map(res => `${res.title}`);
      choices.push('Go back');
      const { role } = await inquirer.prompt([
        {
          name: 'role',
          type: 'rawlist',
          choices: choices,
          message:
            'Which role would you like to delete?\n(Only roles with no employees can be deleted)'
        }
      ]);
      if (role === 'Go back') {
        deleteData(connection);
      } else {
        connection.query(
          `DELETE FROM role WHERE title = '${role}';
      `,
          (err, res) => {
            if (err) throw err;
            console.log(`\n${res.affectedRows} role deleted (${role})\n`);
            deleteData(connection);
          }
        );
      }
    }
  );
}

async function deleteEmployee(connection) {
  connection.query(
    `SELECT * FROM employee e1 RIGHT JOIN  employee e2
  ON e1.manager_id = e2.id
  WHERE e1.id IS NULL;`,
    async (err, res) => {
      if (err) throw err;
      let employeeFullName;
      const choices = res.map(res => `${res.first_name} ${res.last_name}`);
      choices.push('Go back');
      const { employee } = await inquirer.prompt([
        {
          name: 'employee',
          type: 'rawlist',
          choices: choices,
          message:
            'Which employee would you like to delete?\n(NOTE: Managers cannot be deleted if they currently have a team working for them,\nYou must assign those employees a new manager first)'
        }
      ]);
      let employeeId;
      if (employee === 'Go back') {
        deleteData(connection);
      } else {
        for (const row of res) {
          row.fullName = `${row.first_name} ${row.last_name}`;
          if (row.fullName === employee) {
            employeeId = row.id;
            employeeFullName = row.fullName;
            continue;
          }
        }
        connection.query(
          `DELETE FROM employee WHERE id = '${employeeId}'`,
          (err, res) => {
            if (err) throw err;
            console.log(
              `\n${res.affectedRows} employee deleted (${employeeFullName})\n`
            );
            deleteData(connection);
          }
        );
      }
    }
  );
}

module.exports = {
  userSelect
};
