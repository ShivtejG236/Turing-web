export async function getTopHeadlines(country = 'in') {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    
    // ENHANCED LOGGING - This will help us see what's wrong
    console.log('[NEWS] Environment check:');
    console.log('[NEWS] - NODE_ENV:', process.env.NODE_ENV);
    console.log('[NEWS] - API Key exists:', !!apiKey);
    console.log('[NEWS] - API Key length:', apiKey ? apiKey.length : 0);
    console.log('[NEWS] - API Key first 10 chars:', apiKey ? apiKey.substring(0, 10) : 'MISSING');
    
    if (!apiKey) {
      console.error('[NEWS] NEWS_API_KEY not configured in environment variables');
      throw new Error('NEWS_API_KEY not configured');
    }
    
    // Fetch breaking news for the selected country using NewsData.io
    const url = `https://newsdata.io/api/1/latest?apikey=${apiKey}&country=${country}&language=en`;
    
    console.log(`[NEWS] Fetching breaking news for country: ${country}`);
    console.log(`[NEWS] Request URL (key hidden): https://newsdata.io/api/1/latest?apikey=***&country=${country}&language=en`);
    
    const response = await fetch(url);
    
    console.log(`[NEWS] Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[NEWS] API Error Response:`, errorText);
      throw new Error(`NewsData.io error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('[NEWS] API Response received, status:', data.status);
    
    // Check for API-level errors
    if (data.status === 'error') {
      console.error('[NEWS] API returned error:', data);
      throw new Error(data.results?.message || data.message || 'Failed to fetch news');
    }
    
    if (data.status !== 'success') {
      console.error('[NEWS] Unexpected API response status:', data.status);
      throw new Error('Unexpected API response status');
    }
    
    console.log(`[NEWS] Successfully fetched ${data.results?.length || 0} articles for country: ${country}`);
    
    // Transform NewsData.io response to standardized format
    // FIXED: Changed 'source' to 'sourceName' to avoid reserved word conflict
    return {
      success: true,
      articles: (data.results || []).map(article => ({
        title: article.title || 'No title available',
        description: article.description || article.content || 'No description available',
        url: article.link || '#',
        urlToImage: article.image_url || null,
        publishedAt: article.pubDate || new Date().toISOString(),
        author: article.creator ? article.creator.join(', ') : null,
        sourceName: article.source_name || article.source_id || 'Unknown Source' // CHANGED from 'source'
      }))
    };
  } catch (error) {
    console.error('[NEWS] Error fetching news:', error.message);
    console.error('[NEWS] Full error:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch news articles'
    };
  }
}
