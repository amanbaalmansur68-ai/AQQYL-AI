import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Trophy, Star, Medal, Home, RotateCcw } from 'lucide-react-native';
import { ScreenWrapper, Button, Card, AnimatedListItem } from '../../components/ui';
import { useGameStore, useUserStore, Player } from '../../store';
import { useLanguageStore } from '../../store/languageStore';
import { mockApi } from '../../services';
import * as Haptics from 'expo-haptics';

export default function ResultScreen() {
    const router = useRouter();
    const { score, resetGame, questions } = useGameStore();
    const { name, avatar, avatarColor } = useUserStore();
    const { t } = useLanguageStore();
    const [leaderboard, setLeaderboard] = useState<Player[]>([]);
    const [myRank, setMyRank] = useState(0);

    useEffect(() => {
        loadLeaderboard();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, []);

    const loadLeaderboard = async () => {
        const data = await mockApi.getLeaderboard();
        // Insert current user into leaderboard
        const myPlayer: Player = { id: 'me', name, avatar, avatarColor, score };
        const allPlayers = [...data, myPlayer].sort((a, b) => b.score - a.score);
        const rank = allPlayers.findIndex(p => p.id === 'me') + 1;
        setMyRank(rank);
        setLeaderboard(allPlayers.slice(0, 5));
    };

    const handlePlayAgain = () => {
        resetGame();
        router.replace('/(student)/join');
    };

    const handleGoHome = () => {
        resetGame();
        router.replace('/(student)/join');
    };

    const getRankEmoji = (rank: number) => {
        switch (rank) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return `${rank}`;
        }
    };

    const correctAnswers = Math.round((score / (questions.length * 150)) * questions.length);

    return (
        <ScreenWrapper>
            {/* Confetti Effect */}
            <View className="absolute inset-0 overflow-hidden" pointerEvents="none">
                {[...Array(30)].map((_, i) => (
                    <MotiView
                        key={i}
                        from={{
                            translateY: -50,
                            translateX: Math.random() * 400,
                            rotate: '0deg',
                            opacity: 1,
                        }}
                        animate={{
                            translateY: 900,
                            rotate: `${Math.random() * 360}deg`,
                            opacity: 0,
                        }}
                        transition={{
                            type: 'timing',
                            duration: 2000 + Math.random() * 500, // ~2-2.5 seconds
                            delay: Math.random() * 500,
                        }}
                        className="absolute"
                    >
                        <Text className="text-2xl">
                            {['🎉', '⭐', '🎊', '✨', '🌟'][Math.floor(Math.random() * 5)]}
                        </Text>
                    </MotiView>
                ))}
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                {/* Trophy Animation */}
                <MotiView
                    from={{ scale: 0, rotate: '-180deg' }}
                    animate={{ scale: 1, rotate: '0deg' }}
                    transition={{ type: 'spring', damping: 12, delay: 300 }}
                    className="items-center mt-8 mb-4"
                >
                    <View className="w-32 h-32 bg-amber-500/20 rounded-full items-center justify-center">
                        <Text className="text-7xl">{myRank <= 3 ? '🏆' : '🎖️'}</Text>
                    </View>
                </MotiView>

                {/* Rank */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 500, delay: 500 }}
                    className="items-center mb-6"
                >
                    <Text className="text-gray-400 text-lg">{t.game.place}</Text>
                    <Text className="text-white text-5xl font-bold mt-2">
                        {getRankEmoji(myRank)} #{myRank}
                    </Text>
                </MotiView>

                {/* Score Card */}
                <MotiView
                    from={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'timing', duration: 500, delay: 600 }}
                    className="px-6 mb-6"
                >
                    <Card variant="elevated" className="bg-gradient-to-r from-primary-600 to-accent-violet p-6">
                        <View className="flex-row items-center justify-around">
                            <View className="items-center">
                                <Star size={24} color="#fbbf24" />
                                <Text className="text-white text-3xl font-bold mt-2">{score}</Text>
                                <Text className="text-white/70 text-sm">{t.game.totalScore}</Text>
                            </View>
                            <View className="w-px h-16 bg-white/20" />
                            <View className="items-center">
                                <Trophy size={24} color="#fbbf24" />
                                <Text className="text-white text-3xl font-bold mt-2">
                                    {correctAnswers}/{questions.length}
                                </Text>
                                <Text className="text-white/70 text-sm">{t.game.correctAnswers}</Text>
                            </View>
                        </View>
                    </Card>
                </MotiView>

                {/* XP Earned */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 500, delay: 700 }}
                    className="px-6 mb-6"
                >
                    <Card variant="default" className="flex-row items-center justify-between p-4">
                        <View className="flex-row items-center">
                            <Text className="text-2xl mr-3">✨</Text>
                            <Text className="text-white font-semibold">{t.game.xpEarned}</Text>
                        </View>
                        <Text className="text-secondary-400 text-xl font-bold">+{score} XP</Text>
                    </Card>
                </MotiView>

                {/* Leaderboard */}
                <View className="px-6 mb-6">
                    <Text className="text-white text-lg font-semibold mb-4">
                        🏅 {t.game.leaderboard}
                    </Text>

                    {leaderboard.map((player, index) => (
                        <AnimatedListItem key={player.id} index={index} className="mb-2">
                            <Card
                                variant={player.id === 'me' ? 'elevated' : 'default'}
                                className={player.id === 'me' ? 'border-2 border-primary-500' : ''}
                            >
                                <View className="flex-row items-center">
                                    <Text className="text-2xl w-10">{getRankEmoji(index + 1)}</Text>
                                    <View
                                        className="w-10 h-10 rounded-xl items-center justify-center"
                                        style={{ backgroundColor: player.avatarColor || '#4f46e5' }}
                                    >
                                        <Text className="text-xl" style={{ includeFontPadding: false }}>{player.avatar}</Text>
                                    </View>
                                    <Text className={`flex-1 ml-3 font-semibold ${player.id === 'me' ? 'text-primary-400' : 'text-white'
                                        }`}>
                                        {player.name} {player.id === 'me' && '(Сіз)'}
                                    </Text>
                                    <Text className="text-amber-400 font-bold">{player.score}</Text>
                                </View>
                            </Card>
                        </AnimatedListItem>
                    ))}
                </View>

                {/* Action Buttons */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 500, delay: 900 }}
                    className="px-6 mb-8"
                >
                    <View className="flex-row gap-3">
                        <View className="flex-1">
                            <Button
                                title={t.game.playAgain}
                                onPress={handlePlayAgain}
                                variant="secondary"
                                icon={<RotateCcw size={18} color="#fff" />}
                            />
                        </View>
                        <View className="flex-1">
                            <Button
                                title={t.game.exit}
                                onPress={handleGoHome}
                                variant="outline"
                                icon={<Home size={18} color="#6366f1" />}
                            />
                        </View>
                    </View>
                </MotiView>
            </ScrollView>
        </ScreenWrapper>
    );
}
