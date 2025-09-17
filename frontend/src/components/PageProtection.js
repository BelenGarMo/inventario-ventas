import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../App';

const PageProtection = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        fontSize: '18px'
      }}>
        Verificando permisos...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.perfil)) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h2 style={{ color: '#f44336', marginBottom: '10px' }}>
          Acceso Denegado
        </h2>
        <p style={{ color: '#666', marginBottom: '10px' }}>
          No tienes permisos para acceder a esta página.
        </p>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Tu perfil actual: <strong>{user.perfil}</strong><br />
          Perfiles requeridos: <strong>{allowedRoles.join(', ')}</strong>
        </p>
        <button 
          onClick={() => window.history.back()}
          style={{
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Volver
        </button>
      </div>
    );
  }

  return children;
};

export default PageProtection;