import {
    Keyboard,
    Pressable, SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {deleteNote, getNote, Note, updateNote} from "@/lib/note_repo";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Stack, useFocusEffect, useLocalSearchParams, useNavigation, useRouter} from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import {usePreventRemove} from "@react-navigation/native";
import dayjs from "dayjs";

export default function DetailNoteScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const { id } = useLocalSearchParams();
    const [note, setNote] = useState<Note | null>(null);
    const [title, setTitle] = useState<string>("");
    const [textBody, setTextBody] = useState<string>("");
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isSavingRef = useRef(false);

    /*
    * Hook che permette di memorizzare dei dati
    * che vengono refreshati solo se cambia almeno una dipendenza.
    * In questo caso, calcola se i valori digitati dall'utente
    * sono diversi da quelli originali della nota.
    * In questo caso, memorizza il boolean ritornato.
    * */
    const isDirty = useMemo(() => {
        if (!note) return false;
        return note.title !== title || note.text !== textBody;
    }, [note, title, textBody]);


    const readNote = useCallback(async () => {
        try {
            const note: Note | null = await getNote(Number(id));
            if(note == null) {
                throw new Error("No note found");
            }
            setNote(note);
            setTitle(note.title);
            setTextBody(note.text);
        } catch (err) {
            console.error(err);
        }
    }, []);

    async function deleteSelectedNote(): Promise<void> {
        if(!note) return;
        await deleteNote(note.id_note);
        router.push("/");
    }

    useFocusEffect(
        useCallback(() => {
            readNote();
        }, [readNote])
    );

    async function saveNote(): Promise<void> {
        if(note) {
            setNote({
                ...note,
                title: title,
                text: textBody
            })
        }

        await updateNote(
            note!.id_note,
            title,
            textBody,
            new Date().getTime()
        );
        console.log("Note saved")
    }

    /**
     * FlushSave
     *
     * Funzione asincrona che forza il salvataggio immediato della nota corrente,
     * annullando qualsiasi timer di salvataggio differito (debounce).
     *
     * Comportamento:
     * - Se è attivo un timer di autosalvataggio (`saveTimeoutRef`), lo cancella.
     * - Se non ci sono modifiche rispetto all'ultima versione salvata (titolo e testo invariati),
     *   la funzione termina senza fare nulla.
     * - Se è già in corso un salvataggio (`isSavingRef.current === true`), evita di avviarne un altro in parallelo.
     * - Altrimenti:
     *   1. Imposta il flag `isSavingRef.current = true` per marcare il salvataggio in corso.
     *   2. Aggiorna lo stato locale della nota (`setNote`) con i valori correnti di `title` e `textBody`
     *      e con il nuovo timestamp `updatedAt`.
     *   3. Persiste la modifica nel database richiamando `updateNote(...)`.
     *   4. Infine, resetta il flag `isSavingRef.current = false`, anche in caso di errore.
     *
     * Utilità:
     * - Viene usata nei casi in cui è necessario salvare immediatamente (es. prima di uscire dallo screen),
     *   bypassando il normale debounce di 1.5 secondi usato da `saveNote`.
     * - Garantisce che non vengano effettuati salvataggi multipli concorrenti
     *   e che i dati dello stato restino coerenti con quanto scritto su database.
     */
    const flushSave = useCallback(async () => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
            saveTimeoutRef.current = null;
        }

        if (!note || !isDirty || isSavingRef.current) return;

        isSavingRef.current = true;
        try {
            const now = Date.now();

            await updateNote(note.id_note, title, textBody, now);

            setNote(prev => (prev ? { ...prev, title, text: textBody, updatedAt: now } as Note : prev));
        } catch (e) {
            console.error(e);
        } finally {
            isSavingRef.current = false;
        }
    }, [note?.id_note, title, textBody, isDirty]);

    useEffect(() => {
        /* A ogni modifica del title o del body, viene resettato il timer */
        if(!isDirty) return;

        if(saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(() => {
            saveNote();
        }, 1500);

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };

    }, [title, textBody]);

    /**
     * usePreventRemove
     *
     * Hook fornito da React Navigation che intercetta i tentativi di uscire
     * dallo screen (back button, swipe back, ecc.) e permette di bloccarli
     * in base a una condizione.
     *
     * Parametri:
     * - `isDirty || isSavingRef.current` → flag che indica quando la rimozione
     *   dello screen deve essere impedita:
     *   - `isDirty`: ci sono modifiche non ancora salvate
     *   - `isSavingRef.current`: è in corso un salvataggio asincrono
     *
     * - Callback asincrona: viene eseguita se l’utente tenta di uscire quando
     *   la prevenzione è attiva.
     *
     * Comportamento della callback:
     * - Se `isDirty` è `false`, significa che non ci sono modifiche pendenti:
     *   non viene fatto nulla (l’hook ha già sbloccato la navigazione).
     * - Se invece `isDirty` è `true`:
     *   1. Si invoca `flushSave()` per forzare il salvataggio immediato
     *      delle modifiche rimaste in sospeso (annullando il debounce).
     *   2. Dopo che il salvataggio è terminato, si rilancia manualmente
     *      l’azione di navigazione originale con `navigation.dispatch(data.action)`,
     *      permettendo così la rimozione dello screen.
     *
     * Utilità:
     * - Garantisce che l’utente non possa chiudere accidentalmente lo screen
     *   lasciando modifiche non salvate.
     * - Forza un flush asincrono prima di consentire la navigazione,
     *   mantenendo i dati consistenti tra stato locale e database.
     */
    usePreventRemove(
        isDirty || isSavingRef.current,
        async ({ data }) => {
            // Se non è sporco / modificato, non fare nulla: l'hook ha già gestito il default
            if (!isDirty) return;

            await flushSave();
            navigation.dispatch(data.action);
        }
    );

    return (
        <>
            <Stack.Screen
                options={{
                    title: "",
                    headerRight: () => (
                        <Pressable onPress={deleteSelectedNote}>
                            <Text style={{fontSize: 18, paddingHorizontal: 10}}>
                                <FontAwesome6 name={"trash"} size={18}/>
                            </Text>
                        </Pressable>
                    ),
                }}
            />

            <SafeAreaView style={styles.root}>
                {/* Tap fuori -> chiude tastiera */}
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    {/* Drag sulla ScrollView -> chiude tastiera (iOS; su Android dipende dalla versione) */}
                    <ScrollView
                        style={styles.root}
                        contentContainerStyle={styles.scrollContent}
                        keyboardDismissMode="on-drag"
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.card}>
                            <TextInput
                                style={styles.inputTextTitle}
                                value={title}
                                onChangeText={setTitle}
                                placeholder={"Title..."}
                                placeholderTextColor="#999"
                            />

                            {note && note.updatedAt && (
                                <View>
                                  <Text>{dayjs(note.updatedAt).format("YYYY-MM-DD HH:mm")}</Text>
                                </View>
                                )
                            }

                            {note && !note.updatedAt && (
                                <View>
                                    <Text>{dayjs(note.createdAt).format("YYYY-MM-DD HH:mm")}</Text>
                                </View>
                            )}

                            <TextInput
                                style={styles.inputTextBody}
                                value={textBody}
                                onChangeText={setTextBody}
                                multiline
                                scrollEnabled
                                placeholder="Write your note…"
                                placeholderTextColor="#999"
                            />
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    scrollContent: { flexGrow: 1 },
    card: {
        flex: 1,
        paddingHorizontal: 8,
        paddingVertical: 8,
        marginHorizontal: 8,
        marginVertical: 8,
        flexDirection: "column",
        gap: 2,
    },
    inputTextTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 8,
    },
    inputTextBody: {
        flex: 1,
        minHeight: 0,
        textAlignVertical: "top",
    },
});