// lib/note_repo.ts
import { getDb } from "./db";

export type Note = {
    id_note: number;        // INTEGER in SQLite => number
    title: string;
    text: string;
    createdAt: number;      // timestamp ms
    updatedAt: number;      // timestamp ms
};

// Per la creazione non inviare id_note
export type NewNote = Omit<Note, "id_note">;

// CREATE
export async function createNote(note: NewNote): Promise<number> {
    const db = getDb();
    const { title, text, createdAt, updatedAt } = note;

    const res = await db.runAsync(
        `INSERT INTO note (title, text, createdAt, updatedAt)
         VALUES (?, ?, ?, ?)`,
        [title, text, createdAt, updatedAt]
    );

    // opzionale: restituisco l'id generato
    return res.lastInsertRowId as number;
}

// READ (tutte)
export async function listNotes(): Promise<Note[]> {
    const db = getDb();
    return db.getAllAsync<Note>(
        `SELECT id_note, title, text, createdAt, updatedAt
         FROM note
         ORDER BY updatedAt DESC`
    );
}

// // SEARCH / READ full text with filters
export async function searchNotes(inputText: string): Promise<Note[]> {
    const db = getDb();
    const normalizedQuery = (inputText ?? '').trim().toLowerCase();
    if(!normalizedQuery || normalizedQuery === '') {
        return db.getAllAsync<Note>(`
            SELECT id_note, title, text, createdAt, updatedAt
            FROM note
            ORDER BY updatedAt DESC
        `);
    }

    const ftsQuery = normalizedQuery + "*";
    return db.getAllAsync<Note>(
        `
            SELECT *
            FROM virtual_note v
            join note n on n.id_note = v.rowid
            WHERE virtual_note MATCH ?
            ORDER BY n.updatedAt DESC
        `,
        [ftsQuery]
    );
}

// READ (singola)
export async function getNote(id_note: number): Promise<Note | null> {
    const db = getDb();
    return db.getFirstAsync<Note>(
        `SELECT id_note, title, text, createdAt, updatedAt
         FROM note
         WHERE id_note = ?`,
        [id_note]
    );
}

// UPDATE
export async function updateNote(
    id_note: number,
    title: string,
    text: string,
    updatedAt: number
): Promise<void> {
    const db = getDb();

    await db.runAsync(
        `UPDATE note
         SET title = ?, text = ?, updatedAt = ?
         WHERE id_note = ?`,
        [title, text, updatedAt, id_note]
    );
}

// DELETE
export async function deleteNote(id_note: number): Promise<void> {
    const db = getDb();
    await db.runAsync(`DELETE FROM note WHERE id_note = ?`, [id_note]);
}
