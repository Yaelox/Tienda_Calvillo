const { pool } = require("../../config/db"); // Asegúrate de usar la ruta correcta

const registrarVenta = async (req, res) => {
    const { repartidor_id, total,motivo, productos, foto_venta } = req.body; // Se espera un array de productos

    // Verificar que todos los campos necesarios están presentes
    if (!repartidor_id || !total || !foto_venta || !motivo || !productos || productos.length === 0) {
        return res.status(400).json({ error: "Todos los campos son obligatorios, incluyendo los productos" });
    }

    // Transacción para insertar la venta, los detalles y actualizar el stock
    const connection = await pool.getConnection();
    try {
        // Iniciar una transacción
        await connection.beginTransaction();

        // Registrar la venta en la tabla ventas_repartidores
        const queryVenta = "INSERT INTO ventas_repartidores (repartidor_id, total, motivo, foto_venta) VALUES (?, ?, ?,?)";
        const [ventaResult] = await connection.query(queryVenta, [repartidor_id,motivo, total, foto_venta]);

        // Obtener el id de la venta registrada
        const ventaId = ventaResult.insertId;

        // Insertar los detalles de la venta en ventas_detalles
        for (const producto of productos) {
            const { producto_id, cantidad, precio } = producto;

            console.log("Detalles del producto:", producto); // Agregar esta línea para inspeccionar los datos del producto

            // Verificar que los campos del producto sean correctos
            if (!producto_id || !cantidad || !precio) {
                throw new Error("Los detalles del producto son incompletos");
            }

            // Verificar si hay suficiente stock disponible
            const queryStock = "SELECT stock FROM productos WHERE  id_producto  = ?";
            const [stockResult] = await connection.query(queryStock, [producto_id]);

            if (stockResult.length === 0 || stockResult[0].stock < cantidad) {
                throw new Error(`No hay suficiente stock para el producto con ID ${producto_id}`);
            }

            // Restar el stock
            const nuevoStock = stockResult[0].stock - cantidad;
            const queryActualizarStock = "UPDATE productos SET stock = ? WHERE  id_producto  = ?";
            await connection.query(queryActualizarStock, [nuevoStock, producto_id]);

            // Calcular el subtotal
            const subtotal = cantidad * precio;

            // Insertar el detalle de la venta en ventas_detalles
            const queryDetalle = "INSERT INTO ventas_detalles (venta_id, producto_id, cantidad, precio, subtotal) VALUES (?, ?, ?, ?, ?)";
            await connection.query(queryDetalle, [ventaId, producto_id, cantidad, precio, subtotal]);
        }

        // Confirmar la transacción
        await connection.commit();

        // Responder con éxito
        res.json({ success: true, message: "Venta registrada con éxito" });
    } catch (error) {
        // Si hay un error, revertir la transacción
        await connection.rollback();
        console.error("Error al registrar la venta:", error);
        res.status(500).json({ error: error.message || "Error interno del servidor" });
    } finally {
        // Liberar la conexión
        connection.release();
    }
};


// Obtener todas las ventas de un repartidor
const obtenerVentasPorRepartidor = async (req, res) => {
    try {
        const { id } = req.params;  // Aquí cambiamos "repartidor_id" por "id"

        if (!id) {
            return res.status(400).json({ error: "El ID del repartidor es obligatorio" });
        }

        const query = `
            SELECT vr.*, vd.id_venta_detalle, vd.producto_id, vd.cantidad, vd.precio, vd.subtotal
            FROM ventas_repartidores vr
            LEFT JOIN ventas_detalles vd ON vr.id_venta = vd.venta_id
            WHERE vr.repartidor_id = ?
        `;
        
        const [ventas] = await pool.query(query, [id]);

        if (ventas.length === 0) {
            return res.status(404).json({ error: "No se encontraron ventas para este repartidor" });
        }

        // Ahora vamos a mapear las ventas con sus detalles
        const ventasConDetalles = [];

        ventas.forEach((venta) => {
            // Buscamos si ya hemos añadido esta venta a la lista
            let ventaExistente = ventasConDetalles.find(v => v.id_venta === venta.id_venta);

            if (!ventaExistente) {
                // Si la venta no existe en el array, la creamos
                ventaExistente = {
                    id_venta: venta.id_venta,
                    repartidor_id: venta.repartidor_id,
                    tienda_id: venta.tienda_id,
                    total: venta.total,
                    fecha_venta: venta.fecha_venta,
                    foto_venta: venta.foto_venta,
                    detalles: [] // Inicializamos la lista de detalles
                };
                ventasConDetalles.push(ventaExistente);
            }

            // Agregamos el detalle de la venta
            if (venta.id_venta_detalle) {
                ventaExistente.detalles.push({
                    id_venta_detalle: venta.id_venta_detalle,
                    producto_id: venta.producto_id,
                    cantidad: venta.cantidad,
                    precio: venta.precio,
                    subtotal: venta.subtotal
                });
            }
        });

        res.json({ success: true, ventas: ventasConDetalles });
    } catch (error) {
        console.error("Error al obtener ventas:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const actualizarVenta = async (req, res) => {
    try {
        const { id_venta } = req.params;
        const { repartidor_id, tienda_id, monto,motivo } = req.body;

        if (!id_venta || !repartidor_id || !tienda_id || !total) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        const query = "UPDATE ventas_repartidores SET repartidor_id = ?, tienda_id = ?, monto = ?,motivo=?, foto_venta = ? WHERE id_venta = ?";
        const [result] = await pool.query(query, [repartidor_id, tienda_id, monto,motivo, foto_venta, id_venta]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Venta no encontrada" });
        }

        res.json({ success: true, message: "Venta actualizada con éxito" });
    } catch (error) {
        console.error("Error al actualizar venta:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const eliminarVenta = async (req, res) => {
    try {
        const { id_venta } = req.params;

        if (!id_venta) {
            return res.status(400).json({ error: "El ID de la venta es obligatorio" });
        }

        const query = "DELETE FROM ventas_repartidores WHERE id_venta = ?";
        const [result] = await pool.query(query, [id_venta]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Venta no encontrada" });
        }

        res.json({ success: true, message: "Venta eliminada con éxito" });
    } catch (error) {
        console.error("Error al eliminar venta:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const obtenerTodasLasVentas = async (req, res) => {
    try {
        // Consulta mejorada para obtener las ventas con todos los detalles, incluyendo productos
        const query = `
           SELECT 
                vr.id_venta,
                vr.total,
                vr.fecha_venta,
                vr.foto_venta,
                repartidor.nombre AS nombre_repartidor,
                t.nombre_tienda,
                propietario.nombre AS propietario_tienda,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id_venta_detalle', vd.id_venta_detalle,
                        'producto_id', vd.producto_id,
                        'cantidad', vd.cantidad,
                        'precio', vd.precio,
                        'subtotal', vd.subtotal,
                        'nombre_producto', p.nombre,
                        'descripcion', p.descripcion
                    )
                ) AS detalles
            FROM ventas_repartidores vr
            JOIN users repartidor ON vr.repartidor_id = repartidor.id_usuario
            JOIN tiendas t ON vr.tienda_id = t.id_tienda
            JOIN users propietario ON t.id_usuario = propietario.id_usuario
            JOIN ventas_detalles vd ON vr.id_venta = vd.venta_id
            JOIN productos p ON vd.producto_id = p.id_producto
            GROUP BY vr.id_venta;
        `;
        
        // Ejecutar la consulta en la base de datos
        const [ventas] = await pool.query(query);

        // Devolver solo las ventas sin la propiedad 'success'
        res.json(ventas);
    } catch (error) {
        console.error("Error al obtener las ventas con detalles:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

module.exports = {
    registrarVenta,
    obtenerVentasPorRepartidor,
    obtenerTodasLasVentas,
    actualizarVenta,
    eliminarVenta
};
