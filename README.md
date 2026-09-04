## MiniBlog API

API REST de un miniblog con Express y PostgreSQL.

## Estructura

```text
src/
  config/         Conexion a PostgreSQL
  controllers/    Logica de las peticiones HTTP
  middlewares/    Validaciones y manejo de errores
  routes/         Definicion de endpoints
  services/       Consultas SQL
  index.js        Punto de entrada
database/
  setup.sql       Creacion de tablas
  seed.sql        Datos de prueba
tests/            Pruebas unitarias
```

## Instalacion

```bash
npm install
```

Copia `.env.example` como `.env` y completa las credenciales de PostgreSQL.
Ejecuta `database/setup.sql` y luego `database/seed.sql` en la base de datos.

## Ejecucion

```bash
npm start
npm run dev
npm test
```

La API queda disponible en `http://localhost:3000`.

## Preparacion para Railway

El proyecto ya incluye el comando de inicio que Railway necesita:

```bash
npm start
```

En Railway configura estas variables de entorno:

```env
DATABASE_URL=URL_DE_POSTGRESQL
NODE_ENV=production
```

Railway puede usar el servicio PostgreSQL y su variable `DATABASE_URL` directamente.
Antes de probar los endpoints, ejecuta `database/setup.sql` en esa base de datos y,
opcionalmente, `database/seed.sql` para cargar datos de prueba.

No subas el archivo `.env`; usa `.env.example` como referencia para las variables.

## Endpoints

- `GET /authors`
- `GET /authors/:id`
- `POST /authors`
- `PUT /authors/:id`
- `DELETE /authors/:id`
- `GET /posts`
- `GET /posts/:id`
- `GET /posts/author/:authorId`
- `POST /posts`
- `PUT /posts/:id`
- `DELETE /posts/:id`
- `GET /comments/post/:postId`
- `POST /comments`



