import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { ArrowLeft, Trophy, Gamepad2, TrendingUp, Package } from 'lucide-react-native';
import { ScreenWrapper, Card, AnimatedListItem } from '../../components/ui';
import { useUserStore } from '../../store';
import { useLanguageStore } from '../../store/languageStore';
import { mockApi } from '../../services';

// Mock inventory items (skins/frames)
const inventoryItems = [
    { id: '1', name: 'Алтын жақтау', emoji: '🏆', rarity: 'legendary', unlocked: true },
    { id: '2', name: 'Күміс жақтау', emoji: '🥈', rarity: 'epic', unlocked: true },
    { id: '3', name: 'Қола жақтау', emoji: '🥉', rarity: 'rare', unlocked: true },
    { id: '4', name: 'Жұлдыз скин', emoji: '⭐', rarity: 'rare', unlocked: true },
    { id: '5', name: 'Алмаз скин', emoji: '💎', rarity: 'legendary', unlocked: false },
    { id: '6', name: 'Отты скин', emoji: '🔥', rarity: 'epic', unlocked: false },
    { id: '7', name: 'Кемпірқосақ', emoji: '🌈', rarity: 'rare', unlocked: false },
    { id: '8', name: 'Құпия скин', emoji: '❓', rarity: 'legendary', unlocked: false },
];

const rarityColors = {
    common: 'bg-gray-600',
    rare: 'bg-blue-600',
    epic: 'bg-purple-600',
    legendary: 'bg-amber-500',
};

export default function ProfileScreen() {
    const router = useRouter();
    const { name, avatar, role, avatarColor } = useUserStore();
    const { t } = useLanguageStore();
    const [stats, setStats] = useState({
        gamesPlayed: 0,
        averageScore: 0,
        totalXP: 0,
        rank: t.common.student,
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        const data = await mockApi.getUserStats();
        setStats(data);
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
                    {t.common.profile}
                </Text>
            </MotiView>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Avatar & Name */}
                <MotiView
                    from={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'timing', duration: 500 }}
                    className="items-center mb-8"
                >
                    <View
                        className="w-28 h-28 rounded-3xl items-center justify-center mb-4 shadow-lg border-4 border-white/20"
                        style={{ backgroundColor: role === 'teacher' ? '#4f46e5' : (avatarColor || '#4f46e5') }}
                    >
                        <Text
                            style={{
                                fontSize: 60,
                                lineHeight: 70,
                                includeFontPadding: false
                            }}
                        >
                            {avatar}
                        </Text>
                    </View>
                    <Text className="text-white text-2xl font-bold">{name}</Text>
                    <View className="flex-row items-center mt-2 bg-primary-600/30 px-4 py-1 rounded-full">
                        <Text className="text-primary-400 font-medium">
                            {role === 'teacher' ? `👨‍🏫 ${t.common.teacher}` : `🏅 ${stats.rank}`}
                        </Text>
                    </View>
                </MotiView>

                {/* Stats */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 500, delay: 100 }}
                    className="px-6 mb-6"
                >
                    <Text className="text-white text-lg font-semibold mb-4">
                        📊 {t.game.stats}
                    </Text>
                    <View className="flex-row gap-3">
                        <Card variant="default" className="flex-1 items-center py-4">
                            <Gamepad2 size={24} color="#a5b4fc" />
                            <Text className="text-white text-2xl font-bold mt-2">{stats.gamesPlayed}</Text>
                            <Text className="text-gray-400 text-xs mt-1">{t.game.gamesPlayed}</Text>
                        </Card>
                        <Card variant="default" className="flex-1 items-center py-4">
                            <TrendingUp size={24} color="#34d399" />
                            <Text className="text-white text-2xl font-bold mt-2">{stats.averageScore}%</Text>
                            <Text className="text-gray-400 text-xs mt-1">{t.game.avgScore}</Text>
                        </Card>
                        <Card variant="default" className="flex-1 items-center py-4">
                            <Trophy size={24} color="#fbbf24" />
                            <Text className="text-white text-2xl font-bold mt-2">{stats.totalXP}</Text>
                            <Text className="text-gray-400 text-xs mt-1">{t.game.totalXP}</Text>
                        </Card>
                    </View>
                </MotiView>

                {/* Achievements */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 500, delay: 200 }}
                    className="px-6 mb-6"
                >
                    <Text className="text-white text-lg font-semibold mb-4">
                        🏆 {t.game.achievements}
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className="flex-row gap-3">
                            {['🎯 Дәлдік', '🔥 Жүйелілік', '📚 Білімқұмар', '⚡ Жылдам'].map((achievement, index) => (
                                <Card key={index} variant="default" className="items-center p-4 w-24">
                                    <Text className="text-3xl mb-2">{achievement.split(' ')[0]}</Text>
                                    <Text className="text-white text-xs text-center font-medium">
                                        {achievement.split(' ')[1]}
                                    </Text>
                                </Card>
                            ))}
                        </View>
                    </ScrollView>
                </MotiView>

                {/* Inventory */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 500, delay: 300 }}
                    className="px-6 mb-8"
                >
                    <View className="flex-row items-center mb-4">
                        <Package size={20} color="#fff" />
                        <Text className="text-white text-lg font-semibold ml-2">
                            {t.game.inventory}
                        </Text>
                    </View>

                    <View className="flex-row flex-wrap gap-3">
                        {inventoryItems.map((item, index) => (
                            <AnimatedListItem
                                key={item.id}
                                index={index}
                                delay={50}
                                className="w-[22%]"
                            >
                                <Pressable>
                                    <Card
                                        variant="default"
                                        className={`items-center py-3 ${!item.unlocked ? 'opacity-50' : ''}`}
                                    >
                                        <View className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${rarityColors[item.rarity as keyof typeof rarityColors]
                                            }`} />
                                        <Text className="text-2xl">{item.emoji}</Text>
                                        {!item.unlocked && (
                                            <View className="absolute inset-0 items-center justify-center">
                                                <Text className="text-2xl">🔒</Text>
                                            </View>
                                        )}
                                    </Card>
                                </Pressable>
                            </AnimatedListItem>
                        ))}
                    </View>
                </MotiView>

                <View className="h-20" />
            </ScrollView>
        </ScreenWrapper>
    );
}
