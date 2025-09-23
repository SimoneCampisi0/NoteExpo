import { Stack } from "expo-router";
import {View, Text, StyleSheet, TextInput} from "react-native";
import {useState} from "react";

export default function NewNoteScreen() {
    const [title, setTitle] = useState<string>("Prova");

    return (
        <>
            <Stack.Screen
                options={{
                    title: "New Note",
                }}
            />
            <View
                style={styles.card}
            >
                <TextInput
                    style={styles.inputText}
                    onChangeText={setTitle}
                    value={title}
                ></TextInput>
            </View>
        </>
    );

}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#f4f4f4",
        borderRadius: 12,
        paddingHorizontal: 6,
        paddingVertical: 4,
        marginHorizontal: 8,
        marginVertical: 8,
        height: "40%",
        display: "flex",
        flexDirection: "column",

        shadowColor: "#686868",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
    },
    inputText: {
        alignSelf: "flex-start",
        backgroundColor: "#ffefef"
    }
});