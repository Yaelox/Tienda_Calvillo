const mysql = require('mysql2/promise');
require('dotenv').config(); // Cargar variables de entorno

// Crear el pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mi_base_de_datos',
  waitForConnections: true,
  charset: 'utf8mb4',
  connectionLimit: 10,
  queueLimit: 0,
});

// Función para probar la conexión
const connectDB = async () => {
  try {
    await pool.getConnection(); // Probar la conexión
    console.log('Conectado a la base de datos con conexión en pool');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    throw error; // Usar 'throw' en lugar de 'arrojar'
  }
};

module.exports = {
  connectDB, // Exportar la función de prueba de conexión
  pool, // Exportar el pool para consultas
};
