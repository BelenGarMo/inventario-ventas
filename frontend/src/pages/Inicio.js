import React from 'react';
import { Link } from 'react-router-dom';

const Inicio = () => {
    return (
        <div id="home">
          <h1>Bienvenido a la tienda de Café Gamo</h1>
          <p>Compra los mejores productos para tu café directamente desde nuestra tienda.</p>
          <div>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/registro">Registrarse</Link>
          </div>
        </div>
      );
    };

export default Inicio;
