import { describe, expect, it } from 'vitest';
import validation from '../src/middlewares/validation.js';

const { validateId, validatePost } = validation;

const response = () => ({
  statusCode: null,
  body: null,
  status(code) { this.statusCode = code; return this; },
  json(body) { this.body = body; return this; }
});

describe('middlewares de validacion', () => {
  it('validateId rechaza identificadores no positivos', () => {
    const res = response();
    validateId({ params: { id: 'abc' } }, res, () => {});
    expect(res.statusCode).toBe(400);
  });

  it('validatePost normaliza datos validos', () => {
    const req = { body: { title: ' Titulo ', content: ' Texto ', author_id: '2' } };
    validatePost(req, response(), () => {});
    expect(req.body).toEqual({ title: 'Titulo', content: 'Texto', author_id: 2, published: false });
  });
});
