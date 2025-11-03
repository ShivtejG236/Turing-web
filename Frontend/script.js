const canvas = document.getElementById("liquid");
const ctx = canvas.getContext("2d");
let w, h, t = 0;
let mouseX = 0, mouseY = 0, react = 0;

let stocks = document.getElementsByClassName("stocks")[0]
let news = document.getElementsByClassName("news")[0]
let weather = document.getElementsByClassName("weather")[0]
let extensions = document.getElementsByClassName("extensions")[0]
let profile_pic = document.getElementsByClassName("profile_pic")[0]
let profile_pic_text = document.getElementsByClassName("profile_pic_text")[0]
let profile_logout = document.getElementsByClassName("profile_logout")[0]
let stocks_text = document.getElementsByClassName("stocks_text")[0]
let news_text = document.getElementsByClassName("news_text")[0]
let weather_text = document.getElementsByClassName("weather_text")[0]
let extensions_text = document.getElementsByClassName("extensions_text")[0]

const profilePic = document.querySelector('.profile_pic');

const Messages = document.getElementById('Messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
let conversationHistory = [];

const newsPanel = document.getElementById('newsPanel');
const newsClose = document.getElementById('newsClose');
const newsArticlesContainer = document.getElementById('newsArticles');
const newsButton = document.querySelector('.news');
let currentNewsSource = 'tech';
const tech = document.querySelector('.tech');
const apple = document.querySelector('.apple');
const tesla = document.querySelector('.tesla');
const business = document.querySelector('.business');
const jane = document.querySelector('.jane');

const weatherPanel = document.getElementById('weatherPanel');
const weatherClose = document.getElementById('weatherClose');
const weatherContent = document.getElementById('weatherContent');
const weatherButton = document.querySelector('.weather');

const stocksPanel = document.getElementById('stocksPanel');
const stocksClose = document.getElementById('stocksClose');
const stocksButton = document.querySelector('.stocks');

// const extensionsPanel = document.getElementById('extensionsPanel');
// const extensionsClose = document.getElementById('extensionsClose');
const extensionsButton = document.querySelector('.extensions');

document.addEventListener('contextmenu', function (event) {
  event.preventDefault(); // Prevents the default context menu
  return false; // Ensures the event doesn't propagate further
});


function resize() {
  w = canvas.width = innerWidth;
  h = canvas.height = innerHeight;
}
window.onresize = resize;
resize();

// mouse movement adds gentle offset
window.addEventListener("mousemove", e => {
  mouseX = e.clientX / w - 0.5;
  mouseY = e.clientY / h - 0.5;
  react = 0.15; // small immediate reaction
});

// typing or focusing boosts wave amplitude briefly
const input = document.querySelector(".text_box");
input.addEventListener("focus", () => react = 0);
input.addEventListener("input", () => react = 3);
input.addEventListener("blur", () => react = 0);

const noise = x => Math.sin(x) + Math.sin(x * 0.27) + Math.sin(x * 0.11);

function draw() {
  t += 0.01;
  ctx.clearRect(0, 0, w, h);
  ctx.globalCompositeOperation = "lighter";

  // decay any reaction pulse
  react += (0 - react) * 0.02;

  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const distortion = noise(x * 0.008 + t * 1.5) * 4;
      const offset = (mouseY * 20) + Math.sin(mouseX * 2 + i) * 10;
      const amp = 30 + react * 4; // pulse when typing
      const y = h/2 + Math.sin(x * 0.01 + t + i) * amp + distortion + offset;
      ctx.lineTo(x, y + i * 25);
    }
    ctx.strokeStyle = `hsla(${200 + i * 40}, 90%, 65%, 0.4)`;
    ctx.lineWidth = 3;
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 25;
    ctx.stroke();
  }
  requestAnimationFrame(draw);
}
draw();





stocks.addEventListener("mouseover", ()=>{
        stocks.style.transform = "scale(0.98)";
        stocks_text.style.display = "block";
})
stocks.addEventListener("mouseout", ()=>{
        stocks.style.transform = "scale(1)";
        stocks_text.style.display = "none";
})

news.addEventListener("mouseover", ()=>{
        news.style.transform = "scale(0.98)";
        news_text.style.display = "block";
})
news.addEventListener("mouseout", ()=>{
        news.style.transform = "scale(1)";
        news_text.style.display = "none";
})

weather.addEventListener("mouseover", ()=>{
        weather.style.transform = "scale(0.98)";
        weather_text.style.display = "block";
})
weather.addEventListener("mouseout", ()=>{
        weather.style.transform = "scale(1)";
        weather_text.style.display = "none";
})

extensions.addEventListener("mouseover", ()=>{
        extensions.style.transform = "scale(0.98)";
        extensions_text.style.display = "block";
})
extensions.addEventListener("mouseout", ()=>{
        extensions.style.transform = "scale(1)";
        extensions_text.style.display = "none";
})

profile_pic.addEventListener("mouseover", ()=>{
  profile_pic.style.transform = "scale(0.98)";
  profile_pic.style.boxShadow = "rgba(0, 0, 0, 0.5) 1px 1px 5px 2px";
  profile_pic_text.style.display = "block";
})
profile_pic.addEventListener("mouseout", ()=>{
  profile_pic.style.transform = "scale(1)";
  profile_pic.style.boxShadow = "rgba(0, 0, 0, 1) 1px 1px 5px 1.5px";
  profile_pic_text.style.display = "none";
})

profile_logout.addEventListener("mouseover", ()=>{
        profile_logout.style.color = "red";
        profile_logout.style.background = "transparent";
        profile_logout.style.boxShadow = "rgba(0, 0, 0, 0.5) 1px 1px 5px 1.5px";
})
profile_logout.addEventListener("mouseout", ()=>{
        profile_logout.style.color = "rgba(220, 242, 249, 0.584)";
        profile_logout.style.background = "rgba(201, 45, 60, 0.833)";
        profile_logout.style.boxShadow = "rgba(0, 0, 0, 1) 1px 1px 5px 1.5px";
})

// Check for token in URL and store it
function checkURLToken() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  
  if (token) {
    // Store token in localStorage
    localStorage.setItem('authToken', token);
    // Clean up URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

async function fetchMe() {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.log('No token found, redirecting to login');
      window.location.href = 'https://turing-web-version.vercel.app';
      return;
    }

    const res = await fetch('https://turing-web-version.up.railway.app/api/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });

    if (res.status === 200) {
      const user = await res.json();
      console.log('User data:', user);
      
      // Update UI with user data
      document.querySelector('.profile_pic').src = user.photo || 'Assets/profile.png';
      document.querySelector('.profile_pic').alt = user.displayName || 'User';
      
      // Update greeting
      if (document.querySelector('.greeting')) {
        document.querySelector('.greeting').textContent = `Hello ${user.displayName.split(' ')[0]} !`;
      }
    } else {
      console.log('Auth failed, clearing token and redirecting');
      localStorage.removeItem('authToken');
      window.location.href = 'https://turing-web-version.vercel.app';
    }
  } catch (err) {
    console.error('fetchMe error', err);
    localStorage.removeItem('authToken');
    window.location.href = 'https://turing-web-version.vercel.app';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  checkURLToken();
  fetchMe();
});

// logout
async function logout() {
  const token = localStorage.getItem('authToken');
  
  await fetch('https://turing-web-version.up.railway.app/auth/logout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include'
  });
  
  localStorage.removeItem('authToken');
  window.location.href = 'https://turing-web-version.vercel.app';
}

document.querySelector('.profile_logout')?.addEventListener('click', logout);


// Chat functionality


function addMessage(content, type = 'user') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = content;
    Messages.appendChild(messageDiv);
    Messages.classList.add('active');
    Messages.scrollTop = Messages.scrollHeight;
    return messageDiv;
}

// Messages.addEventListener('scroll', ()=>{
//   Messages.classList.remove('no-scrollbar');
//   clearTimeout(scrollTimeout);
//   scrollTimeout = setTimeout(() => {
//     Messages.classList.add('no-scrollbar'); // hide again
//   }, 1000);
// })

async function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    // Add user message to UI
    addMessage(message, 'user');
    
    // Clear input
    messageInput.value = '';
    
    // Show loading message
    const loadingMsg = addMessage('Thinking...', 'loading');
    
    try {
        const token = localStorage.getItem('authToken');
        
        const response = await fetch('https://turing-web-version.up.railway.app/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                message: message,
                conversationHistory: conversationHistory
            })
        });
        
        // Remove loading message
        loadingMsg.remove();
        
        if (response.ok) {
            const data = await response.json();
            
            // Add bot response to UI
            addMessage(data.message, 'bot');
            
            // Update conversation history
            conversationHistory.push(
                { role: 'user', content: message },
                { role: 'assistant', content: data.message }
            );
            
            // Keep only last 10 messages in history to avoid token limits
            if (conversationHistory.length > 20) {
                conversationHistory = conversationHistory.slice(-20);
            }
        } else {
            addMessage('Sorry, I encountered an error. Please try again.', 'error');
        }
    } catch (error) {
        loadingMsg.remove();
        console.error('Chat error:', error);
        addMessage('Failed to send message. Please check your connection.', 'error');
    }
}

sendButton.addEventListener('click', () => {
  stocksPanel.classList.remove('active');
  newsPanel.classList.remove('active');
  weatherPanel.classList.remove('active');
  if (Messages.classList.contains('active')) {
    Messages.style.display = 'block';
  }
});
// Send on button click
sendButton.addEventListener('click', sendMessage);

// Send on Enter key (Shift+Enter for new line)
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
      stocksPanel.classList.remove('active');
      newsPanel.classList.remove('active');
      weatherPanel.classList.remove('active');
      if (Messages.classList.contains('active')) {
        Messages.style.display = 'block';
      }
    }
});

// Auto-resize textarea
messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 150) + 'px';
});



// News Modal functionality


// Open news Panel
newsButton.addEventListener('click', async () => {
  if (Messages.classList.contains('active')) {
    Messages.style.display = 'none';
  }
  newsPanel.classList.add('active');
  stocksPanel.classList.remove('active');
  weatherPanel.classList.remove('active');
  currentNewsSource = 'tech';
  setActiveTab('tech');
  await loadNews('tech');
});

// Close news Panel
newsClose.addEventListener('click', () => {
  newsPanel.style.animation = 'fadeOut 0.3s ease-out';
  setTimeout(() => {
    newsPanel.classList.remove('active');
    newsPanel.style.animation = ''; // Reset animation
    if (Messages.classList.contains('active')) {
      Messages.style.display = 'block';
    }
  }, 300); // Match the animation duration
});

// Close on outside click
newsPanel.addEventListener('click', (e) => {
    if (e.target === newsPanel) {
        newsPanel.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            newsPanel.classList.remove('active');
            newsPanel.style.animation = '';
        }, 300);
    }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (newsPanel.classList.contains('active')) {
            newsPanel.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                newsPanel.classList.remove('active');
                newsPanel.style.animation = '';
            }, 300);
        }
        if (weatherPanel.classList.contains('active')) {
            weatherPanel.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                weatherPanel.classList.remove('active');
                weatherPanel.style.animation = '';
            }, 300);
        }
        if (stocksPanel.classList.contains('active')) {
            stocksPanel.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                stocksPanel.classList.remove('active');
                stocksPanel.style.animation = '';
            }, 300);
        }
    }
});

async function loadNews(source = 'tech') {
    newsArticlesContainer.innerHTML = '<div class="news_loading">Refreshing news...</div>';
    
    try {
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`https://turing-web-version.up.railway.app/api/news?source=${source}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            displayNews(data.articles);
        } else {
            newsArticlesContainer.innerHTML = '<div class="news_loading" style="color: #ff6b6b;">Failed to load news. Please try again.</div>';
        }
    } catch (error) {
        console.error('News fetch error:', error);
        newsArticlesContainer.innerHTML = '<div class="news_loading" style="color: #ff6b6b;">Network error. Please check your connection.</div>';
    }
}

function displayNews(articles) {
    if (!articles || articles.length === 0) {
        newsArticlesContainer.innerHTML = '<div class="news_loading">No news articles available.</div>';
        return;
    }
    
    newsArticlesContainer.innerHTML = articles.map(article => {
        const date = new Date(article.publishedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        return `
          <div class="news_article" onclick="window.open('${article.url}', '_blank')">
            <div class="news_article_image">
              ${article.urlToImage 
                ? `<img src="${article.urlToImage}" alt="${article.title}" onerror="this.style.display='none'">`
                : ''
              }
              <div class="news_article_meta">
                <span class="news_article_author">${article.author || article.source || 'Unknown'}</span>
                <span class="news_article_date">${date}</span>
              </div>
            </div>
        
            <div class="news_article_text">
              <div class="news_article_title">${article.title}</div>
              ${article.description 
                ? `<div class="news_article_description">${article.description}</div>` 
                : ''
              }
            </div>
          </div>
        `;
    }).join('');
}

function setActiveTab(tabName) {
    // Reset all tabs
    tech.style.boxShadow = "rgba(0,0,0,0) 1px 1px 5px 2px";
    apple.style.boxShadow = "rgba(0,0,0,0) 1px 1px 5px 2px";
    tesla.style.boxShadow = "rgba(0,0,0,0) 1px 1px 5px 2px";
    business.style.boxShadow = "rgba(0,0,0,0) 1px 1px 5px 2px";
    jane.style.boxShadow = "rgba(0,0,0,0) 1px 1px 5px 2px";
    
    // Set active tab
    const tabs = { tech, apple, tesla, business, jane };
    if (tabs[tabName]) {
        tabs[tabName].style.boxShadow = "rgba(0,0,0,0.25) 1px 1px 5px 2px";
    }
}


tech.addEventListener('click', async () => {
    setActiveTab('tech');
    currentNewsSource = 'tech';
    await loadNews('tech');
});

apple.addEventListener('click', async () => {
    setActiveTab('apple');
    currentNewsSource = 'apple';
    await loadNews('apple');
});

tesla.addEventListener('click', async () => {
    setActiveTab('tesla');
    currentNewsSource = 'tesla';
    await loadNews('tesla');
});

business.addEventListener('click', async () => {
    setActiveTab('business');
    currentNewsSource = 'business';
    await loadNews('business');
});

jane.addEventListener('click', async () => {
    setActiveTab('jane');
    currentNewsSource = 'jane';
    await loadNews('jane');
});


// Weather Panel functionality

// Open Weather Panel
weatherButton.addEventListener('click', async () => {
  if (Messages.classList.contains('active')) {
    Messages.style.display = 'none';
  }
  stocksPanel.classList.remove('active');
  newsPanel.classList.remove('active');
  weatherPanel.classList.add('active');
  await loadWeather();
});

// Close Weather Panel
weatherClose.addEventListener('click', () => {
  weatherPanel.style.animation = 'fadeOut 0.3s ease-out';
  setTimeout(() => {
    weatherPanel.classList.remove('active');
    weatherPanel.style.animation = ''; // Reset animation
    if (Messages.classList.contains('active')) {
      Messages.style.display = 'block';
    }
  }, 300);
});

// Close on outside click
weatherPanel.addEventListener('click', (e) => {
    if (e.target === weatherPanel) {
        weatherPanel.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            weatherPanel.classList.remove('active');
            weatherPanel.style.animation = '';
        }, 300);
    }
});

// Close on Escape key (update existing Escape handler to include weather)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && weatherPanel.classList.contains('active')) {
        stocksPanel.classList.remove('active');
        weatherPanel.classList.remove('active');
    }
});

async function loadWeather(location = 'New Delhi') {
    weatherContent.innerHTML = '<div class="weather_loading">Fetching weather data...</div>';
    
    try {
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`https://turing-web-version.up.railway.app/api/weather?location=${encodeURIComponent(location)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            displayWeather(data.weather);
        } else {
            weatherContent.innerHTML = '<div class="weather_loading" style="color: #ff6b6b;">Failed to load weather. Please try again.</div>';
        }
    } catch (error) {
        console.error('Weather fetch error:', error);
        weatherContent.innerHTML = '<div class="weather_loading" style="color: #ff6b6b;">Network error. Please check your connection.</div>';
    }
}

function displayWeather(weather) {
    if (!weather) {
        weatherContent.innerHTML = '<div class="weather_loading">No weather data available.</div>';
        return;
    }
    
    const { location, current } = weather;
    
    weatherContent.innerHTML = `
        <div class="weather_main">
            <div class="weather_temp_section">
                <img src="https:${current.condition.icon}" alt="${current.condition.text}" class="weather_icon">
                <div>
                    <div class="weather_temp">${Math.round(current.temp_c)}°C</div>
                    <div class="weather_condition">${current.condition.text}</div>
                </div>
            </div>
            <div class="weather_location">
                <div class="weather_location_name">${location.name}</div>
                <div class="weather_location_region">${location.region}, ${location.country}</div>
                <div class="weather_location_time">${new Date(location.localtime).toLocaleString()}</div>
            </div>
        </div>
        <div class="weather_details">
            <div class="weather_detail_item">
                <span class="weather_detail_label">Feels Like</span>
                <span class="weather_detail_value">${Math.round(current.feelslike_c)}°C</span>
            </div>
            <div class="weather_detail_item">
                <span class="weather_detail_label">Humidity</span>
                <span class="weather_detail_value">${current.humidity}%</span>
            </div>
            <div class="weather_detail_item">
                <span class="weather_detail_label">Wind Speed</span>
                <span class="weather_detail_value">${current.wind_kph} km/h ${current.wind_dir}</span>
            </div>
            <div class="weather_detail_item">
                <span class="weather_detail_label">Pressure</span>
                <span class="weather_detail_value">${current.pressure_mb} mb</span>
            </div>
            <div class="weather_detail_item">
                <span class="weather_detail_label">UV Index</span>
                <span class="weather_detail_value">${current.uv}</span>
            </div>
            <div class="weather_detail_item">
                <span class="weather_detail_label">Visibility</span>
                <span class="weather_detail_value">${current.vis_km} km</span>
            </div>
        </div>
    `;
}


stocksButton.addEventListener('click', () => {
  stocksPanel.classList.add('active');
  if (Messages.classList.contains('active')) {
    Messages.style.display = 'none';
  }
  if (weatherPanel.classList.contains('active')) {
    weatherPanel.style.display = 'none';
  }
  if (newsPanel.classList.contains('active')) {
    newsPanel.style.display = 'none';
  }
});

extensionsButton.addEventListener('click', () => {
  stocksPanel.classList.add('active');
  if (Messages.classList.contains('active')) {
    Messages.style.display = 'none';
  }
  if (weatherPanel.classList.contains('active')) {
    weatherPanel.style.display = 'none';
  }
  if (newsPanel.classList.contains('active')) {
    newsPanel.style.display = 'none';
  }
});

profilePic.addEventListener('click', () => {
  stocksPanel.classList.add('active');
  if (Messages.classList.contains('active')) {
    Messages.style.display = 'none';
  }
  if (weatherPanel.classList.contains('active')) {
    weatherPanel.style.display = 'none';
  }
  if (newsPanel.classList.contains('active')) {
    newsPanel.style.display = 'none';
  }
});

stocksClose.addEventListener('click', () => {
  stocksPanel.style.animation = 'fadeOut 0.3s ease-out';
  setTimeout(() => {
    stocksPanel.classList.remove('active');
    stocksPanel.style.animation = ''; // Reset animation
    if (Messages.classList.contains('active')) {
      Messages.style.display = 'block';
    }
  }, 300);
});

