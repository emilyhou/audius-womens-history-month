'use client';

import { useState, useEffect } from 'react';
import { Dedication } from '@/types';
import { getDedicatedToLabel } from '@/lib/utils';
import { useMusicPlayer } from './MusicPlayer';
import { ReactionButtons } from './ReactionButtons';
import { ShareButton } from './ShareButton';
import { AudiusImage } from './AudiusImage';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface DedicationViewProps {
  dedication: Dedication;
}

export function DedicationView({ dedication }: DedicationViewProps) {
  const { playDedication, loadingDedicationId } = useMusicPlayer();
  const themeClass = `card-theme-${dedication.theme}`;
  const dedicatedToLabel = getDedicatedToLabel(
    dedication.dedicated_to,
    dedication.dedicated_to_custom
  );

  const isCurrentSongLoading = loadingDedicationId === dedication.id;

  // Theme emojis for background decoration
  const getThemeEmojis = (theme: string) => {
    switch (theme) {
      case 'floral':
        return ['🌸', '🌺', '🌻', '🌷', '🌼', '💐', '🌹', '🌿'];
      case 'neon':
        return ['✨', '⭐', '💫', '🌟', '⚡', '🔆', '💎', '🎆'];
      case 'vintage':
        return ['📜', '✉️', '📮', '📬', '🕰️', '📷', '🎞️', '📰'];
      case 'watercolor':
        return ['🎨', '🖌️', '🖼️', '🌈', '💧', '🌊', '☁️', '🌤️'];
      case 'cosmic':
        return ['💫', '⭐', '🌟', '🌙', '🌌', '🪐', '☄️', '🔭'];
      default:
        return ['💝'];
    }
  };

  const themeEmojis = getThemeEmojis(dedication.theme);
  const [artwork, setArtwork] = useState<{ src: string; mirrors?: string[] } | null>(null);

  useEffect(() => {
    // Fetch artwork when component mounts
    const fetchArtwork = async () => {
      try {
        const response = await fetch(`/api/tracks/${dedication.song_id}/artwork`);
        if (response.ok) {
          const data = await response.json();
          if (data.artwork) {
            setArtwork({
              src: data.artwork['480x480'] || data.artwork['150x150'] || data.artwork['1000x1000'] || '',
              mirrors: data.artwork.mirrors || [],
            });
          }
        }
      } catch (error) {
        console.error('Error fetching artwork:', error);
      }
    };
    fetchArtwork();
  }, [dedication.song_id]);

  const handlePlay = () => {
    playDedication(dedication);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          ← Back to board
        </Link>

        <div className={cn(
          'bg-white rounded-2xl shadow-2xl p-8 md:p-12 relative overflow-hidden',
          themeClass
        )}>
          {/* Background emojis */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {themeEmojis.map((emoji, index) => (
              <div
                key={index}
                className="absolute text-4xl md:text-6xl opacity-10 select-none"
                style={{
                  left: `${15 + (index * 12) % 70}%`,
                  top: `${10 + (index * 15) % 80}%`,
                  transform: `rotate(${index * 15}deg)`,
                }}
              >
                {emoji}
              </div>
            ))}
          </div>

          <div className={cn(
            "space-y-6 relative z-10",
            dedication.theme === 'neon' || dedication.theme === 'cosmic' 
              ? "text-white" 
              : "text-gray-900"
          )}>
            <div className="flex gap-6">
              {/* Artwork thumbnail */}
              {artwork && artwork.src && (
                <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 shadow-md">
                  <AudiusImage
                    src={artwork.src}
                    mirrors={artwork.mirrors || []}
                    alt={dedication.song_title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <div className="flex-1">
                <div className={cn(
                  "text-sm font-semibold uppercase tracking-wide mb-2",
                  dedication.theme === 'neon' || dedication.theme === 'cosmic' 
                    ? "text-white/90" 
                    : "text-gray-700"
                )}>
                  Dedicated to: {dedicatedToLabel}
                </div>
                <h1 className={cn(
                  "text-4xl font-bold mb-3",
                  dedication.theme === 'neon' || dedication.theme === 'cosmic' 
                    ? "text-white" 
                    : "text-gray-900"
                )}>
                  {dedication.song_title}
                </h1>
                <p className={cn(
                  "text-xl",
                  dedication.theme === 'neon' || dedication.theme === 'cosmic' 
                    ? "text-white/90" 
                    : "text-gray-700"
                )}>
                  by {dedication.artist_name}
                </p>
              </div>
            </div>

            <div className={cn(
              "backdrop-blur-sm rounded-lg p-6",
              dedication.theme === 'neon' || dedication.theme === 'cosmic' 
                ? "bg-white/10" 
                : "bg-white/60"
            )}>
              <p className={cn(
                "text-lg leading-relaxed whitespace-pre-wrap",
                dedication.theme === 'neon' || dedication.theme === 'cosmic' 
                  ? "text-white" 
                  : "text-gray-900"
              )}>
                {dedication.message}
              </p>
            </div>

            {dedication.author_name && (
              <div className={cn(
                "text-sm italic",
                dedication.theme === 'neon' || dedication.theme === 'cosmic' 
                  ? "text-white/80" 
                  : "text-gray-700"
              )}>
                — {dedication.author_name}
              </div>
            )}

            {dedication.location && (
              <div className={cn(
                "text-sm",
                dedication.theme === 'neon' || dedication.theme === 'cosmic' 
                  ? "text-white/70" 
                  : "text-gray-600"
              )}>
                📍 {dedication.location}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-white/20">
              <button
                onClick={handlePlay}
                disabled={isCurrentSongLoading}
                className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-full transition-colors"
              >
                {isCurrentSongLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                    Play Song
                  </>
                )}
              </button>

              <ReactionButtons dedicationId={dedication.id} />

              <ShareButton dedicationId={dedication.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
