import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getChatCompletion } from '../services/openai.js';
import { getTopHeadlines } from '../services/news.js';
const router = express.Router();

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

router.get('/news', requireAuth, async (req, res) => {
  try {
    console.log('[NEWS] Fetching top headlines');
    const result = await getTopHeadlines();
    
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

export default router;
