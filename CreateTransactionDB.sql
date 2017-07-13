CREATE TABLE transactions (
   id  SERIAL PRIMARY KEY,
   query TEXT NOT NULL,
   bindings TEXT,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)