import { describe, expect, it } from 'vitest';
import supertest from 'supertest';
import app from '../src/index.js';

describe('Endpoints de autores', () => {
  it('responde correctamente en la ruta principal de la API', async () => {
    const response = await supertest(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'API MiniBlog activa', status: 'OK' });
  });

  it('rechaza un id de autor invalido', async () => {
    const response = await supertest(app).get('/authors/no-es-un-id');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('El id debe ser un entero positivo');
  });

  it('rechaza crear un autor sin nombre ni email', async () => {
    const response = await supertest(app)
      .post('/authors')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('El nombre del autor no puede estar vacío');
  });
});