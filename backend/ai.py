import google.generativeai as genai
import os
from youtube_transcript_api import YouTubeTranscriptApi
from typing import List, Dict
import json
import logging

logger = logging.getLogger(__name__)

class AIAnalyzer:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def get_transcript(self, video_id: str) -> str:
        try:
            transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
            return " ".join([t['text'] for t in transcript_list]), transcript_list
        except Exception as e:
            logger.error(f"Error getting transcript: {e}")
            return "", []

    def find_clips(self, video_id: str, requirements: str) -> List[Dict]:
        transcript_text, transcript_list = self.get_transcript(video_id)
        if not transcript_text:
            return []

        prompt = f"""
        Analyze the following YouTube video transcript and find segments that match these requirements: "{requirements}"
        
        Transcript:
        {transcript_text[:10000]} # Limit to 10k chars for now
        
        Return a JSON list of objects with "start" (seconds), "end" (seconds), and "reason" (short description).
        Only return the JSON.
        """

        try:
            response = self.model.generate_content(prompt)
            # Basic parsing of JSON from response
            text = response.text
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0]
            elif "```" in text:
                text = text.split("```")[1].split("```")[0]
            
            clips = json.loads(text.strip())
            return clips
        except Exception as e:
            logger.error(f"Error calling Gemini: {e}")
            return []

if __name__ == "__main__":
    # Test
    api_key = os.getenv("GOOGLE_API_KEY")
    if api_key:
        analyzer = AIAnalyzer(api_key)
        # test with a known video id
        # print(analyzer.find_clips("dQw4w9WgXcQ", "the beginning of the song"))
