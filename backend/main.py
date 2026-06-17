from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os
import uuid
import json
import logging
import re
from sniper import Sniper
from ai import AIAnalyzer
from typing import List, Optional, Dict
from youtube_transcript_api import YouTubeTranscriptApi

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="ClipSniper API")

# Ensure output directory exists
OUTPUT_DIR = "static/clips"
METADATA_FILE = "static/clips.json"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Initialize AI Analyzer
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
analyzer = AIAnalyzer(GOOGLE_API_KEY) if GOOGLE_API_KEY else None

# Mount static files for clips
app.mount("/static", StaticFiles(directory="static"), name="static")

sniper = Sniper(output_dir=OUTPUT_DIR)

class ClipRequest(BaseModel):
    url: str
    requirements: str # E.g. "Find the part where they talk about X"

class ClipInfo(BaseModel):
    id: str
    video_url: str
    title: str
    start_time: str
    end_time: str
    clip_url: str

def save_metadata(clip_info: ClipInfo):
    metadata = []
    if os.path.exists(METADATA_FILE):
        try:
            with open(METADATA_FILE, "r") as f:
                metadata = json.load(f)
        except:
            metadata = []
    
    metadata.append(clip_info.dict())
    with open(METADATA_FILE, "w") as f:
        json.dump(metadata, f, indent=2)

def get_video_id(url: str) -> Optional[str]:
    patterns = [
        r'(?:v=|\/)([0-9A-Za-z_-]{11}).*',
        r'(?:embed\/)([0-9A-Za-z_-]{11}).*',
        r'(?:shorts\/)([0-9A-Za-z_-]{11}).*',
        r'(?:be\/)([0-9A-Za-z_-]{11}).*'
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None

@app.post("/process", response_model=List[ClipInfo])
async def process_video(request: ClipRequest):
    try:
        video_info = sniper.get_video_info(request.url)
        video_title = video_info.get("title", "Unknown Video")
        video_id = get_video_id(request.url)
        
        if not video_id:
            raise HTTPException(status_code=400, detail="Invalid YouTube URL")

        if analyzer:
            found_segments = analyzer.find_clips(video_id, request.requirements)
        else:
            logger.warning("AI Analyzer not initialized, using dummy logic")
            # Fallback dummy logic
            found_segments = [{"start": 0, "end": 30, "reason": "Dummy clip"}]

        if not found_segments:
             raise HTTPException(status_code=404, detail="No relevant segments found")

        clips = []
        for segment in found_segments:
            clip_id = str(uuid.uuid4())
            start = segment["start"]
            end = segment["end"]
            
            # Convert seconds to HH:MM:SS for sniper
            def format_time(seconds):
                h = int(seconds) // 3600
                m = (int(seconds) % 3600) // 60
                s = int(seconds) % 60
                return f"{h:02d}:{m:02d}:{s:02d}"

            start_str = format_time(start)
            end_str = format_time(end)

            sniper.extract_clip(request.url, start_str, end_str, clip_id)
            
            clip_info = ClipInfo(
                id=clip_id,
                video_url=request.url,
                title=video_title,
                start_time=start_str,
                end_time=end_str,
                clip_url=f"/static/clips/{clip_id}.mp4"
            )
            save_metadata(clip_info)
            clips.append(clip_info)
            
        return clips
    except Exception as e:
        logger.error(f"Error in process_video: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/clips", response_model=List[ClipInfo])
async def get_clips():
    if os.path.exists(METADATA_FILE):
        try:
            with open(METADATA_FILE, "r") as f:
                return json.load(f)
        except:
            return []
    return []

# Serve frontend
FRONTEND_DIST = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(FRONTEND_DIST):
    app.mount("/", StaticFiles(directory=FRONTEND_DIST, html=True), name="frontend")
else:
    @app.get("/")
    async def root():
        return {"message": "ClipSniper API is running. Frontend dist not found."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
