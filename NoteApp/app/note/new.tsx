import {Stack, useRouter} from "expo-router";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TextInput, Keyboard, TouchableWithoutFeedback, ScrollView, Pressable
} from "react-native";
import { useState } from "react";
import {FontAwesome6} from "@expo/vector-icons";
import {createNote, NewNote} from "@/lib/note_repo";

export default function NewNoteScreen() {
    const router = useRouter();
    const [title, setTitle] = useState("Prova");
    const [textBody, setTextBody] = useState("");

    async function onAddNewNote(): Promise<void> {
        console.log("onAddNewNote");
        console.log("noteTitle: ", title);
        console.log("noteBody: ", textBody);
        const newNote: NewNote = {
            title: title,
            text: textBody,
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
        };

        const idNote = await createNote(newNote);
        console.log("idNote: ", idNote);
        router.replace("/");
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: "New Note",
                    headerRight: () => (
                        <Pressable onPress={onAddNewNote}>
                            <Text style={{fontSize: 18, paddingHorizontal: 10}}>
                                <FontAwesome6 name={"check"} size={18}/>
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
                            <Text style={styles.inputTitle}>Note title:</Text>
                            <TextInput
                                style={styles.inputTextTitle}
                                value={title}
                                onChangeText={setTitle}
                            />

                            <TextInput
                                style={styles.inputTextBody}
                                value={textBody}
                                onChangeText={setTextBody}
                                multiline
                                scrollEnabled
                                placeholder="Write your note…"
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
        flex: 1,                // let children consume remaining height
        paddingHorizontal: 8,
        paddingVertical: 8,
        marginHorizontal: 8,
        marginVertical: 8,
        flexDirection: "column",
        gap: 6,
    },
    inputTitle: {
        fontSize: 18,
        marginBottom: 4,
    },
    inputTextTitle: {
        backgroundColor: "#dcdcdc",
        height: 40,
        paddingHorizontal: 8,
        borderRadius: 6,
    },
    inputTextBody: {
        backgroundColor: "#dcdcdc",
        flex: 1,
        minHeight: 0,
        padding: 8,
        borderRadius: 6,
        textAlignVertical: "top",
    },
});
