'use client';

interface Step3WriteMessageProps {
  message: string;
  onChange: (message: string) => void;
  songTitle: string;
  dedicatedTo: string;
}

export function Step3WriteMessage({ message, onChange, songTitle, dedicatedTo }: Step3WriteMessageProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold mb-6 text-gray-900">Write Your Message</h3>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
        <div className="text-sm text-gray-700 mb-2">
          <span className="font-semibold text-gray-900">To:</span> {dedicatedTo}
        </div>
        <div className="text-sm text-gray-700">
          <span className="font-semibold text-gray-900">Song:</span> {songTitle}
        </div>
      </div>

      <textarea
        value={message}
        onChange={(e) => onChange(e.target.value)}
        placeholder="You taught me strength and kindness. This song reminds me of your resilience."
        className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none resize-none text-gray-900 bg-white shadow-sm focus:shadow-sm transition-all"
      />
      
      <div className="text-sm text-gray-600">
        {message.length} characters
      </div>
    </div>
  );
}
