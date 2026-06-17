export default function ClipGallery({ clips, onReset }) {
  if (!clips || clips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <p className="text-gray-400">No clips were generated.</p>
        <p className="text-gray-600 text-sm mt-1">Try different settings and snip again.</p>
        <button onClick={onReset} className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm font-medium">
          ← Back to form
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-100">Generated Clips</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {clips.length} clip{clips.length !== 1 && 's'} ready for download
          </p>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          New Snip
        </button>
      </div>

      {/* Clip Cards */}
      <div className="space-y-3">
        {clips.map((clip, index) => (
          <div key={clip.id || index} className="clip-card clip-card-hover">
            <div className="flex items-start justify-between gap-3">
              {/* Clip info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    #{index + 1}
                  </span>
                  {clip.start_time && clip.end_time && (
                    <span className="badge bg-gray-700/50 text-gray-400">
                      {clip.start_time} – {clip.end_time}
                    </span>
                  )}
                </div>
                {clip.title && (
                  <p className="text-sm text-gray-300 line-clamp-1 mt-0.5" title={clip.title}>
                    {clip.title}
                  </p>
                )}
              </div>

              {/* Download button */}
              <a
                href={clip.clip_url || `/static/clips/${clip.id}.mp4`}
                download
                className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 flex items-center justify-center transition-all duration-200 active:scale-90"
              >
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Playable note for Android */}
      {clips.length > 0 && (
        <p className="text-xs text-gray-600 text-center mt-3">
          Videos are optimized for Android mobile browsers. Tap download to save or long-press to share.
        </p>
      )}
    </div>
  );
}