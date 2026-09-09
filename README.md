# MiniBlog API

Proyecto desplegado en Railway: https://proyecto-miniblog-backend-production.up.railway.app/

API REST para administrar autores, publicaciones y comentarios. Está construida con Node.js, Express y PostgreSQL, y separa rutas, controladores, servicios, validaciones y acceso a datos. La base de datos aplica claves foráneas y borrado en cascada para evitar registros huérfanos.

---

## Índice

- [Descripción general](#descripción-general)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos](#requisitos)
- [Instalación y ejecución local](#instalación-y-ejecución-local)
- [Tests](#tests)
- [Documentación OpenAPI](#documentación-openapi)
- [Deployment en Railway](#deployment-en-railway)
- [Migración de la base de datos local a Railway](#migración-de-la-base-de-datos-local-a-railway)
- [Endpoints](#endpoints)
- [Registro del uso de AI](#registro-del-uso-de-ai)
- [Anexos de IA](#Anexos-de-AI)

---

## Descripción general

- API REST con Node.js + Express.
- Persistencia en PostgreSQL.
- Arquitectura por capas: rutas, controladores, servicios, middlewares y configuración.
- Validaciones para IDs, campos obligatorios, longitudes máximas, cuerpos vacíos y manejo de `bio: null`.
- Documentación con Swagger UI y OpenAPI.

---

## Estructura del proyecto

```text
.
├── database/
│   ├── seed.sql
│   └── setup.sql
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authors.controller.js
│   │   ├── comments.controller.js
│   │   └── posts.controller.js
│   ├── docs/
│   │   └── openapi.js
│   ├── middlewares/
│   │   ├── error-handler.js
│   │   └── validation.js
│   ├── routes/
│   │   ├── authors.routes.js
│   │   ├── comments.routes.js
│   │   └── posts.routes.js
│   ├── services/
│   │   ├── authors.service.js
│   │   ├── comments.service.js
│   │   └── posts.service.js
│   └── index.js
├── tests/
│   ├── authors.test.mjs
│   ├── comments.test.mjs
│   ├── crud.test.mjs
│   ├── docs.test.mjs
│   ├── posts.test.mjs
│   └── validation.test.mjs
├── .env.example
├── package.json
├── README.md
├── server.js
└── package-lock.json
```

---

## Requisitos

- Node.js 20.6 o superior.
- PostgreSQL 14 o superior para ejecutar la API localmente.
- npm, incluido con Node.js.

---

## Instalación y ejecución local

1. Instala las dependencias:

```bash
npm install
```

2. Crea una base de datos PostgreSQL y copia `.env.example` a `.env`:

```bash
cp .env.example .env
```

En Windows también puedes copiar el archivo desde el explorador o ejecutar `copy .env.example .env` en CMD. Completa las credenciales locales. El ejemplo de configuración es:

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

3. Ejecuta el esquema y, opcionalmente, los datos de prueba desde la raíz del proyecto:

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

Las pruebas automatizadas no requieren una conexión PostgreSQL porque las operaciones CRUD se aíslan mediante mocks de los servicios. Para probar manualmente las operaciones contra datos reales, sí necesitas una conexión PostgreSQL configurada en `.env`.

---

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

Configura `API_URL` con esa URL pública para que Swagger muestre el servidor correcto en su selector.

---

## Deployment en Railway

1. Sube el repositorio a GitHub y crea un nuevo servicio desde ese repositorio en Railway.
2. Añade un servicio PostgreSQL en el mismo proyecto. Railway expondrá su cadena de conexión en `DATABASE_URL`.
3. Configura en el servicio de la API:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
NODE_ENV=production
API_URL=https://TU-DOMINIO.up.railway.app
```

El nombre exacto de la referencia puede variar según el nombre que Railway asigne al servicio PostgreSQL; también puedes pegar directamente su valor.

4. Railway ejecutará `npm start`. El servidor usa `PORT`, que Railway asigna automáticamente; no es necesario fijarlo en producción.
5. Ejecuta `database/setup.sql` contra la base de datos de Railway y, si lo necesitas, `database/seed.sql`. Puedes hacerlo desde un cliente PostgreSQL usando la internal URL del servicio de base de datos, que evita salir a Internet entre servicios del mismo proyecto.

La public URL es el dominio HTTP del servicio de la API y es la dirección que usarán los clientes, Swagger y `API_URL`. La internal URL pertenece a la red privada de Railway y sirve para conexiones internas, migraciones o clientes administrativos; no debe publicarse como URL de la API.

No subas `.env` al repositorio. Usa las variables del panel de Railway y deja `.env.example` como referencia.

---

## Migración de la base de datos local a Railway

Si ya tienes datos en tu base local y quieres moverlos a Railway, puedes seguir estos pasos:

1. Exporta la base local:

```bash
pg_dump -U miniblog_user -d miniblog_db --no-owner --no-privileges > miniblog_local.sql
```

2. Crea el servicio PostgreSQL en Railway y copia su `DATABASE_URL`.

3. Importa el archivo SQL a la base nueva:

```bash
psql "tu_url_de_railway" < miniblog_local.sql
```

4. Si la base en Railway está vacía, crea primero el esquema:

```bash
psql "tu_url_de_railway" -f database/setup.sql
```

5. Si quieres llenar datos de prueba:

```bash
psql "tu_url_de_railway" -f database/seed.sql
```

6. Configura las variables de entorno en Railway:

```env
DATABASE_URL=tu_url_de_railway
NODE_ENV=production
API_URL=https://TU-DOMINIO.up.railway.app
```
---

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

---

## Registro del uso de AI

Se utilizó asistencia de AI como apoyo para la revisión técnica, la mejora de la calidad del código y la documentación del proyecto. Los puntos trabajados fueron:

- Revisión de la arquitectura por capas: rutas, controladores, servicios, middlewares y configuración de PostgreSQL.
- Verificación de los endpoints CRUD de `authors` y `posts`, además de los endpoints disponibles para `comments`.
- Revisión del esquema PostgreSQL, las claves foráneas y el borrado en cascada.
- Confirmación de que las consultas SQL utilizan parámetros y no interpolan directamente datos recibidos del cliente.
- Mejora de las validaciones de IDs, campos obligatorios, longitudes máximas, tipos de datos y cuerpos vacíos en actualizaciones.
- Corrección del caso en que `bio: null` debía limpiar el valor existente, mientras que omitir `bio` debía conservarlo.
- Ampliación de los tests automatizados para cubrir las operaciones CRUD y las nuevas reglas de validación.
- Revisión de la documentación OpenAPI, Swagger UI, configuración local y pasos de despliegue en Railway.
- Actualización de este README para reflejar el comportamiento actual del proyecto.
- Soluciones de errores 

La validación final de los cambios se realizó ejecutando la suite de Vitest: 6 archivos y 17 tests aprobados.

La lógica de negocio, las credenciales y las decisiones de despliegue deben ser revisadas y validadas por el equipo antes de publicar cambios.
---

## Anexos de AI

---

- `Promp`

Quiero que me ayudes a restructura todo para realizar la validacion, basicamente quiero exista un middlewares para usarlo ahi y tambien que tenga su respectivo controllers para que sea mejor organizado el proyecto
```text 
miniblog-api/
├── src/
│   ├── config/          # Conexión a la base de datos
│   ├── controllers/     # Lógica de las peticiones HTTP
│   ├── middlewares/     # Validaciones y manejo de errores
│   ├── routes/          # Definición de endpoints
│   ├── services/        # Consultas SQL puras
│   └── index.js         # Punto de entrada de la aplicación
├── database/
│   ├── setup.sql        # Script para crear las tablas
│   └── seed.sql         # Script para insertar datos de prueba
├── tests/               # Pruebas unitarias
├── .env.example         # Ejemplo de variables de entorno
├── .gitignore           # Archivos a ignorar en Git
└── package.json
```

Quiero que lo restructures de esat manera y que funcione como lo esta ahorita

- `Respuesta`

 Listo. El proyecto quedó restructurado y funcionando con esta arquitectura:

config: conexión PostgreSQL.
controllers: lógica HTTP.
services: consultas SQL.
middlewares: validaciones y errores.
routes: definición de endpoints.
index.js: entrada principal.
setup.sql y seed.sql.
validation.test.js.
Archivos principales:

index.js
validation.js
error-handler.js
controllers
services
routes
También dejé server.js como archivo compatible que redirige a la nueva entrada.

---

- `Promp`

Ayudame con una revision total del proyecto si cumple conestos parametros que me solicitan:
-Qué se espera del proyecto
-Se espera que desarrolles una API REST en Node.js + Express que:
-Implemente operaciones CRUD para las entidades authors y posts.
-Persista los datos en PostgreSQL.
Maneje validaciones básicas y errores.
-Incluya documentación mínima y tests automatizados.
Más allá de la cantidad de funcionalidades, se valorará especialmente:
-Que los endpoints funcionen correctamente.
-Que la conexión con la base de datos esté bien configurada.
-Que las consultas SQL estén parametrizadas.
-Que el proyecto esté correctamente versionado.
-Que la documentación permita ejecutar el proyecto sin ayuda externa.

- `Respuesta`

El proyecto cumple los requisitos principales de la consigna:
Requisito	                      Estado
API REST con Node.js + Express	Cumple
CRUD de authors	                Cumple
CRUD de posts	                  Cumple
Persistencia PostgreSQL	Cumple
Consultas SQL parametrizadas	  Cumple
Validaciones básicas	          Cumple parcialmente
Manejo de errores	              Cumple
Documentación	                  Cumple
Tests automatizados	            Cumple parcialmente
Versionado Git	                Cumple

---

- `Promp`

Necesito crear la documentacion de swagger para mi API de forma correcta para que funcione dentro del internet, y que el funcionamienot sea correcto

- `Respuesta`

Swagger quedó integrado correctamente sin modificar el funcionamiento de la API.

Disponible en local:
http://localhost:3000/api-docs/

Documento OpenAPI JSON:
http://localhost:3000/api-docs.json

---

- `Promp`

al momento de deploy en railway me salio este unico error, explicame y ayudame a corregirlo para solucionar la momento de poner el proyecto en railway claro esta sin afectar ya el funcionamiento como tal del proyecto solo corrigue eso

- `Respuesta`

La línea de npm:
npm warn config production Use `--omit=dev` instead.

es solo una advertencia de npm 11. No impide el despliegue.

Apliqué un ajuste mínimo en index.js:17-43:

Express escucha explícitamente en 0.0.0.0, requerido por Railway.
El log ya no muestra localhost, sino el puerto real asignado.
No se modificaron rutas, servicios, base de datos ni lógica del proyecto.
Ahora el servidor quedará registrado así:

Validación realizada:
Sintaxis correcta.
git diff --check correcto.
Tests: 17 aprobados.
Dependencias: 0 vulnerabilidades.