import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid,
  Container,
  Chip
} from '@mui/material';
import { 
  Store, 
  ShoppingCart, 
  Inventory, 
  Login,
  PersonAdd,
  Dashboard,
  Assessment
} from '@mui/icons-material';

const Inicio = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: <Inventory sx={{ fontSize: 40 }} />,
      title: 'Gestión de Inventario',
      description: 'Control completo de productos, stock y categorías',
      color: '#2196F3'
    },
    {
      icon: <ShoppingCart sx={{ fontSize: 40 }} />,
      title: 'Sistema de Ventas',
      description: 'Registro de ventas con control automático de stock',
      color: '#4CAF50'
    },
    {
      icon: <Assessment sx={{ fontSize: 40 }} />,
      title: 'Reportes y Analytics',
      description: 'Estadísticas de ventas y productos más vendidos',
      color: '#FF9800'
    },
    {
      icon: <Dashboard sx={{ fontSize: 40 }} />,
      title: 'Panel de Control',
      description: 'Dashboard personalizado según tu rol de usuario',
      color: '#9C27B0'
    }
  ];

  const quickActions = user ? [
    ...(user.perfil === 'admin' ? [
      { label: 'Panel Admin', path: '/admin', icon: <Dashboard />, color: '#f44336' },
      { label: 'Gestionar Usuarios', path: '/registro', icon: <PersonAdd />, color: '#2196F3' }
    ] : []),
    ...(user.perfil === 'vendedor' ? [
      { label: 'Panel Vendedor', path: '/vendedor', icon: <Dashboard />, color: '#ff9800' }
    ] : []),
    { label: 'Ver Catálogo', path: '/productos', icon: <Store />, color: '#4caf50' },
    ...(user.perfil !== 'cliente' ? [
      { label: 'Nueva Venta', path: '/formulario-venta', icon: <ShoppingCart />, color: '#9c27b0' },
      { label: 'Gestionar Productos', path: '/listado-productos', icon: <Inventory />, color: '#607d8b' }
    ] : [])
  ] : [];

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh'
    }}>
      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Hero Section */}
        <Box textAlign="center" mb={6}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            Bienvenido a Café Gamo
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)',
              mb: 4,
              maxWidth: '700px',
              mx: 'auto',
              fontSize: { xs: '1.3rem', md: '1.8rem' }
            }}
          >
            {user 
              ? `Hola ${user.nombres}, tu sistema de gestión está listo`
              : 'Sistema completo de gestión de inventario y ventas'
            }
          </Typography>

          {user && (
            <Chip 
              label={`Conectado como ${user.perfil.toUpperCase()}`}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
                height: '40px',
                mb: 4
              }}
            />
          )}

          {!user && (
            <Box sx={{ 
              display: 'flex', 
              gap: 3, 
              justifyContent: 'center', 
              mb: 4,
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center'
            }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Login />}
                onClick={() => navigate('/login')}
                sx={{
                  bgcolor: 'white',
                  color: '#667eea',
                  fontWeight: 'bold',
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)'
                  }
                }}
              >
                Iniciar Sesión
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                startIcon={<PersonAdd />}
                onClick={() => navigate('/registro')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  fontWeight: 'bold',
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  borderWidth: '2px',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderWidth: '2px'
                  }
                }}
              >
                Registrarse
              </Button>
            </Box>
          )}
        </Box>

        {/* Quick Actions para usuarios logueados */}
        {user && quickActions.length > 0 && (
          <Box mb={6}>
            <Typography 
              variant="h3" 
              textAlign="center" 
              gutterBottom
              sx={{ 
                color: 'white', 
                fontWeight: 'bold', 
                mb: 4,
                fontSize: { xs: '2rem', md: '2.8rem' }
              }}
            >
              Acciones Rápidas
            </Typography>
            
            <Grid container spacing={3} justifyContent="center">
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card 
                    sx={{ 
                      height: '160px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      borderRadius: '16px',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.3)'
                      }
                    }}
                    onClick={() => navigate(action.path)}
                  >
                    <CardContent sx={{ 
                      textAlign: 'center', 
                      p: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          bgcolor: action.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 2,
                          color: 'white',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }}
                      >
                        {action.icon}
                      </Box>
                      <Typography variant="h6" fontWeight="bold" fontSize="1.1rem">
                        {action.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Features Section */}
        <Box mb={6}>
          <Typography 
            variant="h3" 
            textAlign="center" 
            gutterBottom
            sx={{ 
              color: 'white', 
              fontWeight: 'bold', 
              mb: 4,
              fontSize: { xs: '2rem', md: '2.8rem' }
            }}
          >
            Características del Sistema
          </Typography>
          
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  sx={{ 
                    height: '220px',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    borderRadius: '16px',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.3)'
                    }
                  }}
                >
                  <CardContent sx={{ 
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <Box
                      sx={{
                        width: 70,
                        height: 70,
                        borderRadius: '50%',
                        bgcolor: feature.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom fontSize="1.1rem" color="text.primary">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontSize="0.9rem">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box textAlign="center">
          <Card sx={{ 
            bgcolor: 'rgba(255,255,255,0.15)', 
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.2)',
            maxWidth: '700px',
            mx: 'auto'
          }}>
            <CardContent sx={{ p: 5 }}>
              <Typography variant="h4" gutterBottom sx={{ 
                color: 'white', 
                fontWeight: 'bold',
                fontSize: { xs: '1.8rem', md: '2.2rem' }
              }}>
                ¿Listo para comenzar?
              </Typography>
              <Typography variant="h6" sx={{ 
                color: 'rgba(255,255,255,0.9)', 
                mb: 4,
                fontSize: { xs: '1rem', md: '1.2rem' }
              }}>
                {user 
                  ? 'Explora todas las funcionalidades de tu sistema de gestión'
                  : 'Únete a Café Gamo y gestiona tu inventario de manera profesional'
                }
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<Store />}
                onClick={() => navigate('/productos')}
                sx={{
                  bgcolor: 'white',
                  color: '#667eea',
                  fontWeight: 'bold',
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  borderRadius: '12px',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                    transform: 'scale(1.05)'
                  }
                }}
              >
                Ver Catálogo de Productos
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default Inicio;