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