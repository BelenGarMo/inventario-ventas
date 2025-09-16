import axios from 'axios';
import React, { useState, useEffect } from 'react';

function Vendedor() {
  const [productos, setProductos] = useState([]);
  const [nuevoStock, setNuevoStock] = useState('');

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/productos');
        setProductos(response.data);
      } catch (error) {
        console.error('Error al obtener productos', error);
      }
    };

    fetchProductos();
  }, []);

  const handleActualizarStock = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/productos/${id}`, {
        stock: nuevoStock,
      });
      alert('Stock actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar stock', error);
      alert('Hubo un error al actualizar el stock.');
    }
  };

  return (
    <div>
      <h2>Modificar Stock de Productos</h2>
      <div>
        {productos.map((producto) => (
          <div key={producto.id}>
            <h3>{producto.nombre}</h3>
            <p>Stock actual: {producto.stock}</p>
            <input
              type="number"
              placeholder="Nuevo Stock"
              value={nuevoStock}
              onChange={(e) => setNuevoStock(e.target.value)}
            />
            <button onClick={() => handleActualizarStock(producto.id)}>Actualizar Stock</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Vendedor;
