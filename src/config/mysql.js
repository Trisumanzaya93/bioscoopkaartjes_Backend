const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  timezone: "Z",
  ssl: {
    ca: process.env.DB_SSL_CA_PATH,  // Menggunakan CA certificate saja
    rejectUnauthorized: false,
  }
});

connection.connect((error) => {
  if (error) {
    throw error;
  }
  /* eslint-disable no-console */
  console.log("You're now connected to mysql ...");
});
module.exports = connection;
