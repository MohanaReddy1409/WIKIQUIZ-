from pydantic import BaseModel
from typing import List, Dict, Optional, Union

class QuizRequest(BaseModel):
    url: str

class Question(BaseModel):
    id: Optional[Union[str, int]] = None 
    question: str
    options: List[str]
    answer: str
    explanation: str
    difficulty: str

class QuizResponse(BaseModel):
    id: Optional[str] = None 
    url: str
    title: str
    summary: str
    key_entities: Dict[str, List[str]] 
    sections: List[str]
    quiz: List[Question] 
    related_topics: List[str]
