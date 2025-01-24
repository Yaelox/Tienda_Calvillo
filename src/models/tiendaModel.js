const { pool } = require('../../config/db');

// Obtener todos los contactos
const getTiendas = async () => {
    try {
      const [tiendas] = await pool.query("SELECT * FROM tiendas");
      return tiendas;
    } catch (error) {
      throw error;
    }
  };

  // Obtener un producto por ID
const getTiendasbyId = async (id) => {
    try {
      const [tiendas] = await pool.query('SELECT * FROM tiendas WHERE id_tienda = ?', [id]);
      return tiendas.length ? tiendas[0] : null;
    } catch (error) {
      throw error;
    }
  };

  // Crear un nuevo tienda
const createTienda = async (nombre_tienda, direccion, telefono,email,id_usuario) => {
  try {
    const [result] = await pool.query(
      'INSERT INTO tiendas (nombre_tienda, direccion, telefono,email,id_usuario) VALUES (?, ?, ?, ?, ?,?)', 
      [nombre_tienda, direccion, telefono,email,id_usuario]
    );
    return { id_tienda: result.insertId, nombre_tienda, direccion, telefono,email,id_usuario };
  } catch (error) {
    throw error;
  }
};

// Actualizar una tienda
const updateTienda = async (id,nombre_tienda, direccion, telefono,email,fecha_registro) => {
    try {
      await pool.query(
        'UPDATE productos SET nombre_tienda=?, direccion=?, telefono=?,email=?,fecha_registro=? WHERE id_tienda = ?', 
        [nombre_tienda, direccion, telefono,email,fecha_registro, id]
      );
      return { id,nombre_tienda, direccion, telefono,email,fecha_registro };
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