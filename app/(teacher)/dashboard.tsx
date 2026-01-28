import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Plus, Clock, Users, ChevronRight, LogOut, User } from 'lucide-react-native';
import { ScreenWrapper, Button, Card, AnimatedListItem } from '../../components/ui';
import { useUserStore } from '../../store';
import { useLanguageStore } from '../../store/languageStore';
import * as Haptics from 'expo-haptics';

// Mock session data
const mockSessions = [
    { id: '1', topic: 'Қазақ тілі - Сын есім', students: 24, date: 'Бүгін', status: 'active' },
    { id: '2', topic: 'Әдебиет - Абай Құнанбаев', students: 18, date: 'Кеше', status: 'completed' },
    { id: '3', topic: 'Тарих - Қазақ хандығы', students: 22, date: '2 күн бұрын', status: 'completed' },
];

export default function TeacherDashboard() {
    const router = useRouter();
    const { name, logout } = useUserStore();
    const { t } = useLanguageStore();

    const handleCreateSession = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push('/(teacher)/lobby-config');
    };

    const handleLogout = async () => {
        await logout();
        router.replace('/(auth)/welcome');
    };

    return (
        <ScreenWrapper>
            {/* Header */}
            <MotiView
                from={{ opacity: 0, translateY: -20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 400 }}
                className="px-6 pt-4 pb-6"
            >
                <View className="flex-row items-center justify-between mb-2">
                    <View>
                        <Text className="text-gray-400 text-base">{t.teacher.dashboardTitle}</Text>
                        <Text className="text-white text-2xl font-bold">{name || 'Мұғалім'} 👋</Text>
                    </View>
                    <View className="flex-row gap-2">
                        <Pressable
                            onPress={() => router.push('/(tabs)/profile')}
                            className="w-12 h-12 bg-dark-card rounded-xl items-center justify-center"
                        >
                            <User size={22} color="#a5b4fc" />
                        </Pressable>
                        <Pressable
                            onPress={handleLogout}
                            className="w-12 h-12 bg-dark-card rounded-xl items-center justify-center"
                        >
                            <LogOut size={22} color="#f87171" />
                        </Pressable>
                    </View>
                </View>
            </MotiView>

            {/* Create Session Button */}
            <MotiView
                from={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'timing', duration: 400, delay: 100 }}
                className="px-6 mb-6"
            >
                <Pressable onPress={handleCreateSession}>
                    <Card variant="elevated" className="bg-gradient-to-r from-primary-600 to-accent-violet p-6">
                        <View className="flex-row items-center">
                            <View className="w-14 h-14 bg-white/20 rounded-2xl items-center justify-center">
                                <Plus size={28} color="#fff" />
                            </View>
                            <View className="flex-1 ml-4">
                                <Text className="text-white text-xl font-bold">{t.teacher.createSession}</Text>
                                <Text className="text-white/70 text-sm mt-1">
                                    {t.teacher.createDesc}
                                </Text>
                            </View>
                            <Text className="text-4xl">🚀</Text>
                        </View>
                    </Card>
                </Pressable>
            </MotiView>

            {/* Stats Row */}
            <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 400, delay: 200 }}
                className="flex-row px-6 gap-4 mb-6"
            >
                <Card variant="default" className="flex-1 items-center py-4">
                    <Text className="text-3xl font-bold text-primary-400">12</Text>
                    <Text className="text-gray-400 text-sm mt-1">Жалпы сабақтар</Text>
                </Card>
                <Card variant="default" className="flex-1 items-center py-4">
                    <Text className="text-3xl font-bold text-secondary-400">186</Text>
                    <Text className="text-gray-400 text-sm mt-1">Оқушылар саны</Text>
                </Card>
            </MotiView>

            {/* Sessions List */}
            <View className="flex-1 px-6">
                <Text className="text-white text-lg font-semibold mb-4">
                    {t.teacher.history}
                </Text>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {mockSessions.map((session, index) => (
                        <AnimatedListItem key={session.id} index={index} className="mb-3">
                            <Card
                                variant="default"
                                onPress={() => { }}
                            >
                                <View className="flex-row items-center">
                                    <View className={`w-12 h-12 rounded-xl items-center justify-center ${session.status === 'active' ? 'bg-secondary-500/20' : 'bg-gray-700/50'
                                        }`}>
                                        {session.status === 'active' ? (
                                            <View className="w-3 h-3 bg-secondary-500 rounded-full" />
                                        ) : (
                                            <Clock size={20} color="#64748b" />
                                        )}
                                    </View>

                                    <View className="flex-1 ml-3">
                                        <Text className="text-white font-semibold">{session.topic}</Text>
                                        <View className="flex-row items-center mt-1">
                                            <Users size={14} color="#64748b" />
                                            <Text className="text-gray-500 text-sm ml-1">
                                                {session.students} оқушы • {session.date}
                                            </Text>
                                        </View>
                                    </View>

                                    <ChevronRight size={20} color="#64748b" />
                                </View>
                            </Card>
                        </AnimatedListItem>
                    ))}

                    <View className="h-20" />
                </ScrollView>
            </View>
        </ScreenWrapper>
    );
}
