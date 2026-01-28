import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { GraduationCap, Users } from 'lucide-react-native';
import { ScreenWrapper, Card } from '../../components/ui';
import { useUserStore } from '../../store';
import { useLanguageStore } from '../../store/languageStore';
import { Language } from '../../constants/translations';

export default function WelcomeScreen() {
    const router = useRouter();
    const setRole = useUserStore((state) => state.setRole);
    const { t, language, setLanguage } = useLanguageStore();

    const handleRoleSelect = (role: 'teacher' | 'student') => {
        setRole(role);
        router.push('/(auth)/login');
    };

    const languages: Language[] = ['kk', 'ru', 'en'];

    return (
        <ScreenWrapper className="px-6">
            {/* Language Toggle */}
            <MotiView
                from={{ opacity: 0, translateY: -10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 500 }}
                className="flex-row justify-end mt-4 gap-2"
            >
                {languages.map((lang) => (
                    <Pressable
                        key={lang}
                        onPress={() => setLanguage(lang)}
                        className={`px-3 py-1.5 rounded-full border border-white/10 ${language === lang ? 'bg-primary-600' : 'bg-dark-card'
                            }`}
                    >
                        <Text className={`font-bold text-xs ${language === lang ? 'text-white' : 'text-gray-400'}`}>
                            {lang.toUpperCase()}
                        </Text>
                    </Pressable>
                ))}
            </MotiView>

            {/* Logo & Title */}
            <MotiView
                from={{ opacity: 0, translateY: -30 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 600 }}
                className="items-center mt-8 mb-8"
            >
                <View className="w-24 h-24 bg-primary-600 rounded-3xl items-center justify-center mb-6 shadow-lg">
                    <Text style={{ fontSize: 60, lineHeight: 70, includeFontPadding: false }}>🎓</Text>
                </View>
                <Text className="text-4xl font-bold text-white text-center">
                    {t.welcome.title}
                </Text>
                <Text className="text-gray-400 text-lg mt-2 text-center">
                    {t.welcome.subtitle}
                </Text>
            </MotiView>

            {/* Animated illustration */}
            <MotiView
                from={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'timing', duration: 500, delay: 200 }}
                className="items-center my-6"
            >
                <Text style={{ fontSize: 90, lineHeight: 110, includeFontPadding: false }}>📚</Text>
            </MotiView>

            {/* Role Selection */}
            <MotiView
                from={{ opacity: 0, translateY: 30 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 600, delay: 400 }}
                className="flex-1 justify-end pb-12"
            >
                <Text className="text-xl font-semibold text-white text-center mb-6">
                    {t.welcome.chooseRole}
                </Text>

                <View className="gap-4">
                    <Card
                        variant="elevated"
                        className="bg-gradient-to-r from-primary-600 to-primary-700"
                        onPress={() => handleRoleSelect('teacher')}
                    >
                        <View className="flex-row items-center p-2">
                            <View className="w-14 h-14 bg-white/20 rounded-xl items-center justify-center mr-4">
                                <GraduationCap size={28} color="#fff" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white text-xl font-bold">{t.welcome.iamTeacher}</Text>
                                <Text className="text-white/70 text-sm mt-1">
                                    {t.welcome.teacherDesc}
                                </Text>
                            </View>
                            <Text className="text-3xl" style={{ includeFontPadding: false }}>👨‍🏫</Text>
                        </View>
                    </Card>

                    <Card
                        variant="elevated"
                        className="bg-gradient-to-r from-secondary-600 to-secondary-700"
                        onPress={() => handleRoleSelect('student')}
                    >
                        <View className="flex-row items-center p-2">
                            <View className="w-14 h-14 bg-white/20 rounded-xl items-center justify-center mr-4">
                                <Users size={28} color="#fff" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white text-xl font-bold">{t.welcome.iamStudent}</Text>
                                <Text className="text-white/70 text-sm mt-1">
                                    {t.welcome.studentDesc}
                                </Text>
                            </View>
                            <Text className="text-3xl" style={{ includeFontPadding: false }}>👩‍🎓</Text>
                        </View>
                    </Card>
                </View>
            </MotiView>
        </ScreenWrapper>
    );
}
