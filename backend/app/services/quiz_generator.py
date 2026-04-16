import os
import json
import time
from json_repair import repair_json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from app.schemas.quiz_schemas import QuizResponse
from app.core.config import settings

# Initialize Gemini
# Ensure you have GOOGLE_API_KEY in your .env file
google_api_key = settings.GOOGLE_API_KEY

llm = ChatGoogleGenerativeAI(
    model="gemini-flash-latest", 
    api_key=google_api_key, 
    temperature=0.7
)

def generate_with_retry(chain, inputs, max_retries=3):
    """
    Helper function to invoke chain with retry logic for rate limits.
    """
    for attempt in range(max_retries):
        try:
            return chain.invoke(inputs)
        except Exception as e:
            if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
                if attempt < max_retries - 1:
                    wait_time = (attempt + 1) * 5 # Increase wait time: 5s, 10s, 15s...
                    print(f"Rate limit hit. Retrying in {wait_time}s...")
                    time.sleep(wait_time)
                    continue
            raise e

def generate_quiz_from_text(title: str, text: str, url: str):
    """
    Generates a quiz from the provided text using Gemini.
    """
    
    prompt_template = """
    You are an expert educational AI. 
    Based on the following Wikipedia article content about "{title}", generate a structured quiz.
    
    Article Content (truncated):
    {text}
    
    **Requirements:**
    1. Generate 5-10 multiple-choice questions.
    2. Questions should vary in difficulty (easy, medium, hard).
    3. Provide 4 options for each question.
    4. Provide the correct answer (key: "answer").
    5. Provide a short explanation for the correct answer.
    6. Suggest 3-5 related Wikipedia topics.
    7. Provide a very brief summary (1-2 sentences) of the article.
    8. Extract key entities (People, Organizations, Locations) mentioned in the text.
    9. List the main sections/topics covered in the text (e.g. Early Life, Career, etc).
    
    **Output Format:**
    Return ONLY a raw JSON object (no markdown formatting like ```json ... ```) with the following structure:
    {{
        "url": "{url}",
        "title": "{title}",
        "summary": "...",
        "key_entities": {{
            "people": ["Name 1", "Name 2"],
            "organizations": ["Org 1", "Org 2"],
            "locations": ["Loc 1", "Loc 2"]
        }},
        "sections": ["Section 1", "Section 2"],
        "quiz": [
            {{
                "id": 1,
                "question": "...",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "answer": "Option A",
                "explanation": "...",
                "difficulty": "easy"
            }},
            ...
        ],
        "related_topics": ["Topic 1", "Topic 2", ...]
    }}
    """
    
    prompt = PromptTemplate(
        input_variables=["title", "text", "url"],
        template=prompt_template
    )
    
    try:
        chain = prompt | llm
        response = generate_with_retry(chain, {"title": title, "text": text, "url": url})
         
        # Debug: Print raw response
        print(f"DEBUG: LLM Response Content:\n{response.content}\n-------------------")

        # Clean up response content in case it has markdown code blocks
        content = response.content
        
        # Handle list response (common in newer Gemini models/LangChain versions)
        if isinstance(content, list):
            # If it's a list, it might contain string parts or dictionaries (like {'text': '...'})
            joined_content = ""
            for item in content:
                if isinstance(item, dict) and 'text' in item:
                    joined_content += item['text']
                elif isinstance(item, str):
                    joined_content += item
                else:
                    joined_content += str(item)
            content = joined_content
        
        # Ensure content is a string before stripping
        if not isinstance(content, str):
            content = str(content)
            
        content = content.strip()
        if content.startswith("```json"):
            content = content[7:]
        if content.endswith("```"):
            content = content[:-3]
            
        data = json.loads(repair_json(content))
        return data
        
    except Exception as e:
        print(f"Error generating quiz: {e}")
        # Return a fallback or re-raise
        raise e
