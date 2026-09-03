const express = require('express');
const controller = require('../controllers/posts.controller');
const {
  validateId,
  validatePostId,
  validateAuthorId,
  validatePost,
  validatePostUpdate
} = require('../middlewares/validation');

const router = express.Router();

router.get('/', controller.list);
router.get('/author/:authorId', validateAuthorId, controller.listByAuthor);
router.get('/:id', validateId, controller.getById);
router.post('/', validatePost, controller.create);
router.put('/:id', validateId, validatePostUpdate, controller.update);
router.delete('/:id', validateId, controller.remove);

module.exports = router;
