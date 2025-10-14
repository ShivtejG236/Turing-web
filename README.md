# Turing - Web Edition

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/) 
[![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat&logo=openai&logoColor=white)](https://openai.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com/)
[![Railway](https://img.shields.io/badge/Railway-FF0000?style=flat&logo=railway&logoColor=white)](https://railway.app/)
[![Google OAuth](https://img.shields.io/badge/Google%20OAuth-4285F4?style=flat&logo=google&logoColor=white)](https://developers.google.com/identity)

---

## **About This Project**
**Turing-Web** is an **intelligent AI-powered assistant** built for web browsers. It provides seamless AI interactions alongside integrated modules for **News, Weather, Stock Tracking, and Extensions**.  

> This represents the **web implementation** of the open-source **Turing** project [Link to the Turing Project](https://github.com/Shashank-Tripathi-07/Turing-An_AI_Integrated_Real-time_Assistant).

**Core Features:**  
- Secure authentication via **Google OAuth2**  
- Real-time conversational AI using **OpenAI API**  
- Multiple interactive modules: **Stock Market, News Feed, Weather Updates, Extensions**  
- Contemporary design featuring **Animations, glassmorphic effects, and custom typography**  

---

## **What It Offers**
- **Conversational AI & Voice Interface** – Communicate with your assistant through text or voice  
- **Google Sign-In** – Protected user authentication  
- **News Feed** – Stay updated with current headlines  
- **Weather Dashboard** – Access live weather data  
- **Stock Tracker** – Monitor market prices  
- **Extensions Hub** – Framework for AI-enhanced capabilities  
- **Dynamic Interface** – Responsive design with hover interactions and animated elements  

---

## **Project Architecture**

### **Server-Side Structure**
```
Backend/
├── Config/                # Configuration files
│   └── env.js
├── Routes/               # Endpoint definitions
│   └── api.js
├── middleware/           # Authentication handlers
│   └── auth.js
├── services/            # External integrations
│   └── openai.js
├── db.js                # Database interface
├── db.json              # Data persistence
├── server.js            # Application entry point
├── package.json
├── nodemon.json
├── railway.json
└── .env                 # Configuration secrets
```

### **Client-Side Structure**
```
Frontend/
├── Assets/              # Media resources
│   ├── logo.png
│   ├── favicon.png
│   ├── google.webp
│   ├── mile.otf
│   ├── rale.ttf
│   └── nevera.otf
├── auth.js              # Authentication logic
├── login.css            # Authentication page styling
├── main.css             # Application styling
├── main.html            # Primary interface
├── script.js            # Client-side functionality
└── login.html           # Sign-in page
```

### **Configuration Files**
```
README.md
vercel.json              # Deployment settings for Vercel
```

---

## **Technology Stack**
- **Client:** HTML5, CSS3, JavaScript with animations and glassmorphic styling  
- **Server:** Node.js, Express.js, Passport.js, OpenAI API integration  
- **Auth System:** Google OAuth2  
- **Storage:** JSON-based data management  
- **Security:** Helmet middleware, CORS policies, Request rate limiting  
- **Hosting:** Railway (server), Vercel (client)  

---

## **Setup Instructions**

1. **Download the repository**
```bash
git clone https://github.com/<your-username>/Turing-web.git
cd Turing-web
```

2. **Configure the server**
```bash
cd Backend
npm install
```

3. **Add your credentials to `.env`:**
```ini
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
OPENAI_API_KEY=your_openai_api_key
SESSION_SECRET=your_session_secret
```

4. **Access the client**
Open `Frontend/main.html` in your browser or deploy through Vercel.

5. **Launch the server**
```bash
npm run dev   # Using nodemon
# alternatively
node server.js
```

6. **Navigate to**
- Server: http://localhost:8080
- Client: Via Vercel deployment or local `Frontend/main.html`

---

## **How to Use**
- Authenticate using your Google account
- Engage with the AI or explore Stocks, News, Weather, and Extensions sections
- Experience interactive elements through hover effects
- Sign out through the profile menu

---

## **API Endpoints**

**Authentication Routes:** `/auth/*` – Handles Google sign-in and sign-out

**Conversation Endpoint:** `/api/chat` – Send messages to AI
```json
{
  "message": "Hello Turing!",
  "conversationHistory": []
}
```

**Profile Endpoint:** `/api/me` – Retrieve authenticated user information

---

## **Visual Preview**
*(Include screenshots or animated demonstrations here)*

- Authentication Screen
- Main Dashboard
- AI Conversation Interface

---

## **Contributing to Turing**
- Fork this repository
- Develop your feature in a dedicated branch
- Create a Pull Request with detailed documentation
- Maintain the established directory organization (Backend/Frontend separation)
