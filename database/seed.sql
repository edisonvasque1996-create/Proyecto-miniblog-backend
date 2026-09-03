INSERT INTO authors (name, email, bio) VALUES
  ('Ana Perez', 'ana@example.com', 'Autora de tecnologia'),
  ('Carlos Gomez', 'carlos@example.com', 'Escritor y desarrollador')
ON CONFLICT (email) DO NOTHING;

INSERT INTO posts (title, content, author_id, published)
SELECT 'Primer post', 'Contenido de prueba del MiniBlog.', id, TRUE
FROM authors WHERE email = 'ana@example.com'
AND NOT EXISTS (SELECT 1 FROM posts WHERE title = 'Primer post');
