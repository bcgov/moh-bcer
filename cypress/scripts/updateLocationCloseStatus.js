const { Client } = require('pg');

const client = new Client({
  user: 'vape_nestapi',
  host: 'localhost',
  database: 'nest_api_test',
  password: 'vape_nest123',
  port: 5435,
});

(async () => {
  await client.connect();

  await client.query(`UPDATE location SET status = 'active', closed_at = null, closed_time = null WHERE id IS NOT NULL`);

  await client.end()
})()