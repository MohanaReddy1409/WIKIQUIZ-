from sqlalchemy import Column, Integer, String, Text, JSON, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, index=True)
    title = Column(String)
    summary = Column(Text)
    key_entities = Column(JSON)
    sections = Column(JSON)
    quiz_data = Column(JSON)  # Stores the list of questions
    related_topics = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
