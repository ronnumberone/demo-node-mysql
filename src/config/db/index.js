const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

  // create the connection to database
  const connection = mysql.createConnection({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    database: process.env.SQL_DATABASE,
    password: process.env.SQL_PASSWORD
  });

  connection.connect((err) => {
    if (err) {
      console.error('Database connecting fail', err);
      throw err;
    }
    console.log('Database connecting successfull');
  });


module.exports = connection;