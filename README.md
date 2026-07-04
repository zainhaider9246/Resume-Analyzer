# 🤖 ResumeAI — Smart Resume Analyzer

An AI-powered resume analyzer built with **React** and **Google Gemini API**. Upload your resume PDF, paste a job description, and instantly get an ATS score, keyword analysis, strengths, improvement suggestions, and pro tips — with a downloadable PDF report.

---

## 🚀 Live Demo

> *(Add your Netlify link here)*

---

## ✨ Features

- 📄 **PDF Resume Upload** — Drag & drop or click to upload
- 🎯 **ATS Score** — 0-100 score with animated ring
- 🔍 **Keyword Analysis** — Found / Missing / Partial keywords
- 📊 **Score Breakdown** — Keyword Match, Relevance, Formatting, Experience
- 💪 **Strengths** — What your resume does well
- 🛠️ **Improvements** — Prioritized fixes with exact suggestions
- 💡 **Pro Tips** — Actionable advice by category
- 📥 **Download Report** — Full PDF analysis report
- 🔐 **API Key stored locally** — No backend, no server, no database

---

## 🛠️ Tech Stack

| Tech | Purpose |
|------|---------|
| React 18 + Vite | Frontend framework |
| Google Gemini API | AI analysis |
| pdfjs-dist | PDF text extraction |
| jsPDF | Report generation |
| Bootstrap 5 | UI components |
| Tailwind CSS | Utility styling |

---

## ⚙️ Setup

```bash
git clone https://github.com/your-username/resumeai.git
cd resumeai
npm install
npm run dev
```

Open **http://localhost:5173** → Enter your Gemini API key → Upload resume → Analyze!

### Get Free Gemini API Key
1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with Google
3. Click **Create API Key**
4. Copy and paste it into the app

---

## 🌐 Deploy on Netlify

1. Push to GitHub
2. Connect repo on Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. No environment variables needed!

---

## 👤 Author

**Zayn** — Frontend Developer
🔗 [GitHub](https://github.com/zainhaider9246)

---

## 📄 License

MIT License
