import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ListadoProductos = () => {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/productos')
      .then((res) => setProductos(res.data))
      .catch((err) => console.error('Error al cargar los productos.'));
  }, []);

  const handleEdit = (id) => {
    navigate(`/producto/${id}`);
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3000/api/productos/${id}`)
      .then(() => setProductos(productos.filter((producto) => producto.id !== id)))
      .catch((err) => console.error('Error al eliminar el producto.'));
  };

  return (
    <div>
      <h2>Listado de Productos</h2>
      <button onClick={() => navigate('/producto')}>Crear Producto</button>
      <ul>
        {productos.map((producto) => (
          <li key={producto.id}>
            <h3>{producto.nombre}</h3>
            <button onClick={() => handleEdit(producto.id)}>Editar</button>
            <button onClick={() => handleDelete(producto.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListadoProductos;
