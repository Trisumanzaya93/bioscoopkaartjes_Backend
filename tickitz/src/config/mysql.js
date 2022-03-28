const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.UNAME,
  password: process.env.PASS,
  database: process.env.DB,
  // host: "localhost",
  // user: "root",
  // password: "123456",
  // database: "Tickitz",
});

connection.connect((error) => {
  if (error) {
    throw error;
  }
  // eslint-disable-next-line-no-console
  console.log("You're now connected to mysql ...");
});
module.exports = connection;
