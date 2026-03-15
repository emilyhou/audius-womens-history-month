'use client';

import { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Dedication } from '@/types';
import { AudiusImage } from './AudiusImage';

interface MusicPlayerContextType {
  currentDedication: Dedication | null;
  isPlaying: boolean;
  isLoading: boolean;
  loadingDedicationId: string | null;
  playDedication: (dedication: Dedication) => Promise<void>;
  pause: () => void;
  resume: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentDedication, setCurrentDedication] = useState<Dedication | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDedicationId, setLoadingDedicationId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [artwork, setArtwork] = useState<{ src: string; mirrors?: string[] } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setDuration(audio.duration);
      }
    });

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setProgress(0);
    });

    audio.addEventListener('loadedmetadata', () => {
      if (audio.duration) {
        setDuration(audio.duration);
      }
    });

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const playDedication = async (dedication: Dedication) => {
    if (!audioRef.current || isLoading) return;

    setIsLoading(true);
    setLoadingDedicationId(dedication.id);

    try {
      // Fetch stream URL from API route to avoid CORS issues
      const response = await fetch(`/api/tracks/${dedication.song_id}/stream`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to get stream URL:', errorData.error || response.statusText);
        alert('Failed to load song. Please try again.');
        setIsLoading(false);
        setLoadingDedicationId(null);
        return;
      }

      const { streamUrl } = await response.json();
      
      if (!streamUrl) {
        console.error('No stream URL returned');
        alert('Failed to load song. Please try again.');
        setIsLoading(false);
        setLoadingDedicationId(null);
        return;
      }

      if (currentDedication?.id === dedication.id && audioRef.current.src) {
        // Same song, just resume
        audioRef.current.play().catch((error) => {
          console.error('Error playing audio:', error);
          alert('Failed to play song. Please try again.');
          setIsLoading(false);
          setLoadingDedicationId(null);
        });
        setIsPlaying(true);
        setIsLoading(false);
        setLoadingDedicationId(null);
      } else {
        // Clear previous artwork when switching songs
        setArtwork(null);
        // New song
        setCurrentDedication(dedication);
        audioRef.current.src = streamUrl;
        
        // Fetch artwork for the track
        fetchArtwork(dedication.song_id);
        
        // Wait for audio to load before playing
        const handleCanPlay = () => {
          audioRef.current?.play()
            .then(() => {
              setIsLoading(false);
              setLoadingDedicationId(null);
            })
            .catch((error) => {
              console.error('Error playing audio:', error);
              alert('Failed to play song. Please try again.');
              setIsLoading(false);
              setLoadingDedicationId(null);
            });
        };
        
        const handlePlaying = () => {
          setIsLoading(false);
          setLoadingDedicationId(null);
        };
        
        const handleError = (e: Event) => {
          console.error('Audio error:', e);
          alert('Failed to load song. Please try again.');
          setIsLoading(false);
          setLoadingDedicationId(null);
        };
        
        audioRef.current.addEventListener('canplay', handleCanPlay, { once: true });
        audioRef.current.addEventListener('playing', handlePlaying, { once: true });
        audioRef.current.addEventListener('error', handleError, { once: true });
        
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing dedication:', error);
      alert('Failed to load song. Please try again.');
      setIsLoading(false);
      setLoadingDedicationId(null);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resume = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const newTime = percent * duration;
    audioRef.current.currentTime = newTime;
    setProgress(percent * 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const fetchArtwork = async (trackId: string) => {
    try {
      const response = await fetch(`/api/tracks/${trackId}/artwork`);
      if (response.ok) {
        const data = await response.json();
        if (data.artwork) {
          setArtwork({
            src: data.artwork['150x150'] || data.artwork['480x480'] || data.artwork['1000x1000'] || '',
            mirrors: data.artwork.mirrors || [],
          });
        }
      }
    } catch (error) {
      console.error('Error fetching artwork:', error);
    }
  };

  return (
    <MusicPlayerContext.Provider value={{ currentDedication, isPlaying, isLoading, loadingDedicationId, playDedication, pause, resume }}>
      {children}
      {currentDedication && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg z-50">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center gap-4">
              {/* Artwork thumbnail */}
              {artwork && artwork.src && (
                <div className="relative w-14 h-14 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                  <AudiusImage
                    src={artwork.src}
                    mirrors={artwork.mirrors || []}
                    alt={currentDedication.song_title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <button
                onClick={isPlaying ? pause : resume}
                className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center hover:bg-pink-600 transition-colors"
              >
                {isPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">
                  {currentDedication.song_title}
                </div>
                <div className="text-xs text-gray-600 truncate">
                  {currentDedication.artist_name} • Dedicated to: {currentDedication.dedicated_to === 'Other' ? currentDedication.dedicated_to_custom : currentDedication.dedicated_to} ❤️
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
                <span>{formatTime((progress / 100) * duration)}</span>
                <div
                  className="w-64 h-1 bg-gray-200 rounded-full cursor-pointer relative"
                  onClick={seek}
                >
                  <div
                    className="h-full bg-pink-500 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
}
