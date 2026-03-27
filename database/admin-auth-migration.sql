ALTER TABLE users
  ADD COLUMN IF NOT EXISTS active TINYINT(1) NOT NULL DEFAULT 1;

ALTER TABLE users
  MODIFY COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user';

UPDATE users
SET role = 'user'
WHERE role IS NULL OR role NOT IN ('admin', 'user');

ALTER TABLE users
  MODIFY COLUMN role ENUM('admin', 'user') NOT NULL DEFAULT 'user';

-- Torna um usuario especifico em admin.
-- Troque o e-mail abaixo pelo seu usuario principal.
UPDATE users
SET role = 'admin', active = 1
WHERE email = 'SEU_EMAIL_ADMIN@EXEMPLO.COM';

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

-- Para criar um admin totalmente novo, insira manualmente um usuario com password_hash em bcrypt.
