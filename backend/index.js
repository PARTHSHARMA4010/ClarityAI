import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/analyze', async (req, res) => {
  try {
    const { submissions } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are an expert pedagogical assistant for a teacher. Your task is to analyze a list of student submissions for a specific question and identify the top 2-4 common conceptual misunderstandings.

      Analyze the following student submissions:
      ---
      ${submissions.map((s, i) => `Submission ${i + 1}: "${s}"`).join('\n')}
      ---

      Based on your analysis, provide a response in a clean JSON format. Do not include any text outside of the JSON structure. The JSON object should have a single key "clusters", which is an array of objects. Each object in the array represents a single misconception cluster and must have the following four keys:
      1. "title": A short, clear title for the misconception (e.g., "Confusing Correlation with Causation").
      2. "explanation": A one or two-sentence explanation of what the students are misunderstanding.
      3. "examples": An array of 1-3 direct, anonymized quotes from the provided submissions that exemplify this specific error.
      4. "actionPlan": An object with two keys: "suggestion" (a brief, actionable suggestion for the teacher, like a 5-minute activity or a specific analogy to use) and "quiz" (an array of 2-3 short multiple-choice or true/false questions the teacher can use to check for understanding on this specific point).
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    res.status(200).json(JSON.parse(cleanedText));

  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Failed to analyze submissions. Please check the server logs.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});