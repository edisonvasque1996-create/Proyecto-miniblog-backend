const express = require('express');
const router = express.Router();
const pool = require('../db/config');

// 1. GET /comments/post/:postId - Listar comentarios de una publicación
router.get('/post/:postId', async (req, res) => {
  try {
    const query = `
      SELECT c.id, c.content, c.created_at,
             json_build_object('id', a.id, 'name', a.name) AS author
      FROM comments c
      INNER JOIN authors a ON c.author_id = a.id
      WHERE c.post_id = $1
      ORDER BY c.created_at ASC`;
      
    const { rows } = await pool.query(query, [req.params.postId]);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener comentarios:', err);
    res.status(500).json({ error: 'Error al obtener comentarios' });
  }
});

// 2. POST /comments - Crear un comentario
router.post('/', async (req, res) => {
  const { post_id, author_id, content } = req.body;
  
  if (!post_id || !author_id || !content || content.trim() === '') {
    return res.status(400).json({ error: 'post_id, author_id y contenido son requeridos' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO comments (post_id, author_id, content) VALUES ($1, $2, $3) RETURNING *',
      [post_id, author_id, content.trim()]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23503') { // Restricción de llave foránea fallida
      return res.status(400).json({ error: 'El post_id o author_id especificado no existe' });
    }
    console.error('Error al registrar comentario:', err);
    res.status(500).json({ error: 'Error al registrar comentario' });
  }
});

module.exports = router;