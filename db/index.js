const mysql = require('mysql');

const config = {
  host: 'coinlessdb.cfx4yrrlw52h.us-west-2.rds.amazonaws.com',
  user: 'CoinLess_pg',
  port: 5432,
  password: 'asdfg278',
  database: 'postgres',
};

const pool = mysql.createPool(config);

module.exports = pool;
