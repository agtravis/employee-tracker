'use strict';

const select = {
  type: 'list',
  message: 'What would you like to do?',
  name: 'selection',
  choices: ['View data', 'Add data', 'Exit']
};

const addDataPrompt = {
  type: 'list',
  message: 'What would you like to add?',
  name: 'selection',
  choices: ['Department', 'Role', 'Employee', 'Go back']
};

const whichDepartment = {
  type: 'input',
  message: 'Which department would you like to add?',
  name: 'name'
};

const whichRole = [
  {
    type: 'input',
    message: 'What role would you like to add?',
    name: 'role'
  },
  {
    name: 'salary',
    type: 'input',
    message: 'How much does this role pay?'
  }
];

const addEmployeePrompts = [
  {
    type: 'input',
    message: "What is the new employee's first name?",
    name: 'firstName'
  },
  {
    type: 'input',
    message: "What is the new employee's last name?",
    name: 'lastName'
  }
];

const viewDataChoicePrompts = [
  {
    type: 'list',
    message: 'What data would you like to see?',
    choices: [
      'All departments',
      'All roles',
      'All employees',
      'Employees by manager',
      'Departmental budgets',
      'Go back'
    ],
    name: 'selection'
  }
];

module.exports = {
  viewDataChoicePrompts,
  addEmployeePrompts,
  whichRole,
  whichDepartment,
  addDataPrompt,
  select
};
