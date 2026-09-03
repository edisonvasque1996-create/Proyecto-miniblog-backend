const isPositiveInteger = (value) => /^\d+$/.test(String(value)) && Number(value) > 0;

const validateId = (req, res, next) => {
  if (!isPositiveInteger(req.params.id)) {
    return res.status(400).json({ error: 'El id debe ser un entero positivo' });
  }
  req.params.id = Number(req.params.id);
  next();
};

const validatePostId = (req, res, next) => {
  if (!isPositiveInteger(req.params.postId)) {
    return res.status(400).json({ error: 'El postId debe ser un entero positivo' });
  }
  req.params.postId = Number(req.params.postId);
  next();
};

const validateAuthorId = (req, res, next) => {
  if (!isPositiveInteger(req.params.authorId)) {
    return res.status(400).json({ error: 'El authorId debe ser un entero positivo' });
  }
  req.params.authorId = Number(req.params.authorId);
  next();
};

const validateAuthorCreate = (req, res, next) => {
  const { name, email } = req.body;
  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'El nombre del autor no puede estar vacío' });
  }
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ error: 'El email del autor no es válido' });
  }
  req.body.name = name.trim();
  req.body.email = email.trim();
  next();
};

const validateAuthorUpdate = (req, res, next) => {
  const { name, email } = req.body;
  if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
    return res.status(400).json({ error: 'El nombre del autor no puede estar vacío' });
  }
  if (email !== undefined && (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))) {
    return res.status(400).json({ error: 'El email del autor no es válido' });
  }
  if (name !== undefined) req.body.name = name.trim();
  if (email !== undefined) req.body.email = email.trim();
  next();
};

const validatePost = (req, res, next) => {
  const { title, content, author_id, published } = req.body;
  if (typeof title !== 'string' || title.trim() === '' || typeof content !== 'string' || content.trim() === '') {
    return res.status(400).json({ error: 'Título y contenido son obligatorios' });
  }
  if (!isPositiveInteger(author_id)) {
    return res.status(400).json({ error: 'author_id debe ser un entero positivo' });
  }
  if (published !== undefined && typeof published !== 'boolean') {
    return res.status(400).json({ error: 'published debe ser booleano' });
  }
  req.body.title = title.trim();
  req.body.content = content.trim();
  req.body.author_id = Number(author_id);
  req.body.published = published ?? false;
  next();
};

const validatePostUpdate = (req, res, next) => {
  const { title, content, published } = req.body;
  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    return res.status(400).json({ error: 'El título no puede estar vacío' });
  }
  if (content !== undefined && (typeof content !== 'string' || content.trim() === '')) {
    return res.status(400).json({ error: 'El contenido no puede estar vacío' });
  }
  if (published !== undefined && typeof published !== 'boolean') {
    return res.status(400).json({ error: 'published debe ser booleano' });
  }
  if (title !== undefined) req.body.title = title.trim();
  if (content !== undefined) req.body.content = content.trim();
  next();
};

const validateComment = (req, res, next) => {
  const { post_id, author_id, content } = req.body;
  if (!isPositiveInteger(post_id) || !isPositiveInteger(author_id)) {
    return res.status(400).json({ error: 'post_id y author_id deben ser enteros positivos' });
  }
  if (typeof content !== 'string' || content.trim() === '') {
    return res.status(400).json({ error: 'El contenido es requerido' });
  }
  req.body.post_id = Number(post_id);
  req.body.author_id = Number(author_id);
  req.body.content = content.trim();
  next();
};

module.exports = {
  validateId,
  validatePostId,
  validateAuthorId,
  validateAuthorCreate,
  validateAuthorUpdate,
  validatePost,
  validatePostUpdate,
  validateComment
};
