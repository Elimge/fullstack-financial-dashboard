// backend/src/config/database.js

// Import the MySQL2 package with Promise support for async/await usage
const mysql = require("mysql2/promise");
// Load environment variables from a .env file located two directories up
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

const dbConfig = {
    host: process.env.DB_HOST,             // Database host (e.g., localhost or remote server)
    user: process.env.DB_USER,             // Database user
    password: process.env.DB_PASSWORD,     // Database user password
    database: process.env.DB_DATABASE,     // Name of the database to connect to
    waitForConnections: true,              // Queue connection requests when all connections are in use
    connectionLimit: 10,                   // Maximum number of connections in the pool
    queueLimit: 0                          // Maximum number of queued connection requests (0 = unlimited)
};

// Create a connection pool using the defined configuration
const pool = mysql.createPool(dbConfig);

module.exports = pool; 