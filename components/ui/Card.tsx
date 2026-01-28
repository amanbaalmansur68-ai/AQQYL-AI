import React from 'react';
import { View, Pressable, ViewProps } from 'react-native';
import { MotiView } from 'moti';

interface CardProps extends ViewProps {
    children: React.ReactNode;
    className?: string;
    onPress?: () => void;
    variant?: 'default' | 'elevated' | 'outlined';
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    onPress,
    variant = 'default',
    ...props
}) => {
    const [pressed, setPressed] = React.useState(false);

    const variantClasses = {
        default: 'bg-dark-card',
        elevated: 'bg-dark-card shadow-lg shadow-black/30',
        outlined: 'bg-transparent border border-dark-border',
    };

    const cardContent = (
        <MotiView
            className={`rounded-2xl p-4 ${variantClasses[variant]} ${className}`}
            animate={{
                scale: onPress ? (pressed ? 0.98 : 1) : 1,
            }}
            transition={{
                type: 'timing',
                duration: 100,
            }}
            {...props}
        >
            {children}
        </MotiView>
    );

    if (onPress) {
        return (
            <Pressable
                onPress={onPress}
                onPressIn={() => setPressed(true)}
                onPressOut={() => setPressed(false)}
            >
                {cardContent}
            </Pressable>
        );
    }

    return cardContent;
};
