const postsService = require('../services/posts.service');

const list = async (req, res, next) => {
  try { res.json(await postsService.listPosts()); } catch (err) { next(err); }
};

const listByAuthor = async (req, res, next) => {
  try { res.json(await postsService.listPostsByAuthor(req.params.authorId)); } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const post = await postsService.findPostById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Publicación no encontrada' });
    res.json(post);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try { res.status(201).json(await postsService.createPost(req.body)); } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const post = await postsService.updatePost(req.params.id, req.body);
    if (!post) return res.status(404).json({ error: 'Publicación no encontrada' });
    res.json(post);
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    if (!await postsService.deletePost(req.params.id)) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }
    res.status(204).send();
  } catch (err) { next(err); }
};

module.exports = { list, listByAuthor, getById, create, update, remove };
