const db = require('../config/db');

exports.getVentas = (req, res) => {
    const query = `
        SELECT v.*, u.nombres as vendedor_nombres, u.apellido as vendedor_apellido,
               c.nombre as cliente_nombre, c.apellido as cliente_apellido
        FROM ventas v
        LEFT JOIN usuarios u ON v.idvendedor = u.idusuario
        LEFT JOIN clientes c ON v.idcliente = c.idcliente
        ORDER BY v.fecha DESC
    `;
    
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error obteniendo ventas:', err);
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(result);
    });
};

exports.createVenta = (req, res) => {
    const { idcliente, idvendedor, fecha, total, productos } = req.body;
    
    // Iniciar transacción
    db.beginTransaction((err) => {
        if (err) {
            console.error('Error iniciando transacción:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        // Insertar la venta principal
        const ventaQuery = 'INSERT INTO ventas (idcliente, idvendedor, fecha, total) VALUES (?, ?, ?, ?)';
        db.query(ventaQuery, [idcliente, idvendedor, fecha, total], (err, ventaResult) => {
            if (err) {
                return db.rollback(() => {
                    console.error('Error creando venta:', err);
                    res.status(500).json({ error: err.message });
                });
            }

            const idventa = ventaResult.insertId;
            let completedQueries = 0;
            const totalQueries = productos.length;

            // Insertar detalles de venta y actualizar stock
            productos.forEach((producto) => {
                // Insertar detalle de venta
                const detalleQuery = `
                    INSERT INTO detalle_ventas (idventa, idproducto, cantidad, precio_unitario) 
                    VALUES (?, ?, ?, ?)
                `;
                
                db.query(detalleQuery, [idventa, producto.idproducto, producto.cantidad, producto.precio_unitario], (err) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error('Error creando detalle de venta:', err);
                            res.status(500).json({ error: err.message });
                        });
                    }

                    // Actualizar stock del producto
                    const updateStockQuery = 'UPDATE productos SET stock = stock - ? WHERE idproducto = ?';
                    db.query(updateStockQuery, [producto.cantidad, producto.idproducto], (err) => {
                        if (err) {
                            return db.rollback(() => {
                                console.error('Error actualizando stock:', err);
                                res.status(500).json({ error: err.message });
                            });
                        }

                        completedQueries++;
                        if (completedQueries === totalQueries) {
                            // Confirmar transacción
                            db.commit((err) => {
                                if (err) {
                                    return db.rollback(() => {
                                        console.error('Error confirmando transacción:', err);
                                        res.status(500).json({ error: err.message });
                                    });
                                }
                                res.status(201).json({ 
                                    success: true,
                                    message: 'Venta registrada correctamente',
                                    idventa: idventa
                                });
                            });
                        }
                    });
                });
            });
        });
    });
};

exports.getVentasByVendedor = (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT v.*, c.nombre as cliente_nombre, c.apellido as cliente_apellido
        FROM ventas v
        LEFT JOIN clientes c ON v.idcliente = c.idcliente
        WHERE v.idvendedor = ?
        ORDER BY v.fecha DESC
    `;
    
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error obteniendo ventas del vendedor:', err);
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(result);
    });
};