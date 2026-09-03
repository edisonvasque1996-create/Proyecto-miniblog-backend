const express = require('express');
const controller = require('../controllers/authors.controller');
const {
  validateId,
  validateAuthorCreate,
  validateAuthorUpdate
} = require('../middlewares/validation');

const router = express.Router();

router.get('/', controller.list);
router.get('/:id', validateId, controller.getById);
router.post('/', validateAuthorCreate, controller.create);
router.put('/:id', validateId, validateAuthorUpdate, controller.update);
router.delete('/:id', validateId, controller.remove);

module.exports = router;
