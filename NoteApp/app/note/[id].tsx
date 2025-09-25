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
import {useCallback, useEffect, useRef, useState} from "react";
import {Stack, useFocusEffect, useLocalSearchParams, useRouter} from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";

export default function DetailNoteScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [note, setNote] = useState<Note | null>(null);
    const [title, setTitle] = useState<string>("");
    const [textBody, setTextBody] = useState<string>("");
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    useEffect(() => {
        /* A ogni modifica del title o del body, viene resettato il timer */
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