const notFound = (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err);
  if (err.code === '23505') {
    return res.status(400).json({ error: 'El email ya está registrado' });
  }
  if (err.code === '23503') {
    return res.status(400).json({ error: 'La referencia relacionada no existe' });
  }
  res.status(500).json({ error: 'Error interno del servidor' });
};

module.exports = { notFound, errorHandler };
