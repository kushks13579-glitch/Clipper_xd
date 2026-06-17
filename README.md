# ClipSniper

AI-powered YouTube clip extractor. Snipe relevant segments without downloading the full video.

## Features
- **AI-Powered Detection:** Uses Gemini 1.5 Flash to analyze transcripts and find the best moments.
- **Fast Sniping:** Streams only the necessary byte ranges using `yt-dlp` and `ffmpeg`.
- **Mobile-First UI:** Responsive React frontend optimized for touch devices.
- **Standalone Deployment:** Easily self-hostable via Docker.

## Self-Hosting with Docker

### Prerequisites
- Docker and Docker Compose installed.
- A Google Gemini API Key.

### Steps
1. Clone this repository.
2. Create a `.env` file in the root directory and add your API key:
   ```
   GOOGLE_API_KEY=your_api_key_here
   ```
3. Run the following command:
   ```bash
   docker compose up -d
   ```
4. Access the app at `http://localhost:8000`.

## Manual Deployment

### Backend
1. Install dependencies: `pip install -r backend/requirements.txt`
2. Install `ffmpeg`.
3. Set environment variable `GOOGLE_API_KEY`.
4. Run: `uvicorn backend.main:app --host 0.0.0.0 --port 8000`

### Frontend
1. Navigate to `frontend/`.
2. Install dependencies: `npm install`.
3. Build: `npm run build`.
4. The backend will serve the `dist/` folder if it exists.

## License
MIT
