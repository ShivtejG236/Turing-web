import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function transcribeAudio(audioBuffer, filename = 'audio.webm') {
  try {
    // Create a temporary file path
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const tempFilePath = path.join(tempDir, filename);
    
    // Write the buffer to a temporary file
    fs.writeFileSync(tempFilePath, audioBuffer);
    
    // Create a read stream from the file
    const audioFile = fs.createReadStream(tempFilePath);
    
    // Send to Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "en", // You can make this dynamic or remove it for auto-detection
    });
    
    // Clean up the temporary file
    fs.unlinkSync(tempFilePath);
    
    console.log('[WHISPER] Transcription successful:', transcription.text);
    
    return {
      success: true,
      text: transcription.text
    };
  } catch (error) {
    console.error('[WHISPER] Error transcribing audio:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
