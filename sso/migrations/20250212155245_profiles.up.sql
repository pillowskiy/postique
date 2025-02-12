CREATE TABLE IF NOT EXISTS profiles (
    user_id UUID UNIQUE NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    username VARCHAR(255) UNIQUE NOT NULL,
    avatar_path TEXT DEFAULT NULL,
    bio TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles (username);

INSERT INTO profiles (user_id, username)
SELECT
    u.id AS user_id,
    substr(md5(random()::TEXT), 1, 12) AS username
FROM users AS u ON CONFLICT DO NOTHING;
