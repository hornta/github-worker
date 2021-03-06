# Github Worker [![Build Status](https://travis-ci.org/hornta/github-worker.svg?branch=master)](https://travis-ci.org/hornta/github-worker) [![Known Vulnerabilities](https://snyk.io/test/github/hornta/github-worker/badge.svg?targetFile=package.json)](https://snyk.io/test/github/hornta/github-worker?targetFile=package.json) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
Aggregates information about Github repositories using the Github API and stores it in a MySQL database.

## Setup
First you have to install the SQL schema.
Import the contents of schema.sql to your database.

Make sure you have passed the correct arguments for your database connection and Github API token, or if you prefer having it in environment variables.

## Usage
```js
npm install
npm test
node src
```

## Arguments
```
node src --github_token=[REPLACE_WITH_YOUR_GITHUB_TOKEN]
         --mysql_host=localhost
         --mysql_username=github-worker
         --mysql_password=qwer1234
         --mysql_database=github-worker
         --amount=100

node src --github_token=[REPLACE_WITH_YOUR_GITHUB_TOKEN] --mysql_host=localhost --mysql_username=github-worker --mysql_password=qwer1234 --mysql_database=github-worker --amount=100
```

## Environment variables
If some arguments is not passed, it will default to these environment variables.
```
MYSQL_HOST=localhost,
MYSQL_USERNAME=github-worker,
MYSQL_PASSWORD=qwer1234,
MYSQL_DATABASE=github-worker
GITHUB_TOKEN=[REPLACE_WITH_YOUR_GITHUB_TOKEN]
```

## Contribute
Please feel free to create an issue and/or make a PR.

## Future
I plan to create a REST API to query the database of the items. 

I also plan to create a web application that will consume that API.

Let me know if you would want to help me with that!

## TODO
- Unit tests for database actions(setting up MySQL with Travis).
- Continue adding more items.
- Support for categorizing items.
