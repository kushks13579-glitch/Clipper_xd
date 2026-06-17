import { useState } from 'react';

export default function ClipForm({ onSubmit, isLoading }) {
  const [url, setUrl] = useState('');
  const [numClips, setNumClips] = useState(5);
  const [minLength, setMinLength] = useState(30);
  const [maxLength, setMaxLength] = useState(60);
  const [niche, setNiche] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    // Build the requirements string from form fields
    const parts = [];
    parts.push(`Extract ${numClips} clips`);
    parts.push(`each between ${minLength} and ${maxLength} seconds long`);
    if (niche.trim()) parts.push(`from the ${niche.trim()} niche`);
    if (description.trim()) parts.push(`focusing on: ${description.trim()}`);

    onSubmit({
      url: url.trim(),
      requirements: parts.join(', '),
    });
  };

  const isValidUrl = url.trim().length > 0 && (
    url.includes('youtube.com/watch') ||
    url.includes('youtu.be/') ||
    url.includes('youtube.com/')
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* YouTube URL */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          YouTube URL <span className="text-red-400">*</span>
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          className="input-field"
          required
        />
        {url && !isValidUrl && (
          <p className="text-xs text-amber-400 mt-1 ml-1">
            Please enter a valid YouTube URL
          </p>
        )}
      </div>

      {/* Number of Clips */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Number of Clips
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={1}
            max={20}
            value={numClips}
            onChange={(e) => setNumClips(Number(e.target.value))}
            className="flex-1 accent-indigo-500 h-2 rounded-full appearance-none bg-gray-700 cursor-pointer"
          />
          <span className="text-lg font-semibold text-indigo-400 min-w-[2rem] text-center tabular-nums">
            {numClips}
          </span>
        </div>
      </div>

      {/* Clip Length Range */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Clip Length Range
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Min (seconds)</label>
            <input
              type="number"
              min={5}
              max={300}
              value={minLength}
              onChange={(e) => setMinLength(Math.max(5, Number(e.target.value)))}
              className="input-field"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Max (seconds)</label>
            <input
              type="number"
              min={5}
              max={300}
              value={maxLength}
              onChange={(e) => setMaxLength(Math.max(5, Number(e.target.value)))}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Niche (optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Niche <span className="text-gray-500 text-xs">(optional)</span>
        </label>
        <input
          type="text"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          placeholder="e.g., gaming, educational, music"
          className="input-field"
        />
      </div>

      {/* Description / Theme (optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Description / Theme <span className="text-gray-500 text-xs">(optional)</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what kind of clips you're looking for..."
          rows={3}
          className="input-field resize-none"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValidUrl || isLoading}
        className="btn-primary mt-1"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Snip Clips
          </span>
        )}
      </button>
    </form>
  );
}