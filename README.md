# MiniBlog API

Proyecto desplegado en Railway: https://proyecto-miniblog-backend-production.up.railway.app/

API REST para administrar autores, publicaciones y comentarios de MiniBlog. La aplicación está construida con Node.js, Express y PostgreSQL, y sigue una arquitectura por capas con rutas, controladores, servicios, middlewares y configuración independiente. El proyecto incluye validaciones de entrada, manejo centralizado de errores, documentación OpenAPI/Swagger y pruebas automatizadas con Vitest y Supertest.

---

## Índice

- [Descripción del proyecto](#descripción-del-proyecto)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos](#requisitos)
- [Variables de entorno](#variables-de-entorno)
- [Instalación y ejecución local](#instalación-y-ejecución-local)
- [Cómo ejecutar tests](#cómo-ejecutar-tests)
- [Cómo ejecutar la documentación OpenAPI](#cómo-ejecutar-la-documentación-openapi)
- [Deployment en Railway](#deployment-en-railway)
- [Migración de la base de datos local a Railway](#migración-de-la-base-de-datos-local-a-railway)
- [Endpoints principales](#endpoints-principales)
- [Registro del uso de AI](#registro-del-uso-de-ai)
- [Anexos de IA](#anexos-de-ia)

---

## Descripción del proyecto

MiniBlog API permite:

- Consultar, crear, actualizar y eliminar autores.
- Consultar, crear, actualizar y eliminar publicaciones.
- Listar comentarios por publicación y crear nuevos comentarios.
- Validar parcialmente las entradas HTTP antes de consultar la base de datos.
- Exponer documentación OpenAPI compatible con Swagger UI.

Además, el proyecto se diseñó pensando en un flujo de trabajo profesional:

- Cada responsabilidad está separada por capas.
- Los servicios contienen la lógica de acceso a datos en PostgreSQL.
- Los middlewares centralizan validaciones y errores.
- La documentación del contrato se mantiene actualizada en un archivo OpenAPI.
- Las pruebas automatizadas ayudan a validar el comportamiento esperado de la API.

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

Para ejecutar el proyecto en local necesitas:

- Node.js 20.6 o superior.
- npm (incluido con Node.js).
- PostgreSQL 14 o superior para correr la base de datos localmente.
- Cliente `psql` (opcional pero recomendable para ejecutar `setup.sql` y `seed.sql` directamente).

---

## Variables de entorno

El archivo `.env.example` incluye la configuración recomendada para desarrollo local y para despliegue en Railway. Puedes copiarlo a `.env` y ajustar los valores:

```env
# Railway/PostgreSQL usa esta variable en producción.
DATABASE_URL=
API_URL=http://localhost:3000

# Variables para PostgreSQL local. Reemplaza los valores de ejemplo.
DB_HOST=localhost
DB_PORT=5432
DB_NAME=miniblog_db
DB_USER=miniblog_user
DB_PASSWORD=tu_contraseña_local
PORT=3000
NODE_ENV=development
```

Notas importantes:

- `DATABASE_URL` es la variable principal para Railway y también se usa en producción cuando el proyecto se despliega en un servicio PostgreSQL gestionado.
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` y `DB_PASSWORD` permiten ejecutar la API localmente contra PostgreSQL.
- `API_URL` se usa para configurar la documentación OpenAPI y Swagger UI con la URL correcta.
- `PORT` es opcional en local y Railway lo inyecta automáticamente en producción.

---

## Instalación y ejecución local

1. Clona el proyecto y entra a la carpeta raíz:

```bash
git clone <url-del-repositorio>
cd Proyecto-API MiniBlog-N2-Arq
```

2. Instala las dependencias:

```bash
npm install
```

3. Crea tu archivo `.env` a partir del ejemplo:

```bash
cp .env.example .env
```

En Windows, si usas CMD:

```bash
copy .env.example .env
```

4. Crea la base de datos local y configura las credenciales dentro de `.env`.

5. Ejecuta el esquema y, opcionalmente, los datos de prueba:

```bash
psql -U miniblog_user -d miniblog_db -f database/setup.sql
psql -U miniblog_user -d miniblog_db -f database/seed.sql
```

6. Inicia la API:

```bash
npm start
```

7. Para desarrollo con recarga automática cuando cambian archivos:

```bash
npm run dev
```

La API queda disponible en:

```text
http://localhost:3000
```

El endpoint raíz (`GET /`) devuelve un mensaje de salud, y la documentación OpenAPI queda disponible en `http://localhost:3000/api-docs/`.

---

## Cómo ejecutar tests

Ejecuta toda la suite con:

```bash
npm test
```

La suite usa Vitest + Supertest y cubre los siguientes aspectos:

- Operaciones CRUD HTTP de autores, publicaciones y comentarios.
- Validaciones de IDs, campos obligatorios, longitudes máximas y actualizaciones vacías.
- Validación de `bio` como texto o `null`.
- Documentación OpenAPI y Swagger UI.
- Comportamiento de la API con datos de prueba y manejo de errores.

> Nota: las pruebas automatizadas no requieren una conexión PostgreSQL activa porque el proyecto encapsula la lógica con mocks en sus tests. Para probar manualmente las rutas con datos reales, sí necesitarás una base PostgreSQL configurada en `.env`.

---

## Cómo ejecutar la documentación OpenAPI

Con la API corriendo, puedes consultar la documentación en:

```text
http://localhost:3000/api-docs/
```

Y el contrato OpenAPI JSON en:

```text
http://localhost:3000/api-docs.json
```

En producción, por ejemplo con Railway, la documentación queda expuesta en:

```text
https://TU-DOMINIO.up.railway.app/api-docs/
https://TU-DOMINIO.up.railway.app/api-docs.json
```

La variable `API_URL` debe apuntar a la URL pública del servicio para que Swagger muestre correctamente el servidor asociado al documento.

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

### 1) Preparar el repositorio

1. Sube el proyecto a un repositorio de GitHub.
2. En Railway crea un nuevo servicio desde ese repositorio.
3. Añade un servicio PostgreSQL al mismo proyecto para tener una base de datos gestionada por Railway.

### 2) Variables de entorno recomendadas

En el panel de Railway del servicio de la API, configura aproximadamente esto:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
NODE_ENV=production
API_URL=https://TU-DOMINIO.up.railway.app
```

Si el nombre exacto de la referencia no coincide con `Postgres`, puedes pegar la cadena de conexión directamente en `DATABASE_URL`. También puedes definir manualmente `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` y `DB_PASSWORD`, aunque normalmente `DATABASE_URL` es suficiente cuando el servicio de base de datos está en Railway.

### 3) Internal URL vs Public URL

Es importante distinguir ambos conceptos:

- Public URL: es la URL externa del servicio de la API, por ejemplo `https://TU-DOMINIO.up.railway.app`. Es la que usan clientes, navegadores y Swagger.
- Internal URL: es la URL privada del servicio de PostgreSQL dentro de la red de Railway. Se usa para conexiones internas, migraciones y tareas administrativas entre servicios del mismo proyecto.

No publiques la Internal URL como endpoint de la API. La Internal URL sirve para ejecutar scripts de inicialización desde el mismo proyecto o desde otra herramienta conectada a Railway; la Public URL debe ser la que uses en `API_URL` y en la documentación.

### 4) Inicializar la base de datos en Railway

Una vez creado el servicio PostgreSQL en Railway:

```bash
psql "<internal-url-del-servicio-postgres>" -f database/setup.sql
psql "<internal-url-del-servicio-postgres>" -f database/seed.sql
```

> Si solo quieres el esquema base, basta con `database/setup.sql`. El archivo `seed.sql` es útil para cargar datos de ejemplo.

### 5) Ejecutar la aplicación

Railway ejecutará automáticamente el comando definido en `package.json`:

```json
"start": "node src/index.js"
```

Por lo tanto, no es necesario tocar la configuración de arranque si el servicio está conectado correctamente al repositorio.

### 6) Recomendaciones finales

- No subas `.env` al repositorio.
- Mantén `.env.example` actualizado como referencia base.
- Revisa que `API_URL` corresponda a la Public URL del servicio para que `/api-docs` y `/api-docs.json` generen enlaces correctos.
- Si usas `DATABASE_URL`, asegurate de que `src/config/database.js` reciba esa variable con el formato adecuado.

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

Se utilizó asistencia de IA como apoyo en el desarrollo, revisión y documentación del proyecto. El uso de IA quedó centrado en tareas de apoyo técnico y calidad, no como sustituto de la validación final por parte del equipo.

Puntos en los que se apoyó la IA:

- Revisión de la arquitectura por capas del proyecto y sugerencias de organización para rutas, controladores, servicios, middlewares y configuración.
- Verificación del flujo CRUD para `authors`, `posts` y `comments`.
- Revisión del esquema de PostgreSQL, especialmente claves foráneas, borrado en cascada y consistencia referencial.
- Confirmación de que las consultas SQL usan parámetros en lugar de interpolar datos recibidos desde el cliente.
- Mejora de validaciones para IDs, campos obligatorios, longitudes máximas, tipos de datos y manejo de payloads vacíos o parciales.
- Corrección del comportamiento de `bio: null` para limpiar el valor previo sin afectar el resto de la actualización.
- Ampliación de la suite de tests automatizados para cubrir casos reales de CRUD y validación.
- Revisión de la documentación OpenAPI, Swagger UI, variables de entorno y pasos para despliegue en Railway.
- Redacción y actualización de este README para que refleje el estado actual del proyecto.
- Diagnóstico y corrección de errores de despliegue y configuración en entornos públicos.

La validación final de los cambios se realizó ejecutando la suite de Vitest y revisando el comportamiento de la API en local y con documentación OpenAPI.

> La lógica de negocio, las credenciales y las decisiones de despliegue deben ser revisadas y validadas por el equipo antes de publicar cambios en producción.
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