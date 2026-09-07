## MiniBlog API

API REST para administrar autores, publicaciones y comentarios. Está construida
con Node.js, Express y PostgreSQL, y separa rutas, controladores, servicios,
validaciones y acceso a datos. La base de datos aplica claves foráneas y borrado
en cascada para evitar registros huérfanos.

## Requisitos

- Node.js 20.6 o superior.
- PostgreSQL 14 o superior para ejecutar la API localmente.
- npm, incluido con Node.js.

## Instalación y ejecución local

1. Instala las dependencias:

  ```bash
  npm install
  ```

2. Crea una base de datos PostgreSQL y copia `.env.example` a `.env`:

  ```bash
  cp .env.example .env
  ```

  En Windows también puedes copiar el archivo desde el explorador o ejecutar
  `copy .env.example .env` en CMD. Completa las credenciales locales. El
  ejemplo de configuración es:

  ```env
  DB_HOST=localhost
  DB_PORT=5432
  DB_NAME=miniblog_db
  DB_USER=miniblog_user
  DB_PASSWORD=tu_contraseña_local
  PORT=3000
  NODE_ENV=development
  API_URL=http://localhost:3000
  ```

3. Ejecuta el esquema y, opcionalmente, los datos de prueba desde la raíz del
  proyecto:

  ```bash
  psql -U miniblog_user -d miniblog_db -f database/setup.sql
  psql -U miniblog_user -d miniblog_db -f database/seed.sql
  ```

4. Inicia la API:

  ```bash
  npm start
  ```

  Para desarrollo, con reinicio automático al cambiar archivos:

  ```bash
  npm run dev
  ```

  La API queda disponible en `http://localhost:3000`.

## Tests

Ejecuta toda la suite con:

```bash
npm test
```

Los tests usan Vitest y Supertest. La suite cubre:

- Operaciones CRUD HTTP de autores y publicaciones.
- Validaciones de IDs, campos obligatorios, longitudes máximas y actualizaciones vacías.
- Validación de `bio` como texto o `null`.
- Documentación OpenAPI y Swagger UI.
- Manejo de la actualización de `bio: null` sin conservar accidentalmente el valor anterior.

Ejecuta la suite con:

```bash
npm test
```

Las pruebas automatizadas no requieren una conexión PostgreSQL porque las
operaciones CRUD se aíslan mediante mocks de los servicios. Para probar
manualmente las operaciones contra datos reales, sí necesitas una conexión
PostgreSQL configurada en `.env`.

## Documentación OpenAPI

Con la API iniciada, Swagger UI está disponible en:

```text
http://localhost:3000/api-docs/
```

El documento OpenAPI en JSON está disponible en:

```text
http://localhost:3000/api-docs.json
```

En producción, reemplaza `TU-DOMINIO` por la URL pública de Railway:

```text
https://TU-DOMINIO/api-docs/
https://TU-DOMINIO/api-docs.json
```

Configura `API_URL` con esa URL pública para que Swagger muestre el servidor
correcto en su selector.

## Deployment en Railway

1. Sube el repositorio a GitHub y crea un nuevo servicio desde ese repositorio
  en Railway.
2. Añade un servicio PostgreSQL en el mismo proyecto. Railway expondrá su
  cadena de conexión en `DATABASE_URL`.
3. Configura en el servicio de la API:

  ```env
  DATABASE_URL=${{Postgres.DATABASE_URL}}
  NODE_ENV=production
  API_URL=https://TU-DOMINIO.up.railway.app
  ```

  El nombre exacto de la referencia puede variar según el nombre que Railway
  asigne al servicio PostgreSQL; también puedes pegar directamente su valor.
4. Railway ejecutará `npm start`. El servidor usa `PORT`, que Railway asigna
  automáticamente; no es necesario fijarlo en producción.
5. Ejecuta `database/setup.sql` contra la base de datos de Railway y, si lo
  necesitas, `database/seed.sql`. Puedes hacerlo desde un cliente PostgreSQL
  usando la **internal URL** del servicio de base de datos, que evita salir a
  Internet entre servicios del mismo proyecto.

La **public URL** es el dominio HTTP del servicio de la API y es la dirección
que usarán los clientes, Swagger y `API_URL`. La **internal URL** pertenece a
la red privada de Railway y sirve para conexiones internas, migraciones o
clientes administrativos; no debe publicarse como URL de la API.

No subas `.env` al repositorio. Usa las variables del panel de Railway y deja
`.env.example` como referencia.

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

## Registro del uso de AI

Se utilizó asistencia de AI como apoyo para la revisión técnica, la mejora de
la calidad del código y la documentación del proyecto. Los puntos trabajados
fueron:

- Revisión de la arquitectura por capas: rutas, controladores, servicios,
  middlewares y configuración de PostgreSQL.
- Verificación de los endpoints CRUD de `authors` y `posts`, además de los
  endpoints disponibles para `comments`.
- Revisión del esquema PostgreSQL, las claves foráneas y el borrado en cascada.
- Confirmación de que las consultas SQL utilizan parámetros y no interpolan
  directamente datos recibidos del cliente.
- Mejora de las validaciones de IDs, campos obligatorios, longitudes máximas,
  tipos de datos y cuerpos vacíos en actualizaciones.
- Corrección del caso en que `bio: null` debía limpiar el valor existente,
  mientras que omitir `bio` debía conservarlo.
- Ampliación de los tests automatizados para cubrir las operaciones CRUD y
  las nuevas reglas de validación.
- Revisión de la documentación OpenAPI, Swagger UI, configuración local y
  pasos de despliegue en Railway.
- Actualización de este README para reflejar el comportamiento actual del
  proyecto.

La validación final de los cambios se realizó ejecutando la suite de Vitest:
6 archivos y 17 tests aprobados.

La lógica de negocio, las credenciales y las decisiones de despliegue deben ser
revisadas y validadas por el equipo antes de publicar cambios.



