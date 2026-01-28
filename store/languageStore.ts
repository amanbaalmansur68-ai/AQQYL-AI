import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations, Language } from '../constants/translations';

interface LanguageState {
    language: Language;
    t: typeof translations.kk;
    setLanguage: (lang: Language) => Promise<void>;
    loadLanguage: () => Promise<void>;
}

export const useLanguageStore = create<LanguageState>((set) => ({
    language: 'kk',
    t: translations.kk,

    setLanguage: async (lang) => {
        await AsyncStorage.setItem('language', lang);
        set({ language: lang, t: translations[lang] });
    },

    loadLanguage: async () => {
        try {
            const storedLang = await AsyncStorage.getItem('language');
            if (storedLang && (storedLang === 'kk' || storedLang === 'ru' || storedLang === 'en')) {
                set({ language: storedLang as Language, t: translations[storedLang as Language] });
            }
        } catch (error) {
            console.error('Failed to load language', error);
        }
    },
}));
