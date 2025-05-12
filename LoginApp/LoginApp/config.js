require('dotenv').config();

const config = {
    server: process.env.DB_SERVER || 'localhost\\SQLEXPRESS', // Use the correct instance name
    db: {
        user: process.env.DB_USER || 'MSI\\yande',
        password: process.env.DB_PASSWORD || '',
        server: process.env.DB_SERVER || '16.0.1000',
        database: process.env.DB_NAME || 'Proyecto',
        options: {
            trustServerCertificate: true,
            encrypt: false, // Disable encryption for the connection
        },
    },
    port: process.env.PORT || 1433,
};

module.exports = config;
