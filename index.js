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
  functions.userSelect(connection);
});
