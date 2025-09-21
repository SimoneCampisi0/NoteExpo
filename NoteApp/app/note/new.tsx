import { Stack } from "expo-router";
import { View, Text } from "react-native";

export default function NewNoteScreen() {

    return (
        <>
            <Stack.Screen
                options={{
                    title: "New Note",
                }}
            />
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text>Crea una nuova nota qui</Text>
            </View>
        </>
    );

}