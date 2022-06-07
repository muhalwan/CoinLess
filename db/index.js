const mysql = require('mysql');

const config = {
  host: 'bttogl4fpt9desspbkb0-mysql.services.clever-cloud.com',
  user: 'uyuxgntwayyym696',
  password: 'WKvH2CvIrnpGOKGPYZLW',
  database: 'bttogl4fpt9desspbkb0',
};

const pool = mysql.createPool(config);

module.exports = pool;
