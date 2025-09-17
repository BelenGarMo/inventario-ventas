import React from 'react';
import { useAuth } from '../App';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  Grid,
  Avatar
} from '@mui/material';
import { 
  Person,
  Email,
  Badge,
  CalendarToday
} from '@mui/icons-material';

const Perfil = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography>No hay información de usuario disponible</Typography>
      </Box>
    );
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#f44336';
      case 'vendedor': return '#2196f3';
      case 'cliente': return '#4caf50';
      default: return '#757575';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'vendedor': return 'Vendedor';
      case 'cliente': return 'Cliente';
      default: return role;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '90vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4,
      px: 2
    }}>
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Typography 
          variant="h4" 
          component="h1" 
          textAlign="center" 
          gutterBottom
          sx={{ color: 'white', fontWeight: 'bold', mb: 4 }}
        >
          Mi Perfil
        </Typography>

        <Card sx={{ borderRadius: '20px', overflow: 'hidden' }}>
          <Box sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            p: 4,
            textAlign: 'center'
          }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mx: 'auto',
                mb: 2,
                bgcolor: 'white',
                color: '#667eea',
                fontSize: '3rem',
                fontWeight: 'bold'
              }}
            >
              {user.nombres?.charAt(0)}{user.apellido?.charAt(0)}
            </Avatar>
            
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
              {user.nombres} {user.apellido}
            </Typography>
            
            <Chip
              label={getRoleLabel(user.perfil)}
              sx={{
                bgcolor: getRoleColor(user.perfil),
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
                height: '32px'
              }}
            />
          </Box>

          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Person sx={{ color: '#667eea', mr: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Nombres
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {user.nombres || 'No especificado'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Person sx={{ color: '#667eea', mr: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Apellido
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {user.apellido || 'No especificado'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Email sx={{ color: '#667eea', mr: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {user.email}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Badge sx={{ color: '#667eea', mr: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      ID de Usuario
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      #{user.idusuario}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarToday sx={{ color: '#667eea', mr: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Permisos del Rol
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {user.perfil === 'admin' && (
                        <>
                          <Chip label="Gestión completa de usuarios" variant="outlined" sx={{ mr: 1, mb: 1 }} />
                          <Chip label="Gestión de productos" variant="outlined" sx={{ mr: 1, mb: 1 }} />
                          <Chip label="Registro de ventas" variant="outlined" sx={{ mr: 1, mb: 1 }} />
                          <Chip label="Reportes y estadísticas" variant="outlined" sx={{ mr: 1, mb: 1 }} />
                        </>
                      )}
                      {user.perfil === 'vendedor' && (
                        <>
                          <Chip label="Gestión de productos" variant="outlined" sx={{ mr: 1, mb: 1 }} />
                          <Chip label="Registro de ventas" variant="outlined" sx={{ mr: 1, mb: 1 }} />
                          <Chip label="Ver reportes de ventas" variant="outlined" sx={{ mr: 1, mb: 1 }} />
                        </>
                      )}
                      {user.perfil === 'cliente' && (
                        <>
                          <Chip label="Ver catálogo de productos" variant="outlined" sx={{ mr: 1, mb: 1 }} />
                          <Chip label="Realizar compras" variant="outlined" sx={{ mr: 1, mb: 1 }} />
                        </>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Perfil;