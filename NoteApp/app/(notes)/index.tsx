import {FlatList, Pressable, Text, View, StyleSheet, TextInput} from "react-native";
import {useCallback, useLayoutEffect, useState} from "react";
import {listNotes, Note} from "@/lib/note_repo";
import {Stack, useFocusEffect, useNavigation, useRouter} from "expo-router";
import {FontAwesome6} from "@expo/vector-icons";

export default function NotesListScreen() {
    const router = useRouter();
    const [notes, setNotes] = useState<Note[]>([]);
    const navigation = useNavigation();
    const [isSearching, setIsSearching] = useState(false);
    const [query, setQuery] = useState("");

    const loadNotes = useCallback(async () => {
        try {
            const rows = await listNotes();
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

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "My Notes",
            headerTitle: () =>
                isSearching ? (
                    <View style={{flex: 1}}>
                        <TextInput
                            placeholder="Search..."
                            autoFocus
                            value={query}
                            onChangeText={setQuery}
                            style={{
                                backgroundColor: "#eee",
                                paddingHorizontal: 10,
                                borderRadius: 8,
                                height: 36,
                                width: "90%",
                            }}
                        />
                    </View>
                ) : (
                    <Text style={{fontSize: 18, fontWeight: "600"}}>My Notes</Text>
                ),
            headerLeft: () =>
                isSearching ? (
                    null
                ) : (
                    <Pressable onPress={() => router.push("/note/new")}>
                        <FontAwesome6 name="plus" size={18} style={{paddingHorizontal: 10}}/>
                    </Pressable>
                ),
            headerRight: () =>
                isSearching ?
                    <Pressable onPress={() => {
                        setIsSearching(false);
                        setQuery("");
                    }}>
                        <FontAwesome6 name="xmark" size={18} style={{paddingHorizontal: 10}}/>
                    </Pressable>
                    : (
                        <Pressable onPress={() => setIsSearching(true)}>
                            <FontAwesome6 name="magnifying-glass" size={18} style={{paddingHorizontal: 10}}/>
                        </Pressable>
                    ),
        })
    }, [navigation, isSearching, query]);

    function navigateToDetail(idNote: number): void {
        router.push(`/note/${idNote}`);
    }

    return (
        <>
            {/*<Stack.Screen*/}
            {/*    options={{*/}
            {/*        title: "My Notes",*/}
            {/*        headerBackVisible: false,*/}
            {/*        headerLeft: () => (*/}
            {/*            <Pressable onPress={() => console.log("open search bar") }>*/}
            {/*                <Text style={{fontSize: 18, paddingHorizontal: 10}}>*/}
            {/*                    <FontAwesome6 name={"magnifying-glass"} size={18}/>*/}
            {/*                </Text>*/}
            {/*            </Pressable>*/}
            {/*        ),*/}
            {/*        headerRight: () => (*/}
            {/*            <Pressable onPress={() => router.push("/note/new")}>*/}
            {/*                <Text style={{fontSize: 18, paddingHorizontal: 10}}>*/}
            {/*                    <FontAwesome6 name={"plus"} size={18}/>*/}
            {/*                </Text>*/}
            {/*            </Pressable>*/}
            {/*        ),*/}
            {/*    }}*/}
            {/*/>*/}
            <Stack.Screen options={{headerBackVisible: false}}/>


            {notes.length > 0 ? (
                <FlatList
                    style={{marginTop: 10}}
                    data={notes}
                    keyExtractor={(item) => item.id_note.toString()}
                    renderItem={({item}) => (
                        <Pressable style={styles.card} onPress={() => navigateToDetail(item.id_note)}>
                            {/* Riga con titolo e button */}
                            <View style={styles.headerRow}>
                                <Text style={styles.title}>{item.title}</Text>
                            </View>

                            {/* Corpo del testo */}
                            <Text numberOfLines={3} style={styles.body}>
                                {item.text}
                            </Text>
                        </Pressable>
                    )}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No notes found.</Text>
                </View>
            )
            }


        </>
    );

}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#f4f4f4",
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 20,
        marginVertical: 8,

        shadowColor: "#686868",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {width: 0, height: 2},
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
        color: "#000000",
    },
    body: {
        fontSize: 14,
        color: "#000000",
        marginTop: 8,
    },
    emptyContainer: {
        flex: 1,
        marginTop: '80%',
        paddingHorizontal: 20,
    },
    emptyText: {
        fontSize: 22,
        textAlign: "center",
    },
});
