import express from 'express';
import pg from 'pg';
import { normalizeNumber, isValidLuhn } from './luhn.js';

const { Pool } = pg;
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.POSTGRES_DB || 'luhn',
  user: process.env.POSTGRES_USER || 'luhn_user',
  password: process.env.POSTGRES_PASSWORD || 'luhn_pass'
});

async function waitForDb() {
  for (let i = 0; i < 30; i++) {
    try {
      await pool.query('SELECT 1');
      return;
    } catch {
      console.log('Esperando DB...');
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  throw new Error('DB no disponible');
}

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS validations (
      id SERIAL PRIMARY KEY,
      number VARCHAR(64),
      valid BOOLEAN,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

app.post('/validate', async (req, res) => {
  const raw = req.body?.number ?? '';
  const number = normalizeNumber(raw);

  if (!number || /[^0-9]/.test(number)) {
    return res.json({ valid: false });
  }

  const valid = isValidLuhn(number);

  await pool.query(
    'INSERT INTO validations(number, valid) VALUES($1, $2)',
    [number, valid]
  );

  res.json({ valid });
});

app.get('/history', async (req, res) => {
  const result = await pool.query(
    'SELECT number, valid, created_at FROM validations ORDER BY created_at DESC LIMIT 10'
  );
  res.json(result.rows);
});

(async () => {
  await waitForDb();
  await initDb();

  app.listen(port, () => {
    console.log(`Backend en ${port}`);
  });
})();
