import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Perfil = () => {
  const [usuario, setUsuario] = useState({
    nombre: '',
    email: '',
    apellido: '',
    perfil: 'cliente',
  });

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user && user.id) {
      axios.get(`http://localhost:3000/api/usuarios/${user.id}`)
        .then(response => {
          setUsuario(response.data);
        })
        .catch(error => console.error("Error fetching user:", error));
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!usuario.nombre || !usuario.email) {
      return alert('Por favor complete todos los campos.');
    }

    axios.put(`http://localhost:3000/api/usuarios/${user.id}`, usuario)
      .then(() => {
        alert('Perfil actualizado correctamente');
      })
      .catch(error => {
        console.error("Error updating user:", error);
        alert('Hubo un error al actualizar el perfil.');
      });
  };

  const handleChange = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="perfil-container">
      <h2>Perfil</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={usuario.nombre || ''}
            onChange={handleChange}
            placeholder="Ingresa tu nombre"
            required
          />
        </div>

        <div className="form-group">
          <label>Apellido</label>
          <input
            type="text"
            name="apellido"
            value={usuario.apellido || ''}
            onChange={handleChange}
            placeholder="Ingresa tu apellido"
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={usuario.email || ''}
            onChange={handleChange}
            placeholder="Ingresa tu correo electrónico"
            required
          />
        </div>

        <div className="form-group">
          <label>Perfil</label>
          <select
            name="perfil"
            value={usuario.perfil}
            onChange={handleChange}
            required
          >
            <option value="admin">Administrador</option>
            <option value="vendedor">Vendedor</option>
            <option value="cliente">Cliente</option>
          </select>
        </div>

        <button type="submit" className="btn-submit">Actualizar</button>
      </form>
    </div>
  );
};

export default Perfil;
