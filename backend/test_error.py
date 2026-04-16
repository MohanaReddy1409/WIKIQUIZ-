import sys
import os
import traceback
sys.path.append(os.getcwd())
from app.main import generate_quiz
from app.schemas.quiz_schemas import QuizRequest
from app.core.database import get_db

req = QuizRequest(url='https://en.wikipedia.org/wiki/Special:Search?search=mia+kalifaa&go=Go&ns0=1')
db = next(get_db())

try:
    generate_quiz(req, db)
    print("SUCCESS")
except Exception as e:
    msg = traceback.format_exc()
    sys.stdout.buffer.write(msg.encode('utf-8'))
