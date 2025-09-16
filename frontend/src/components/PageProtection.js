import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PageProtection = ({ allowedRoles, children }) => {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userPerfil = localStorage.getItem('perfil');

    if (!token) {
      navigate('/login');
    } else {
      setPerfil(userPerfil);
    }
  }, [navigate]);

  if (!perfil) return null;

  if (allowedRoles && !allowedRoles.includes(perfil)) {
    return <div>No tenes permiso para acceder a esta página.</div>;
  }

  return children;
};

export default PageProtection;
