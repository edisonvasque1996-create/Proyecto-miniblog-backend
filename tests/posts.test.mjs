import { describe, expect, it } from 'vitest';
import supertest from 'supertest';
import app from '../src/index.js';

describe('Endpoints de publicaciones', () => {
  it('rechaza un id de publicacion invalido', async () => {
    const response = await supertest(app).get('/posts/no-es-un-id');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('El id debe ser un entero positivo');
  });

  it('rechaza un autor invalido al filtrar publicaciones', async () => {
    const response = await supertest(app).get('/posts/author/no-es-un-id');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('El authorId debe ser un entero positivo');
  });

  it('rechaza crear una publicacion incompleta', async () => {
    const response = await supertest(app)
      .post('/posts')
      .send({ title: 'Publicacion sin autor' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Título y contenido son obligatorios');
  });
});