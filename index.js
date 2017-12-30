const axios = require('axios');
const util = require('util');
const moment = require('moment');
const items = require('./items');
const mysql = require('./mysql');
const options = require('./options');
const query = util.promisify(mysql.query).bind(mysql);
const measureStart = process.hrtime();
checkFormat(items);
checkForDuplicates(items);
formatItems(items);

const githubUrls = items.map((item) => item.github);

async function startProcessing() {
  const storedItems = await query('SELECT * FROM items ORDER BY last_updated ASC');
  const indexMapping = [];
  storedItems.forEach((storedItem) => {
    indexMapping.push(storedItem.github_url);
  });
  const prunedItems = await pruneItems(storedItems);
  const processedItems = await updateItems(storedItems, indexMapping);
  const measureEnd = process.hrtime(measureStart);
  console.log(`Execution time: ${(measureEnd[0] + measureEnd[1] / 1e9).toPrecision(3)} s.`);
  console.log(`${processedItems} item${processedItems === 1 ? '' : 's'} processed`);
  console.log(`${prunedItems} item${prunedItems === 1 ? '' : 's'} pruned`);
}

startProcessing().then(() => {
  mysql.end();
});

async function pruneItems(storedItems) {
  const tasks = [];
  storedItems.forEach((result) => {
    if(githubUrls.indexOf(result.github_url) === -1) {
      tasks.push(pruneItem(result.github_url));
    }
  });

  return Promise.all(tasks).then(() => tasks.length);
}

async function pruneItem(githubUrl) {
  console.log(`[PRUNE] ${githubUrl}`);
  return await query(`DELETE FROM items WHERE github_url = '${githubUrl}'`);
}

async function updateItems(storedItems, indexMapping) {
  const tasks = [];
  let itemsToProcess = [];

  // items in data file but not yet in database always get priority
  for(let i = 0; i < githubUrls.length; ++i) {
    if(indexMapping.indexOf(githubUrls[i]) === -1) {
      if(items[i].process) {
        itemsToProcess.push(items[i]);
      }
    }
  }

  storedItems.forEach((storedItem) => {
    const itemIndex = githubUrls.indexOf(storedItem.github_url);
    if(items[itemIndex].process) {
      itemsToProcess.push(items[itemIndex]);
    }
  });
  
  if(itemsToProcess.length >= options.amount) {
    itemsToProcess = itemsToProcess.slice(0, options.amount);
  }

  itemsToProcess.forEach((itemToProcess) => {
    tasks.push(processPackage(itemToProcess.github, itemToProcess.npm))
  });

  return Promise.all(tasks).then(() => itemsToProcess.length);
}

async function processPackage(githubUrl, npm) {
  const { name, owner } = getOwnerAndName(githubUrl);
  let published_at = 'NULL';
  let queryString = '';
  try {
    const { data: { githubUrl: html_url, open_issues, stargazers_count, description, homepage } } = await axios.get(`https://api.github.com/repos/${owner}/${name}?access_token=${options.github_token}`);
    const { data } = await axios.get(`https://api.github.com/repos/${owner}/${name}/releases?access_token=${options.github_token}`);
    if(Array.isArray(data) && data.length > 0) {
      published_at = data[0].published_at;
    }

    const npm_url = npm ? `${mysql.escape(npm)}` : 'NULL';
    if(published_at !== 'NULL') {
      published_at = `'${moment(published_at).format('YYYY-MM-DD HH:mm:ss')}'`;
    }
    queryString = `
      INSERT INTO items (github_url, npm_url, open_issues, stars, description, last_release, website, last_updated) 
        VALUES(
            ${mysql.escape(githubUrl)}, 
            ${npm_url}, 
            ${open_issues}, 
            ${stargazers_count}, 
            ${mysql.escape(description)}, 
            ${published_at}, 
            ${mysql.escape(homepage)}, 
            UTC_TIMESTAMP()) 
      ON DUPLICATE KEY UPDATE 
        github_url=${mysql.escape(githubUrl)}, 
        npm_url=${npm_url}, 
        open_issues=${open_issues}, 
        stars=${stargazers_count}, 
        description=${mysql.escape(description)}, 
        last_release=${published_at}, 
        website=${mysql.escape(homepage)}, 
        last_updated=UTC_TIMESTAMP()`;
    await query(queryString.trim());
    return true;
  } catch(e) {
    if(e.response) {
      if(e.response.status === 404) {
        console.error(`[NOT FOUND] ${githubUrl}`);
        return false;
      }

      if(e.response.status === 401) {
        console.error(`[UNAUTHORIZED] More requests can be made ${moment(e.response.headers['x-ratelimit-reset'] * 1000).fromNow()}`);
      }
    }
  }
}

function checkFormat(items) {
  if(!Array.isArray(items)) {
    throw new Error('Bad format');
  }

  for(let i = 0; i < items.length; ++i) {
    if(typeof(items[i]) !== 'object') {
      throw new Error('Bad format');
    }

    if(typeof items[i].github !== 'string') {
      throw new Error('Bad format');
    }

    if(typeof items[i].process !== 'boolean') {
      throw new Error('Bad format');
    }

    if(typeof items[i].npm !== 'undefined' && typeof items[i].npm !== 'string') {
      throw new Error('Bad format');
    }
  }
}

function checkForDuplicates(items) {
  const mapping = {};

  for(let i = items.length - 1; i >= 0; --i) {
    const lowerCased = items[i].github.toLowerCase();
    if(mapping[lowerCased]) {
      console.error(`[DUPLICATE FOUND] ${items[i].github}`);
      items.splice(i, 1);
    }

    mapping[lowerCased] = true;
  }
}

function getOwnerAndName(githubUrl) {
  const urlParts = githubUrl.split('/');
  const name = urlParts[urlParts.length - 1];
  const owner = urlParts[urlParts.length - 2];

  return { owner, name };
}

function formatItems(items) {
  items.forEach((item) => {
    item.github = item.github.toLowerCase();
  });
}