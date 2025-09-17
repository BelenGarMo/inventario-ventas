import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Divider
} from '@mui/material';
import { Save, ArrowBack, Add, Remove, Delete, PersonAdd } from '@mui/icons-material';
import axios from 'axios';

const FormularioVenta = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [ventaData, setVentaData] = useState({
    idcliente: '',
    fecha: new Date().toISOString().split('T')[0]
  });
  const [productosVenta, setProductosVenta] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProductos();
    fetchClientes();
  }, []);

  // Recargar clientes cuando se vuelve de crear uno nuevo
  useEffect(() => {
    const handleFocus = () => {
      fetchClientes();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/productos');
      setProductos(response.data.filter(p => p.stock > 0));
    } catch (error) {
      setError('Error al cargar productos');
    }
  };

  const fetchClientes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/clientes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClientes(response.data);
    } catch (error) {
      console.log('Error cargando clientes:', error);
      setError('Error al cargar clientes');
    }
  };

  const agregarProducto = () => {
    if (!productoSeleccionado || cantidadSeleccionada <= 0) {
      setError('Selecciona un producto y cantidad válida');
      return;
    }

    const producto = productos.find(p => p.idproducto === parseInt(productoSeleccionado));
    
    if (cantidadSeleccionada > producto.stock) {
      setError(`Stock insuficiente. Disponible: ${producto.stock}`);
      return;
    }

    // Verificar si el producto ya está en la venta
    const existeIndex = productosVenta.findIndex(pv => pv.idproducto === producto.idproducto);
    
    if (existeIndex >= 0) {
      const nuevaCantidad = productosVenta[existeIndex].cantidad + cantidadSeleccionada;
      if (nuevaCantidad > producto.stock) {
        setError(`Stock insuficiente. Disponible: ${producto.stock}`);
        return;
      }
      
      const nuevosProductos = [...productosVenta];
      nuevosProductos[existeIndex].cantidad = nuevaCantidad;
      nuevosProductos[existeIndex].subtotal = nuevaCantidad * producto.precio;
      setProductosVenta(nuevosProductos);
    } else {
      const nuevoProducto = {
        idproducto: producto.idproducto,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: cantidadSeleccionada,
        subtotal: producto.precio * cantidadSeleccionada,
        stockDisponible: producto.stock
      };
      setProductosVenta([...productosVenta, nuevoProducto]);
    }

    setProductoSeleccionado('');
    setCantidadSeleccionada(1);
    setError('');
    setSuccess('Producto agregado correctamente');
    setTimeout(() => setSuccess(''), 3000);
  };

  const eliminarProducto = (index) => {
    setProductosVenta(productosVenta.filter((_, i) => i !== index));
    setSuccess('Producto eliminado de la venta');
    setTimeout(() => setSuccess(''), 3000);
  };

  const modificarCantidad = (index, nuevaCantidad) => {
    if (nuevaCantidad <= 0) return;
    
    const producto = productosVenta[index];
    if (nuevaCantidad > producto.stockDisponible) {
      setError(`Stock insuficiente. Disponible: ${producto.stockDisponible}`);
      return;
    }

    const nuevosProductos = [...productosVenta];
    nuevosProductos[index].cantidad = nuevaCantidad;
    nuevosProductos[index].subtotal = nuevaCantidad * producto.precio;
    setProductosVenta(nuevosProductos);
    setError('');
  };

  const calcularTotal = () => {
    return productosVenta.reduce((total, producto) => total + producto.subtotal, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!ventaData.idcliente) {
      setError('Selecciona un cliente');
      return;
    }

    if (productosVenta.length === 0) {
      setError('Agrega al menos un producto a la venta');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const ventaCompleta = {
        idcliente: parseInt(ventaData.idcliente),
        idvendedor: user.idusuario,
        fecha: ventaData.fecha,
        total: calcularTotal(),
        productos: productosVenta.map(p => ({
          idproducto: p.idproducto,
          cantidad: p.cantidad,
          precio_unitario: p.precio
        }))
      };

      console.log('Enviando venta:', ventaCompleta);
      const response = await axios.post('http://localhost:5000/api/ventas', ventaCompleta, { headers });
      
      if (response.data.success) {
        setSuccess('Venta registrada correctamente');
        setTimeout(() => {
          navigate('/vendedor');
        }, 2000);
      }
    } catch (error) {
      console.error('Error al registrar venta:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Error al registrar la venta. Verifica la conexión.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mr: 2 }}
          disabled={loading}
        >
          Volver
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Nueva Venta
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Información de la Venta
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
            <FormControl sx={{ minWidth: 300 }}>
              <InputLabel>Cliente</InputLabel>
              <Select
                value={ventaData.idcliente}
                onChange={(e) => setVentaData({...ventaData, idcliente: e.target.value})}
                label="Cliente"
                disabled={loading}
              >
                {clientes.map((cliente) => (
                  <MenuItem key={cliente.idcliente} value={cliente.idcliente}>
                    {cliente.nombre} {cliente.apellido} - {cliente.email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              startIcon={<PersonAdd />}
              onClick={() => navigate('/formulario-cliente')}
              disabled={loading}
              sx={{ height: 'fit-content' }}
            >
              Nuevo Cliente
            </Button>

            <TextField
              label="Fecha"
              type="date"
              value={ventaData.fecha}
              onChange={(e) => setVentaData({...ventaData, fecha: e.target.value})}
              InputLabelProps={{ shrink: true }}
              disabled={loading}
            />

            <TextField
              label="Vendedor"
              value={`${user?.nombres} ${user?.apellido}`}
              disabled
              sx={{ minWidth: 200 }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Agregar Productos
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
            <FormControl sx={{ minWidth: 350 }}>
              <InputLabel>Producto</InputLabel>
              <Select
                value={productoSeleccionado}
                onChange={(e) => setProductoSeleccionado(e.target.value)}
                label="Producto"
                disabled={loading}
              >
                {productos.map((producto) => (
                  <MenuItem key={producto.idproducto} value={producto.idproducto}>
                    {producto.nombre} - ${producto.precio?.toLocaleString('es-AR')} (Stock: {producto.stock})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Cantidad"
              type="number"
              value={cantidadSeleccionada}
              onChange={(e) => setCantidadSeleccionada(parseInt(e.target.value) || 1)}
              inputProps={{ min: 1 }}
              sx={{ width: 120 }}
              disabled={loading}
            />

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={agregarProducto}
              disabled={loading || !productoSeleccionado}
              sx={{ height: 'fit-content' }}
            >
              Agregar
            </Button>
          </Box>

          {productos.length === 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              No hay productos con stock disponible
            </Alert>
          )}
        </CardContent>
      </Card>

      {productosVenta.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Productos en la Venta ({productosVenta.length} productos)
            </Typography>
            
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>Producto</strong></TableCell>
                    <TableCell><strong>Precio Unit.</strong></TableCell>
                    <TableCell><strong>Cantidad</strong></TableCell>
                    <TableCell><strong>Subtotal</strong></TableCell>
                    <TableCell><strong>Acciones</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productosVenta.map((producto, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {producto.nombre}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Stock disponible: {producto.stockDisponible}
                        </Typography>
                      </TableCell>
                      <TableCell>${producto.precio.toLocaleString('es-AR')}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton 
                            size="small" 
                            onClick={() => modificarCantidad(index, producto.cantidad - 1)}
                            disabled={loading || producto.cantidad <= 1}
                          >
                            <Remove />
                          </IconButton>
                          <Typography sx={{ minWidth: 30, textAlign: 'center', fontWeight: 'bold' }}>
                            {producto.cantidad}
                          </Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => modificarCantidad(index, producto.cantidad + 1)}
                            disabled={loading}
                          >
                            <Add />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight="bold" color="primary">
                          ${producto.subtotal.toLocaleString('es-AR')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          color="error" 
                          onClick={() => eliminarProducto(index)}
                          disabled={loading}
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Typography variant="h6" textAlign="right">
                        <strong>Total General:</strong>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h5" fontWeight="bold" color="primary">
                        ${calcularTotal().toLocaleString('es-AR')}
                      </Typography>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      <Box display="flex" justifyContent="center" gap={2}>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate(-1)}
          disabled={loading}
          sx={{ px: 4, py: 1.5 }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          size="large"
          startIcon={<Save />}
          onClick={handleSubmit}
          disabled={loading || productosVenta.length === 0 || !ventaData.idcliente}
          sx={{ 
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            px: 4,
            py: 1.5
          }}
        >
          {loading ? 'Registrando Venta...' : `Registrar Venta - $${calcularTotal().toLocaleString('es-AR')}`}
        </Button>
      </Box>
    </Box>
  );
};

export default FormularioVenta;