import os
import sys

# Append the backend directory so Vercel can find the app module
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Load environment variables if `.env` exists in production runtime
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '..', 'backend', '.env'))

# Import the FastAPI App Instance from backend structure
from app.main import app
