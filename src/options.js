const commandLineArgs = require('command-line-args');
const optionDefinitions = [
  { 
    name: 'amount', 
    alias: 'a', 
    type: Number, 
    defaultValue: 20 
  },
  {
    name: 'github_token',
    alias: 'g',
    type: String,
    defaultValue: process.env.GITHUB_TOKEN
  },
  {
    name: 'mysql_host',
    type: String,
    defaultValue: process.env.MYSQL_HOST
  },
  {
    name: 'mysql_username',
    type: String,
    defaultValue: process.env.MYSQL_USERNAME
  },
  {
    name: 'mysql_password',
    type: String,
    defaultValue: process.env.MYSQL_PASSWORD
  },
  {
    name: 'mysql_database',
    type: String,
    defaultValue: process.env.MYSQL_DATABASE
  }
];

module.exports = commandLineArgs(optionDefinitions);