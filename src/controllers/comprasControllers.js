const db = require('../../config/db');

// Obtener todas las compras
const getCompras = async (req, res) => {
  try {
    const [compras] = await db.pool.query('SELECT * FROM compras');
    res.status(200).json(compras);
  } catch (error) {
    console.error('Error al obtener las compras:', error);
    res.status(500).json({ message: 'Error al obtener las compras' });
  }
};

// Obtener una compra por ID
const getComprasById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.pool.query('SELECT * FROM compras WHERE id_compra = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Compra no encontrada' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error al obtener la compra:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Registrar compra
// Registrar compra
async function registrarCompra(req, res) {
    const { usuario_id, total, metodo_pago, shippingInfo, productos } = req.body;
  
    let connection;
  
    try {
      // 🚨 Validar que no haya undefined en shippingInfo y productos
      if (!usuario_id || !total || !metodo_pago || !shippingInfo || !productos || productos.length === 0) {
        return res.status(400).json({ error: "Faltan datos en la solicitud" });
      }
  
      const fullName = shippingInfo.fullName || null;
      const address = shippingInfo.address || null;
      const city = shippingInfo.city || null;
      const postalCode = shippingInfo.postalCode || null;
      const lat = shippingInfo.lat !== undefined ? shippingInfo.lat : null;
      const lng = shippingInfo.lng !== undefined ? shippingInfo.lng : null;
  
      connection = await db.pool.getConnection();
      await connection.beginTransaction(); // Iniciar transacción
  
      // Insertar en la tabla "compras"
      const [compraResult] = await connection.execute(
        `INSERT INTO compras (usuario_id, total, metodo_pago, nombre_completo, direccion, ciudad, codigo_postal, latitud, longitud, estado) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendiente')`, 
        [usuario_id, total, metodo_pago, fullName, address, city, postalCode, lat, lng]
      );
  
      const compraId = compraResult.insertId; // Obtener el ID de la compra recién creada
  
      // Insertar los productos en la tabla "compra_detalles"
      const productosQuery = `INSERT INTO compra_detalles (compra_id, producto_id, cantidad, precio_unitario, subtotal) VALUES ?`;
      const productosData = productos.map(p => [
        compraId, 
        p.id_producto || null, 
        p.cantidad || 1, 
        p.precio || 0, 
        (p.cantidad || 1) * (p.precio || 0)
      ]);
  
      await connection.query(productosQuery, [productosData]);
  
      await connection.commit(); // Confirmar la transacción
      res.status(201).json({ message: "Compra registrada con éxito", compraId });
  
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      console.error('Error al registrar la compra:', error);
      res.status(500).json({ error: "Error interno del servidor" });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
  
// Actualizar estado de la compra
const actualizarEstadoCompra = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body; // Estado a actualizar (por ejemplo: 'en proceso', 'completada')

  try {
    const [result] = await db.pool.query(
      'UPDATE compras SET estado = ? WHERE id_compra = ?',
      [estado, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Compra no encontrada' });
    }

    res.status(200).json({ message: `Estado de la compra actualizado a ${estado}` });
  } catch (error) {
    console.error('Error al actualizar el estado de la compra:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

// Eliminar compra
const eliminarCompra = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.pool.query('DELETE FROM compras WHERE id_compra = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Compra no encontrada' });
    }

    res.status(200).json({ message: 'Compra eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar la compra:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

module.exports = { 
  registrarCompra,
  getCompras,
  getComprasById,
  actualizarEstadoCompra,
  eliminarCompra
};
