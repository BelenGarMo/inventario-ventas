import React, { createContext, useState, useEffect, useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, CircularProgress } from '@mui/material';
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
import FormularioCliente from './pages/FormularioCliente';
import './styles/globalStyles.css';

// Context de Autenticación
export const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

// Provider de Autenticación
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Tema personalizado de Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

// Componente separado para el contenido principal
const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navigation />
      <Box component="main" sx={{ minHeight: '100vh', pt: 3, px: 3 }}>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route
            path="/perfil"
            element={
              <PageProtection>
                <Perfil />
              </PageProtection>
            }
          />
          <Route path="/productos" element={<Productos />} />
          <Route
            path="/listado-productos"
            element={
              <PageProtection allowedRoles={['admin', 'vendedor']}>
                <ListadoProductos />
              </PageProtection>
            }
          />
          <Route
            path="/formulario-producto"
            element={
              <PageProtection allowedRoles={['admin', 'vendedor']}>
                <FormularioProducto />
              </PageProtection>
            }
          />
          <Route
            path="/formulario-venta"
            element={
              <PageProtection allowedRoles={['admin', 'vendedor']}>
                <FormularioVenta />
              </PageProtection>
            }
          />
          <Route
            path="/admin"
            element={
              <PageProtection allowedRoles={['admin']}>
                <Admin />
              </PageProtection>
            }
          />
          <Route
            path="/formulario-cliente"
            element={
              <PageProtection allowedRoles={['admin', 'vendedor']}>
                <FormularioCliente />
              </PageProtection>
            }
          />
          <Route
            path="/vendedor"
            element={
              <PageProtection allowedRoles={['vendedor']}>
                <Vendedor />
              </PageProtection>
            }
          />
        </Routes>
      </Box>
    </>
  );
};

export default App;