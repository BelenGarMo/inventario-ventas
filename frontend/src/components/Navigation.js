import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav>
      <ul>
        <li><Link to="/">Inicio</Link></li>
        {user && user.perfil === 'admin' && (
          <>
            <li><Link to="/productos">Listado de Productos</Link></li>
            <li><Link to="/ventas">Ventas</Link></li>
            <li><Link to="/usuarios">Usuarios</Link></li>
          </>
        )}
        {user && user.perfil === 'vendedor' && (
          <>
            <li><Link to="/productos">Listado de Productos</Link></li>
            <li><Link to="/ventas">Ventas</Link></li>
          </>
        )}
        {user && user.perfil === 'cliente' && (
          <li><Link to="/catalogo">Catálogo de Productos</Link></li>
        )}
        <li><button onClick={handleLogout}>Cerrar sesión</button></li>
      </ul>
    </nav>
  );
};

export default Navigation;
