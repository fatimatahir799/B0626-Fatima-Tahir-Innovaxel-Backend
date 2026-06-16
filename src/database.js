const Database = require('better-sqlite3');
const db = new Database('events.db');

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    total_seats INTEGER NOT NULL,
    available_seats INTEGER NOT NULL,
    event_date TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT NOT NULL,
    event_id INTEGER NOT NULL,
    registered_at TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    FOREIGN KEY (event_id) REFERENCES events(id),
    UNIQUE(user_name, event_id)
  );
`);

module.exports = db;