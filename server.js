const { loadEnvFile } = require('node:process');
const express = require('express');

// Carga las variables del .env en entorno local
try {
  loadEnvFile('.env');
} catch (e) {
  // En producción (Railway) las variables las inyecta el sistema
}

const authorsRouter = require('./routes/authors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware obligatorio para parsear el cuerpo de peticiones JSON
app.use(express.json());

// Montaje de rutas
app.use('/authors', authorsRouter);

// Ruta base
app.get('/', (req, res) => {
  res.json({ message: 'API MiniBlog activa', status: 'OK' });
});

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejador global de errores internos del servidor (500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Arrancar servidor solo si no estamos en entorno de pruebas
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  });
}

module.exports = app;