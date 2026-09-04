import { describe, expect, it } from 'vitest';
import supertest from 'supertest';
import app from '../src/index.js';

describe('Endpoints de comentarios', () => {
  it('rechaza un postId invalido', async () => {
    const response = await supertest(app).get('/comments/post/no-es-un-id');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('El postId debe ser un entero positivo');
  });

  it('rechaza crear un comentario sin datos requeridos', async () => {
    const response = await supertest(app)
      .post('/comments')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('post_id y author_id deben ser enteros positivos');
  });
});