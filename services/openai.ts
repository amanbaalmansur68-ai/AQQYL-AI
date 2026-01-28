import { Question } from '../store/gameStore';

// User provided key
// In a real production app, this should be in an environment variable or proxy
const API_KEY = ''; // REMOVED FOR SECURITY. Use process.env.EXPO_PUBLIC_OPENAI_API_KEY

interface GenerateOptions {
    topic: string;
    count: number;
    grade: number;
    difficulty: string;
}

export const generateQuizQuestions = async ({ topic, count, grade, difficulty }: GenerateOptions): Promise<Question[]> => {
    try {
        const prompt = `
            You are an expert teacher of Kazakh language, literature, history, and culture.
            
            First, validate the topic: "${topic}".
            The topic might be written in Kazakh, Russian, or English.
            
            Is this topic related to:
            1. **Kazakh Language** (grammar, phonetics, morphology, endings/suffixes, syntax, vocabulary)?
            2. **Kazakh Literature** (writers, poets, works)?
            3. **Kazakh History** or **Kazakh Culture**?
            
            If the topic is about "Endings" (Окончания) or "Grammar" generally, assume it refers to KAZAKH grammar.
            
            If the topic is NOT related (e.g. Marvel, Physics not specific to KZ, Math, general World History), return:
            {"error": "irrelevant"}
            
            If it IS related, generate a multiple choice quiz in **KAZAKH LANGUAGE** (regardless of the input language).
            Target audience: Grade ${grade} students.
            Difficulty level: ${difficulty}.
            Number of questions: ${count}.
            
            Instructions for questions:
            - Be creative and interesting.
            - Ensure diverse question types.
            - If the topic is grammar (e.g. "Септік жалғаулары"), generate practice questions for that specific grammar rule.
            
            Return ONLY a valid JSON array of objects (OR the error object). Do not include markdown.
            Format:
            [
                {
                    "id": 1,
                    "question": "Question text in Kazakh",
                    "options": ["Correct", "Wrong1", "Wrong2", "Wrong3"],
                    "correctIndex": 0
                }
            ]
            (Scramble the correctIndex placement randomly).
        `;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo", // or gpt-4 if available/affordable, 3.5 is fine
                messages: [
                    { role: "system", content: "You are a strict but creative Kazakh educational AI." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.8, // Slightly higher for creativity
            })
        });

        const data = await response.json();

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            console.error('OpenAI API Error:', data);
            throw new Error('Failed to generate questions from AI');
        }

        const content = data.choices[0].message.content.trim();
        const jsonString = content.replace(/^```json/, '').replace(/```$/, '').trim();

        const result = JSON.parse(jsonString);

        if (result.error === 'irrelevant') {
            throw new Error('IRRELEVANT_TOPIC');
        }

        return result;

    } catch (error: any) {
        if (error.message === 'IRRELEVANT_TOPIC') {
            throw error;
        }
        console.error('AI Generation Error:', error);
        throw error;
    }
};
