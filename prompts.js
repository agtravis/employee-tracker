'use strict';

const select = {
  type: 'list',
  message: 'What would you like to do?',
  name: 'selection',
  choices: ['View data', 'Add data', 'Update or delete data', 'Exit']
};

const updateOrDeletePrompts = {
  type: 'list',
  message: 'Would you like to ... ?',
  name: 'selection',
  choices: ['Update data', 'Delete data', 'Go back']
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

const updateChoicePrompts = {
  type: 'list',
  message: 'What would you like to update?',
  name: 'selection',
  choices: ['An employee role', "An employee's manager", 'Go back']
};

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

const deleteDataPrompts = [
  {
    type: 'list',
    message: 'What would you like to delete?',
    choices: ['A department', 'A Role', 'An employee', 'Go back'],
    name: 'selection'
  }
];

module.exports = {
  deleteDataPrompts,
  updateChoicePrompts,
  updateOrDeletePrompts,
  viewDataChoicePrompts,
  addEmployeePrompts,
  whichRole,
  whichDepartment,
  addDataPrompt,
  select
};
