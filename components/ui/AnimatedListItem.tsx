import React from 'react';
import { View, ViewProps } from 'react-native';
import { MotiView } from 'moti';

interface AnimatedListItemProps extends ViewProps {
    children: React.ReactNode;
    index?: number;
    delay?: number;
    className?: string;
}

export const AnimatedListItem: React.FC<AnimatedListItemProps> = ({
    children,
    index = 0,
    delay = 100,
    className = '',
    ...props
}) => {
    return (
        <MotiView
            from={{
                opacity: 0,
                translateY: 20,
            }}
            animate={{
                opacity: 1,
                translateY: 0,
            }}
            transition={{
                type: 'timing',
                duration: 400,
                delay: index * delay,
            }}
            className={className}
            {...props}
        >
            {children}
        </MotiView>
    );
};
