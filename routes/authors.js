const express = require('express');
const router = express.Router();
const pool = require('../db/config');

// 1. GET /authors - Listar todos los autores
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM authors ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener autores:', err);
    res.status(500).json({ error: 'Error al obtener los autores' });
  }
});

// 2. GET /authors/:id - Detalle de un autor por ID
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM authors WHERE id = $1', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error al obtener autor:', err);
    res.status(500).json({ error: 'Error al obtener el autor' });
  }
});

// 3. POST /authors - Crear un nuevo autor (con validación de name y email único)
router.post('/', async (req, res) => {
  const { name, email, bio } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'El nombre del autor no puede estar vacío' });
  }
  if (!email || email.trim() === '') {
    return res.status(400).json({ error: 'El email del autor es obligatorio' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING *',
      [name.trim(), email.trim(), bio || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    // Código 23505 = Violación de restricción UNIQUE (email duplicado en Postgres)
    if (err.code === '23505') {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    console.error('Error al crear autor:', err);
    res.status(500).json({ error: 'Error al crear el autor' });
  }
});

// 4. PUT /authors/:id - Actualizar parcialmente o totalmente un autor
router.put('/:id', async (req, res) => {
  const { name, email, bio } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE authors 
       SET name = COALESCE($1, name), 
           email = COALESCE($2, email), 
           bio = COALESCE($3, bio) 
       WHERE id = $4 RETURNING *`,
      [name, email, bio, req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'El email ya está en uso por otro autor' });
    }
    console.error('Error al actualizar autor:', err);
    res.status(500).json({ error: 'Error al actualizar el autor' });
  }
});

// 5. DELETE /authors/:id - Eliminar autor (Borrará sus posts en cascada)
router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM authors WHERE id = $1', [req.params.id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Error al eliminar autor:', err);
    res.status(500).json({ error: 'Error al eliminar el autor' });
  }
});

module.exports = router;