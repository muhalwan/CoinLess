const {Client} = require('mysql');

const client = new Client({
  host: 'bttogl4fpt9desspbkb0-mysql.services.clever-cloud.com',
  user: 'uyuxgntwayyym696',
  port: 3306,
  password: 'WKvH2CvIrnpGOKGPYZLW',
  database: 'bttogl4fpt9desspbkb0',
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = client;
