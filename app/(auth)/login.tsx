import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { ArrowLeft, Check } from 'lucide-react-native';
import { ScreenWrapper, Button, Input } from '../../components/ui';
import { useUserStore } from '../../store';
import { useLanguageStore } from '../../store/languageStore';
import { avatarOptions } from '../../services';
import * as Haptics from 'expo-haptics';

export default function LoginScreen() {
    const router = useRouter();
    const { role, login } = useUserStore();
    const { t } = useLanguageStore();
    const [name, setName] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState('😊');
    const [selectedColor, setSelectedColor] = useState('#4f46e5'); // Default Indigo
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isTeacher = role === 'teacher';

    const backgroundColors = [
        '#4f46e5', // INDIGO
        '#10b981', // EMERALD
        '#3b82f6', // BLUE
        '#ef4444', // RED
        '#f59e0b', // AMBER
        '#ec4899', // PINK
        '#8b5cf6', // VIOLET
        '#06b6d4', // CYAN
    ];

    const handleLogin = async () => {
        if (!name.trim()) {
            setError(t.auth.errorName);
            return;
        }

        setLoading(true);
        try {
            await login(name.trim(), role, selectedAvatar, selectedColor);
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            if (role === 'teacher') {
                router.replace('/(teacher)/dashboard');
            } else {
                router.replace('/(student)/join');
            }
        } catch (err) {
            setError(t.auth.errorGeneric);
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarSelect = async (avatar: string) => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedAvatar(avatar);
    };

    const handleColorSelect = async (color: string) => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedColor(color);
    };

    return (
        <ScreenWrapper className="px-6">
            {/* Header */}
            <MotiView
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: 'timing', duration: 400 }}
                className="flex-row items-center mt-4"
            >
                <Pressable
                    onPress={() => router.back()}
                    className="w-10 h-10 bg-dark-card rounded-xl items-center justify-center"
                >
                    <ArrowLeft size={24} color="#fff" />
                </Pressable>
                <Text className="text-white text-xl font-semibold ml-4">
                    {isTeacher ? t.auth.teacherLogin : t.auth.studentLogin}
                </Text>
            </MotiView>

            {/* Avatar Selection for Student */}
            {!isTeacher && (
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 500, delay: 100 }}
                    className="mt-8"
                >
                    <Text className="text-white text-lg font-semibold mb-4">
                        {t.auth.chooseAvatar}
                    </Text>

                    {/* Selected Avatar Display */}
                    <View className="items-center mb-6">
                        <MotiView
                            key={selectedColor} // Animate color change
                            from={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="w-28 h-28 rounded-3xl items-center justify-center border-4 border-white/20"
                            style={{ backgroundColor: selectedColor }}
                        >
                            <Text
                                style={{
                                    fontSize: 60,
                                    lineHeight: 70,
                                    includeFontPadding: false,
                                    textAlign: 'center'
                                }}
                            >
                                {selectedAvatar}
                            </Text>
                        </MotiView>
                    </View>

                    {/* Avatar Grid */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="mb-4"
                    >
                        <View className="flex-row gap-3">
                            {avatarOptions.map((avatar, index) => (
                                <MotiView
                                    key={avatar}
                                    from={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: 'timing', duration: 300, delay: index * 50 }}
                                >
                                    <Pressable
                                        onPress={() => handleAvatarSelect(avatar)}
                                        className={`w-14 h-14 rounded-xl items-center justify-center ${selectedAvatar === avatar
                                            ? 'bg-white/20'
                                            : 'bg-dark-card'
                                            }`}
                                    >
                                        <Text className="text-3xl" style={{ includeFontPadding: false }}>{avatar}</Text>
                                        {selectedAvatar === avatar && (
                                            <View className="absolute top-1 right-1 w-5 h-5 bg-secondary-500 rounded-full items-center justify-center border border-dark-card shadow-sm">
                                                <Check size={12} color="#fff" />
                                            </View>
                                        )}
                                    </Pressable>
                                </MotiView>
                            ))}
                        </View>
                    </ScrollView>

                    {/* Color Selection */}
                    <Text className="text-white text-base font-semibold mb-3">
                        {t.auth.chooseBg}
                    </Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="mb-6"
                    >
                        <View className="flex-row gap-3 p-1">
                            {backgroundColors.map((color, index) => (
                                <MotiView
                                    key={color}
                                    from={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: 'timing', duration: 300, delay: 200 + (index * 50) }}
                                >
                                    <Pressable
                                        onPress={() => handleColorSelect(color)}
                                        className="w-10 h-10 rounded-full border-2"
                                        style={{
                                            backgroundColor: color,
                                            borderColor: selectedColor === color ? '#fff' : 'transparent',
                                            transform: [{ scale: selectedColor === color ? 1.1 : 1 }]
                                        }}
                                    >
                                        {selectedColor === color && (
                                            <View className="flex-1 items-center justify-center">
                                                <Check size={16} color="#fff" strokeWidth={3} />
                                            </View>
                                        )}
                                    </Pressable>
                                </MotiView>
                            ))}
                        </View>
                    </ScrollView>
                </MotiView>
            )}

            {/* Teacher icon */}
            {isTeacher && (
                <MotiView
                    from={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'timing', duration: 500, delay: 100 }}
                    className="items-center mt-12 mb-8"
                >
                    <View className="w-28 h-28 bg-primary-600/30 rounded-3xl items-center justify-center border-4 border-primary-500">
                        <Text className="text-6xl">👨‍🏫</Text>
                    </View>
                </MotiView>
            )}

            {/* Name Input */}
            <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 500, delay: 200 }}
                className="mt-4"
            >
                <Input
                    label={t.auth.enterName}
                    placeholder={isTeacher ? t.auth.teacherNamePlaceholder : t.auth.studentNamePlaceholder}
                    value={name}
                    onChangeText={(text) => {
                        setName(text);
                        setError('');
                    }}
                    error={error}
                    autoCapitalize="words"
                />
            </MotiView>

            {/* Login Button */}
            <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 500, delay: 300 }}
                className="mt-auto mb-8"
            >
                <Button
                    title={loading ? t.auth.loading : t.auth.continue}
                    onPress={handleLogin}
                    loading={loading}
                    size="lg"
                />
            </MotiView>
        </ScreenWrapper>
    );
}
