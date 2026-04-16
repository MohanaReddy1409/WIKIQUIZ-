
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.schemas.quiz_schemas import QuizRequest, QuizResponse
from app.services.scraper import scrape_wikipedia
from app.services.quiz_generator import generate_quiz_from_text
from app.core.database import get_db
from app.core.config import settings
from pymongo.database import Database
from datetime import datetime


app = FastAPI(title="WikiQuiz AI Backend")

# CORS setup to allow frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "WikiQuiz AI Backend is running"}

@app.post("/generate-quiz", response_model=QuizResponse)
def generate_quiz(request: QuizRequest, db: Database = Depends(get_db)):
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
        quiz_doc = {
            "url": quiz_data_json['url'],
            "title": quiz_data_json['title'],
            "summary": quiz_data_json['summary'],
            "key_entities": quiz_data_json.get('key_entities'),
            "sections": quiz_data_json.get('sections'),
            "quiz_data": quiz_data_json.get('quiz'),
            "related_topics": quiz_data_json.get('related_topics'),
            "created_at": datetime.utcnow()
        }
        
        result = db["quizzes"].insert_one(quiz_doc)
        
        quiz_data_json['id'] = str(result.inserted_id)
        
        return quiz_data_json
    except Exception as e:
        import traceback
        import sys
        # Safely print traceback on Windows cp1252 consoles
        sys.stderr.buffer.write(traceback.format_exc().encode('utf-8', 'replace'))
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history")
def get_history(db: Database = Depends(get_db)):
    """
    Fetch all generated quizzes from history.
    """
    quizzes = list(db["quizzes"].find().sort("created_at", -1))
    
    # Format for frontend
    history_list = []
    for q in quizzes:
        # created_at is a datetime object in MongoDB
        date_str = q.get("created_at").strftime("%Y-%m-%d") if q.get("created_at") else ""
        
        history_list.append({
            "id": str(q["_id"]),
            "title": q.get("title", ""),
            "url": q.get("url", ""),
            "date": date_str,
            "questions_count": len(q.get("quiz_data", [])) if q.get("quiz_data") else 0,
            
            # Include full details for the 'Details' view
            "summary": q.get("summary", ""),
            "key_entities": q.get("key_entities", {}),
            "sections": q.get("sections", []),
            "quiz": q.get("quiz_data", []),
            "related_topics": q.get("related_topics", [])
        })
    return history_list

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
