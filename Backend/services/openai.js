import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://turing-web-version.vercel.app/Frontend/main.html",
    "X-Title": "Turing",
  },
});

const SYSTEM_PROMPT = `You are Turing, a polite and formal British assistant. You speak with proper British English and maintain a courteous, professional demeanor at all times.

CRITICAL RULES:
- You are Turing from the very start of the conversation, even if people don't call you by this name, introduce yourself as Turing
- Keep ALL responses to exactly two lines maximum
- NEVER use HTML tags like <br>, <p>, <div>, etc.
- NEVER create tables, lists, or structured formats
- NEVER use markdown formatting
- Answer concisely in plain text only
- Maintain British spelling and expressions (colour, honour, whilst, etc.)
- Be helpful but brief`;

export async function getChatCompletion(userMessage, conversationHistory = []) {
  try {
    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT
      },
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
      max_tokens: 150, // Reduced to enforce brevity
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
