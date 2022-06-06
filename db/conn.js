const {Client} = require('pg');

const client = new Client({
  host: 'coinlessdb.cfx4yrrlw52h.us-west-2.rds.amazonaws.com',
  user: 'CoinLess_pg',
  port: 5432,
  password: 'asdfg278',
  database: 'postgres',
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = client;