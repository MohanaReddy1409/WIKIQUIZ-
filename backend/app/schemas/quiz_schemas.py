from pydantic import BaseModel
from typing import List, Dict, Optional

class QuizRequest(BaseModel):
    url: str

class Question(BaseModel):
    id: Optional[int] = None 
    question: str
    options: List[str]
    answer: str
    explanation: str
    difficulty: str

class QuizResponse(BaseModel):
    id: Optional[int] = 1 
    url: str
    title: str
    summary: str
    key_entities: Dict[str, List[str]] 
    sections: List[str]
    quiz: List[Question] 
    related_topics: List[str]
