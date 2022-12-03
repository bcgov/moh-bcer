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

  await client.connect();

  await client.query('UPDATE location SET created_at = $1 WHERE id IS NOT NULL', [newCreationDate]);
  await client.query('UPDATE noi SET created_at = $1 WHERE id IS NOT NULL', [newCreationDate]);

  await client.end()
})()