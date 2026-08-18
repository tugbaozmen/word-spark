import * as SQLite from 'expo-sqlite';

// Renamed from word-spark.db: the schema changed from frontend/backend
// definitions to a single English word + Turkish translation pair, so a
// fresh file avoids column-mismatch errors on devices with the old schema.
const DATABASE_NAME = 'word-spark-vocab.db';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DATABASE_NAME);
  }
  return dbPromise;
}

export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  const db = await getDatabase();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS flashcards (
      id TEXT PRIMARY KEY NOT NULL,
      word TEXT NOT NULL,
      translation TEXT NOT NULL,
      interval INTEGER NOT NULL DEFAULT 0,
      repetition INTEGER NOT NULL DEFAULT 0,
      easeFactor REAL NOT NULL DEFAULT 2.5,
      dueDate TEXT NOT NULL
    );
  `);
  return db;
}
