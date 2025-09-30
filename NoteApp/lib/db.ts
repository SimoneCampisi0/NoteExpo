// lib/db.ts
import * as SQLite from "expo-sqlite";
import {Asset} from "expo-asset"
import { File } from "expo-file-system";

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
    await closeDbIfOpen();
    await SQLite.deleteDatabaseAsync(DB_NAME);
}

async function runSqlScript(moduleRef: number): Promise<void> {
    const db = getDb();

    // Risolve e scarica l’asset
    const asset = Asset.fromModule(moduleRef);
    await asset.downloadAsync();
    const uri = asset.localUri ?? asset.uri;

    const file = new File(uri);
    const sql = await file.text();

    await db.execAsync(sql);
}

export async function migrate(): Promise<void> {
    await runSqlScript(require('../assets/sqlite/init_db.sql'));
    await runSqlScript(require('../assets/sqlite/full_text_search/init_full_text.sql'));
}
