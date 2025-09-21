import { db } from './db';

export type Note = {
    id_note: string;
    title: string;
    text: string;
    createdAt: number;
    updatedAt: number;
};

// CREATE
export async function createNote(note: Note): Promise<void> {
    const { id_note, title, text, createdAt, updatedAt } = note;
    await db.runAsync(
        `INSERT INTO note (id_note, title, text, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?)`,
        [id_note, title, text, createdAt, updatedAt]
    );
}

// READ (tutte)
export async function listNotes(): Promise<Note[]> {
    return db.getAllAsync<Note>(
        `SELECT id_note, title, text, createdAt, updatedAt
     FROM note
     ORDER BY updatedAt DESC`
    );
}

// READ (singola)
export async function getNote(id_note: string): Promise<Note | null> {
    return db.getFirstAsync<Note>(
        `SELECT id_note, title, text, createdAt, updatedAt
     FROM note
     WHERE id_note = ?`,
        [id_note]
    );
}

// UPDATE
export async function updateNote(
    args: Pick<Note, 'id_note' | 'title' | 'text' | 'updatedAt'>
): Promise<void> {
    const { id_note, title, text, updatedAt } = args;
    await db.runAsync(
        `UPDATE note
         SET title = ?, text = ?, updatedAt = ?
         WHERE id_note = ?`,
        [title, text, updatedAt, id_note]
    );
}

// DELETE
export async function deleteNote(id_note: string): Promise<void> {
    await db.runAsync(`DELETE FROM note WHERE id_note = ?`, [id_note]);
}
