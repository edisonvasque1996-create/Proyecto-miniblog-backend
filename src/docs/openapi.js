const apiUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 3000}`;

const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'MiniBlog API',
    version: '1.0.0',
    description: 'API REST para administrar autores, publicaciones y comentarios de MiniBlog.'
  },
  servers: [
    {
      url: apiUrl,
      description: process.env.API_URL ? 'Servidor publicado' : 'Servidor local'
    }
  ],
  tags: [
    { name: 'Authors', description: 'Operaciones relacionadas con autores' },
    { name: 'Posts', description: 'Operaciones relacionadas con publicaciones' },
    { name: 'Comments', description: 'Operaciones relacionadas con comentarios' }
  ],
  paths: {
    '/': {
      get: {
        summary: 'Comprobar estado de la API',
        responses: {
          200: {
            description: 'API disponible',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HealthResponse' }
              }
            }
          }
        }
      }
    },
    '/authors': {
      get: {
        tags: ['Authors'],
        summary: 'Listar autores',
        responses: {
          200: {
            description: 'Lista de autores',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Author' } } } }
          },
          500: { $ref: '#/components/responses/InternalError' }
        }
      },
      post: {
        tags: ['Authors'],
        summary: 'Crear un autor',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthorInput' } } } },
        responses: {
          201: { description: 'Autor creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Author' } } } },
          400: { $ref: '#/components/responses/BadRequest' },
          500: { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/authors/{id}': {
      parameters: [{ $ref: '#/components/parameters/Id' }],
      get: {
        tags: ['Authors'],
        summary: 'Obtener un autor',
        responses: {
          200: { description: 'Autor encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Author' } } } },
          400: { $ref: '#/components/responses/BadRequest' },
          404: { description: 'Autor no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
        }
      },
      put: {
        tags: ['Authors'],
        summary: 'Actualizar un autor',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthorUpdate' } } } },
        responses: {
          200: { description: 'Autor actualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Author' } } } },
          400: { $ref: '#/components/responses/BadRequest' },
          404: { description: 'Autor no encontrado' }
        }
      },
      delete: {
        tags: ['Authors'],
        summary: 'Eliminar un autor',
        responses: {
          204: { description: 'Autor eliminado' },
          400: { $ref: '#/components/responses/BadRequest' },
          404: { description: 'Autor no encontrado' }
        }
      }
    },
    '/posts': {
      get: {
        tags: ['Posts'],
        summary: 'Listar publicaciones',
        responses: {
          200: { description: 'Lista de publicaciones', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Post' } } } } },
          500: { $ref: '#/components/responses/InternalError' }
        }
      },
      post: {
        tags: ['Posts'],
        summary: 'Crear una publicación',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/PostInput' } } } },
        responses: {
          201: { description: 'Publicación creada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } } },
          400: { $ref: '#/components/responses/BadRequest' },
          500: { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/posts/author/{authorId}': {
      parameters: [{ $ref: '#/components/parameters/AuthorId' }],
      get: {
        tags: ['Posts'],
        summary: 'Listar publicaciones de un autor',
        responses: {
          200: { description: 'Publicaciones del autor', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/PostWithAuthor' } } } } },
          400: { $ref: '#/components/responses/BadRequest' }
        }
      }
    },
    '/posts/{id}': {
      parameters: [{ $ref: '#/components/parameters/Id' }],
      get: {
        tags: ['Posts'],
        summary: 'Obtener una publicación',
        responses: {
          200: { description: 'Publicación encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } } },
          400: { $ref: '#/components/responses/BadRequest' },
          404: { description: 'Publicación no encontrada' }
        }
      },
      put: {
        tags: ['Posts'],
        summary: 'Actualizar una publicación',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/PostUpdate' } } } },
        responses: {
          200: { description: 'Publicación actualizada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } } },
          400: { $ref: '#/components/responses/BadRequest' },
          404: { description: 'Publicación no encontrada' }
        }
      },
      delete: {
        tags: ['Posts'],
        summary: 'Eliminar una publicación',
        responses: {
          204: { description: 'Publicación eliminada' },
          400: { $ref: '#/components/responses/BadRequest' },
          404: { description: 'Publicación no encontrada' }
        }
      }
    },
    '/comments': {
      post: {
        tags: ['Comments'],
        summary: 'Crear un comentario',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CommentInput' } } } },
        responses: {
          201: { description: 'Comentario creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Comment' } } } },
          400: { $ref: '#/components/responses/BadRequest' },
          500: { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/comments/post/{postId}': {
      parameters: [{ $ref: '#/components/parameters/PostId' }],
      get: {
        tags: ['Comments'],
        summary: 'Listar comentarios de una publicación',
        responses: {
          200: { description: 'Comentarios de la publicación', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/CommentWithAuthor' } } } } },
          400: { $ref: '#/components/responses/BadRequest' }
        }
      }
    }
  },
  components: {
    parameters: {
      Id: { name: 'id', in: 'path', required: true, description: 'Identificador entero positivo', schema: { type: 'integer', minimum: 1 } },
      AuthorId: { name: 'authorId', in: 'path', required: true, description: 'Identificador del autor', schema: { type: 'integer', minimum: 1 } },
      PostId: { name: 'postId', in: 'path', required: true, description: 'Identificador de la publicación', schema: { type: 'integer', minimum: 1 } }
    },
    responses: {
      BadRequest: { description: 'Solicitud inválida', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      InternalError: { description: 'Error interno del servidor', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
    },
    schemas: {
      Error: { type: 'object', required: ['error'], properties: { error: { type: 'string', example: 'El id debe ser un entero positivo' } } },
      HealthResponse: { type: 'object', properties: { message: { type: 'string', example: 'API MiniBlog activa' }, status: { type: 'string', example: 'OK' } } },
      Author: { type: 'object', properties: { id: { type: 'integer', example: 1 }, name: { type: 'string', example: 'Ana Perez' }, email: { type: 'string', format: 'email', example: 'ana@example.com' }, bio: { type: 'string', nullable: true, example: 'Autora de tecnologia' } } },
      AuthorInput: { type: 'object', required: ['name', 'email'], properties: { name: { type: 'string', example: 'Ana Perez' }, email: { type: 'string', format: 'email', example: 'ana@example.com' }, bio: { type: 'string', example: 'Autora de tecnologia' } } },
      AuthorUpdate: { type: 'object', properties: { name: { type: 'string', example: 'Ana Perez' }, email: { type: 'string', format: 'email', example: 'ana@example.com' }, bio: { type: 'string', nullable: true } } },
      Post: { type: 'object', properties: { id: { type: 'integer', example: 1 }, title: { type: 'string', example: 'Primer post' }, content: { type: 'string', example: 'Contenido del post' }, author_id: { type: 'integer', example: 1 }, published: { type: 'boolean', example: true }, created_at: { type: 'string', format: 'date-time' } } },
      PostInput: { type: 'object', required: ['title', 'content', 'author_id'], properties: { title: { type: 'string', example: 'Primer post' }, content: { type: 'string', example: 'Contenido del post' }, author_id: { type: 'integer', minimum: 1, example: 1 }, published: { type: 'boolean', default: false } } },
      PostUpdate: { type: 'object', properties: { title: { type: 'string' }, content: { type: 'string' }, published: { type: 'boolean' } } },
      Comment: { type: 'object', properties: { id: { type: 'integer', example: 1 }, post_id: { type: 'integer', example: 1 }, author_id: { type: 'integer', example: 1 }, content: { type: 'string', example: 'Muy buen artículo' }, created_at: { type: 'string', format: 'date-time' } } },
      CommentInput: { type: 'object', required: ['post_id', 'author_id', 'content'], properties: { post_id: { type: 'integer', minimum: 1, example: 1 }, author_id: { type: 'integer', minimum: 1, example: 1 }, content: { type: 'string', example: 'Muy buen artículo' } } },
      CommentWithAuthor: { type: 'object', properties: { id: { type: 'integer' }, content: { type: 'string' }, created_at: { type: 'string', format: 'date-time' }, author: { $ref: '#/components/schemas/AuthorSummary' } } },
      AuthorSummary: { type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' } } },
      PostWithAuthor: { allOf: [{ $ref: '#/components/schemas/Post' }, { type: 'object', properties: { author: { $ref: '#/components/schemas/Author' } } }] }
    }
  }
};

module.exports = openapi;
