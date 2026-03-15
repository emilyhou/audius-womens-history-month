'use client';

interface LocationStatsProps {
  locations: string[];
  total: number;
}

export function LocationStats({ locations, total }: LocationStatsProps) {
  if (locations.length === 0) {
    return null;
  }

  return (
    <div className="absolute bottom-6 left-6 z-10 bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200 max-w-xs">
      <div className="text-xs font-semibold text-gray-700 mb-2">
        🌍 Dedications from:
      </div>
      <div className="text-xs text-gray-600 space-y-1">
        {locations.slice(0, 5).map((location, index) => (
          <div key={index}>{location}</div>
        ))}
        {locations.length > 5 && (
          <div className="text-gray-500 italic">and {locations.length - 5} more...</div>
        )}
      </div>
      {total > 0 && (
        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
          {total} total dedication{total !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
