const { loadEnvFile } = require('node:process');
const express = require('express');

try {
  loadEnvFile('.env');
} catch (err) {
  // En producción las variables vienen del entorno.
}

const authorsRoutes = require('./routes/authors.routes');
const postsRoutes = require('./routes/posts.routes');
const commentsRoutes = require('./routes/comments.routes');
const { notFound, errorHandler } = require('./middlewares/error-handler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API MiniBlog activa', status: 'OK' });
});
app.use('/authors', authorsRoutes);
app.use('/posts', postsRoutes);
app.use('/comments', commentsRoutes);

app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  });
}

module.exports = app;
