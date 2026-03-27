ALTER TABLE users
  ADD COLUMN IF NOT EXISTS active TINYINT(1) NOT NULL DEFAULT 1;

ALTER TABLE users
  MODIFY COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user';

UPDATE users
SET role = 'user'
WHERE role IS NULL OR role NOT IN ('admin', 'user');

ALTER TABLE users
  MODIFY COLUMN role ENUM('admin', 'user') NOT NULL DEFAULT 'user';

INSERT INTO companies (name, legal_name, document, email, phone)
SELECT 'Horse Flow Admin', NULL, NULL, 'feehsantosc10@gmail.com', NULL
WHERE NOT EXISTS (
  SELECT 1
  FROM companies
  LIMIT 1
);

-- Torna o seu usuario especifico em admin.
UPDATE users
SET role = 'admin', active = 1
WHERE email = 'feehsantosc10@gmail.com';

-- Cria o admin se ele ainda nao existir.
INSERT INTO users (company_id, name, email, password_hash, role, active)
SELECT
  (SELECT id FROM companies ORDER BY id ASC LIMIT 1),
  'Felipe',
  'feehsantosc10@gmail.com',
  '$2a$10$IAYxo6DGIPPZV2RH4GkaheHXDjyf9/rw9MI4H.j5ufGkt.nQw/Qfm',
  'admin',
  1
WHERE NOT EXISTS (
  SELECT 1
  FROM users
  WHERE email = 'feehsantosc10@gmail.com'
);

-- Se ainda nao existir nenhum admin, promove o primeiro usuario ativo encontrado.
UPDATE users
SET role = 'admin', active = 1
WHERE id = (
  SELECT id_to_promote
  FROM (
    SELECT id AS id_to_promote
    FROM users
    ORDER BY id ASC
    LIMIT 1
  ) AS first_user
)
AND NOT EXISTS (
  SELECT 1
  FROM (
    SELECT id
    FROM users
    WHERE role = 'admin'
    LIMIT 1
  ) AS admin_check
);

-- Usuario admin inicial:
-- email: feehsantosc10@gmail.com
-- senha: Felipe@2004
