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
  IconButton,
  Alert
} from '@mui/material';
import { 
  Inventory,
  ShoppingCart,
  TrendingUp,
  Edit,
  Add,
  AttachMoney,
  Assessment
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Vendedor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProductos: 0,
    totalVentas: 0,
    ventasHoy: 0,
    ventasMes: 0
  });
  const [productos, setProductos] = useState([]);
  const [ventasRecientes, setVentasRecientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendedorData();
  }, []);

  const fetchVendedorData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Obtener productos
      const productosRes = await axios.get('http://localhost:5000/api/productos');
      setProductos(productosRes.data);
      setStats(prev => ({ ...prev, totalProductos: productosRes.data.length }));

      // Obtener ventas (cuando esté disponible)
      try {
        const ventasRes = await axios.get('http://localhost:5000/api/ventas', { headers });
        const ventasDelVendedor = ventasRes.data.filter(venta => venta.idvendedor === user.idusuario);
        
        const hoy = new Date().toDateString();
        const mesActual = new Date().getMonth();
        const añoActual = new Date().getFullYear();
        
        const ventasHoy = ventasDelVendedor.filter(venta => 
          new Date(venta.fecha).toDateString() === hoy
        ).length;
        
        const ventasMes = ventasDelVendedor.filter(venta => {
          const fechaVenta = new Date(venta.fecha);
          return fechaVenta.getMonth() === mesActual && fechaVenta.getFullYear() === añoActual;
        }).length;

        setStats(prev => ({ 
          ...prev, 
          totalVentas: ventasDelVendedor.length,
          ventasHoy,
          ventasMes
        }));
        
        setVentasRecientes(ventasDelVendedor.slice(-5));
      } catch (error) {
        console.log('Endpoint de ventas no disponible aún');
      }
    } catch (error) {
      console.error('Error cargando datos del vendedor:', error);
    } finally {
      setLoading(false);
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
        <Typography>Cargando panel de ventas...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Panel de Vendedor
      </Typography>
      
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Bienvenido, {user?.nombres} {user?.apellido}
      </Typography>

      {/* Alert informativo */}
      <Alert severity="info" sx={{ mb: 3 }}>
        Como vendedor, puedes gestionar productos y registrar ventas. ¡Mantén el inventario actualizado!
      </Alert>

      {/* Cards de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(45deg, #2196F3, #21CBF3)' }}>
            <CardContent sx={{ color: 'white', textAlign: 'center' }}>
              <Inventory sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.totalProductos}
              </Typography>
              <Typography variant="body2">Productos en Stock</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(45deg, #4CAF50, #8BC34A)' }}>
            <CardContent sx={{ color: 'white', textAlign: 'center' }}>
              <ShoppingCart sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.totalVentas}
              </Typography>
              <Typography variant="body2">Mis Ventas Totales</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(45deg, #FF9800, #FFB74D)' }}>
            <CardContent sx={{ color: 'white', textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.ventasHoy}
              </Typography>
              <Typography variant="body2">Ventas Hoy</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(45deg, #9C27B0, #E91E63)' }}>
            <CardContent sx={{ color: 'white', textAlign: 'center' }}>
              <AttachMoney sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.ventasMes}
              </Typography>
              <Typography variant="body2">Ventas Este Mes</Typography>
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
              startIcon={<ShoppingCart />}
              onClick={() => navigate('/formulario-venta')}
              sx={{ background: 'linear-gradient(45deg, #667eea, #764ba2)' }}
            >
              Nueva Venta
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/formulario-producto')}
              sx={{ background: 'linear-gradient(45deg, #f093fb, #f5576c)' }}
            >
              Agregar Producto
            </Button>
            <Button
              variant="outlined"
              startIcon={<Inventory />}
              onClick={() => navigate('/listado-productos')}
            >
              Gestionar Productos
            </Button>
            <Button
              variant="outlined"
              startIcon={<Assessment />}
              onClick={() => navigate('/productos')}
            >
              Ver Catálogo
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Productos con stock bajo */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Productos con Stock Bajo
              </Typography>
              <TableContainer component={Paper} elevation={0}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell><strong>Producto</strong></TableCell>
                      <TableCell><strong>Categoría</strong></TableCell>
                      <TableCell><strong>Stock</strong></TableCell>
                      <TableCell><strong>Estado</strong></TableCell>
                      <TableCell><strong>Acción</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productos
                      .filter(producto => producto.stock < 10)
                      .slice(0, 5)
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
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
                {productos.filter(p => p.stock < 10).length === 0 && (
                  <Box p={3} textAlign="center">
                    <Typography color="text.secondary">
                      Todos los productos tienen stock suficiente.
                    </Typography>
                  </Box>
                )}
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Ventas recientes */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Mis Ventas Recientes
              </Typography>
              {ventasRecientes.length > 0 ? (
                <Box>
                  {ventasRecientes.map((venta, index) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        p: 2, 
                        mb: 1, 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: 1,
                        borderLeft: '4px solid #1976d2'
                      }}
                    >
                      <Typography variant="body2" fontWeight="bold">
                        Venta #{venta.idventa}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(venta.fecha).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="primary">
                        ${venta.total?.toLocaleString('es-AR')}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box textAlign="center" py={3}>
                  <Typography color="text.secondary">
                    No hay ventas registradas aún.
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ShoppingCart />}
                    onClick={() => navigate('/formulario-venta')}
                    sx={{ mt: 1 }}
                  >
                    Registrar Primera Venta
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Vendedor;