import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, TextField, Button, Typography, Box, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';

const Registro = () => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellido: '',
    email: '',
    clave: '',
    perfil: 'cliente',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const validateForm = () => {
    if (!formData.nombres.trim()) {
      setError('El nombre es obligatorio');
      return false;
    }
    if (!formData.apellido.trim()) {
      setError('El apellido es obligatorio');
      return false;
    }
    if (!formData.email.trim()) {
      setError('El email es obligatorio');
      return false;
    }
    if (formData.clave.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/usuario/registro', formData);

      if (response.data.success) {
        setSuccess('Usuario registrado exitosamente. Redirigiendo al login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Error en registro:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.code === 'ERR_NETWORK') {
        setError('Error de conexión. Verifica que el servidor esté funcionando.');
      } else {
        setError('Hubo un error al registrar el usuario. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="90vh"
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px'
      }}
    >
      <Card sx={{ 
        maxWidth: 500, 
        width: '100%', 
        mx: 2,
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            textAlign="center"
            sx={{
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
              mb: 3
            }}
          >
            Crear Cuenta
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary" 
            textAlign="center" 
            sx={{ mb: 3 }}
          >
            Unite a nuestro sistema de inventario
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nombres"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              margin="normal"
              required
              autoComplete="given-name"
              disabled={loading}
            />
            
            <TextField
              fullWidth
              label="Apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              margin="normal"
              required
              autoComplete="family-name"
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              autoComplete="email"
              disabled={loading}
            />
            
            <TextField
              fullWidth
              label="Contraseña"
              name="clave"
              type="password"
              value={formData.clave}
              onChange={handleChange}
              margin="normal"
              required
              autoComplete="new-password"
              disabled={loading}
              helperText="Mínimo 6 caracteres"
            />

            <FormControl fullWidth margin="normal" disabled={loading}>
              <InputLabel>Tipo de Usuario</InputLabel>
              <Select
                name="perfil"
                value={formData.perfil}
                onChange={handleChange}
                label="Tipo de Usuario"
                required
              >
                <MenuItem value="cliente">Cliente</MenuItem>
                <MenuItem value="vendedor">Vendedor</MenuItem>
                <MenuItem value="admin">Administrador</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2, 
                py: 1.5,
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                }
              }}
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </Button>

            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                ¿Ya tenes cuenta?{' '}
                <Button
                  component={Link}
                  to="/login"
                  variant="text"
                  sx={{ 
                    textTransform: 'none',
                    color: '#667eea',
                    fontWeight: 'bold'
                  }}
                  disabled={loading}
                >
                  Inicia sesión aquí
                </Button>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Registro;