import {FlatList, Pressable, Text, View, StyleSheet, Button} from "react-native";
import {useCallback, useEffect, useState} from "react";
import {listNotes, Note} from "@/lib/note_repo";
import {Stack, useFocusEffect, useRouter} from "expo-router";
import {FontAwesome, FontAwesome6} from "@expo/vector-icons";

export default function NotesListScreen() {
    const router = useRouter();
    const [notes, setNotes] = useState<Note[]>([]);

    const loadNotes = useCallback(async () => {
        try {
            const rows = await listNotes();
            console.log("rows obtained: ", rows);
            setNotes(rows);
        } catch (err) {
            console.log("error during notes loading: ", err);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadNotes();
        }, [loadNotes])
    );

    return (
        <>
            <Stack.Screen
                options={{
                    title: "My Notes",
                    headerRight: () => (
                        <Pressable onPress={() => router.push("/note/new")}>
                            <Text style={{fontSize: 18, paddingHorizontal: 10}}>
                                <FontAwesome6 name={"plus"} size={18}/>
                            </Text>
                        </Pressable>
                    ),
                }}
            />

            <FlatList
                data={notes}
                keyExtractor={(item) => item.id_note.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        {/* Riga con titolo e button */}
                        <View style={styles.headerRow}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Pressable onPress={() => console.log("apri nota", item.id_note)}>
                                <FontAwesome6 name="arrow-right" size={18} color="white" />
                            </Pressable>
                        </View>

                        {/* Corpo del testo */}
                        <Text numberOfLines={3} style={styles.body}>
                            {item.text}
                        </Text>
                    </View>
                )}
            />


        </>
    );

}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#101010",
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 20,
        marginVertical: 8,

        shadowColor: "#686868",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center", // allinea verticalmente testo e bottone
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        color: "#ffffff",
    },
    body: {
        fontSize: 14,
        color: "#ffffff",
        marginTop: 8,
    },
});
