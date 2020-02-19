'use strict';

const mysql = require('mysql');
const consoleTable = require('console.table');
const functions = require('./functions');
const textArt = require('./textArt');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'George1!',
  database: 'employee_tracker_db'
});

connection.connect(err => {
  if (err) throw err;
  console.log(textArt.start);
  functions.userSelect(connection);
});
