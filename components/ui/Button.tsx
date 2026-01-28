import React from 'react';
import { Text, Pressable, ActivityIndicator } from 'react-native';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon,
    className = '',
}) => {
    const [pressed, setPressed] = React.useState(false);

    const handlePress = async () => {
        if (disabled || loading) return;
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
    };

    const baseClasses = 'flex-row items-center justify-center rounded-xl';

    const variantClasses = {
        primary: 'bg-primary-600',
        secondary: 'bg-secondary-500',
        outline: 'border-2 border-primary-500 bg-transparent',
        ghost: 'bg-transparent',
    };

    const sizeClasses = {
        sm: 'px-4 py-2',
        md: 'px-6 py-3.5',
        lg: 'px-8 py-4',
    };

    const textVariantClasses = {
        primary: 'text-white',
        secondary: 'text-white',
        outline: 'text-primary-500',
        ghost: 'text-primary-500',
    };

    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    };

    const disabledClasses = disabled ? 'opacity-50' : '';

    return (
        <Pressable
            onPress={handlePress}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            disabled={disabled || loading}
        >
            <MotiView
                className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
                animate={{
                    scale: pressed ? 0.96 : 1,
                }}
                transition={{
                    type: 'timing',
                    duration: 100,
                }}
            >
                {loading ? (
                    <ActivityIndicator
                        color={variant === 'primary' || variant === 'secondary' ? '#fff' : '#6366f1'}
                        size="small"
                    />
                ) : (
                    <>
                        {icon && <MotiView className="mr-2">{icon}</MotiView>}
                        <Text
                            className={`font-semibold ${textVariantClasses[variant]} ${textSizeClasses[size]}`}
                        >
                            {title}
                        </Text>
                    </>
                )}
            </MotiView>
        </Pressable>
    );
};
