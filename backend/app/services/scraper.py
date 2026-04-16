import requests
from bs4 import BeautifulSoup
import re

def scrape_wikipedia(url: str):
    """
    Scrapes the content of a Wikipedia page.
    Returns a dictionary with 'title' and 'content'.
    """
    try:
        # User-Agent header is often required by Wikipedia to prevent 403 Forbidden
        headers = {
            'User-Agent': 'WikiQuiz-AI/1.0 (https://github.com/BhanuPrakashAlahari/deepKlarity; contact@example.com)'
        }
        
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract title
        title_tag = soup.find('h1', {'id': 'firstHeading'})
        if not title_tag:
            # Fallback if id changes
            title_tag = soup.find('span', {'class': 'mw-page-title-main'})
        
        title = title_tag.text if title_tag else "Unknown Title"
        
        # Extract content (paragraphs)
        # Wikipedia content is inside #mw-content-text -> .mw-parser-output
        content_div = soup.find('div', {'id': 'mw-content-text'})
        if content_div:
            parser_output = content_div.find('div', {'class': 'mw-parser-output'})
            if parser_output:
                content_div = parser_output
        
        paragraphs = content_div.find_all('p') if content_div else []
        
        # Combine text from paragraphs
        text_content = "\n".join([p.get_text() for p in paragraphs if p.get_text().strip()])
        
        # Basic cleanup (removing citation numbers like [1], [2])
        text_content = re.sub(r'\[\d+\]', '', text_content)
        
        if not text_content:
             print("Warning: No text content found.")
             return None

        return {
            "title": title,
            "content": text_content[:15000] # Limit to ~15k chars
        }
    except Exception as e:
        print(f"Error scraping URL: {e}")
        return None
