import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "WikiQuiz AI Backend"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "mongodb://localhost:27017/wikiquiz")
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY")
    # Parse comma separated string into a list
    CORS_ORIGINS: list = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "*").split(",")]

settings = Settings()
