'use strict';

const select = {
  type: 'list',
  message: 'What would you like to do?',
  name: 'selection',
  choices: ['View all employees', 'Add data', 'Exit']
};

const addDataPrompt = {
  type: 'list',
  message: 'What would you like to add?',
  name: 'selection',
  choices: ['Department', 'Role', 'Employee']
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

module.exports = {
  whichRole,
  whichDepartment,
  addDataPrompt,
  select
};
