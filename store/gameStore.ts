import { create } from 'zustand';

export interface Question {
    id: number;
    question: string;
    options: string[];
    correctIndex: number;
}

export interface Player {
    id: string;
    name: string;
    avatar: string;
    avatarColor?: string;
    score: number;
}

interface GameState {
    lobbyCode: string;
    questions: Question[];
    currentQuestionIndex: number;
    score: number;
    totalQuestions: number;
    timePerQuestion: number;
    players: Player[];
    isGameActive: boolean;

    setLobbyCode: (code: string) => void;
    setQuestions: (questions: Question[]) => void;
    nextQuestion: () => void;
    addScore: (points: number) => void;
    resetGame: () => void;
    addPlayer: (player: Player) => void;
    removePlayer: (playerId: string) => void;
    updatePlayerScore: (playerId: string, score: number) => void;
    startGame: () => void;
    startTestMode: () => void;
    endGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
    lobbyCode: '',
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    totalQuestions: 10,
    timePerQuestion: 20,
    players: [],
    isGameActive: false,

    setLobbyCode: (code) => set({ lobbyCode: code }),
    setQuestions: (questions) => set({ questions, totalQuestions: questions.length }),
    nextQuestion: () => set((state) => ({
        currentQuestionIndex: state.currentQuestionIndex + 1
    })),
    addScore: (points) => set((state) => ({ score: state.score + points })),
    resetGame: () => set({
        currentQuestionIndex: 0,
        score: 0,
        questions: [],
        isGameActive: false,
    }),
    addPlayer: (player) => set((state) => ({
        players: [...state.players, player]
    })),
    removePlayer: (playerId) => set((state) => ({
        players: state.players.filter(p => p.id !== playerId)
    })),
    updatePlayerScore: (playerId, score) => set((state) => ({
        players: state.players.map(p =>
            p.id === playerId ? { ...p, score } : p
        ),
    })),
    startGame: () => set({ isGameActive: true }),
    startTestMode: () => set({
        isGameActive: true,
        currentQuestionIndex: 0,
        score: 0,
        // Keep questions
    }),
    endGame: () => set({ isGameActive: false }),
}));
