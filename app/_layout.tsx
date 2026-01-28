import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useUserStore } from '../store';
import { useLanguageStore } from '../store/languageStore';

export default function RootLayout() {
    const loadUser = useUserStore((state) => state.loadUser);
    const loadLanguage = useLanguageStore((state) => state.loadLanguage);

    useEffect(() => {
        loadUser();
        loadLanguage();
    }, []);

    return (
        <SafeAreaProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                    contentStyle: { backgroundColor: '#0f172a' },
                }}
            />
        </SafeAreaProvider>
    );
}
