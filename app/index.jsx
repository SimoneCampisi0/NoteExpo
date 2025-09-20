import {Button, Text, View} from "react-native";
import {router} from "expo-router";

export default function HomeScreen() {
    return (
        <View>
            <Text>Home</Text>
            <Button
                title="Vai ai dettagli"
                onPress={() => router.push("/edit")}
            />
        </View>
    );
}

HomeScreen.options = {
    title: "Home",
}