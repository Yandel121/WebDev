require('dotenv').config();
const sql = require('mssql');

// Define the configuration object
const config = {
    user: process.env.DB_USER || 'testuser', // Username from .env
    password: process.env.DB_PASSWORD || 'testuser', // Password from .env
    server: process.env.DB_SERVER || 'localhost', // SQL Server instance
    database: process.env.DB_NAME || 'Proyecto', // Database name
    options: {
        trustServerCertificate: true, // Bypass certificate validation
        encrypt: false, // Disable encryption for local connections
    },
    port: 1433, // Default SQL Server port
};

// Function to connect to the database
const connectDB = async () => {
    try {
        const pool = await sql.connect(config);
        console.log('Connected to SQL Server database: Proyecto');
        return pool;
    } catch (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1); // Exit the process if the connection fails
    }
};

// Function to close the database connection
const endConnection = async () => {
    try {
        await sql.close();
        console.log('Connection to SQL Server closed.');
    } catch (err) {
        console.error('Error closing the connection:', err.message);
    }
};

module.exports = { connectDB, endConnection, config };