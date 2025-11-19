import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getChatCompletion } from '../services/openai.js';
import { getTopHeadlines } from '../services/news.js';
import { getCurrentWeather } from '../services/weather.js';
import { transcribeAudio } from '../services/whisper.js';
import multer from 'multer';

const router = express.Router();

// Configure multer for audio file upload
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit
});

router.get('/me', requireAuth, (req, res) => {
  const { id, displayName, email, photo } = req.user;
  res.json({ id, displayName, email, photo });
});

router.get('/protected-data', requireAuth, (req, res) => {
  res.json({ secret: 'this is protected', user: req.user.displayName });
});

router.post('/chat', requireAuth, async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('[CHAT] Processing message:', message);
    const result = await getChatCompletion(message, conversationHistory);
    
    if (result.success) {
      console.log('[CHAT] Response:', result.message);
      res.json({ 
        message: result.message,
        timestamp: new Date().toISOString()
      });
    } else {
      console.error('[CHAT] Error:', result.error);
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error('[CHAT] Unexpected error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// New route for speech-to-text transcription
router.post('/transcribe', requireAuth, upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    console.log('[TRANSCRIBE] Processing audio file');
    const result = await transcribeAudio(req.file.buffer, req.file.originalname);
    
    if (result.success) {
      console.log('[TRANSCRIBE] Success:', result.text);
      res.json({ text: result.text });
    } else {
      console.error('[TRANSCRIBE] Error:', result.error);
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error('[TRANSCRIBE] Unexpected error:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

// Updated news route - now uses country parameter instead of source
router.get('/news', requireAuth, async (req, res) => {
  try {
    const country = req.query.country || 'in'; // Default to India
    console.log(`[NEWS] Fetching top headlines for country: ${country}`);
    const result = await getTopHeadlines(country);
    
    if (result.success) {
      res.json({ articles: result.articles });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error('[NEWS] Unexpected error:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

router.get('/weather', requireAuth, async (req, res) => {
  try {
    const location = req.query.location || 'New Delhi';
    console.log(`[WEATHER] Fetching weather for location: ${location}`);
    const result = await getCurrentWeather(location);
    
    if (result.success) {
      res.json({ weather: result.weather });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error('[WEATHER] Unexpected error:', error);
    res.status(500).json({ error: 'Failed to fetch weather' });
  }
});

export default router;
