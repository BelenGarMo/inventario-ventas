import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/forms.css';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/usuario/login`, { email, password });
      const { token, perfil } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('perfil', perfil);

      if (perfil === 'admin') {
        navigate('/admin');
      } else if (perfil === 'vendedor') {
        navigate('/vendedor');
      } else {
        navigate('/productos');
      }
    } catch (error) {
      console.error('Error al iniciar sesión', error);
      alert('Hubo un error al iniciar sesión. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleLogin}>
        <h2>Iniciar Sesión</h2>

        <div className="input-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            placeholder="Ingrese su correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder="Ingrese su contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="form-button">Iniciar Sesión</button>

        <div className="form-footer">
          <p className="forgot-password">¿Olvidaste tu contraseña? <a href="/recuperar">Recuperarla</a></p>
          <p>No tienes cuenta? <a href="/registro">Regístrate aquí</a></p>
        </div>
      </form>
    </div>
  );
}

export default Login;
