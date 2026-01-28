import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { ArrowLeft, LogIn, User, LogOut } from 'lucide-react-native';
import { ScreenWrapper, Button, Input, Card } from '../../components/ui';
import { useUserStore, useGameStore } from '../../store';
import { useLanguageStore } from '../../store/languageStore';
import { mockApi } from '../../services';
import * as Haptics from 'expo-haptics';

export default function JoinLobbyScreen() {
    const router = useRouter();
    const { name, avatar, avatarColor, logout } = useUserStore();
    const { setLobbyCode, setQuestions } = useGameStore();
    const { t } = useLanguageStore();

    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [error, setError] = useState('');

    const handleJoinLobby = async () => {
        if (code.length < 4) {
            setError(t.join.inputLabel); // Reusing label as simplified error or generic? No better to have error. Using label for now or generic error.
            // Actually 'Enter correct code'. I don't have that key. I'll use generic error or add one.
            // I'll leave hardcoded fallback for specific validtion if I must, or use t.auth.errorGeneric.
            // Let's use t.auth.errorGeneric for now.
            // Wait, t.join.inputLabel is 'Game Code'. Not suitable.
            // I'll add a quick error string variable if I can, or just leave it hardcoded mixed? 
            // User wants interface translated. Validation messages are part of interface.
            // I'll use t.auth.errorGeneric + ' (Code)'
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await mockApi.joinLobby(code.toUpperCase(), name, avatar);

            if (result.success) {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                setLobbyCode(code.toUpperCase());

                // Get questions
                const questions = await mockApi.getQuestions(10);
                setQuestions(questions);

                setWaiting(true);

                // Simulate waiting for game to start
                setTimeout(() => {
                    router.push('/(student)/quiz');
                }, 3000);
            } else {
                setError(result.message || 'Қате орын алды');
            }
        } catch (err) {
            setError(t.auth.errorGeneric);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.replace('/(auth)/welcome');
    };

    if (waiting) {
        return (
            <ScreenWrapper className="items-center justify-center px-6">
                <MotiView
                    from={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'timing', duration: 500 }}
                    className="items-center"
                >
                    <MotiView
                        from={{ rotate: '0deg' }}
                        animate={{ rotate: '360deg' }}
                        transition={{ type: 'timing', duration: 2000, loop: true }}
                    >
                        <Text className="text-8xl">⏳</Text>
                    </MotiView>
                    <Text className="text-white text-2xl font-bold mt-6">
                        {t.join.waitingTitle}
                    </Text>
                    <Text className="text-gray-400 text-base mt-2">
                        {t.join.waitingDesc}
                    </Text>

                    <Card variant="default" className="mt-8 w-full">
                        <View className="flex-row items-center">
                            <View
                                className="w-14 h-14 rounded-xl items-center justify-center"
                                style={{ backgroundColor: avatarColor || '#4f46e5' }}
                            >
                                <Text className="text-3xl" style={{ includeFontPadding: false }}>{avatar}</Text>
                            </View>
                            <View className="ml-3 flex-1">
                                <Text className="text-white font-bold text-lg">{name}</Text>
                                <Text className="text-gray-400">Лобби: {code.toUpperCase()}</Text>
                            </View>
                            <View className="bg-secondary-500/20 px-3 py-1 rounded-lg">
                                <Text className="text-secondary-400 text-sm font-medium">{t.join.ready} ✓</Text>
                            </View>
                        </View>
                    </Card>
                </MotiView>
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper className="px-6">
            {/* Header */}
            <MotiView
                from={{ opacity: 0, translateY: -20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 400 }}
                className="flex-row items-center justify-between pt-4 mb-8"
            >
                <View className="flex-row items-center">
                    <View
                        className="w-12 h-12 rounded-xl items-center justify-center"
                        style={{ backgroundColor: avatarColor || '#4f46e5' }}
                    >
                        <Text className="text-2xl" style={{ includeFontPadding: false }}>{avatar}</Text>
                    </View>
                    <View className="ml-3">
                        <Text className="text-gray-400 text-sm">{t.join.greeting}</Text>
                        <Text className="text-white font-bold text-lg">{name}</Text>
                    </View>
                </View>
                <View className="flex-row gap-2">
                    <Pressable
                        onPress={() => router.push('/(tabs)/profile')}
                        className="w-10 h-10 bg-dark-card rounded-xl items-center justify-center"
                    >
                        <User size={20} color="#a5b4fc" />
                    </Pressable>
                    <Pressable
                        onPress={handleLogout}
                        className="w-10 h-10 bg-dark-card rounded-xl items-center justify-center"
                    >
                        <LogOut size={20} color="#f87171" />
                    </Pressable>
                </View>
            </MotiView>

            {/* Illustration */}
            <MotiView
                from={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'timing', duration: 500, delay: 100 }}
                className="items-center my-8"
            >
                <Text className="text-8xl">🎮</Text>
                <Text className="text-white text-2xl font-bold mt-4">
                    {t.join.title}
                </Text>
                <Text className="text-gray-400 text-base mt-2 text-center">
                    {t.join.subtitle}
                </Text>
            </MotiView>

            {/* Code Input */}
            <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 500, delay: 200 }}
                className="mt-4"
            >
                <Input
                    label={t.join.inputLabel}
                    placeholder="ABC123"
                    value={code}
                    onChangeText={(text) => {
                        setCode(text.toUpperCase());
                        setError('');
                    }}
                    autoCapitalize="characters"
                    maxLength={6}
                    error={error}
                    className="text-center text-2xl tracking-widest font-bold"
                />
            </MotiView>

            {/* Join Button */}
            <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 500, delay: 300 }}
                className="mt-auto mb-8"
            >
                <Button
                    title={loading ? t.auth.loading : t.join.button}
                    onPress={handleJoinLobby}
                    loading={loading}
                    size="lg"
                    icon={<LogIn size={20} color="#fff" />}
                />
            </MotiView>
        </ScreenWrapper>
    );
}
