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
    defaultValue: process.env.DATABASE_HOST
  },
  {
    name: 'mysql_user',
    type: String,
    defaultValue: process.env.DATABASE_USER
  },
  {
    name: 'mysql_password',
    type: String,
    defaultValue: process.env.DATABASE_PASS
  },
  {
    name: 'mysql_database',
    type: String,
    defaultValue: process.env.DATABASE_NAME
  }
];

module.exports = commandLineArgs(optionDefinitions);