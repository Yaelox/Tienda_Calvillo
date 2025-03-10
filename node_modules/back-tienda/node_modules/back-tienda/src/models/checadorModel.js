const db = require('../../config/db');

const Checador = {
    registrarEntrada: (usuario_id, latitud, longitud, callback) => {
        const fecha = new Date().toISOString().split('T')[0];
        const hora = formatearHora24(new Date());  // Cambio aquí para usar hora en 24 horas

        const sql = `INSERT INTO checador (usuario_id, fecha, hora_entrada, latitud, longitud, estado)
                     VALUES (?, ?, ?, ?, ?, 'entrada')`;
        db.pool.query(sql, [usuario_id, fecha, hora, latitud, longitud], callback);
    },

    registrarSalida: (usuario_id, latitud, longitud, callback) => {
        const fecha = new Date().toISOString().split('T')[0];
        const hora = formatearHora24(new Date());  // Cambio aquí para usar hora en 24 horas

        const sql = `UPDATE checador SET hora_salida = ?, estado = 'salida'
                     WHERE usuario_id = ? AND fecha = ? AND estado = 'entrada'`;
        db.pool.query(sql, [hora, usuario_id, fecha], callback);
    },
     obtenerHistorial : (callback) => {
        const sql = `SELECT * FROM checador ORDER BY fecha DESC`;
        db.pool.query(sql, [], callback); // Se mantiene el array vacío para seguir la estructura
    },
    
    actualizarRegistro: (id, data, callback) => {
        const sql = `UPDATE checador SET hora_entrada = ?, hora_salida = ?, latitud = ?, longitud = ?, estado = ? WHERE id = ?`;
        db.pool.query(sql, [data.hora_entrada, data.hora_salida, data.latitud, data.longitud, data.estado, id], callback);
    },

    eliminarRegistro: (id, callback) => {
        const sql = `DELETE FROM checador WHERE id = ?`;
        db.pool.query(sql, [id], callback);
    }
};

// Función para convertir hora a formato de 24 horas
function formatearHora24(fecha) {
    return fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

module.exports = Checador;
