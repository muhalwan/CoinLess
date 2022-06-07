const mysql = require('pg');

const config = {
  host: 'bnelnjnmszopqkmmj9yf-postgresql.services.clever-cloud.com',
  user: 'udow0xy7yma3b9qqi1vc',
  password: '7OD5izBTuJ8DPYd7lznw',
  database: 'bnelnjnmszopqkmmj9yf',
};

const pool = mysql.createPool(config);

module.exports = pool;
