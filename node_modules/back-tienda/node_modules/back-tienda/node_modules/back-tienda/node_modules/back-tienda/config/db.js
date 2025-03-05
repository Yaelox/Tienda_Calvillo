const mysql = require('mysql2/promise');
require('dotenv').config(); // Load environment variables

// Create the connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mi_base_de_datos',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Function to test the connection
const connectDB = async () => {
    try {
        await pool.getConnection(); // Test the connection
        console.log('Conectado a la base de datos con conexión en pool');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        throw error;
    }
};

module.exports = {
    connectDB, // Export the connection test function
    pool,      // Export the pool for queries
};
