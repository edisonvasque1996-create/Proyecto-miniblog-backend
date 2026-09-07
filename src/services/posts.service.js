const pool = require('../config/database');

const listPosts = async () => {
  const { rows } = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
  return rows;
};

const listPostsByAuthor = async (authorId) => {
  // La respuesta anidada evita que el cliente tenga que resolver el autor por separado.
  const query = `
    SELECT p.id, p.title, p.content, p.published, p.created_at,
           json_build_object('id', a.id, 'name', a.name, 'email', a.email) AS author
    FROM posts p
    INNER JOIN authors a ON p.author_id = a.id
    WHERE p.author_id = $1
    ORDER BY p.created_at DESC`;
  const { rows } = await pool.query(query, [authorId]);
  return rows;
};

const findPostById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
  return rows[0] || null;
};

const createPost = async ({ title, content, author_id, published }) => {
  const { rows } = await pool.query(
    'INSERT INTO posts (title, content, author_id, published) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, content, author_id, published]
  );
  return rows[0];
};

const updatePost = async (id, { title, content, published }) => {
  const { rows } = await pool.query(
    `UPDATE posts
     SET title = COALESCE($1, title), content = COALESCE($2, content),
         published = COALESCE($3, published)
     WHERE id = $4 RETURNING *`,
    [title, content, published, id]
  );
  return rows[0] || null;
};

const deletePost = async (id) => {
  const { rowCount } = await pool.query('DELETE FROM posts WHERE id = $1', [id]);
  return rowCount > 0;
};

module.exports = {
  listPosts,
  listPostsByAuthor,
  findPostById,
  createPost,
  updatePost,
  deletePost
};
