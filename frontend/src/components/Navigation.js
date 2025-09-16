import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App'; // Importar el hook

const Navigation = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Usar el contexto en lugar de localStorage

  const handleLogout = () => {
    logout(); // Usar la función del contexto
    navigate('/login');
  };

  return (
    <nav style={{ 
      padding: '15px', 
      backgroundColor: '#1976d2', 
      marginBottom: '20px',
      color: 'white'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{ margin: 0, color: 'white' }}>Sistema de Inventario</h2>
        
        <ul style={{ 
          listStyle: 'none', 
          display: 'flex', 
          gap: '20px', 
          margin: 0, 
          padding: 0,
          alignItems: 'center'
        }}>
          <li><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Inicio</Link></li>
          {user && user.perfil === 'admin' && (
            <>
              <li><Link to="/productos" style={{ color: 'white', textDecoration: 'none' }}>Catálogo</Link></li>
              <li><Link to="/listado-productos" style={{ color: 'white', textDecoration: 'none' }}>Gestionar Productos</Link></li>
              <li><Link to="/formulario-venta" style={{ color: 'white', textDecoration: 'none' }}>Ventas</Link></li>
              <li><Link to="/registro" style={{ color: 'white', textDecoration: 'none' }}>Usuarios</Link></li>
            </>
          )}
          {user && user.perfil === 'vendedor' && (
            <>
              <li><Link to="/productos" style={{ color: 'white', textDecoration: 'none' }}>Catálogo</Link></li>
              <li><Link to="/listado-productos" style={{ color: 'white', textDecoration: 'none' }}>Gestionar Productos</Link></li>
              <li><Link to="/formulario-venta" style={{ color: 'white', textDecoration: 'none' }}>Ventas</Link></li>
            </>
          )}
          {user && user.perfil === 'cliente' && (
            <li><Link to="/productos" style={{ color: 'white', textDecoration: 'none' }}>Catálogo</Link></li>
          )}
          {user ? (
            <li>
              <button 
                onClick={handleLogout}
                style={{ 
                  background: '#f44336', 
                  color: 'white', 
                  border: 'none', 
                  padding: '8px 16px', 
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cerrar sesión ({user.perfil})
              </button>
            </li>
          ) : (
            <li><Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Iniciar sesión</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;