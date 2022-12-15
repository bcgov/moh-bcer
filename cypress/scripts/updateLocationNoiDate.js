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
  const newCreationDate = now.subtract(18, 'month').toISOString();  

  const validUntil = '01-15';  
                
  const newCreationDateYear = moment(newCreationDate).year();
  const newCreationDateMonth = moment(newCreationDate).month();
  const newCreationDateDay = moment(newCreationDate).date();
  let expiryYear;
	
  if ([10, 11, 12].includes(newCreationDateMonth) || (newCreationDateMonth === 1 && newCreationDateDay <= 15)) {
    expiryYear = newCreationDateYear + 2;
  }  else {
    expiryYear = newCreationDateYear + 1;
  }

  const expiryDate = moment(`${expiryYear}-${validUntil}`);

  await client.connect();

  await client.query('UPDATE location SET created_at = $1 WHERE id IS NOT NULL', [newCreationDate]);
  await client.query('UPDATE noi SET created_at = $1 WHERE id IS NOT NULL', [newCreationDate]);
  await client.query('UPDATE noi SET expiry_date = $1 WHERE id IS NOT NULL', [expiryDate.toISOString()]);

  await client.end()
})()