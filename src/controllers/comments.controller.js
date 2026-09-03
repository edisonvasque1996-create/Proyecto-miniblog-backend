const commentsService = require('../services/comments.service');

const listByPost = async (req, res, next) => {
  try { res.json(await commentsService.listCommentsByPost(req.params.postId)); } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try { res.status(201).json(await commentsService.createComment(req.body)); } catch (err) { next(err); }
};

module.exports = { listByPost, create };
