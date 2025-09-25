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
    const [title, setTitle] = useState("");
    const [textBody, setTextBody] = useState("");

    async function onAddNewNote(): Promise<void> {
        if(title.length === 0 && textBody.length === 0) {
            return;
        }
        const newNote: NewNote = {
            title: title,
            text: textBody,
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
        };

        await createNote(newNote);
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
        flex: 1,                // let children consume remaining height
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
