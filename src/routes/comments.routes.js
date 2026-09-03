const express = require('express');
const controller = require('../controllers/comments.controller');
const { validatePostId, validateComment } = require('../middlewares/validation');

const router = express.Router();

router.get('/post/:postId', validatePostId, controller.listByPost);
router.post('/', validateComment, controller.create);

module.exports = router;
