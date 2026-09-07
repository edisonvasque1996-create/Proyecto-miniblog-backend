import { afterEach, describe, expect, it, vi } from 'vitest';
import supertest from 'supertest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const app = require('../src/index.js');
const authorsService = require('../src/services/authors.service.js');
const postsService = require('../src/services/posts.service.js');
const pool = require('../src/config/database.js');

afterEach(() => vi.restoreAllMocks());

describe('CRUD HTTP de autores', () => {
  it('expone las operaciones de listar, consultar, crear, actualizar y eliminar', async () => {
    vi.spyOn(authorsService, 'listAuthors').mockResolvedValue([{ id: 1 }]);
    vi.spyOn(authorsService, 'findAuthorById').mockResolvedValue({ id: 1 });
    vi.spyOn(authorsService, 'createAuthor').mockResolvedValue({ id: 1 });
    vi.spyOn(authorsService, 'updateAuthor').mockResolvedValue({ id: 1 });
    vi.spyOn(authorsService, 'deleteAuthor').mockResolvedValue(true);

    expect((await supertest(app).get('/authors')).status).toBe(200);
    expect((await supertest(app).get('/authors/1')).status).toBe(200);
    expect((await supertest(app).post('/authors').send({ name: 'Ana', email: 'ana@example.com' })).status).toBe(201);
    expect((await supertest(app).put('/authors/1').send({ name: 'Ana' })).status).toBe(200);
    expect((await supertest(app).delete('/authors/1')).status).toBe(204);
  });

  it('permite limpiar la bio de un autor con null', async () => {
    vi.spyOn(pool, 'query').mockResolvedValue({ rows: [{ id: 1, bio: null }] });

    await expect(authorsService.updateAuthor(1, { bio: null })).resolves.toEqual({ id: 1, bio: null });
    expect(pool.query).toHaveBeenCalledWith(
      'UPDATE authors SET bio = $1 WHERE id = $2 RETURNING *',
      [null, 1]
    );
  });
});

describe('CRUD HTTP de publicaciones', () => {
  it('expone las operaciones de listar, consultar, crear, actualizar y eliminar', async () => {
    vi.spyOn(postsService, 'listPosts').mockResolvedValue([{ id: 1 }]);
    vi.spyOn(postsService, 'listPostsByAuthor').mockResolvedValue([{ id: 1 }]);
    vi.spyOn(postsService, 'findPostById').mockResolvedValue({ id: 1 });
    vi.spyOn(postsService, 'createPost').mockResolvedValue({ id: 1 });
    vi.spyOn(postsService, 'updatePost').mockResolvedValue({ id: 1 });
    vi.spyOn(postsService, 'deletePost').mockResolvedValue(true);

    expect((await supertest(app).get('/posts')).status).toBe(200);
    expect((await supertest(app).get('/posts/author/1')).status).toBe(200);
    expect((await supertest(app).get('/posts/1')).status).toBe(200);
    expect((await supertest(app).post('/posts').send({ title: 'Post', content: 'Texto', author_id: 1 })).status).toBe(201);
    expect((await supertest(app).put('/posts/1').send({ published: true })).status).toBe(200);
    expect((await supertest(app).delete('/posts/1')).status).toBe(204);
  });
});