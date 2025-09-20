import { Stack } from 'expo-router';
import { migrate } from "../lib/db"
import {useEffect} from "react";

export default function Layout() {
    useEffect(() => {
        (async () => { await migrate() })();
    })

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#000000',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen
                name="index"
                options={{ title: "Home" }}
            />
            <Stack.Screen
                name="edit"
                options={{ title: "Edit note" }}
            />
        </Stack>
    );
}