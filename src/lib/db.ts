import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

;(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS habits (
      id         TEXT PRIMARY KEY,
      name       TEXT NOT NULL,
      emoji      TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS completions (
      habit_id TEXT NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
      date     TEXT NOT NULL,
      PRIMARY KEY (habit_id, date)
    )
  `)
})().catch(console.error)

export default pool
