import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { ArrowLeft, Copy, Share2, Play, Users, Trophy } from 'lucide-react-native';
import { ScreenWrapper, Button, Card, AnimatedListItem } from '../../components/ui';
import { useGameStore, Player } from '../../store';
import { useLanguageStore } from '../../store/languageStore';
import { mockApi } from '../../services';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';

export default function SessionMonitorScreen() {
    const router = useRouter();
    const { lobbyCode, questions, players, addPlayer, startGame, startTestMode } = useGameStore();
    const { t } = useLanguageStore();
    const [isWaiting, setIsWaiting] = useState(true);

    // Simulate students joining
    useEffect(() => {
        const mockJoins = [
            { id: '1', name: 'Арман', avatar: '😎', score: 0 },
            { id: '2', name: 'Айгерім', avatar: '🦋', score: 0 },
            { id: '3', name: 'Нұрсұлтан', avatar: '🔥', score: 0 },
            { id: '4', name: 'Дана', avatar: '💎', score: 0 },
        ];

        mockJoins.forEach((player, index) => {
            setTimeout(() => {
                addPlayer(player);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }, 1500 * (index + 1));
        });
    }, []);

    const handleCopyCode = async () => {
        await Clipboard.setStringAsync(lobbyCode);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `AI-Tutor Qazaq викторинасына қосылыңыз! Код: ${lobbyCode}`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleStartGame = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        startGame();
        // In real app, this would start the game for all connected students
        router.replace('/(teacher)/dashboard');
    };

    return (
        <ScreenWrapper>
            {/* Header */}
            <MotiView
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: 'timing', duration: 400 }}
                className="flex-row items-center px-6 pt-4 mb-6"
            >
                <Pressable
                    onPress={() => router.back()}
                    className="w-10 h-10 bg-dark-card rounded-xl items-center justify-center"
                >
                    <ArrowLeft size={24} color="#fff" />
                </Pressable>
                <Text className="text-white text-xl font-semibold ml-4">
                    {t.teacher.sessionTitle}
                </Text>
            </MotiView>

            {/* Lobby Code Display */}
            <MotiView
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'timing', duration: 500 }}
                className="px-6 mb-6"
            >
                <Card variant="elevated" className="bg-gradient-to-br from-primary-600 to-accent-violet items-center py-8">
                    <Text className="text-white/80 text-base font-medium mb-2">
                        {t.teacher.lobbyCode}
                    </Text>
                    <Text className="text-white text-5xl font-bold tracking-widest mb-4">
                        {lobbyCode || 'ABC123'}
                    </Text>
                    <View className="flex-row gap-3">
                        <Pressable
                            onPress={handleCopyCode}
                            className="flex-row items-center bg-white/20 px-4 py-2 rounded-xl"
                        >
                            <Copy size={18} color="#fff" />
                            <Text className="text-white font-medium ml-2">{t.teacher.copy}</Text>
                        </Pressable>
                        <Pressable
                            onPress={handleShare}
                            className="flex-row items-center bg-white/20 px-4 py-2 rounded-xl"
                        >
                            <Share2 size={18} color="#fff" />
                            <Text className="text-white font-medium ml-2">{t.game.share || 'Бөлісу'}</Text>
                        </Pressable>
                    </View>

                    <Pressable
                        onPress={() => {
                            startTestMode();
                            router.push('/(student)/quiz');
                        }}
                        className="mt-4 flex-row items-center bg-secondary-500 px-6 py-2 rounded-xl"
                    >
                        <Play size={18} color="#fff" />
                        <Text className="text-white font-bold ml-2">{t.teacher.testQuiz}</Text>
                    </Pressable>
                </Card>
            </MotiView>

            {/* Quiz Info */}
            <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 400, delay: 200 }}
                className="flex-row px-6 gap-4 mb-6"
            >
                <Card variant="default" className="flex-1 flex-row items-center py-3 px-4">
                    <Trophy size={20} color="#f59e0b" />
                    <Text className="text-white font-medium ml-2">{questions.length} сұрақ</Text>
                </Card>
                <Card variant="default" className="flex-1 flex-row items-center py-3 px-4">
                    <Users size={20} color="#10b981" />
                    <Text className="text-white font-medium ml-2">{players.length} оқушы</Text>
                </Card>
            </MotiView>

            {/* Connected Students List */}
            <View className="flex-1 px-6">
                <Text className="text-white text-lg font-semibold mb-4">
                    Қосылған оқушылар
                </Text>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {players.length === 0 ? (
                        <MotiView
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ type: 'timing', duration: 400 }}
                            className="items-center py-12"
                        >
                            <MotiView
                                from={{ rotate: '0deg' }}
                                animate={{ rotate: '360deg' }}
                                transition={{
                                    type: 'timing',
                                    duration: 2000,
                                    loop: true
                                }}
                            >
                                <Text className="text-6xl">⏳</Text>
                            </MotiView>
                            <Text className="text-gray-400 text-lg mt-4">
                                Оқушылар қосылуын күтуде...
                            </Text>
                        </MotiView>
                    ) : (
                        players.map((player, index) => (
                            <AnimatedListItem key={player.id} index={index} className="mb-3">
                                <Card variant="default">
                                    <View className="flex-row items-center">
                                        <View className="w-12 h-12 bg-primary-600/30 rounded-xl items-center justify-center">
                                            <Text className="text-2xl">{player.avatar}</Text>
                                        </View>
                                        <Text className="text-white font-semibold ml-3 flex-1">
                                            {player.name}
                                        </Text>
                                        <View className="bg-secondary-500/20 px-3 py-1 rounded-lg">
                                            <Text className="text-secondary-400 text-sm font-medium">
                                                {t.join.ready} ✓
                                            </Text>
                                        </View>
                                    </View>
                                </Card>
                            </AnimatedListItem>
                        ))
                    )}
                    <View className="h-32" />
                </ScrollView>
            </View>

            {/* Start Game Button */}
            <MotiView
                from={{ opacity: 0, translateY: 30 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 400, delay: 300 }}
                className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-dark-bg"
            >
                <Button
                    title={players.length < 1 ? t.join.waitingTitle : t.teacher.startGame}
                    onPress={handleStartGame}
                    disabled={players.length < 1}
                    size="lg"
                    icon={<Play size={20} color="#fff" />}
                />
            </MotiView>
        </ScreenWrapper>
    );
}
