export default function ProcessingScreen({ status }) {
  const steps = [
    { key: 'analyzing', label: 'Analyzing video content...' },
    { key: 'detecting', label: 'Detecting key moments with AI...' },
    { key: 'sniping', label: 'Sniping clip segments...' },
    { key: 'encoding', label: 'Encoding and optimizing...' },
    { key: 'done', label: 'Clips ready!' },
  ];

  const currentStep = status?.step || 'analyzing';
  const currentIndex = steps.findIndex((s) => s.key === currentStep);
  const progress = currentIndex >= 0 ? ((currentIndex + 1) / steps.length) * 100 : 0;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {/* Animated sniper icon */}
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-full bg-indigo-600/20 border-2 border-indigo-500/30 flex items-center justify-center animate-pulse">
          <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        {/* Spinning ring */}
        <div className="absolute inset-0 w-20 h-20">
          <svg className="animate-spin" viewBox="0 0 80 80" fill="none">
            <circle
              cx="40" cy="40" r="36"
              stroke="currentColor"
              strokeWidth="3"
              className="text-indigo-500/20"
            />
            <circle
              cx="40" cy="40" r="36"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${progress * 2.26} 300`}
              strokeLinecap="round"
              className="text-indigo-500"
              style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
            />
          </svg>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs mb-6">
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step indicators */}
      <div className="w-full max-w-sm space-y-3">
        {steps.map((step, i) => (
          <div
            key={step.key}
            className={`flex items-center gap-3 transition-all duration-300 ${
              i <= currentIndex ? 'opacity-100' : 'opacity-30'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                i < currentIndex
                  ? 'bg-indigo-500'
                  : i === currentIndex
                  ? 'bg-indigo-500 animate-pulse'
                  : 'bg-gray-700'
              }`}
            >
              {i < currentIndex ? (
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <div className={`w-2 h-2 rounded-full ${i === currentIndex ? 'bg-white' : 'bg-gray-500'}`} />
              )}
            </div>
            <span
              className={`text-sm ${
                i === currentIndex
                  ? 'text-gray-100 font-medium'
                  : i < currentIndex
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Status message */}
      {status?.message && currentStep !== 'done' && (
        <p className="mt-6 text-xs text-gray-500 text-center max-w-xs">{status.message}</p>
      )}
    </div>
  );
}