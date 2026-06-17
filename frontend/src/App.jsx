import { useState, useCallback } from 'react';
import ClipForm from './components/ClipForm';
import ProcessingScreen from './components/ProcessingScreen';
import ClipGallery from './components/ClipGallery';

export default function App() {
  const [view, setView] = useState('form'); // 'form' | 'processing' | 'results'
  const [status, setStatus] = useState(null);
  const [clips, setClips] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = useCallback(async (formData) => {
    setView('processing');
    setError(null);
    setClips([]);

    const steps = ['analyzing', 'detecting', 'sniping', 'encoding'];
    let stepIndex = 0;

    const progressInterval = setInterval(() => {
      if (stepIndex < steps.length - 1) {
        stepIndex++;
        setStatus({
          step: steps[stepIndex],
          message: `Step ${stepIndex + 1} of ${steps.length}...`,
        });
      }
    }, 4000);

    setStatus({ step: 'analyzing', message: 'Starting clip analysis...' });

    try {
      const response = await fetch('/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: formData.url,
          requirements: formData.requirements || '',
        }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setStatus({ step: 'done', message: 'Clips generated!' });

      // Brief pause to show completion
      await new Promise((r) => setTimeout(r, 800));

      const clipList = Array.isArray(data) ? data : data.clips || data.results || [];
      setClips(clipList);
      setView('results');
    } catch (err) {
      clearInterval(progressInterval);
      setError(err.message);
      setView('form');
    }
  }, []);

  const handleReset = useCallback(() => {
    setView('form');
    setStatus(null);
    setClips([]);
    setError(null);
  }, []);

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gray-950/80 backdrop-blur-lg border-b border-gray-800/50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          {/* Logo icon - sniper scope */}
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-100 leading-tight">ClipSniper</h1>
            <p className="text-[10px] text-gray-500 leading-tight">AI-powered YouTube clip extractor</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-900/20 border border-red-800/30 flex items-start gap-2">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-red-300 font-medium">Error</p>
              <p className="text-xs text-red-400 mt-0.5">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300 flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {view === 'form' && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-100">Snip Clips</h2>
              <p className="text-sm text-gray-500 mt-1">
                Extract the best moments from any YouTube video automatically.
              </p>
            </div>
            <ClipForm onSubmit={handleSubmit} isLoading={false} />
          </>
        )}

        {view === 'processing' && <ProcessingScreen status={status} />}

        {view === 'results' && <ClipGallery clips={clips} onReset={handleReset} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-3">
        <p className="text-[10px] text-gray-600 text-center">
          ClipSniper — clips are processed locally using yt-dlp & ffmpeg
        </p>
      </footer>
    </div>
  );
}