import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CatalogoProductos = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/productos')
      .then(response => setProductos(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h2>Catálogo de Productos</h2>
      <div className="productos">
        {productos.map(producto => (
          <div key={producto.idproducto} className="producto">
            <h3>{producto.nombre}</h3>
            <p>Precio: ${producto.precio}</p>
            <p>Stock: {producto.stock}</p>
            <div className={`stock-indicator ${producto.stock < 10 ? 'bajo-stock' : 'stock-disponible'}`}>
              {producto.stock < 10 ? '¡Bajo stock!' : 'Stock disponible'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogoProductos;
