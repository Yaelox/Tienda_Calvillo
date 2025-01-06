const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db'); // Import connectDB correctly

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Function to initialize the server
const startServer = async () => {
    try {
        // Connect to the database
        await connectDB();
        console.log('Conexión a la base de datos establecida.');

        // Routes
        app.use('/api', require('./src/routes/userRouters'));

        // Server port
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        process.exit(1); // Exit the process if there's an error
    }
};

// Start the server
startServer();
