
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export const analyzeResume = async (resumeText, jobDescription, apiKey) => {
  const prompt = `
You are an expert ATS resume analyzer and career coach.

Analyze the following resume against the job description and provide a detailed analysis.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Respond ONLY with a valid JSON object in this exact format (no markdown, no backticks, no extra text):
{
  "atsScore": <number 0-100>,
  "scoreBreakdown": {
    "keywordMatch": <number 0-100>,
    "relevance": <number 0-100>,
    "formatting": <number 0-100>,
    "experience": <number 0-100>
  },
  "summary": "<2-3 sentence overall assessment>",
  "foundKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword1", "keyword2"],
  "partialKeywords": ["keyword1", "keyword2"],
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": [
    {
      "priority": "high",
      "section": "section name",
      "issue": "what is wrong",
      "fix": "how to fix it"
    }
  ],
  "tips": [
    {
      "category": "Keywords",
      "tip": "specific actionable tip"
    }
  ],
  "verdict": "Strong Match"
}
`;

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || 'Gemini API error');
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No response from Gemini');

  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
};