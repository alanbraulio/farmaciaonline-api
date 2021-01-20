const sql = require('mssql');
require('dotenv/config');

const dbConfig = {
    server: process.env.DB_SERVER_ADR,
    database: process.env.DB_NAME, 
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: 1433,
    parseJSON:true,
    options: {
          encrypt: true,
          enableArithAbort: true
    }
};

const dbConnectionPool = new sql.ConnectionPool(dbConfig);


async function getConnection(){  
  return await dbConnectionPool.connect();
}

module.exports = {
  getConnection
}