Diseño del Esquema de Datos e Integridad Referencial
Objetivo: Crear el esquema en PostgreSQL asegurando relaciones de clave foránea y borrado en cascada para evitar datos huérfanos.

[authors] (1) ───< (N) [posts] (1) ───< (N) [comments]
  id (PK)                 id (PK)             id (PK)
                          author_id (FK)      post_id (FK)
                                              author_id (FK)

Modulo 1 Base de Datos e Integridad Referencial (PostgreSQL) 
check

Módulo 2: Configuración del Proyecto Node.js e Infraestructura
check

Módulo 3: Servidor Principal y CRUD de Autores



