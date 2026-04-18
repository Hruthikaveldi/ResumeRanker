# 📊 ResumeRanker — AI-Powered Resume Scoring

ResumeRanker is a full-stack MERN web application that analyzes resumes against job descriptions and generates an AI-powered match score with detailed feedback.

---

## ✨ Features

- Paste resume text and job description to get an instant match score (0–100)
- Matched skills extraction with visual score indicators
- Detailed AI-generated feedback on candidate fit
- User authentication (Register / Login) with JWT
- Dashboard to view all past resume analyses
- Responsive dark-themed UI

---

## 🛠️ Tech Stack

| Layer      | Technology                         |
|------------|------------------------------------|
| Frontend   | React.js, React Router, Axios      |
| Backend    | Node.js, Express.js                |
| Database   | MongoDB Atlas                      |
| Auth       | JWT (JSON Web Tokens)              |
| Deployment | Render                             |

---

## 📁 Project Structure

```
ResumeRanker/
├── backend/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   └── src/
│       ├── context/AuthContext.js
│       ├── pages/
│       │   ├── Login.js
│       │   ├── Register.js
│       │   ├── Dashboard.js
│       │   └── Analyze.js
│       ├── App.js
│       └── App.css
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- MongoDB Atlas account

### Installation

```bash
git clone https://github.com/VeldiHruthika/ResumeRanker.git
cd ResumeRanker
```

**Backend**
```bash
cd backend
npm install
npm start
```

**Frontend**
```bash
cd frontend
npm install
npm start
```

> Frontend runs on `http://localhost:3000` — Backend on `http://localhost:5000`

---

## 🌐 Live Demo

> Deployed on Render — [Link coming soon]

---

## 👩‍💻 Author

**Veldi Hruthika**  
B.Tech CSE — SR University, Warangal  
[GitHub](https://github.com/VeldiHruthika)
