const authorsService = require('../services/authors.service');

const list = async (req, res, next) => {
  try { res.json(await authorsService.listAuthors()); } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const author = await authorsService.findAuthorById(req.params.id);
    if (!author) return res.status(404).json({ error: 'Autor no encontrado' });
    res.json(author);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try { res.status(201).json(await authorsService.createAuthor(req.body)); } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const author = await authorsService.updateAuthor(req.params.id, req.body);
    if (!author) return res.status(404).json({ error: 'Autor no encontrado' });
    res.json(author);
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    if (!await authorsService.deleteAuthor(req.params.id)) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }
    res.status(204).send();
  } catch (err) { next(err); }
};

module.exports = { list, getById, create, update, remove };
