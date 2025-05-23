const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db'); // Import connectDB correctly

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Function to initialize the server
const startServer = async () => {
    try {
        // Connect to the database
        await connectDB();
        console.log('Conexión a la base de datos establecida.');

        // Routes
        app.use('/api', require('./src/routes/userRouters'));
        app.use('/api', require('./src/routes/productRouters'));
        app.use('/api', require ('./src/routes/contactoRouters'))
        app.use('/api', require('./src/routes/usuariosRouters'))
        app.use('/api',require('./src/routes/tiendaRouters'))
        app.use('/api',require('./src/routes/eventRouters'))
        app.use('/api',require('./src/routes/postRouters'))
        app.use('/api',require('./src/routes/comprasRouters'))
        app.use('/api',require('./src/routes/compra-detallesRouters'))
        app.use('/api',require('./src/routes/checadorRouters'))
        app.use('/api',require('./src/routes/categoriasRouters'))
        app.use('/api',require('./src/routes/venta-repartisorRouters'))
        app.use('/api',require('./src/routes/estadisticasRouter'))
        app.use('/api',require('./src/routes/rechazosRouters'))
        app.use('/api',require('./src/routes/meta-diaRouters'))
        app.use('/api',require('./src/routes/fotosRouter'))
        app.use('/api', require('./src/routes/ubicacionRouters'))

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
