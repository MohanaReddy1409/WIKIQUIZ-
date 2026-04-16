
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.schemas.quiz_schemas import QuizRequest, QuizResponse
from app.services.scraper import scrape_wikipedia
from app.services.quiz_generator import generate_quiz_from_text
from app.models import quiz_models
from app.core.database import engine, get_db
from app.core.config import settings
from sqlalchemy.orm import Session

# Create Tables
quiz_models.Base.metadata.create_all(bind=engine)


app = FastAPI(title="WikiQuiz AI Backend")

# CORS setup to allow frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "WikiQuiz AI Backend is running"}

@app.post("/generate-quiz", response_model=QuizResponse)
def generate_quiz(request: QuizRequest, db: Session = Depends(get_db)):
    if not request.url:
        raise HTTPException(status_code=400, detail="URL is required")
    
    if "wikipedia.org" not in request.url:
        raise HTTPException(status_code=400, detail="Only Wikipedia URLs are supported")

    # 1. Scrape Content
    scraped_data = scrape_wikipedia(request.url)
    if not scraped_data:
        raise HTTPException(status_code=500, detail="Failed to scrape content from the URL")

    # 2. Generate Quiz using Gemini
    try:
        quiz_data_json = generate_quiz_from_text(scraped_data['title'], scraped_data['content'], request.url)
        
        # 3. Store in Database
        db_quiz = quiz_models.Quiz(
            url=quiz_data_json['url'],
            title=quiz_data_json['title'],
            summary=quiz_data_json['summary'],
            key_entities=quiz_data_json.get('key_entities'),
            sections=quiz_data_json.get('sections'),
            quiz_data=quiz_data_json.get('quiz'),
            related_topics=quiz_data_json.get('related_topics')
        )
        db.add(db_quiz)
        db.commit()
        db.refresh(db_quiz)
        
        quiz_data_json['id'] = db_quiz.id
        
        return quiz_data_json
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history")
def get_history(db: Session = Depends(get_db)):
    """
    Fetch all generated quizzes from history.
    """
    quizzes = db.query(quiz_models.Quiz).order_by(quiz_models.Quiz.created_at.desc()).all()
    
    # Format for frontend
    history_list = []
    for q in quizzes:
        history_list.append({
            "id": q.id,
            "title": q.title,
            "url": q.url,
            "date": q.created_at.strftime("%Y-%m-%d"),
            "questions_count": len(q.quiz_data) if q.quiz_data else 0,
            
            # Include full details for the 'Details' view
            "summary": q.summary,
            "key_entities": q.key_entities,
            "sections": q.sections,
            "quiz": q.quiz_data,
            "related_topics": q.related_topics
        })
    return history_list

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
