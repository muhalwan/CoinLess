const mysql = require('mysql');

const config = {
    host: 'coinlessdb.cfx4yrrlw52h.us-west-2.rds.amazonaws.com',
    user: 'CoinLess_pg',
    password: 'asdfg278',
    database: 'coinlessdb',
};

const pool = mysql.createPool(config);

module.exports = pool;