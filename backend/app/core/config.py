import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "WikiQuiz AI Backend"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/wikiquiz")
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY")
    CORS_ORIGINS: list = ["*"]

settings = Settings()
