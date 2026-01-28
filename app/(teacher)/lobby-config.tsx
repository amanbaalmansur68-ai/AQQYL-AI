import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { ArrowLeft, Sparkles, BookOpen, Users, Gauge, Zap } from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import { ScreenWrapper, Button, Input, Card } from '../../components/ui';
import { useGameStore } from '../../store';
import { useLanguageStore } from '../../store/languageStore';
import { mockApi } from '../../services';
import * as Haptics from 'expo-haptics';

const grades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];

export default function LobbyConfigScreen() {
    const router = useRouter();
    const { setLobbyCode, setQuestions } = useGameStore();
    const { t } = useLanguageStore();

    const difficulties = [
        { id: 'easy', label: t.teacher.diffEasy, emoji: '🌱' },
        { id: 'medium', label: t.teacher.diffMedium, emoji: '🌿' },
        { id: 'hard', label: t.teacher.diffHard, emoji: '🔥' },
    ];

    const [topic, setTopic] = useState('');
    const [questionCount, setQuestionCount] = useState(10);
    const [selectedGrade, setSelectedGrade] = useState('5');
    const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
    const [loading, setLoading] = useState(false);

    const handleCreateQuiz = async () => {
        if (!topic.trim()) {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            return;
        }

        setLoading(true);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        try {
            const result = await mockApi.createLobby(topic, {
                questionCount,
                grade: parseInt(selectedGrade),
                difficulty: selectedDifficulty,
            });

            setLobbyCode(result.lobbyCode);
            setQuestions(result.questions);

            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.push('/(teacher)/session');
        } catch (error: any) {
            if (error.message === 'IRRELEVANT_TOPIC') {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                Alert.alert('Қате / Ошибка / Error', t.teacher.errorIrrelevant);
            } else {
                console.error('Failed to create lobby:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper>
            <ScrollView showsVerticalScrollIndicator={false}>
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
                        {t.teacher.createSession}
                    </Text>
                </MotiView>

                {/* Topic Input */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 400, delay: 100 }}
                    className="px-6"
                >
                    <View className="flex-row items-center mb-2">
                        <BookOpen size={18} color="#a5b4fc" />
                        <Text className="text-white font-semibold ml-2">{t.teacher.topicLabel}</Text>
                    </View>
                    <Input
                        placeholder={t.teacher.topicPlaceholder}
                        value={topic}
                        onChangeText={setTopic}
                        containerClassName="mb-0"
                    />
                    <Text className="text-gray-500 text-sm mt-2">
                        AI осы тақырып бойынша сұрақтар жасайды
                    </Text>
                </MotiView>

                {/* Question Count Slider */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 400, delay: 200 }}
                    className="px-6 mt-6"
                >
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center">
                            <Sparkles size={18} color="#a5b4fc" />
                            <Text className="text-white font-semibold ml-2">{t.teacher.questionCount}</Text>
                        </View>
                        <View className="bg-primary-600 px-3 py-1 rounded-lg">
                            <Text className="text-white font-bold">{questionCount}</Text>
                        </View>
                    </View>
                    <Card variant="default" className="py-4">
                        <View className="px-2">
                            <View className="h-8 justify-center">
                                <View className="h-2 bg-dark-border rounded-full">
                                    <View
                                        className="h-2 bg-primary-500 rounded-full"
                                        style={{ width: `${(questionCount / 20) * 100}%` }}
                                    />
                                </View>
                            </View>
                            <View className="flex-row justify-between mt-2">
                                <Text className="text-gray-500 text-xs">5</Text>
                                <Text className="text-gray-500 text-xs">20</Text>
                            </View>
                            <View className="flex-row justify-between mt-2 gap-2">
                                {[5, 10, 15, 20].map((num) => (
                                    <Pressable
                                        key={num}
                                        onPress={() => setQuestionCount(num)}
                                        className={`flex-1 py-2 rounded-lg items-center ${questionCount === num ? 'bg-primary-600' : 'bg-dark-border'
                                            }`}
                                    >
                                        <Text className={`font-semibold ${questionCount === num ? 'text-white' : 'text-gray-400'
                                            }`}>{num}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    </Card>
                </MotiView>

                {/* Grade Selection */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 400, delay: 300 }}
                    className="px-6 mt-6"
                >
                    <View className="flex-row items-center mb-4">
                        <Users size={18} color="#a5b4fc" />
                        <Text className="text-white font-semibold ml-2">{t.teacher.grade}</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className="flex-row gap-2">
                            {grades.map((grade) => (
                                <Pressable
                                    key={grade}
                                    onPress={() => setSelectedGrade(grade)}
                                    className={`w-12 h-12 rounded-xl items-center justify-center ${selectedGrade === grade ? 'bg-primary-600' : 'bg-dark-card'
                                        }`}
                                >
                                    <Text className={`font-bold ${selectedGrade === grade ? 'text-white' : 'text-gray-400'
                                        }`}>{grade}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </ScrollView>
                </MotiView>

                {/* Difficulty Selection */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 400, delay: 400 }}
                    className="px-6 mt-6"
                >
                    <View className="flex-row items-center mb-4">
                        <Gauge size={18} color="#a5b4fc" />
                        <Text className="text-white font-semibold ml-2">{t.teacher.difficulty}</Text>
                    </View>
                    <View className="flex-row gap-3">
                        {difficulties.map((diff) => (
                            <Pressable
                                key={diff.id}
                                onPress={() => setSelectedDifficulty(diff.id)}
                                className="flex-1"
                            >
                                <Card
                                    variant={selectedDifficulty === diff.id ? 'elevated' : 'default'}
                                    className={`items-center py-4 ${selectedDifficulty === diff.id
                                        ? 'border-2 border-primary-500'
                                        : ''
                                        }`}
                                >
                                    <Text className="text-2xl mb-2">{diff.emoji}</Text>
                                    <Text className={`font-semibold ${selectedDifficulty === diff.id ? 'text-white' : 'text-gray-400'
                                        }`}>{diff.label}</Text>
                                </Card>
                            </Pressable>
                        ))}
                    </View>
                </MotiView>

                {/* Generate Button */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 400, delay: 500 }}
                    className="px-6 mt-8 mb-8"
                >
                    <Button
                        title={loading ? t.auth.loading : t.teacher.createLobby}
                        onPress={handleCreateQuiz}
                        loading={loading}
                        size="lg"
                        icon={<Zap size={20} color="#fff" />}
                    />
                </MotiView>
            </ScrollView>
        </ScreenWrapper>
    );
}
