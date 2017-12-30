const mysql = require('mysql');
const options = require('./options');
const connection = mysql.createConnection({
  host: options.mysql_host,
  user: options.mysql_username,
  password: options.mysql_password,
  database: options.mysql_database,
  charset: 'utf8mb4'
});

connection.connect();

module.exports = connection;