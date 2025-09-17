import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Typography,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Fab
} from '@mui/material';
import { 
  Edit,
  Delete,
  Add,
  Search
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ListadoProductos = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    precio: '',
    stock: ''
  });

  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    let filtered = productos;
    
    if (searchTerm) {
      filtered = filtered.filter(producto =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterCategory) {
      filtered = filtered.filter(producto => producto.categoria === filterCategory);
    }
    
    setFilteredProductos(filtered);
  }, [searchTerm, filterCategory, productos]);

  const fetchProductos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/productos');
      setProductos(response.data);
      setFilteredProductos(response.data);
    } catch (error) {
      setError('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (producto) => {
    setEditingProduct(producto);
    setFormData({
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio.toString(),
      stock: producto.stock.toString()
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/productos/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Producto eliminado correctamente');
        fetchProductos();
      } catch (error) {
        setError('Error al eliminar producto');
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const data = {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock)
      };

      if (editingProduct) {
        await axios.put(`http://localhost:5000/api/productos/${editingProduct.idproducto}`, data, { headers });
        setSuccess('Producto actualizado correctamente');
      } else {
        await axios.post('http://localhost:5000/api/productos', data, { headers });
        setSuccess('Producto creado correctamente');
      }
      
      setOpenDialog(false);
      setEditingProduct(null);
      setFormData({ nombre: '', categoria: '', precio: '', stock: '' });
      fetchProductos();
    } catch (error) {
      setError('Error al guardar producto');
    }
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    setFormData({ nombre: '', categoria: '', precio: '', stock: '' });
    setOpenDialog(true);
  };

  const getStockStatus = (stock) => {
    if (stock < 5) return { label: 'Crítico', color: 'error' };
    if (stock < 10) return { label: 'Bajo', color: 'warning' };
    return { label: 'Normal', color: 'success' };
  };

  const categories = [...new Set(productos.map(p => p.categoria))];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography>Cargando productos...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Gestión de Productos
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Filtros y búsqueda */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />
          }}
          sx={{ minWidth: 300 }}
        />
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filtrar por categoría</InputLabel>
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            label="Filtrar por categoría"
          >
            <MenuItem value="">Todas</MenuItem>
            {categories.map(category => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleNewProduct}
          sx={{ background: 'linear-gradient(45deg, #667eea, #764ba2)' }}
        >
          Nuevo Producto
        </Button>
      </Box>

      {/* Tabla de productos */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Producto</strong></TableCell>
              <TableCell><strong>Categoría</strong></TableCell>
              <TableCell><strong>Precio</strong></TableCell>
              <TableCell><strong>Stock</strong></TableCell>
              <TableCell><strong>Estado</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProductos.map((producto) => {
              const stockStatus = getStockStatus(producto.stock);
              return (
                <TableRow key={producto.idproducto} hover>
                  <TableCell>{producto.idproducto}</TableCell>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {producto.nombre}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={producto.categoria} 
                      variant="outlined" 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" color="primary" fontWeight="bold">
                      ${producto.precio?.toLocaleString('es-AR')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      color={stockStatus.color === 'error' ? 'error' : 'inherit'}
                      fontWeight={stockStatus.color === 'error' ? 'bold' : 'normal'}
                    >
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
                      onClick={() => handleEdit(producto)}
                      sx={{ mr: 1 }}
                    >
                      <Edit />
                    </IconButton>
                    {user?.perfil === 'admin' && (
                      <IconButton 
                        color="error" 
                        onClick={() => handleDelete(producto.idproducto)}
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        {filteredProductos.length === 0 && (
          <Box p={4} textAlign="center">
            <Typography color="text.secondary">
              {searchTerm || filterCategory 
                ? 'No se encontraron productos con los filtros aplicados' 
                : 'No hay productos registrados'
              }
            </Typography>
          </Box>
        )}
      </TableContainer>

      {/* Dialog para crear/editar producto */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Nombre del producto"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              fullWidth
              required
            />
            
            <TextField
              label="Categoría"
              value={formData.categoria}
              onChange={(e) => setFormData({...formData, categoria: e.target.value})}
              fullWidth
              required
            />
            
            <TextField
              label="Precio"
              type="number"
              value={formData.precio}
              onChange={(e) => setFormData({...formData, precio: e.target.value})}
              fullWidth
              required
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
              }}
            />
            
            <TextField
              label="Stock"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: e.target.value})}
              fullWidth
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.nombre || !formData.categoria || !formData.precio || !formData.stock}
          >
            {editingProduct ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* FAB para agregar producto en móvil */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', md: 'none' }
        }}
        onClick={handleNewProduct}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default ListadoProductos;