const {Client} = require('pg');

const client = new Client({
  host: 'coinless.cluster-cfx4yrrlw52h.us-west-2.rds.amazonaws.com',
  user: 'muhalwan',
  port: 3306,
  password: 'asdfg278',
  database: 'coinless',
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = client;