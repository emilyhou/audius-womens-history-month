'use client';

type Theme = 'floral' | 'neon' | 'vintage' | 'watercolor' | 'cosmic';

interface Step4ChooseThemeProps {
  onSelect: (theme: Theme) => void;
  selected: Theme | null;
}

const themes: { value: Theme; label: string; emoji: string; description: string }[] = [
  { value: 'floral', label: 'Floral', emoji: '🌸', description: 'Soft pink with flowers' },
  { value: 'neon', label: 'Neon Glow', emoji: '✨', description: 'Bright vibrant colors' },
  { value: 'vintage', label: 'Vintage Postcard', emoji: '📜', description: 'Aged paper look' },
  { value: 'watercolor', label: 'Watercolor', emoji: '🎨', description: 'Soft brush strokes' },
  { value: 'cosmic', label: 'Cosmic', emoji: '💫', description: 'Dark with stars' },
];

export function Step4ChooseTheme({ onSelect, selected }: Step4ChooseThemeProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold mb-6 text-gray-900">Choose a Theme</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <button
            key={theme.value}
            onClick={() => onSelect(theme.value)}
            className={`p-6 rounded-lg border transition-all text-left ${
              selected === theme.value
                ? 'border-gray-900 bg-gray-50 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <div className={`card-theme-${theme.value} p-4 rounded mb-3 min-h-[100px] flex items-center justify-center ${
              theme.value === 'neon' || theme.value === 'cosmic' ? 'text-white' : 'text-gray-900'
            }`}>
              <div className="text-center">
                <div className="text-4xl mb-2">{theme.emoji}</div>
                <div className={`text-sm font-semibold ${
                  theme.value === 'neon' || theme.value === 'cosmic' ? 'text-white' : 'text-gray-900'
                }`}>
                  {theme.label}
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600">{theme.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
