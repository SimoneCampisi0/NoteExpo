// lib/db.ts
import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('note.db');

export async function migrate(): Promise<void> {
    await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS note (
      id_note   TEXT PRIMARY KEY NOT NULL,
      title     TEXT NOT NULL,
      text      TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_note_updatedAt ON note(updatedAt DESC);
    CREATE INDEX IF NOT EXISTS idx_note_title ON note(title);
  `);
}
