import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FormularioVenta = () => {
  const [venta, setVenta] = useState({
    idproducto: '',
    cantidad: '',
    idcliente: '',
  });
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/productos')
      .then(response => setProductos(response.data))
      .catch(error => console.error("Error al obtener los productos:", error));

    axios.get('http://localhost:3000/api/clientes')
      .then(response => setClientes(response.data))
      .catch(error => console.error("Error al obtener los clientes:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!venta.idproducto || !venta.cantidad || !venta.idcliente) {
      return alert('Por favor completa todos los campos.');
    }

    const productoSeleccionado = productos.find(p => p.idproducto === venta.idproducto);
    const totalVenta = productoSeleccionado.precio * venta.cantidad;

    axios.post('http://localhost:3000/api/ventas', {
      ...venta,
      total: totalVenta,
      idvendedor: JSON.parse(localStorage.getItem('user')).id,
    })
      .then(() => {
        alert('Venta registrada correctamente');
      })
      .catch(error => {
        console.error("Error al registrar la venta:", error);
        alert('Hubo un error al registrar la venta.');
      });
  };

  const handleChange = (e) => {
    setVenta({
      ...venta,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="formulario-venta-container">
      <h2>Registrar Venta</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Producto</label>
          <select
            name="idproducto"
            value={venta.idproducto}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un producto</option>
            {productos.map((producto) => (
              <option key={producto.idproducto} value={producto.idproducto}>
                {producto.nombre} - ${producto.precio}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Cantidad</label>
          <input
            type="number"
            name="cantidad"
            value={venta.cantidad}
            onChange={handleChange}
            placeholder="Cantidad vendida"
            required
          />
        </div>

        <div className="form-group">
          <label>Cliente</label>
          <select
            name="idcliente"
            value={venta.idcliente}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.idcliente} value={cliente.idcliente}>
                {cliente.nombre} {cliente.apellido}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn-submit">
          Registrar Venta
        </button>
      </form>
    </div>
  );
};

export default FormularioVenta;
