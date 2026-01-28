import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { ScreenWrapper, Card } from '../../components/ui';
import { useGameStore } from '../../store';
import { useLanguageStore } from '../../store/languageStore';
import { mockApi } from '../../services';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const answerColors = [
    { bg: 'bg-red-500', selected: 'bg-red-600' },
    { bg: 'bg-blue-500', selected: 'bg-blue-600' },
    { bg: 'bg-amber-500', selected: 'bg-amber-600' },
    { bg: 'bg-green-500', selected: 'bg-green-600' },
];

export default function QuizScreen() {
    const router = useRouter();
    const { questions, currentQuestionIndex, nextQuestion, addScore, resetGame } = useGameStore();
    const { t } = useLanguageStore();

    const [timeLeft, setTimeLeft] = useState(20);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [points, setPoints] = useState(0);

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex >= questions.length - 1;

    // Timer countdown
    useEffect(() => {
        if (showFeedback) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleTimeout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentQuestionIndex, showFeedback]);

    const handleTimeout = useCallback(async () => {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setShowFeedback(true);
        setIsCorrect(false);

        setTimeout(() => {
            moveToNext();
        }, 1500);
    }, [currentQuestionIndex]);

    const handleSelectAnswer = async (index: number) => {
        if (selectedAnswer !== null || showFeedback) return;

        setSelectedAnswer(index);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        try {
            const result = await mockApi.submitAnswer(currentQuestion.id, index, timeLeft);
            setIsCorrect(result.correct);
            setPoints(result.points);

            if (result.correct) {
                addScore(result.points);
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } else {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }

            setShowFeedback(true);

            // Wait longer for wrong answers so user can read the correct answer
            const delay = result.correct ? 1500 : 3500;

            setTimeout(() => {
                moveToNext();
            }, delay);
        } catch (error) {
            console.error('Failed to submit answer:', error);
        }
    };

    const moveToNext = () => {
        if (isLastQuestion) {
            router.replace('/(student)/result');
        } else {
            nextQuestion();
            setSelectedAnswer(null);
            setShowFeedback(false);
            setTimeLeft(20);
        }
    };

    if (!currentQuestion) {
        return (
            <ScreenWrapper className="items-center justify-center">
                <Text className="text-white text-xl">{t.auth.loading}</Text>
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper safeArea={false}>
            {/* Feedback Overlay */}
            {showFeedback && (
                <MotiView
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: 'timing', duration: 300 }}
                    className={`absolute inset-0 z-50 items-center justify-center ${isCorrect ? 'bg-green-500/90' : 'bg-red-500/90'
                        }`}
                >
                    <MotiView
                        from={{ scale: 0, rotate: '-20deg' }}
                        animate={{ scale: 1, rotate: '0deg' }}
                        transition={{ type: 'spring', damping: 10 }}
                    >
                        <Text className="text-8xl">{isCorrect ? '✅' : '❌'}</Text>
                    </MotiView>
                    <Text className="text-white text-3xl font-bold mt-4">
                        {isCorrect ? t.game.correct : t.game.incorrect}
                    </Text>
                    {isCorrect ? (
                        <Text className="text-white/80 text-xl mt-2">
                            +{points} XP
                        </Text>
                    ) : (
                        <View className="items-center mt-4 px-4">
                            <Text className="text-white/80 text-lg mb-1">{t.game.correctAnswerIs}</Text>
                            <Text className="text-white text-2xl font-bold text-center">
                                {currentQuestion.options[currentQuestion.correctIndex]}
                            </Text>
                        </View>
                    )}
                </MotiView>
            )}

            {/* Progress Bar */}
            <View className="h-1 bg-dark-border">
                <MotiView
                    className="h-1 bg-primary-500"
                    animate={{
                        width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`
                    }}
                    transition={{ type: 'timing', duration: 300 }}
                />
            </View>

            {/* Timer */}
            <View className="px-6 pt-6">
                <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center">
                        <Text className="text-gray-400 text-base">
                            {t.game.question} {currentQuestionIndex + 1}/{questions.length}
                        </Text>
                    </View>
                    <MotiView
                        animate={{
                            scale: timeLeft <= 5 ? [1, 1.1, 1] : 1,
                        }}
                        transition={{ type: 'timing', duration: 500, loop: timeLeft <= 5 }}
                        className={`px-4 py-2 rounded-xl ${timeLeft <= 5 ? 'bg-red-500' : 'bg-dark-card'
                            }`}
                    >
                        <Text className={`text-lg font-bold ${timeLeft <= 5 ? 'text-white' : 'text-white'
                            }`}>
                            ⏱️ {timeLeft}с
                        </Text>
                    </MotiView>
                </View>

                {/* Timer Bar */}
                <View className="h-2 bg-dark-card rounded-full overflow-hidden">
                    <MotiView
                        className={`h-2 rounded-full ${timeLeft <= 5 ? 'bg-red-500' : timeLeft <= 10 ? 'bg-amber-500' : 'bg-secondary-500'
                            }`}
                        animate={{ width: `${(timeLeft / 20) * 100}%` }}
                        transition={{ type: 'timing', duration: 1000 }}
                    />
                </View>
            </View>

            {/* Question */}
            <MotiView
                key={currentQuestion.id}
                from={{ opacity: 0, translateX: 50 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: 'timing', duration: 400 }}
                className="px-6 py-8 flex-1"
            >
                <Card variant="elevated" className="p-6 mb-6">
                    <Text className="text-white text-xl font-semibold text-center leading-8">
                        {currentQuestion.question}
                    </Text>
                </Card>

                {/* Answer Options - 2x2 Grid */}
                <View className="flex-1">
                    <View className="flex-row gap-3 mb-3">
                        {currentQuestion.options.slice(0, 2).map((option, index) => (
                            <Pressable
                                key={index}
                                onPress={() => handleSelectAnswer(index)}
                                disabled={selectedAnswer !== null}
                                className="flex-1"
                            >
                                <MotiView
                                    from={{ opacity: 0, scale: 0.9 }}
                                    animate={{
                                        opacity: 1,
                                        scale: selectedAnswer === index ? 0.95 : 1,
                                    }}
                                    transition={{ type: 'timing', duration: 300, delay: index * 100 }}
                                    className={`h-32 rounded-2xl items-center justify-center p-4 ${selectedAnswer === index
                                        ? answerColors[index].selected
                                        : answerColors[index].bg
                                        }`}
                                >
                                    <Text className="text-white text-lg font-bold text-center">
                                        {option}
                                    </Text>
                                </MotiView>
                            </Pressable>
                        ))}
                    </View>

                    <View className="flex-row gap-3">
                        {currentQuestion.options.slice(2, 4).map((option, index) => (
                            <Pressable
                                key={index + 2}
                                onPress={() => handleSelectAnswer(index + 2)}
                                disabled={selectedAnswer !== null}
                                className="flex-1"
                            >
                                <MotiView
                                    from={{ opacity: 0, scale: 0.9 }}
                                    animate={{
                                        opacity: 1,
                                        scale: selectedAnswer === index + 2 ? 0.95 : 1,
                                    }}
                                    transition={{ type: 'timing', duration: 300, delay: (index + 2) * 100 }}
                                    className={`h-32 rounded-2xl items-center justify-center p-4 ${selectedAnswer === index + 2
                                        ? answerColors[index + 2].selected
                                        : answerColors[index + 2].bg
                                        }`}
                                >
                                    <Text className="text-white text-lg font-bold text-center">
                                        {option}
                                    </Text>
                                </MotiView>
                            </Pressable>
                        ))}
                    </View>
                </View>
            </MotiView>
        </ScreenWrapper>
    );
}
