// lib/db.ts
import * as SQLite from "expo-sqlite";

const DB_NAME = "note.db";
let db: SQLite.SQLiteDatabase | null = null;

export function getDb(): SQLite.SQLiteDatabase {
    if (!db) {
        db = SQLite.openDatabaseSync(DB_NAME);
    }
    return db;
}

export async function closeDbIfOpen() {
    if (db) {
        await db.closeAsync(); // chiude connessione/statement
        db = null;
    }
}

export async function resetDb() {
    // 1) chiudi se aperto
    await closeDbIfOpen();
    // 2) cancella file
    await SQLite.deleteDatabaseAsync(DB_NAME);
    // 3) NON riaprire qui: lascia che lo faccia migrate()/getDb()
}

export async function migrate(): Promise<void> {
    const _db = getDb(); // apre solo ora, dopo eventuale reset
    await _db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS note (
      id_note   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      title     TEXT NOT NULL,
      text      TEXT NOT NULL,
      createdAt INTEGER,
      updatedAt INTEGER
    );

    CREATE INDEX IF NOT EXISTS idx_note_updatedAt ON note(updatedAt);
    CREATE INDEX IF NOT EXISTS idx_note_title ON note(title);
  `);

    // Inserisci la nota di test SOLO se la tabella è vuota (evita duplicati a ogni migrate)
    await _db.runAsync(
        `
    INSERT INTO note (title, text, createdAt, updatedAt)
    SELECT ?, ?, ?, ?
    WHERE NOT EXISTS (SELECT 1 FROM note)
    `,
        ["TEST_NOTE", "TEXT OF FIRST NOTE", Date.now(), Date.now()]
    );
}
