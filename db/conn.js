const {Client} = require('pg');

const client = new Client({
  host: 'bnelnjnmszopqkmmj9yf-postgresql.services.clever-cloud.com',
  user: 'udow0xy7yma3b9qqi1vc',
  port: 5432,
  password: '7OD5izBTuJ8DPYd7lznw',
  database: 'bnelnjnmszopqkmmj9yf',
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = client;
