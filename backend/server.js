const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');
const usuarioRoutes = require('./routes/usuario');
const productoRoutes = require('./routes/productos');
const ventaRoutes = require('./routes/ventas');
const { verifyToken, authorizeAdminOrSeller } = require('./middleware/authMiddleware');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/usuario', usuarioRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/ventas', ventaRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
