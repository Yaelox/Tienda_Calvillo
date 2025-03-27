const db = require('../../config/db');


const getCompraDetalles = async (req, res) => {
  try {
      const sql = `
          SELECT 
              c.id_compra, c.usuario_id, c.total, c.metodo_pago, 
              c.nombre_completo, c.direccion, c.ciudad, c.codigo_postal, 
              c.latitud, c.longitud, c.fecha_compra, c.estado,
              cd.id_compra_detalle, cd.producto_id, cd.cantidad, cd.precio_unitario, cd.subtotal,
              p.nombre AS producto_nombre, p.imagen AS producto_imagen  -- Traemos la imagen del producto
          FROM compras c
          LEFT JOIN compra_detalles cd ON c.id_compra = cd.compra_id
          LEFT JOIN productos p ON cd.producto_id = p.id_producto  -- Unimos la tabla productos
      `;

      const [rows] = await db.pool.query(sql);

      // Agrupar los productos por compra
      const comprasMap = new Map();

      rows.forEach(row => {
          if (!comprasMap.has(row.id_compra)) {
              comprasMap.set(row.id_compra, {
                  id_compra: row.id_compra,
                  usuario_id: row.usuario_id,
                  total: row.total,
                  metodo_pago: row.metodo_pago,
                  nombre_completo: row.nombre_completo,
                  direccion: row.direccion,
                  ciudad: row.ciudad,
                  codigo_postal: row.codigo_postal,
                  latitud: row.latitud,
                  longitud: row.longitud,
                  fecha_compra: row.fecha_compra,
                  estado: row.estado,
                  productos: []
              });
          }

          // Si hay productos, agrégarlos al array de productos
          if (row.producto_id) {
              comprasMap.get(row.id_compra).productos.push({
                  id_compra_detalle: row.id_compra_detalle,
                  producto_id: row.producto_id,
                  nombre: row.producto_nombre,  // Agregamos el nombre del producto
                  cantidad: row.cantidad,
                  precio_unitario: row.precio_unitario,
                  subtotal: row.subtotal,
                  imagen: row.producto_imagen  // Agregamos la imagen del producto
              });
          }
      });

      res.json(Array.from(comprasMap.values()));
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener los detalles de compras' });
  }
};

const getCompraDetalleById = async (req, res) => {
  const { id } = req.params;

  try {
    const [detalleCompra] = await db.pool.query(
      `SELECT 
        cd.*, 
        p.nombre AS producto_nombre, 
        p.imagen AS producto_imagen  -- Traemos la imagen del producto
      FROM compra_detalles cd
      LEFT JOIN productos p ON cd.producto_id = p.id_producto
      WHERE cd.id_compra_detalle = ?`,
      [id]
    );

    if (detalleCompra.length === 0) {
      return res.status(404).json({ message: 'Detalle de compra no encontrado' });
    }

    res.status(200).json(detalleCompra[0]);
  } catch (error) {
    console.error('Error al obtener el detalle de la compra:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};


// Registrar un detalle de compra
const registrarCompraDetalle = async (req, res) => {
  const { compra_id, producto_id, cantidad, precio_unitario, subtotal } = req.body;

  try {
    // Validar que no falten datos
    if (!compra_id || !producto_id || !cantidad || !precio_unitario || !subtotal) {
      return res.status(400).json({ message: 'Faltan datos en la solicitud' });
    }

    const [result] = await db.pool.query(
      'INSERT INTO compra_detalles (compra_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
      [compra_id, producto_id, cantidad, precio_unitario, subtotal]
    );

    res.status(201).json({ message: 'Detalle de compra registrado con éxito', id_compra_detalle: result.insertId });
  } catch (error) {
    console.error('Error al registrar el detalle de la compra:', error);
    res.status(500).json({ message: 'Error al registrar el detalle de la compra' });
  }
};

// Actualizar un detalle de compra
const actualizarCompraDetalle = async (req, res) => {
  const { id } = req.params;
  const { cantidad, precio_unitario, subtotal } = req.body;

  try {
    const [result] = await db.pool.query(
      'UPDATE compra_detalles SET cantidad = ?, precio_unitario = ?, subtotal = ? WHERE id_compra_detalle = ?',
      [cantidad, precio_unitario, subtotal, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Detalle de compra no encontrado' });
    }

    res.status(200).json({ message: 'Detalle de compra actualizado con éxito' });
  } catch (error) {
    console.error('Error al actualizar el detalle de la compra:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Eliminar un detalle de compra
const eliminarCompraDetalle = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.pool.query(
      'DELETE FROM compra_detalles WHERE id_compra_detalle = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Detalle de compra no encontrado' });
    }

    res.status(200).json({ message: 'Detalle de compra eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar el detalle de la compra:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  getCompraDetalles,
  getCompraDetalleById,
  registrarCompraDetalle,
  actualizarCompraDetalle,
  eliminarCompraDetalle,
};
