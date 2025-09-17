import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useAuth } from '../App';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    clave: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/usuario/login', formData);
      
      if (response.data.success) {
        login(response.data.user, response.data.token);
        
        // Redirigir según el perfil
        switch (response.data.user.perfil) {
          case 'admin':
            navigate('/admin');
            break;
          case 'vendedor':
            navigate('/vendedor');
            break;
          case 'cliente':
            navigate('/productos');
            break;
          default:
            navigate('/');
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
    >
      <Card sx={{ maxWidth: 400, width: '100%', mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom textAlign="center">
            Iniciar Sesión
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
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
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>

            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                ¿No tienes cuenta?{' '}
                <Button
                  variant="text"
                  onClick={() => navigate('/registro')}
                  sx={{ textTransform: 'none' }}
                >
                  Regístrate aquí
                </Button>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;