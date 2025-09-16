import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Perfil from './pages/Perfil';
import Inicio from './pages/Inicio';
import PageProtection from './components/PageProtection';
import ListadoProductos from './pages/ListadoProductos';
import FormularioProducto from './pages/FormularioProducto';
import FormularioVenta from './pages/FormularioVenta';
import Productos from './pages/Productos';
import Admin from './pages/Admin';
import Vendedor from './pages/Vendedor';
import './styles/globalStyles.css';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
    }
  }, []);

  return (
    <>
      <Navigation user={user} />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/perfil" element={<PageProtection user={user}><Perfil user={user} /></PageProtection>} />
        <Route path="/listado-productos" element={<ListadoProductos />} />
        <Route path="/formulario-producto" element={<FormularioProducto />} />
        <Route path="/formulario-venta" element={<FormularioVenta />} />
        <Route path="/login" element={<Login />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/vendedor" element={<Vendedor />} />
      </Routes>
    </>
  );
}

export default App;
