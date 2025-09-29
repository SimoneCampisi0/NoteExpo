CREATE VIRTUAL TABLE virtual_note
USING FTS5(title, text);

INSERT INTO virtual_note(title, text)
SELECT title, text FROM note;

SELECT *
FROM virtual_note
WHERE virtual_note MATCH 'example'

--TODO: scrivere trigger di create/update/delete di una nota
--Funzionano in locale
DROP TRIGGER IF EXISTS note_ai;
CREATE TRIGGER note_ai
    AFTER INSERT ON note
BEGIN
    INSERT INTO virtual_note(rowid, title, text)
    VALUES (NEW.id_note, NEW.title, NEW.text);
END;

-- UPDATE: elimina la vecchia versione e inserisce la nuova
DROP TRIGGER IF EXISTS note_au;
CREATE TRIGGER note_au
    AFTER UPDATE OF title, text ON note
BEGIN
    DELETE FROM virtual_note WHERE rowid = NEW.id_note;  -- ← al posto di ('delete', …)
    INSERT INTO virtual_note(rowid, title, text)
    VALUES (NEW.id_note, NEW.title, NEW.text);
END;

-- DELETE: rimuove dall'indice
DROP TRIGGER IF EXISTS note_ad;
CREATE TRIGGER note_ad
    AFTER DELETE ON note
BEGIN
    DELETE FROM virtual_note WHERE rowid = OLD.id_note;  -- ← al posto di ('delete', …)
END;