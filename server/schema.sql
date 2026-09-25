CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  public_key JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);