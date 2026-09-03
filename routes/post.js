const express = require('express');
const router = express.Router();
const pool = require('../db/config');

// 1. GET /posts - Obtener todos los posts
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener posts:', err);
    res.status(500).json({ error: 'Error al obtener publicaciones' });
  }
});

// 2. GET /posts/author/:authorId - Obtener posts de un autor específico (INNER JOIN)
router.get('/author/:authorId', async (req, res) => {
  try {
    // Usamos JSON_BUILD_OBJECT para anidar los datos del autor dentro del post
    const query = `
      SELECT p.id, p.title, p.content, p.published, p.created_at,
             json_build_object('id', a.id, 'name', a.name, 'email', a.email) AS author
      FROM posts p
      INNER JOIN authors a ON p.author_id = a.id
      WHERE p.author_id = $1
      ORDER BY p.created_at DESC`;
      
    const { rows } = await pool.query(query, [req.params.authorId]);
    res.json(rows);
  } catch (err) {
    console.error('Error en posts por autor:', err);
    res.status(500).json({ error: 'Error al obtener publicaciones del autor' });
  }
});

// 3. GET /posts/:id - Obtener un post específico
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM posts WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Publicación no encontrada' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error al obtener post:', err);
    res.status(500).json({ error: 'Error al obtener publicación' });
  }
});

// 4. POST /posts - Crear un post
router.post('/', async (req, res) => {
  const { title, content, author_id, published } = req.body;
  
  if (!title || !content || !author_id) {
    return res.status(400).json({ error: 'Título, contenido y author_id son obligatorios' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO posts (title, content, author_id, published) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, content, author_id, published || false]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23503') { // Código de PostgreSQL para Clave foránea inexistente
      return res.status(400).json({ error: 'El author_id proporcionado no existe' });
    }
    console.error('Error al crear post:', err);
    res.status(500).json({ error: 'Error al crear publicación' });
  }
});

// 5. PUT /posts/:id - Actualizar un post
router.put('/:id', async (req, res) => {
  const { title, content, published } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE posts 
       SET title = COALESCE($1, title), 
           content = COALESCE($2, content), 
           published = COALESCE($3, published) 
       WHERE id = $4 RETURNING *`,
      [title, content, published, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Publicación no encontrada' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error al actualizar post:', err);
    res.status(500).json({ error: 'Error al actualizar publicación' });
  }
});

// 6. DELETE /posts/:id - Eliminar un post
router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM posts WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Publicación no encontrada' });
    res.status(204).send(); // 204 significa No Content (éxito, pero sin cuerpo de respuesta)
  } catch (err) {
    console.error('Error al eliminar post:', err);
    res.status(500).json({ error: 'Error al eliminar publicación' });
  }
});

module.exports = router;