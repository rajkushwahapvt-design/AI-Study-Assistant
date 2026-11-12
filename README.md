# AI Study Assistant 🤖📚

An AI-powered study platform designed to make learning smarter, easier, and more interactive. It helps students understand concepts, generate study materials, practice quizzes, and organize their preparation using AI.

## ✨ Features

### AI-Powered Features
- **AI Study Tutor:** Get explanations and answers to your study-related questions.
- **AI Notes Generator:** Generate structured notes for any topic.
- **AI Quiz Generator:** Create quizzes to test your knowledge.
- **AI Flashcards:** Generate flashcards for quick revision.
- **AI Study Planner:** Create personalized study plans.
- **AI Summarizer:** Summarize lengthy study materials into concise content.

### Study Management
- Subject-wise learning and topic organization.
- Track completed topics.
- Monitor quiz scores and study progress.
- Progress tracking using Local Storage.
- Interactive and user-friendly interface.

## 🛠️ Tech Stack

**Frontend**
- HTML5
- CSS3
- JavaScript

**Backend**
- Node.js
- Express.js
- REST API

**AI Integration**
- Google Gemini API

**Tools**
- Git & GitHub
- VS Code

## 📁 Project Structure

```text
AI-Study-Assistant/
│
├── index.html
├── ai_assistant.css
├── ai_assistant.js
├── subjects.json
│
└── backend/
    ├── server.js
    ├── package.json
    └── package-lock.json
```

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Setup Backend

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the backend folder:

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.5-flash-lite
PORT=3000
```

Never share or upload your actual API key.

### 4. Start Backend

```bash
npm run dev
```

Backend runs at:

`http://localhost:3000`

### 5. Run Frontend

Open the project using VS Code Live Server.

## 🔐 Security

- Gemini API requests are handled through the backend.
- API credentials are stored in environment variables.
- Sensitive files are excluded using `.gitignore`.

## 🚀 Future Improvements

- User authentication and authorization.
- MongoDB integration for cloud-based progress storage.
- Personalized student dashboards.
- Deployment for public access.

## 👨‍💻 Author

**Raj Kushwaha**

B.Tech Computer Science (AI & ML) Student

- GitHub: [rajkushwahapvt-design](https://github.com/rajkushwahapvt-design)
- LinkedIn: [Raj Kushwaha](https://linkedin.com/in/raj-kushwaha-1021a1329/)

---

⭐ If you find this project useful, consider giving it a star!
