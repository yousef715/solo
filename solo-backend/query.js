const { Client } = require('pg');

const client = new Client({
  host: '127.0.0.1',
  port: 5432,
  database: 'solo_db',
  user: 'postgres',
  password: '1372004' // from .env
});

async function run() {
  await client.connect();
  const res = await client.query('SELECT id, username, email FROM up_users');
  console.log(res.rows);
  await client.end();
}

run().catch(console.error);
