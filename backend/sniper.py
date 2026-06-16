import os
import subprocess
import json
import logging
from typing import List, Dict

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Sniper:
    def __init__(self, output_dir: str = "clips"):
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)

    def extract_clip(self, video_url: str, start_time: str, end_time: str, clip_name: str) -> str:
        """
        Extracts a clip from a YouTube video using yt-dlp and ffmpeg.
        start_time and end_time should be in HH:MM:SS format or seconds.
        """
        output_path = os.path.join(self.output_dir, f"{clip_name}.mp4")
        
        # We use yt-dlp to get the stream URLs
        # But wait, yt-dlp's --download-sections is actually very efficient and uses ffmpeg internally.
        # Let's try that first as it's cleaner.
        
        command = [
            "yt-dlp",
            "--download-sections", f"*{start_time}-{end_time}",
            "--force-keyframes-at-cuts",
            "-f", "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
            "-o", output_path,
            video_url
        ]
        
        logger.info(f"Running command: {' '.join(command)}")
        
        try:
            subprocess.run(command, check=True)
            logger.info(f"Clip saved to {output_path}")
            return output_path
        except subprocess.CalledProcessError as e:
            logger.error(f"Error extracting clip: {e}")
            raise Exception(f"Failed to extract clip: {e}")

    def get_video_info(self, video_url: str) -> Dict:
        """
        Gets video metadata using yt-dlp.
        """
        command = [
            "yt-dlp",
            "--dump-json",
            "--no-playlist",
            video_url
        ]
        
        try:
            result = subprocess.run(command, capture_output=True, text=True, check=True)
            return json.loads(result.stdout)
        except subprocess.CalledProcessError as e:
            logger.error(f"Error getting video info: {e}")
            raise Exception(f"Failed to get video info: {e}")

if __name__ == "__main__":
    # Simple test
    sniper = Sniper()
    # Use a short video for testing if needed, or just leave as is for now.
    # sniper.extract_clip("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "00:00:00", "00:00:10", "test_clip")
