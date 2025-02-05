const { pool } = require('../../config/db');

// Obtener todas las tiendas
const getTiendas = async () => {
  try {
    const [tiendas] = await pool.query(
      `SELECT 
        id_tienda, 
        nombre_tienda, 
        direccion, 
        telefono, 
        email, 
        id_usuario, 
        frecuencia_visitas, 
        fecha_registro 
      FROM tiendas`
    );
    return tiendas;
  } catch (error) {
    throw error;
  }
};

// Obtener una tienda por ID
const getTiendasbyId = async (id) => {
  try {
    const [tienda] = await pool.query(
      `SELECT 
        id_tienda, 
        nombre_tienda, 
        direccion, 
        telefono, 
        email, 
        id_usuario, 
        frecuencia_visitas, 
        fecha_registro 
      FROM tiendas 
      WHERE id_tienda = ?`,
      [id]
    );
    return tienda.length ? tienda[0] : null;
  } catch (error) {
    throw error;
  }
};

  // Crear un nuevo tienda
const createTienda = async (nombre_tienda, direccion, telefono,email,frecuencia_visitas ,id_usuario) => {
  try {
    const [result] = await pool.query(
      'INSERT INTO tiendas (nombre_tienda, direccion, telefono,email,frecuencia_visitas ,id_usuario) VALUES (?, ?, ?, ?, ?,?)', 
      [nombre_tienda, direccion, telefono,email,id_usuario,frecuencia_visitas ]
    );
    return { id_tienda: result.insertId, nombre_tienda, direccion, telefono,email,id_usuario,frecuencia_visitas  };
  } catch (error) {
    throw error;
  }
};

// Actualizar una tienda
const updateTienda = async (id,nombre_tienda, direccion, telefono,email,frecuencia_visitas ) => {
    try {
      await pool.query(
        'UPDATE productos SET nombre_tienda=?, direccion=?, telefono=?,email=?, frecuencia_visitas =? WHERE id_tienda = ?', 
        [nombre_tienda, direccion, telefono,emailfrecuencia_visitas , id]
      );
      return { id,nombre_tienda, direccion, telefono,email,frecuencia_visitas  };
    } catch (error) {
      throw error;
    }
  };

  // Eliminar un producto
const deleteTienda = async (id) => {
    try {
      await pool.query('DELETE FROM tiendas WHERE id_tienda = ?', [id]);
    } catch (error) {
      throw error;
    }
  };

  module.exports = {
    getTiendas,
    getTiendasbyId,
    createTienda,
    updateTienda,
    deleteTienda
  };