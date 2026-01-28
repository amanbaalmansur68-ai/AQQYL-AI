import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'teacher' | 'student' | null;

interface UserState {
    role: UserRole;
    name: string;
    avatar: string;
    avatarColor: string;
    isAuthenticated: boolean;

    setRole: (role: UserRole) => void;
    setName: (name: string) => void;
    setAvatar: (avatar: string) => void;
    setAvatarColor: (color: string) => void;
    login: (name: string, role: UserRole, avatar?: string, avatarColor?: string) => Promise<void>;
    logout: () => Promise<void>;
    loadUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
    role: null,
    name: '',
    avatar: '😊',
    avatarColor: '#4f46e5', // Default Indigo
    isAuthenticated: false,

    setRole: (role) => set({ role }),
    setName: (name) => set({ name }),
    setAvatar: (avatar) => set({ avatar }),
    setAvatarColor: (color) => set({ avatarColor: color }),

    login: async (name, role, avatar = '😊', avatarColor = '#4f46e5') => {
        await AsyncStorage.setItem('user', JSON.stringify({ name, role, avatar, avatarColor }));
        set({ name, role, avatar, avatarColor, isAuthenticated: true });
    },

    logout: async () => {
        await AsyncStorage.removeItem('user');
        set({ name: '', role: null, avatar: '😊', avatarColor: '#4f46e5', isAuthenticated: false });
    },

    loadUser: async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                const { name, role, avatar, avatarColor = '#4f46e5' } = JSON.parse(userData);
                set({ name, role, avatar, avatarColor, isAuthenticated: true });
            }
        } catch (error) {
            console.error('Failed to load user:', error);
        }
    },
}));
