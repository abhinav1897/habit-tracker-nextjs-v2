import Database from 'better-sqlite3'
import path from 'path'

const db = new Database(path.join(process.cwd(), 'habits.db'))

db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS habits (
    id         TEXT PRIMARY KEY,
    name       TEXT NOT NULL,
    emoji      TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS completions (
    habit_id TEXT NOT NULL,
    date     TEXT NOT NULL,
    PRIMARY KEY (habit_id, date),
    FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
  );
`)

export default db
