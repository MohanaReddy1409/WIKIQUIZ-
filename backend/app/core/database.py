from pymongo import MongoClient
from app.core.config import settings

DATABASE_URL = settings.DATABASE_URL

# Parse the database name from the URL, or default to "wikiquiz"
# Typically mongodb connections look like mongodb://host:port/database_name
client = MongoClient(DATABASE_URL)

def get_db():
    # If a database name is explicitly given in the URI, use it. Otherwise use generic "wikiquiz"
    db_name = client.get_database().name if client.get_database().name else "wikiquiz"
    db = client[db_name]
    yield db
