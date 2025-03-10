const Checador = require('../models/checadorModel');
const moment = require('moment');
const db = require('../../config/db') // Usamos moment.js para manejar la hora de forma adecuada

const registrarEntrada = (req, res) => {
    console.log('Cuerpo recibido en el backend:', req.body); // 🔍 Ver qué llega al backend

    const { usuario_id, latitud, longitud, horaEntrada } = req.body;

    if (!usuario_id || !latitud || !longitud || !horaEntrada) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Convertir la hora de entrada de 12 horas a 24 horas
    const horaEntrada24 = moment(horaEntrada, 'hh:mm:ss A').format('HH:mm:ss');

    Checador.registrarEntrada(usuario_id, latitud, longitud, horaEntrada24, (err, result) => {
        if (err) return res.status(500).json({ message: "Error en el servidor", error: err });
        res.status(200).json({ message: "Entrada registrada con éxito" });
    });
};

const registrarSalida = (req, res) => {
    const { usuario_id, latitud, longitud, horaSalida } = req.body; // Asegúrate de pasar la hora en el cuerpo

    if (!usuario_id || !latitud || !longitud || !horaSalida) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Convertimos la hora de salida de 12 horas a 24 horas
    const horaSalida24 = moment(horaSalida, 'hh:mm:ss A').format('HH:mm:ss');
    
    Checador.registrarSalida(usuario_id, latitud, longitud, horaSalida24, (err, result) => {
        if (err) return res.status(500).json({ message: "Error en el servidor", error: err });
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "No hay entrada registrada para hoy" });
        }
        res.status(200).json({ message: "Salida registrada con éxito" });
    });
};

const obtenerHistorial = async (req, res) => {
  try {
    const [historial] = await db.pool.query('SELECT * FROM checador');
    res.status(200).json(historial);
  } catch (error) {
    console.error('Error al obtener el historial:', error);
    res.status(500).json({ message: 'Error al obtener el historial' });
  }
};

const obtenerPorId = (req, res) => {
    const { id } = req.params;

    Checador.obtenerPorId(id, (err, result) => {
        if (err) return res.status(500).json({ message: "Error en el servidor", error: err });
        if (!result.length) return res.status(404).json({ message: "Registro no encontrado" });

        // Convertimos las horas a formato de 12 horas con AM/PM
        if (result[0].hora_entrada) {
            result[0].hora_entrada = moment(result[0].hora_entrada, 'HH:mm:ss').format('hh:mm:ss A');
        }
        if (result[0].hora_salida) {
            result[0].hora_salida = moment(result[0].hora_salida, 'HH:mm:ss').format('hh:mm:ss A');
        }

        res.status(200).json(result[0]);
    });
};

const actualizarRegistro = (req, res) => {
    const { id } = req.params;
    let data = req.body;

    // Convertimos las horas a formato de 24 horas (HH:mm:ss) si existen en el request
    if (data.hora_entrada) {
        data.hora_entrada = moment(data.hora_entrada, 'hh:mm:ss A').format('HH:mm:ss');
    }
    if (data.hora_salida) {
        data.hora_salida = moment(data.hora_salida, 'hh:mm:ss A').format('HH:mm:ss');
    }

    Checador.actualizarRegistro(id, data, (err, result) => {
        if (err) return res.status(500).json({ message: "Error en el servidor", error: err });
        res.status(200).json({ message: "Registro actualizado con éxito" });
    });
};

const eliminarRegistro = (req, res) => {
    const { id } = req.params;

    Checador.eliminarRegistro(id, (err, result) => {
        if (err) return res.status(500).json({ message: "Error en el servidor", error: err });
        res.status(200).json({ message: "Registro eliminado con éxito" });
    });
};

module.exports = {
    registrarEntrada,
    registrarSalida,
    obtenerHistorial,
    obtenerPorId,
    actualizarRegistro,
    eliminarRegistro
};
