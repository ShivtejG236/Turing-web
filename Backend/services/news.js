export async function getTopHeadlines(country = 'in') {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    
    // Different URL patterns for different sources
    let url;
    if (source === 'tech') {
      url = `https://newsdata.io/api/1/latest?apikey=${apiKey}&country=${country}`;
    }
    // else if (source === 'apple') {
    //   url = `https://newsapi.org/v2/everything?q=apple&from=2025-10-13&to=2025-10-13&sortBy=popularity&apiKey=${apiKey}`;
    // } else if (source === 'tesla') {
    //   url = `https://newsapi.org/v2/everything?q=tesla&from=2025-09-14&sortBy=publishedAt&apiKey=${apiKey}`;
    // } else if (source === 'business') {
    //   url = `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${apiKey}`;
    // } else if (source === 'jane') {
    //   url = `https://newsapi.org/v2/everything?domains=wsj.com&apiKey=${apiKey}`;
    // } else {
    //   url = `https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${apiKey}`;
    // }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`NewsData.io error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'success') {
      throw new Error(data.message || 'Failed to fetch news');
    }
    
    console.log(`[NEWS] Fetched ${data.results.length} articles for country: ${country}`);
    
    return {
      success: true,
      articles: data.results.map(article => ({
        title: article.title,
        description: article.description,
        url: article.link,
        urlToImage: article.image_url,
        publishedAt: article.pubDate,
        author: article.creator ? article.creator.join(', ') : null,
        source: article.source_name || article.source_id
      }))
    };
  } catch (error) {
    console.error('[NEWS] Error fetching news:', error);
    return {
      success: false,
      error: error.message
    };
  }
}


