const { MongoClient } = require('mongodb');
const config = require('../config/mongodb');

const client = new MongoClient(config.uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connect() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    return client.db(config.dbName);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = connect;