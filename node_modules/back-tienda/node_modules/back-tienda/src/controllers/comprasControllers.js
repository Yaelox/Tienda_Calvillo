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
async function registrarCompra(req, res) {
  const { usuario_id, total, metodo_pago, nombre_completo, direccion, ciudad, codigo_postal, latitud, longitud, productos } = req.body;

  let connection;

  try {
    // Validar que no haya datos faltantes
    if (!usuario_id || !total || !metodo_pago || !nombre_completo || !direccion || !ciudad || !codigo_postal || latitud === undefined || longitud === undefined || !productos || productos.length === 0) {
      console.log('Datos faltantes en la solicitud:', req.body);
      return res.status(400).json({ error: "Faltan datos en la solicitud" });
    }

    console.log('Información de compra:', nombre_completo, direccion, ciudad, codigo_postal, latitud, longitud);

    connection = await db.pool.getConnection();
    console.log('Conexión obtenida de la pool');
    
    await connection.beginTransaction(); // Iniciar transacción
    console.log('Transacción iniciada');

    // Insertar en la tabla "compras"
    const [compraResult] = await connection.execute(
      `INSERT INTO compras (usuario_id, total, metodo_pago, nombre_completo, direccion, ciudad, codigo_postal, latitud, longitud, estado) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendiente')`, 
      [usuario_id, total, metodo_pago, nombre_completo, direccion, ciudad, codigo_postal, latitud, longitud]
    );

    console.log('Compra registrada en la tabla "compras"', compraResult);
    const compraId = compraResult.insertId; // Obtener el ID de la compra recién creada
    console.log('ID de la compra recién creada:', compraId);

    // Validar los productos y preparar los datos para la inserción
    const productosData = productos.map(p => {
      const id_producto = p.id_producto || null;
      const cantidad = p.cantidad || 1;
      const precio = p.precio || 0;

      // Si algún producto tiene datos incorrectos, lanzar un error
      if (!id_producto || cantidad <= 0 || precio <= 0) {
        throw new Error('Datos de producto inválidos');
      }

      return [
        compraId,
        id_producto,
        cantidad,
        precio,
        cantidad * precio
      ];
    });

    console.log('Productos a insertar:', productosData);

    // Insertar los productos en la tabla "compra_detalles"
    const productosQuery = `INSERT INTO compra_detalles (compra_id, producto_id, cantidad, precio_unitario, subtotal) VALUES ?`;
    await connection.query(productosQuery, [productosData]);
    console.log('Productos insertados correctamente en "compra_detalles"');

    await connection.commit(); // Confirmar la transacción
    console.log('Transacción confirmada');
    res.status(201).json({ message: "Compra registrada con éxito", compraId });

  } catch (error) {
    if (connection) {
      await connection.rollback();
      console.log('Transacción revertida debido a un error');
    }
    console.error('Error al registrar la compra:', error.message);
    res.status(500).json({ error: error.message || "Error interno del servidor" });
  } finally {
    if (connection) {
      connection.release();
      console.log('Conexión liberada');
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

const eliminarCompra = async (req, res) => {
  const { id } = req.params;

  const connection = await db.pool.getConnection(); // Obtener una conexión de la pool

  try {
    await connection.beginTransaction(); // Iniciar la transacción

    // Eliminar los detalles de la compra
    const [resultDetalles] = await connection.query('DELETE FROM compra_detalles WHERE compra_id = ?', [id]);
    
    // Eliminar la compra
    const [resultCompra] = await connection.query('DELETE FROM compras WHERE id_compra = ?', [id]);

    // Verificar si la compra existía
    if (resultCompra.affectedRows === 0) {
      await connection.rollback(); // Revertir la transacción
      return res.status(404).json({ message: 'Compra no encontrada' });
    }

    // Verificar si los detalles fueron eliminados
    if (resultDetalles.affectedRows === 0) {
      console.warn('No se encontraron detalles para eliminar, pero la compra fue eliminada.');
    }

    // Confirmar la transacción
    await connection.commit();

    res.status(200).json({ message: 'Compra y detalles eliminados con éxito' });
  } catch (error) {
    // Si ocurre un error, revertir la transacción
    await connection.rollback();
    console.error('Error al eliminar la compra:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  } finally {
    connection.release(); // Liberar la conexión
  }
};


module.exports = { 
  registrarCompra,
  getCompras,
  getComprasById,
  actualizarEstadoCompra,
  eliminarCompra
};
