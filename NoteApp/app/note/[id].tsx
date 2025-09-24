import {Pressable, StyleSheet, Text, View} from "react-native";
import {getNote, Note} from "@/lib/note_repo";
import {useCallback, useState} from "react";
import {Stack, useFocusEffect, useLocalSearchParams} from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";

export default function DetailNoteScreen() {
    const { id } = useLocalSearchParams();
    const [note, setNote] = useState<Note | null>(null);

    const readNote = useCallback(async () => {
        try {
            const note: Note | null = await getNote(Number(id));
            if(note == null) {
                throw new Error("No note found");
            }
            setNote(note);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            readNote();
        }, [readNote])
    );

    return (
        <>
            <Stack.Screen
                options={{
                    title: "",
                    headerRight: () => (
                        <Pressable>
                            <Text style={{fontSize: 18, paddingHorizontal: 10}}>
                                <FontAwesome6 name={"trash"} size={18}/>
                            </Text>
                        </Pressable>
                    ),
                }}
            />

            <View style={styles.container}>
                {note ? (
                    <>
                        <Text style={styles.title}>{note.title}</Text>
                        <Text style={styles.textBody}>{note.text}</Text>
                    </>
                ) : (
                    <Text>Loading...</Text>
                )}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 8,
    },
    textBody: {
        flex: 1,
        minHeight: 0,
        textAlignVertical: "top",
    },
})