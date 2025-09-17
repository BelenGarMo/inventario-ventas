import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    color: 'white',
    textDecoration: 'none',
    padding: '10px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    backgroundColor: isActive(path) ? 'rgba(255,255,255,0.15)' : 'transparent',
    border: isActive(path) ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent'
  });

  const handleMouseEnter = (e) => {
    if (!isActive(e.target.getAttribute('data-path'))) {
      e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
    }
  };

  const handleMouseLeave = (e) => {
    if (!isActive(e.target.getAttribute('data-path'))) {
      e.target.style.backgroundColor = 'transparent';
    }
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: '#1976d2',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '70px'
        }}>
          {/* Logo */}
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              color: 'white',
              fontSize: '22px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'white',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1976d2',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              📦
            </div>
            Sistema de Inventario
          </Link>

          {/* Desktop Menu */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Link
              to="/"
              data-path="/"
              style={linkStyle('/')}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              INICIO
            </Link>

            <Link
              to="/productos"
              data-path="/productos"
              style={linkStyle('/productos')}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              CATÁLOGO
            </Link>

            {user && (user.perfil === 'admin' || user.perfil === 'vendedor') && (
              <>
                <Link
                  to="/listado-productos"
                  data-path="/listado-productos"
                  style={linkStyle('/listado-productos')}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  PRODUCTOS
                </Link>

                <Link
                  to="/formulario-venta"
                  data-path="/formulario-venta"
                  style={linkStyle('/formulario-venta')}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  VENTAS
                </Link>
              </>
            )}

            {user && user.perfil === 'admin' && (
              <Link
                to="/registro"
                data-path="/registro"
                style={linkStyle('/registro')}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                USUARIOS
              </Link>
            )}

            {/* User Section */}
            <div style={{
              marginLeft: '20px',
              paddingLeft: '20px',
              borderLeft: '1px solid rgba(255,255,255,0.2)'
            }}>
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '13px',
                    textAlign: 'right',
                    lineHeight: '1.3'
                  }}>
                    <div style={{ fontWeight: '600' }}>
                      {user.nombres} {user.apellido}
                    </div>
                    <div style={{ 
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.7)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {user.perfil}
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    style={{
                      background: 'linear-gradient(135deg, #f44336, #d32f2f)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                    }}
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  style={{
                    background: 'linear-gradient(135deg, #4caf50, #45a049)',
                    color: 'white',
                    textDecoration: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    display: 'inline-block'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                  }}
                >
                  INICIAR SESIÓN
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;