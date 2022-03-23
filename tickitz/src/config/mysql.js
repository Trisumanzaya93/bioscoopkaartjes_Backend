const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "Tickitz",
});

connection.connect((error) => {
  if (error) {
    throw error;
  }
  // eslint-disable-next-line-no-cnsole
  console.log("You're now connected to mysql ...");
});
module.exports = connection;
