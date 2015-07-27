var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./db/DB.db');

export default {
  host: 'localhost',
  port: '3000',
  db: db
};
