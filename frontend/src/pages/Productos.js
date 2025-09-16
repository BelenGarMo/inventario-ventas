import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Productos() {
  const [productos, setProductos] = useState([]);

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

  return (
    <div>
      <h2>Catálogo de Productos</h2>
      <div>
        {productos.map((producto) => {
          const stockStyle = producto.stock < 10 ? { backgroundColor: 'red' } : { backgroundColor: 'green' };
          return (
            <div key={producto.id} style={stockStyle}>
              <h3>{producto.nombre}</h3>
              <p>{producto.descripcion}</p>
              <p>Precio: ${producto.precio}</p>
              <p>Stock: {producto.stock}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Productos;
