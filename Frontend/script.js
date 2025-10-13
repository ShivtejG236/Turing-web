const canvas = document.getElementById("liquid");
const ctx = canvas.getContext("2d");
let w, h, t = 0;
let mouseX = 0, mouseY = 0, react = 0;

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


let stocks = document.getElementsByClassName("stocks")[0]
let news = document.getElementsByClassName("news")[0]
let weather = document.getElementsByClassName("weather")[0]
let extensions = document.getElementsByClassName("extensions")[0]
let profile_pic = document.getElementsByClassName("profile_pic")[0]
let profile_logout = document.getElementsByClassName("profile_logout")[0]
let stocks_text = document.getElementsByClassName("stocks_text")[0]
let news_text = document.getElementsByClassName("news_text")[0]
let weather_text = document.getElementsByClassName("weather_text")[0]
let extensions_text = document.getElementsByClassName("extensions_text")[0]


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
})
profile_pic.addEventListener("mouseout", ()=>{
        profile_pic.style.transform = "scale(1)";
        profile_pic.style.boxShadow = "rgba(0, 0, 0, 1) 1px 1px 5px 1.5px";
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
        document.querySelector('.greeting').textContent = `Hello ${user.displayName.split(' ')[0]}!`;
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
