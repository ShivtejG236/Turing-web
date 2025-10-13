import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.FRONTEND_ORIGIN || "https://turing-web-version.vercel.app",
    "X-Title": "Turing",
  },
});

export async function getChatCompletion(userMessage, conversationHistory = []) {
  try {
    const messages = [
      ...conversationHistory,
      {
        role: "user",
        content: userMessage
      }
    ];

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    return {
      success: true,
      message: completion.choices[0].message.content,
      fullResponse: completion.choices[0].message
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
