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

let input_mic = document.getElementsByClassName("input_mic")[0]

const profilePic = document.querySelector('.profile_pic');

const Messages = document.getElementById('Messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
let conversationHistory = [];

const newsPanel = document.getElementById('newsPanel');
const newsClose = document.getElementById('newsClose');
const newsArticlesContainer = document.getElementById('newsArticles');
const newsButton = document.querySelector('.news');
let currentCountry = 'in'; // Default to Nepal
const countrySelect = document.getElementById('country');

const weatherPanel = document.getElementById('weatherPanel');
const weatherClose = document.getElementById('weatherClose');
const weatherContent = document.getElementById('weatherContent');
const weatherButton = document.querySelector('.weather');

const stocksPanel = document.getElementById('stocksPanel');
const stocksClose = document.getElementById('stocksClose');
const stocksButton = document.querySelector('.stocks');

const extensionsButton = document.querySelector('.extensions');

// Voice Recording Variables
let mediaRecorder;
let audioChunks = [];
let isRecording = false;
const micButton = document.querySelector('.input_mic');
const micImage = document.querySelector('.mic_image');

document.addEventListener('contextmenu', function (event) {
  event.preventDefault();
  return false;
});


function resize() {
  w = canvas.width = innerWidth;
  h = canvas.height = innerHeight;
}
window.onresize = resize;
resize();

window.addEventListener("mousemove", e => {
  mouseX = e.clientX / w - 0.5;
  mouseY = e.clientY / h - 0.5;
  react = 0.15;
});

const input = document.querySelector(".text_box");
input.addEventListener("focus", () => react = 0);
input.addEventListener("input", () => react = 3);
input.addEventListener("blur", () => react = 0);

const noise = x => Math.sin(x) + Math.sin(x * 0.27) + Math.sin(x * 0.11);

function draw() {
  t += 0.01;
  ctx.clearRect(0, 0, w, h);
  ctx.globalCompositeOperation = "lighter";

  react += (0 - react) * 0.02;

  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const distortion = noise(x * 0.008 + t * 1.5) * 4;
      const offset = (mouseY * 20) + Math.sin(mouseX * 2 + i) * 10;
      const amp = 30 + react * 4;
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

function checkURLToken() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  
  if (token) {
    localStorage.setItem('authToken', token);
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

async function fetchMe() {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.log('No token found, redirecting to login');
      window.location.href = 'https://turing-web-version.vercel.app';
      return;
    }

    const res = await fetch('https://turing-web-version.onrender.com/api/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });

    if (res.status === 200) {
      const user = await res.json();
      console.log('User data:', user);
      
      document.querySelector('.profile_pic').src = user.photo || 'Assets/profile.png';
      document.querySelector('.profile_pic').alt = user.displayName || 'User';
      
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
  populateCountryDropdown();
});

async function logout() {
  const token = localStorage.getItem('authToken');
  
  await fetch('https://turing-web-version.onrender.com/auth/logout', {
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

async function sendMessage() {
  const message = messageInput.value.trim();
  
  if (!message) return;
  
  addMessage(message, 'user');
  messageInput.value = '';
  
  const loadingMsg = addMessage('Thinking...', 'loading');
  
  try {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch('https://turing-web-version.onrender.com/api/chat', {
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
    
    loadingMsg.remove();
    
    if (response.ok) {
      const data = await response.json();
      
      addMessage(data.message, 'bot');
      
      conversationHistory.push(
        { role: 'user', content: message },
        { role: 'assistant', content: data.message }
      );
      
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

sendButton.addEventListener("mouseover", ()=>{
  sendButton.style.transform = "scale(0.98)";
})
sendButton.addEventListener("mouseout", ()=>{
  sendButton.style.transform = "scale(1)";
})
sendButton.addEventListener('click', () => {
  stocksPanel.classList.remove('active');
  newsPanel.classList.remove('active');
  weatherPanel.classList.remove('active');
  if (Messages.classList.contains('active')) {
    Messages.style.display = 'block';
  }
});

sendButton.addEventListener('click', sendMessage);

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

messageInput.addEventListener('input', function() {
  this.style.height = 'auto';
  this.style.height = Math.min(this.scrollHeight, 150) + 'px';
});


// Voice Recording Functions

function updateMicUI(recording) {
  if (recording) {
    micButton.style.background = 'rgba(255, 100, 100, 0.3)';
    micButton.style.boxShadow = 'rgba(255, 0, 0, 0.5) 0 0 15px 5px';
    micImage.style.filter = 'brightness(1.5)';
  } else {
    micButton.style.background = 'rgba(255,255,255,0.1)';
    micButton.style.boxShadow = 'rgba(0, 0, 0, 0.25) 1px 1px 5px 3px';
    micImage.style.filter = 'brightness(1)';
  }
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    const options = { mimeType: 'audio/webm' };
    mediaRecorder = new MediaRecorder(stream, options);
    
    audioChunks = [];
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };
    
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      await transcribeAudio(audioBlob);
      
      stream.getTracks().forEach(track => track.stop());
    };
    
    mediaRecorder.start();
    isRecording = true;
    updateMicUI(true);
    
    console.log('[VOICE] Recording started');
  } catch (error) {
    console.error('[VOICE] Error starting recording:', error);
    alert('Could not access microphone. Please check permissions.');
  }
}

function stopRecording() {
  if (mediaRecorder && isRecording) {
    mediaRecorder.stop();
    isRecording = false;
    updateMicUI(false);
    console.log('[VOICE] Recording stopped');
  }
}

async function transcribeAudio(audioBlob) {
  try {
    messageInput.value = 'Transcribing...';
    messageInput.disabled = true;
    
    const token = localStorage.getItem('authToken');
    
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    
    const response = await fetch('https://turing-web-version.onrender.com/api/transcribe', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (response.ok) {
      const data = await response.json();
      
      messageInput.value = data.text;
      messageInput.disabled = false;
      messageInput.focus();
      
      await sendMessage();
      
      console.log('[VOICE] Transcription successful:', data.text);
    } else {
      const error = await response.json();
      console.error('[VOICE] Transcription failed:', error);
      messageInput.value = '';
      messageInput.disabled = false;
      addMessage('Failed to transcribe audio. Please try again.', 'error');
    }
  } catch (error) {
    console.error('[VOICE] Error during transcription:', error);
    messageInput.value = '';
    messageInput.disabled = false;
    addMessage('Network error during transcription. Please try again.', 'error');
  }
}

micButton.addEventListener('click', () => {
  if (isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
});

micButton.addEventListener('mouseover', () => {
  if (!isRecording) {
    micButton.style.transform = 'scale(0.98)';
  }
});

micButton.addEventListener('mouseout', () => {
  if (!isRecording) {
    micButton.style.transform = 'scale(1)';
  }
});


// News Modal functionality

newsButton.addEventListener('click', async () => {
  if (Messages.classList.contains('active')) {
    Messages.style.display = 'none';
  }
  newsPanel.classList.add('active');
  stocksPanel.classList.remove('active');
  weatherPanel.classList.remove('active');
  countrySelect.style.display = 'block';
  await loadNews(currentCountry);
});

newsClose.addEventListener('click', () => {
  newsPanel.style.animation = 'fadeOut 0.3s ease-out';
  countrySelect.style.display = 'none';
  setTimeout(() => {
    newsPanel.classList.remove('active');
    newsPanel.style.animation = '';
    if (Messages.classList.contains('active')) {
      Messages.style.display = 'block';
    }
  }, 300);
});

newsPanel.addEventListener('click', (e) => {
  if (e.target === newsPanel) {
    newsPanel.style.animation = 'fadeOut 0.3s ease-out';
    countrySelect.style.display = 'none';
    setTimeout(() => {
      newsPanel.classList.remove('active');
      newsPanel.style.animation = '';
    }, 300);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (newsPanel.classList.contains('active')) {
      newsPanel.style.animation = 'fadeOut 0.3s ease-out';
      countrySelect.style.display = 'none';
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
    if (isRecording) {
      stopRecording();
    }
  }
});

async function loadNews(country = 'np') {
  newsArticlesContainer.innerHTML = '<div class="news_loading">Refreshing news...</div>';
  
  try {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`https://turing-web-version.onrender.com/api/news?country=${country}`, {
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
            <span class="news_article_author">${article.author || article.sourceName || 'Unknown'}</span>
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

// Country Dropdown functionality
countrySelect.addEventListener('change', async (e) => {
  currentCountry = e.target.value;
  console.log('[NEWS] Country changed to:', currentCountry);
  await loadNews(currentCountry);
});

// Add this after the existing country dropdown event listener (around line 480)

// Tech button click handler - refreshes news for selected country
const techButton = document.querySelector('.tech');
techButton.addEventListener('click', async () => {
  console.log('[NEWS] Tech button clicked - refreshing news for country:', currentCountry);
  await loadNews(currentCountry);
});

// Also update these other buttons to refresh news (optional - removes the existing broken functionality)
const appleButton = document.querySelector('.apple');
const teslaButton = document.querySelector('.tesla');
const businessButton = document.querySelector('.business');
const janeButton = document.querySelector('.jane');

// Remove these if you want ONLY the Tech button to work, or update them all to refresh news
appleButton.addEventListener('click', async () => {
  console.log('[NEWS] Apple button clicked - refreshing news');
  await loadNews(currentCountry);
});

teslaButton.addEventListener('click', async () => {
  console.log('[NEWS] Tesla button clicked - refreshing news');
  await loadNews(currentCountry);
});

businessButton.addEventListener('click', async () => {
  console.log('[NEWS] Business button clicked - refreshing news');
  await loadNews(currentCountry);
});

janeButton.addEventListener('click', async () => {
  console.log('[NEWS] Jane button clicked - refreshing news');
  await loadNews(currentCountry);
});


// Weather Panel functionality

weatherButton.addEventListener('click', async () => {
  if (Messages.classList.contains('active')) {
    Messages.style.display = 'none';
  }
  stocksPanel.classList.remove('active');
  newsPanel.classList.remove('active');
  weatherPanel.classList.add('active');
  await loadWeather();
});

weatherClose.addEventListener('click', () => {
  weatherPanel.style.animation = 'fadeOut 0.3s ease-out';
  setTimeout(() => {
    weatherPanel.classList.remove('active');
    weatherPanel.style.animation = '';
    if (Messages.classList.contains('active')) {
      Messages.style.display = 'block';
    }
  }, 300);
});

weatherPanel.addEventListener('click', (e) => {
  if (e.target === weatherPanel) {
    weatherPanel.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
      weatherPanel.classList.remove('active');
      weatherPanel.style.animation = '';
    }, 300);
  }
});

async function loadWeather(location = 'New Delhi') {
  weatherContent.innerHTML = '<div class="weather_loading">Fetching weather data...</div>';
  
  try {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`https://turing-web-version.onrender.com/api/weather?location=${encodeURIComponent(location)}`, {
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
    stocksPanel.style.animation = '';
    if (Messages.classList.contains('active')) {
      Messages.style.display = 'block';
    }
  }, 300);
});


// Country Dropdown Population
async function populateCountryDropdown() {
  const apiUrl = 'https://restcountries.com/v3.1/all?fields=name,cca2';
  
  try {
    const response = await fetch(apiUrl, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const countriesData = await response.json();

    countrySelect.innerHTML = '';
    
    const defaultOption = document.createElement('option');
    defaultOption.value = "in";
    defaultOption.textContent = "India";
    defaultOption.selected = true;
    countrySelect.appendChild(defaultOption);

    const sortedCountries = countriesData
      .map(country => ({
        name: country.name.common,
        code: country.cca2.toLowerCase()
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    sortedCountries.forEach(country => {
      const option = document.createElement('option');
      option.value = country.code;
      option.textContent = country.name;
      countrySelect.appendChild(option);
    });

  } catch (error) {
    console.error("Could not fetch country data:", error);
    countrySelect.innerHTML = '<option value="">Failed to load countries</option>';
  }
}
