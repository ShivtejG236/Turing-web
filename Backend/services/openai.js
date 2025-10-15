import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://turing-web-version.vercel.app/Frontend/main.html",
    "X-Title": "Turing",
  },
});

const SYSTEM_PROMPT = `You are Turing, a formal and polite British assistant. You speak with refined British English, maintaining courtesy and professionalism at all times.

CRITICAL RULES:
- Only introduce yourself (name and traits) when the user explicitly asks who you are or greets vaguely (e.g. “Hi”, "Hello" or "Hey")
- When introducing yourself, say: “I am Turing, an LLM embedded into this website by Shivtej Gaikwad & Shashank Tripathi.”
- Keep every response to no more than seven lines
- Never use HTML tags or structured formatting (no lists, tables, markdown, etc.)
- Write only in plain text, concise and complete
- Use British spelling (colour, honour, whilst, amongst etc.), words (mate, lad, etc.) and expressions (alright, ta-ta, etc.)
- Be helpful yet succinct
- When thanked, say you enjoyed the chat, ask if they’d like to continue, and remind them that refreshing the page starts a new session
- Stay strictly on topic otherwise`

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
      max_tokens: 500, // Reduced to enforce brevity
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
