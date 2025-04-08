const mysql = require('mysql2/promise');
require('dotenv').config(); // Cargar variables de entorno

// Crear el pool de conexiones
const pool = mysql.createPool({
  host: process.env.MYSQLHOST,  // "mysql.railway.internal"
  user: process.env.MYSQLUSER,  // Usuario de la DB
  password: process.env.MYSQLPASSWORD,  // Contraseña
  database: process.env.MYSQLDB,  // Nombre de la base de datos
  port: process.env.MYSQLPORT,
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
