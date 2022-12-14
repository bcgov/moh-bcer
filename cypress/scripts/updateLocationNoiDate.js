const { Client } = require('pg');
const moment = require('moment');

const client = new Client({
  user: 'vape_nestapi',
  host: 'localhost',
  database: 'nest_api_test',
  password: 'vape_nest123',
  port: 5435,
});

(async () => {
  const now = moment();
  const newCreationDate = now.subtract(1, 'year').toISOString();  

  const validUntil = '01-15';  
                
  let thisYear = new Date().getFullYear();
  let thisMonth = new Date().getMonth();
  let thisDay = new Date().getDay();
  let expiryYear;
	
  if ([10, 11, 12].includes(thisMonth) || (thisMonth = 1 && thisDay <= 15)) {
    expiryYear = thisYear + 2;
  }  else {
    expiryYear = thisYear + 1;
  }

  const expiryDate = moment(`${expiryYear}-,${validUntil}`);

  await client.connect();

  await client.query('UPDATE location SET created_at = $1 WHERE id IS NOT NULL', [newCreationDate]);
  await client.query('UPDATE noi SET created_at = $1 WHERE id IS NOT NULL', [newCreationDate]);
  await client.query('UPDATE noi SET expiry_date = $1 WHERE id IS NOT NULL', [expiryDate]);

  await client.end()
})()