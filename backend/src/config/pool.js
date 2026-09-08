const mysql = require("mysql2/promise");
const config = {
  user: process.env.USER,
 port: process.env.PORT_DB,
  host: process.env.HOST,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};
const pool = mysql.createPool(config);
module.exports = {pool};
