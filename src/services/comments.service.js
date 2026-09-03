const pool = require('../config/database');

const listCommentsByPost = async (postId) => {
  const query = `
    SELECT c.id, c.content, c.created_at,
           json_build_object('id', a.id, 'name', a.name) AS author
    FROM comments c
    INNER JOIN authors a ON c.author_id = a.id
    WHERE c.post_id = $1
    ORDER BY c.created_at ASC`;
  const { rows } = await pool.query(query, [postId]);
  return rows;
};

const createComment = async ({ post_id, author_id, content }) => {
  const { rows } = await pool.query(
    'INSERT INTO comments (post_id, author_id, content) VALUES ($1, $2, $3) RETURNING *',
    [post_id, author_id, content]
  );
  return rows[0];
};

module.exports = { listCommentsByPost, createComment };
