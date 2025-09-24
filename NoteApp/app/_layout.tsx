// app/_layout.tsx
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { migrate, resetDb } from "@/lib/db";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                if (__DEV__) {
                    // ⚠️ Solo in sviluppo! In produzione NON cancellare.
                    // await resetDb();
                }
                await migrate();
                setReady(true);
            } catch (err) {
                console.log("DB init error:", err);
                setReady(true); // evita soft-lock;
            }
        })();
    }, []);

    if (!ready) {
        // Non montare gli screen finché il DB non è pronto
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator />
            </View>
        );
    }

    return <Stack />;
}
