import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton
} from '@mui/material';
import { 
  Dashboard,
  Inventory,
  People,
  ShoppingCart,
  TrendingUp,
  Edit,
  Delete,
  Add
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProductos: 0,
    totalUsuarios: 0,
    totalVentas: 0,
    ventasHoy: 0
  });
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Obtener productos
      const productosRes = await axios.get('http://localhost:5000/api/productos');
      setProductos(productosRes.data);
      setStats(prev => ({ ...prev, totalProductos: productosRes.data.length }));

      // Obtener usuarios (necesitarás crear este endpoint)
      try {
        const usuariosRes = await axios.get('http://localhost:5000/api/usuario/todos', { headers });
        setUsuarios(usuariosRes.data);
        setStats(prev => ({ ...prev, totalUsuarios: usuariosRes.data.length }));
      } catch (error) {
        console.log('Endpoint de usuarios no disponible aún');
      }

      // Obtener ventas (necesitarás crear este endpoint)
      try {
        const ventasRes = await axios.get('http://localhost:5000/api/ventas', { headers });
        setStats(prev => ({ 
          ...prev, 
          totalVentas: ventasRes.data.length,
          ventasHoy: ventasRes.data.filter(venta => 
            new Date(venta.fecha).toDateString() === new Date().toDateString()
          ).length
        }));
      } catch (error) {
        console.log('Endpoint de ventas no disponible aún');
      }
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/productos/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchDashboardData();
      } catch (error) {
        alert('Error al eliminar producto');
      }
    }
  };

  const getStockStatus = (stock) => {
    if (stock < 5) return { label: 'Crítico', color: 'error' };
    if (stock < 10) return { label: 'Bajo', color: 'warning' };
    return { label: 'Normal', color: 'success' };
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography>Cargando panel de administración...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Panel de Administración
      </Typography>
      
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Bienvenido, {user?.nombres} {user?.apellido}
      </Typography>

      {/* Cards de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(45deg, #2196F3, #21CBF3)' }}>
            <CardContent sx={{ color: 'white', textAlign: 'center' }}>
              <Inventory sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.totalProductos}
              </Typography>
              <Typography variant="body2">Total Productos</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(45deg, #4CAF50, #8BC34A)' }}>
            <CardContent sx={{ color: 'white', textAlign: 'center' }}>
              <People sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.totalUsuarios}
              </Typography>
              <Typography variant="body2">Total Usuarios</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(45deg, #FF9800, #FFB74D)' }}>
            <CardContent sx={{ color: 'white', textAlign: 'center' }}>
              <ShoppingCart sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.totalVentas}
              </Typography>
              <Typography variant="body2">Total Ventas</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(45deg, #9C27B0, #E91E63)' }}>
            <CardContent sx={{ color: 'white', textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.ventasHoy}
              </Typography>
              <Typography variant="body2">Ventas Hoy</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Acciones rápidas */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Acciones Rápidas
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/formulario-producto')}
              sx={{ background: 'linear-gradient(45deg, #667eea, #764ba2)' }}
            >
              Nuevo Producto
            </Button>
            <Button
              variant="contained"
              startIcon={<People />}
              onClick={() => navigate('/registro')}
              sx={{ background: 'linear-gradient(45deg, #f093fb, #f5576c)' }}
            >
              Nuevo Usuario
            </Button>
            <Button
              variant="contained"
              startIcon={<ShoppingCart />}
              onClick={() => navigate('/formulario-venta')}
              sx={{ background: 'linear-gradient(45deg, #4facfe, #00f2fe)' }}
            >
              Nueva Venta
            </Button>
            <Button
              variant="outlined"
              startIcon={<Inventory />}
              onClick={() => navigate('/listado-productos')}
            >
              Ver Todos los Productos
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Tabla de productos con stock bajo */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Productos con Stock Bajo (menos de 10 unidades)
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell><strong>Producto</strong></TableCell>
                  <TableCell><strong>Categoría</strong></TableCell>
                  <TableCell><strong>Stock</strong></TableCell>
                  <TableCell><strong>Precio</strong></TableCell>
                  <TableCell><strong>Estado</strong></TableCell>
                  <TableCell><strong>Acciones</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productos
                  .filter(producto => producto.stock < 10)
                  .map((producto) => {
                    const stockStatus = getStockStatus(producto.stock);
                    return (
                      <TableRow key={producto.idproducto}>
                        <TableCell>{producto.nombre}</TableCell>
                        <TableCell>{producto.categoria}</TableCell>
                        <TableCell>
                          <Typography color={stockStatus.color === 'error' ? 'error' : 'inherit'}>
                            {producto.stock}
                          </Typography>
                        </TableCell>
                        <TableCell>${producto.precio?.toLocaleString('es-AR')}</TableCell>
                        <TableCell>
                          <Chip 
                            label={stockStatus.label} 
                            color={stockStatus.color} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            color="primary" 
                            size="small"
                            onClick={() => navigate(`/formulario-producto?id=${producto.idproducto}`)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            size="small"
                            onClick={() => handleDeleteProduct(producto.idproducto)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
            {productos.filter(p => p.stock < 10).length === 0 && (
              <Box p={3} textAlign="center">
                <Typography color="text.secondary">
                  ¡Excelente! Todos los productos tienen stock suficiente.
                </Typography>
              </Box>
            )}
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Admin;