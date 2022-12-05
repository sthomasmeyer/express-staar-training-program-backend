'use strict';

const { DB_URI } = require('./config');
const { Client } = require('pg');

const client = new Client({
  connectionString: DB_URI,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect((err) => {
  err
    ? console.error(`database-connection error`, err.stack)
    : console.log('A successful database connection has been established.');
});

module.exports = client;
