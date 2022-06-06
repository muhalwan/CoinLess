const mysql = require('mysql');

const config = {
    host: 'coinless.cluster-cfx4yrrlw52h.us-west-2.rds.amazonaws.com',
    user: 'muhalwan',
    password: 'asdfg278',
    database: 'coinless',
};

const pool = mysql.createPool(config);

module.exports = pool;