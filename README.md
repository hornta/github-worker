# Github Worker
Aggregates information about Github repositories using the Github API and stores it in a MySQL database.

## Setup
First you have to install the SQL schema.
Import the contents of schema.sql to your database.

Make sure you have passed the correct arguments for your database connection and Github API token, or if you prefer having it in environment variables

## Usage
```js
npm install
npm test
node index
```

## Arguments
```
node index --github_token=[REPLACE_WITH_YOUR_GITHUB_TOKEN]
           --mysql_host=localhost
           --mysql_username=github-worker
           --mysql_password=qwer1234
           --mysql_database=github-worker
           --amount=100

node index --github_token=[REPLACE_WITH_YOUR_GITHUB_TOKEN] --mysql_host=localhost --mysql_username=github-worker --mysql_password=qwer1234 --mysql_database=github-worker --amount=100
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
