import { db } from './db';

// CREATE
export async function createNote({ id_note, title, text, createdAt, updatedAt }) {
    await db.runAsync(
        `INSERT INTO note (id_note, title, text, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?)`,
        [id_note, title, text, createdAt, updatedAt]
    );
}

// READ (tutte)
export async function listNotes() {
    return await db.getAllAsync(
        `SELECT id_note, title, text, createdAt, updatedAt
     FROM note
     ORDER BY updatedAt DESC`
    );
}

// READ (singola)
export async function getNote(id_note) {
    return await db.getFirstAsync(
        `SELECT id_note, title, text, createdAt, updatedAt
     FROM note
     WHERE id_note = ?`,
        [id_note]
    );
}

// UPDATE
export async function updateNote({ id_note, title, text, updatedAt }) {
    await db.runAsync(
        `UPDATE note
     SET title = ?, text = ?, updatedAt = ?
     WHERE id_note = ?`,
        [title, text, updatedAt, id_note]
    );
}

// DELETE
export async function deleteNote(id_note) {
    await db.runAsync(`DELETE FROM note WHERE id_note = ?`, [id_note]);
}
