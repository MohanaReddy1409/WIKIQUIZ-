# WikiQuiz AI - Automated Quiz Generator

WikiQuiz AI is a full-stack web application that automatically generates educational quizzes from any Wikipedia article. It leverages **Google Gemini AI** and **web scraping** to transform unstructured text into interactive, structured assessments with a premium, engaging UI.

## 🚀 Live Demo

- **Frontend (Vercel)**: [Input your Vercel URL here]
- **Backend (Render)**: [Input your Render URL here]

## ✨ Key Features

1.  **AI-Powered Generation**: Instantly creates 5-10 question quizzes from valid Wikipedia URLs.
2.  **Smart Parsing**: Extracts key content, filters noise, and uses LLMs to generate meaningful questions, answers, and explanations.
3.  **Adaptive Learning Modes**:
    *   **Study Mode**: Instant feedback with explanations after every question.
    *   **Test Mode**: Simulates a real exam; answers are hidden until submission, followed by a final score.
4.  **History & Persistence**: All quizzes are saved in a PostgreSQL database, allowing users to revisit past topics.
5.  **Premium UI/UX**:
    *   Dark mode aesthetic with glassmorphism effects.
    *   Smooth animations and transitions.
    *   Responsive design for all devices.

## 🛠️ Technology Stack

### Backend
- **Framework**: FastAPI (Python 3.13+)
- **Database**: PostgreSQL (via SQLAlchemy)
- **AI Integration**: LangChain + Google Gemini Pro (`gemini-1.5-flash`)
- **Web Scraping**: BeautifulSoup4 + Requests
- **Architecture**: Modular "Clean Architecture" (Controllers, Services, Repositories)

### Frontend
- **Framework**: React.js 18 + Vite
- **Styling**: Modern CSS3 (Variables, Glassmorphism, Animations)
- **State Management**: React Hooks
- **Icons**: Heroicons (SVG)

## 🏗️ Architecture

The application uses a decoupled client-server architecture:
- **Frontend**: A React SPA that consumes the REST API. It handles routing, user interactions, and state management.
- **Backend**: A FastAPI service that exposes endpoints for generation and retrieval. It manages the scrape -> generate -> store pipeline.
- **Database**: A relational PostgreSQL database storing `quizzes` with JSON columns for flexible question retrieval.

## 📦 Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL Database
- Google AI API Key

### Backend Setup

1.  **Clone the repository** and navigate to `backend`:
    ```bash
    cd backend
    ```

2.  **Create virtual environment**:
    ```bash
    python -m venv venv
    source venv/bin/activate  # Windows: venv\Scripts\activate
    ```

3.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Environment Variables**:
    Create `.env` in `backend/`:
    ```ini
    GOOGLE_API_KEY=your_gemini_key
    DATABASE_URL=postgresql://user:pass@localhost/wikiquiz
    ```

5.  **Run Server**:
    ```bash
    uvicorn app.main:app --reload
    ```

### Frontend Setup

1.  Navigate to `frontEnd`:
    ```bash
    cd frontEnd
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create `.env` in `frontEnd/`:
    ```ini
    VITE_API_URL=http://localhost:8000
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## 🚀 Deployment

### Backend (Render)
The backend is configured for deployment on Render.
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**: Add `DATABASE_URL` and `GOOGLE_API_KEY` in the dashboard.

### Frontend (Vercel)
The frontend is optimized for Vercel.
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: Add `VITE_API_URL` pointing to your Render backend URL.

## 📄 License
MIT License. Built for educational purposes.
