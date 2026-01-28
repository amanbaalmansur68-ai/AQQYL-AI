import React, { useState } from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';
import { MotiView } from 'moti';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    icon,
    containerClassName = '',
    className = '',
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View className={`mb-4 ${containerClassName}`}>
            {label && (
                <Text className="text-gray-300 text-sm font-medium mb-2">{label}</Text>
            )}
            <MotiView
                className={`flex-row items-center bg-dark-card border rounded-xl px-4 ${error ? 'border-red-500' : isFocused ? 'border-primary-500' : 'border-dark-border'
                    }`}
                animate={{
                    borderColor: error ? '#ef4444' : isFocused ? '#6366f1' : '#334155',
                }}
                transition={{
                    type: 'timing',
                    duration: 200,
                }}
            >
                {icon && <View className="mr-3">{icon}</View>}
                <TextInput
                    className={`flex-1 text-white text-base py-3.5 ${className}`}
                    placeholderTextColor="#64748b"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
            </MotiView>
            {error && (
                <Text className="text-red-500 text-sm mt-1">{error}</Text>
            )}
        </View>
    );
};
