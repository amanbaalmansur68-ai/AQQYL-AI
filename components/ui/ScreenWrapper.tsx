import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

interface ScreenWrapperProps {
    children: React.ReactNode;
    className?: string;
    safeArea?: boolean;
    statusBarStyle?: 'light' | 'dark' | 'auto';
    bgColor?: string;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
    children,
    className = '',
    safeArea = true,
    statusBarStyle = 'light',
    bgColor = 'bg-dark-bg',
}) => {
    const containerClasses = `flex-1 ${bgColor} ${className}`;

    if (safeArea) {
        return (
            <SafeAreaView className={containerClasses}>
                <StatusBar style={statusBarStyle} />
                {children}
            </SafeAreaView>
        );
    }

    return (
        <View className={containerClasses}>
            <StatusBar style={statusBarStyle} />
            {children}
        </View>
    );
};
