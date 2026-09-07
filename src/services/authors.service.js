const pool = require('../config/database');

const listAuthors = async () => {
  const { rows } = await pool.query('SELECT * FROM authors ORDER BY id ASC');
  return rows;
};

const findAuthorById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM authors WHERE id = $1', [id]);
  return rows[0] || null;
};

const createAuthor = async ({ name, email, bio }) => {
  const { rows } = await pool.query(
    'INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING *',
    [name, email, bio ?? null]
  );
  return rows[0];
};

const updateAuthor = async (id, { name, email, bio }) => {
  const fields = [];
  const values = [];

  if (name !== undefined) {
    fields.push(`name = $${values.length + 1}`);
    values.push(name);
  }
  if (email !== undefined) {
    fields.push(`email = $${values.length + 1}`);
    values.push(email);
  }
  if (bio !== undefined) {
    fields.push(`bio = $${values.length + 1}`);
    values.push(bio);
  }

  if (fields.length === 0) return findAuthorById(id);

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE authors SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING *`,
    values
  );
  return rows[0] || null;
};

const deleteAuthor = async (id) => {
  const { rowCount } = await pool.query('DELETE FROM authors WHERE id = $1', [id]);
  return rowCount > 0;
};

module.exports = {
  listAuthors,
  findAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
};
