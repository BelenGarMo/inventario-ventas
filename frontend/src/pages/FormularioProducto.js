import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FormularioProducto = ({ productId }) => {
  const [producto, setProducto] = useState({
    nombre: '',
    categoria: '',
    precio: '',
    stock: '',
  });

  useEffect(() => {
    if (productId) {
      axios.get(`http://localhost:3000/api/productos/${productId}`)
        .then(response => setProducto(response.data))
        .catch(error => console.error("Error al obtener el producto:", error));
    }
  }, [productId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!producto.nombre || !producto.precio || !producto.stock) {
      return alert('Por favor, completa todos los campos.');
    }

    const apiCall = productId
      ? axios.put(`http://localhost:3000/api/productos/${productId}`, producto)
      : axios.post('http://localhost:3000/api/productos', producto);

    apiCall
      .then(() => alert('Producto guardado correctamente'))
      .catch(error => {
        console.error("Error al guardar el producto:", error);
        alert('Hubo un error al guardar el producto.');
      });
  };

  const handleChange = (e) => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="formulario-producto-container">
      <h2>{productId ? 'Editar Producto' : 'Agregar Producto'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={producto.nombre}
            onChange={handleChange}
            placeholder="Nombre del producto"
            required
          />
        </div>

        <div className="form-group">
          <label>Categoría</label>
          <input
            type="text"
            name="categoria"
            value={producto.categoria}
            onChange={handleChange}
            placeholder="Categoría del producto"
            required
          />
        </div>

        <div className="form-group">
          <label>Precio</label>
          <input
            type="number"
            name="precio"
            value={producto.precio}
            onChange={handleChange}
            placeholder="Precio del producto"
            required
          />
        </div>

        <div className="form-group">
          <label>Stock</label>
          <input
            type="number"
            name="stock"
            value={producto.stock}
            onChange={handleChange}
            placeholder="Cantidad en stock"
            required
          />
        </div>

        <button type="submit" className="btn-submit">
          {productId ? 'Actualizar Producto' : 'Agregar Producto'}
        </button>
      </form>
    </div>
  );
};

export default FormularioProducto;
