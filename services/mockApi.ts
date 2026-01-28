import { Question, Player } from '../store/gameStore';
import { generateQuizQuestions } from './openai';

// Simulated network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Quiz questions in Kazakh language
const mockQuestions: Question[] = [
    {
        id: 1,
        question: '«Абай жолы» романының авторы кім?',
        options: ['М. Әуезов', 'Ы. Алтынсарин', 'А. Құнанбаев', 'С. Сейфуллин'],
        correctIndex: 0,
    },
    {
        id: 2,
        question: 'Қазақстанның астанасы қандай қала?',
        options: ['Алматы', 'Шымкент', 'Астана', 'Қарағанды'],
        correctIndex: 2,
    },
    {
        id: 3,
        question: 'Абай Құнанбаев қай жылы дүниеге келген?',
        options: ['1835', '1845', '1855', '1865'],
        correctIndex: 1,
    },
    {
        id: 4,
        question: 'Қазақ тілінде қанша дауысты дыбыс бар?',
        options: ['9', '10', '11', '12'],
        correctIndex: 0,
    },
    {
        id: 5,
        question: '«Қыз Жібек» қай жанрға жатады?',
        options: ['Ертегі', 'Аңыз', 'Лиро-эпос', 'Дастан'],
        correctIndex: 2,
    },
    {
        id: 6,
        question: 'Қазақстан тәуелсіздігін қай жылы алды?',
        options: ['1990', '1991', '1992', '1993'],
        correctIndex: 1,
    },
    {
        id: 7,
        question: 'Қазақ халқының ұлттық аспабы қайсысы?',
        options: ['Баян', 'Домбыра', 'Гитара', 'Пианино'],
        correctIndex: 1,
    },
    {
        id: 8,
        question: '«Алдар көсе» қандай кейіпкер?',
        options: ['Батыр', 'Шешен', 'Аңшы', 'Патша'],
        correctIndex: 1,
    },
    {
        id: 9,
        question: 'Қазақстанның ең үлкен көлі қайсысы?',
        options: ['Балқаш', 'Каспий теңізі', 'Алакөл', 'Зайсан'],
        correctIndex: 1,
    },
    {
        id: 10,
        question: 'Қазақ тіліндегі бірінші газет қалай аталады?',
        options: ['Қазақ', 'Дала уалаяты', 'Айқап', 'Сарыарқа'],
        correctIndex: 1,
    },
];

// Avatar options (emojis)
export const avatarOptions = [
    '😊', '😎', '🤓', '🦊', '🐱', '🐶', '🦁', '🐼',
    '🦄', '🐸', '🦋', '🌟', '🔥', '💎', '🎮', '📚'
];

// Generate random lobby code
export const generateLobbyCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

// Mock API functions
export const mockApi = {
    // Get questions for a quiz
    getQuestions: async (count: number = 10): Promise<Question[]> => {
        await delay(1500);
        const shuffled = [...mockQuestions].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, mockQuestions.length));
    },

    // Create a new lobby (teacher)
    createLobby: async (topic: string, settings: {
        questionCount: number;
        grade: number;
        difficulty: string;
    }): Promise<{ lobbyCode: string; questions: Question[] }> => {
        const lobbyCode = generateLobbyCode();

        try {
            console.log('Generating AI questions for:', topic);
            const aiQuestions = await generateQuizQuestions({
                topic,
                count: settings.questionCount,
                grade: settings.grade,
                difficulty: settings.difficulty
            });

            if (aiQuestions && aiQuestions.length > 0) {
                return { lobbyCode, questions: aiQuestions };
            }
        } catch (error: any) {
            if (error.message === 'IRRELEVANT_TOPIC') {
                throw error;
            }
            console.error('AI Generation failed, falling back to mock:', error);
        }

        // Fallback to mock if AI fails
        await delay(2000);
        const questions = await mockApi.getQuestions(settings.questionCount);
        return { lobbyCode, questions };
    },

    // Join lobby (student)
    joinLobby: async (code: string, playerName: string, avatar: string): Promise<{
        success: boolean;
        message?: string;
        player?: Player;
    }> => {
        await delay(1000);
        // Simulate joining
        const player: Player = {
            id: Math.random().toString(36).substr(2, 9),
            name: playerName,
            avatar,
            score: 0,
        };
        return { success: true, player };
    },

    // Submit answer
    submitAnswer: async (questionId: number, answerIndex: number, timeLeft: number): Promise<{
        correct: boolean;
        points: number;
    }> => {
        await delay(300);
        const question = mockQuestions.find(q => q.id === questionId);
        const correct = question?.correctIndex === answerIndex;
        // More points for faster answers
        const points = correct ? Math.round(100 + timeLeft * 5) : 0;
        return { correct, points };
    },

    // Get leaderboard
    getLeaderboard: async (): Promise<Player[]> => {
        await delay(500);
        // Mock leaderboard data
        const mockPlayers: Player[] = [
            { id: '1', name: 'Арман', avatar: '😎', score: 1250 },
            { id: '2', name: 'Айгерім', avatar: '🦋', score: 1180 },
            { id: '3', name: 'Нұрсұлтан', avatar: '🔥', score: 1050 },
            { id: '4', name: 'Дана', avatar: '💎', score: 980 },
            { id: '5', name: 'Бекзат', avatar: '🎮', score: 850 },
        ];
        return mockPlayers.sort((a, b) => b.score - a.score);
    },

    // Get user stats
    getUserStats: async (): Promise<{
        gamesPlayed: number;
        averageScore: number;
        totalXP: number;
        rank: string;
    }> => {
        await delay(800);
        return {
            gamesPlayed: 24,
            averageScore: 78,
            totalXP: 4580,
            rank: 'Шәкірт',
        };
    },
};
