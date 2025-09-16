const db = require('../config/db');

const getVentas = async (req, res) => {
    try {
      const ventas = [
        { id: 1, producto: 'Café en grano', cantidad: 5, total: 100 },
        { id: 2, producto: 'Cafetera', cantidad: 2, total: 500 }
      ];
  
      res.status(200).json(ventas);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener las ventas', error: error.message });
    }
  };
  
  const crearVenta = async (req, res) => {
    try {
      const { producto, cantidad, precio } = req.body;
  
      // Validar los datos
      if (!producto || !cantidad || !precio) {
        return res.status(400).json({ message: 'Todos los campos son necesarios' });
      }
  
      // Calcular el total de la venta
      const total = cantidad * precio;
      const nuevaVenta = { producto, cantidad, precio, total };
  
      res.status(201).json({ message: 'Venta creada con éxito', venta: nuevaVenta });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la venta', error: error.message });
    }
  };
  
  // Actualizar una venta
  const actualizarVenta = async (req, res) => {
    try {
      const { id } = req.params;
      const { producto, cantidad, precio } = req.body;
  
      // Validar que los datos son correctos
      if (!producto || !cantidad || !precio) {
        return res.status(400).json({ message: 'Todos los campos son necesarios' });
      }
  
      const total = cantidad * precio;
      const ventaActualizada = { id, producto, cantidad, precio, total };
  
      res.status(200).json({ message: 'Venta actualizada con éxito', venta: ventaActualizada });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar la venta', error: error.message });
    }
  };
  
  const eliminarVenta = async (req, res) => {
    try {
      const { id } = req.params; 
      res.status(200).json({ message: `Venta con ID ${id} eliminada con éxito` });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar la venta', error: error.message });
    }
  };
  
  module.exports = { getVentas, crearVenta, actualizarVenta, eliminarVenta };