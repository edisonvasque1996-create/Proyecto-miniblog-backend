import { describe, expect, it } from 'vitest';
import validation from '../src/middlewares/validation.js';

const {
  validateId,
  validatePost,
  validateAuthorCreate,
  validateAuthorUpdate,
  validatePostUpdate
} = validation;

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

  it('rechaza nombres y títulos que superan el límite de la base de datos', () => {
    const authorResponse = response();
    validateAuthorCreate({ body: { name: 'a'.repeat(101), email: 'ana@example.com' } }, authorResponse, () => {});
    expect(authorResponse.statusCode).toBe(400);

    const postResponse = response();
    validatePost({ body: { title: 'a'.repeat(201), content: 'Texto', author_id: 1 } }, postResponse, () => {});
    expect(postResponse.statusCode).toBe(400);
  });

  it('permite limpiar la bio y rechaza actualizaciones vacías', () => {
    const req = { body: { bio: null } };
    const res = response();
    let called = false;
    validateAuthorUpdate(req, res, () => { called = true; });
    expect(called).toBe(true);

    const emptyResponse = response();
    validatePostUpdate({ body: {} }, emptyResponse, () => {});
    expect(emptyResponse.statusCode).toBe(400);
  });
});
