import React, { useState } from 'react';
import axios from 'axios';

function Admin() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');

  const handleAgregarProducto = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/productos', {
        nombre,
        descripcion,
        precio,
        stock,
      });
      alert('Producto agregado exitosamente');
    } catch (error) {
      console.error('Error al agregar el producto', error);
      alert('Hubo un error al agregar el producto.');
    }
  };

  return (
    <div>
      <h2>Agregar Producto</h2>
      <form onSubmit={handleAgregarProducto}>
        <input
          type="text"
          placeholder="Nombre del producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Descripción del producto"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        <button type="submit">Agregar Producto</button>
      </form>
    </div>
  );
}

export default Admin;
