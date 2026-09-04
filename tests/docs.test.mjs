import { describe, expect, it } from 'vitest';
import supertest from 'supertest';
import app from '../src/index.js';

describe('Documentacion OpenAPI', () => {
  it('expone el documento OpenAPI en JSON', async () => {
    const response = await supertest(app).get('/api-docs.json');

    expect(response.status).toBe(200);
    expect(response.body.openapi).toBe('3.0.3');
    expect(response.body.paths['/authors']).toBeDefined();
    expect(response.body.paths['/posts']).toBeDefined();
    expect(response.body.paths['/comments']).toBeDefined();
  });

  it('expone la interfaz web de Swagger UI', async () => {
    const response = await supertest(app).get('/api-docs/');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Swagger UI');
  });
});