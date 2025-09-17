import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        console.log('Intentando conectar con:', 'http://localhost:5000/api/productos');
        const response = await axios.get('http://localhost:5000/api/productos');
        console.log('Respuesta del servidor:', response.data);
        setProductos(response.data);
      } catch (error) {
        console.error('Error detallado:', error);
        if (error.code === 'ERR_NETWORK') {
          setError('No se pudo conectar con el servidor. Verifica que el backend esté funcionando en puerto 5000.');
        } else {
          setError(`Error al cargar productos: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const filteredProductos = productos.filter(producto =>
    producto.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        textAlign: 'center'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #1976d2',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '20px', fontSize: '18px', color: '#666' }}>
          Cargando productos...
        </p>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: '#ffebee',
          border: '1px solid #f44336',
          borderRadius: '8px',
          padding: '20px',
          maxWidth: '500px',
          width: '100%'
        }}>
          <h3 style={{ color: '#f44336', margin: '0 0 10px 0' }}>
            Error de Conexión
          </h3>
          <p style={{ color: '#666', margin: '0 0 15px 0' }}>
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 10px 0'
          }}>
            Catálogo de Productos
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#666',
            margin: '0'
          }}>
            Descubrí nuestra selección de productos premium
          </p>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '40px'
        }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
            <input
              type="text"
              placeholder="Buscar productos por nombre o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '15px 20px',
                border: '2px solid #e0e0e0',
                borderRadius: '50px',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e0e0e0';
                e.target.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
              }}
            />
            <div style={{
              position: 'absolute',
              right: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#666',
              fontSize: '20px'
            }}>
              🔍
            </div>
          </div>
        </div>

        {filteredProductos.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '15px',
            border: '2px dashed #dee2e6'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📦</div>
            <h3 style={{ color: '#666', marginBottom: '10px' }}>
              {searchTerm ? 'No se encontraron productos' : 'No hay productos disponibles'}
            </h3>
            <p style={{ color: '#999', margin: '0' }}>
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda' 
                : 'Pronto tendremos productos increíbles para vos'
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  marginTop: '15px',
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Ver todos los productos
              </button>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {filteredProductos.map((producto) => {
              const isLowStock = producto.stock < 10;
              return (
                <div
                  key={producto.idproducto}
                  style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '30px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    border: '1px solid #f0f0f0',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    padding: '8px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: 'white',
                    backgroundColor: isLowStock ? '#ff4757' : '#2ed573'
                  }}>
                    {isLowStock ? '⚠️ Bajo Stock' : '✅ Disponible'}
                  </div>

                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    color: 'white',
                    marginBottom: '20px'
                  }}>
                    📦
                  </div>

                  <h3 style={{
                    fontSize: '1.4rem',
                    fontWeight: 'bold',
                    color: '#333',
                    margin: '0 0 10px 0',
                    lineHeight: '1.3'
                  }}>
                    {producto.nombre}
                  </h3>

                  <p style={{
                    color: '#666',
                    fontSize: '14px',
                    margin: '0 0 15px 0',
                    padding: '8px 12px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '20px',
                    display: 'inline-block'
                  }}>
                    📂 {producto.categoria}
                  </p>

                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    margin: '20px 0'
                  }}>
                    ${producto.precio?.toLocaleString('es-AR')}
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '25px',
                    padding: '10px',
                    backgroundColor: isLowStock ? '#ffebee' : '#e8f5e8',
                    borderRadius: '10px'
                  }}>
                    <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>
                      📊
                    </span>
                    <span style={{
                      color: isLowStock ? '#f44336' : '#4caf50',
                      fontWeight: 'bold'
                    }}>
                      Stock: {producto.stock} unidades
                    </span>
                  </div>

                  <button
                    disabled={producto.stock < 1}
                    style={{
                      width: '100%',
                      padding: '15px',
                      border: 'none',
                      borderRadius: '50px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: producto.stock < 1 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      background: producto.stock < 1 
                        ? '#ccc' 
                        : 'linear-gradient(45deg, #667eea, #764ba2)',
                      color: 'white',
                      boxShadow: producto.stock < 1 
                        ? 'none' 
                        : '0 4px 15px rgba(102, 126, 234, 0.4)'
                    }}
                    onMouseEnter={(e) => {
                      if (producto.stock >= 1) {
                        e.target.style.transform = 'scale(1.05)';
                        e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (producto.stock >= 1) {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                      }
                    }}
                  >
                    {producto.stock < 1 ? '❌ Sin Stock' : '🛒 Ver Detalles'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Productos;