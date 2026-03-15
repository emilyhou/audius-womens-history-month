'use client';

import { useState, useEffect, useRef } from 'react';
import { AudiusTrack } from '@/types';
import { AudiusImage } from '@/components/AudiusImage';
import { useMusicPlayer } from '@/components/MusicPlayer';

interface Step1ChooseTrackProps {
  onSelect: (track: AudiusTrack) => void;
  selectedTrack: AudiusTrack | null;
}

export function Step1ChooseTrack({ onSelect, selectedTrack }: Step1ChooseTrackProps) {
  const [tracks, setTracks] = useState<AudiusTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [loadingTrackId, setLoadingTrackId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isCleaningUpRef = useRef(false); // Track if we're intentionally cleaning up
  const handlersRef = useRef<{
    canplay?: () => void;
    ended?: () => void;
    error?: () => void;
  }>({});
  const { pause: pauseMainPlayer } = useMusicPlayer();

  useEffect(() => {
    fetchPlaylist();
  }, []);

  const fetchPlaylist = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/playlist');
      if (!response.ok) {
        throw new Error('Failed to fetch playlist');
      }
      const data = await response.json();
      
      // Extract tracks from the playlist data
      if (data.data && data.data[0] && data.data[0].tracks) {
        // Preserve mirrors from artwork if they exist
        // According to Audius API docs, mirrors are in the artwork object
        const processedTracks = data.data[0].tracks.map((track: any) => {
          // Normalize artwork structure and preserve mirrors
          if (track.artwork) {
            // Mirrors might be in artwork.mirrors, artwork._mirrors, or at track level
            // Preserve them in artwork.mirrors for consistent access
            if (!track.artwork.mirrors) {
              // Check multiple possible locations for mirrors
              track.artwork.mirrors = 
                track.artwork._mirrors || 
                track.mirrors || 
                track._mirrors || 
                [];
            }
            // Ensure mirrors is always an array and filter out empty values
            if (!Array.isArray(track.artwork.mirrors)) {
              track.artwork.mirrors = [];
            } else {
              track.artwork.mirrors = track.artwork.mirrors.filter((m: any) => m && m.trim());
            }
          } else {
            // If no artwork, create empty structure
            track.artwork = { mirrors: [] };
          }
          return track;
        });
        
        // Remove duplicates based on track ID
        const uniqueTracks = processedTracks.filter((track: any, index: number, self: any[]) => 
          index === self.findIndex((t: any) => t.id === track.id)
        );
        
        setTracks(uniqueTracks);
      } else {
        throw new Error('No tracks found in playlist');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load playlist');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPreview = async (e: React.MouseEvent, track: AudiusTrack) => {
    e.stopPropagation();
    
    if (playingTrackId === track.id && audioRef.current) {
      // Pause if already playing
      audioRef.current.pause();
      setPlayingTrackId(null);
      return;
    }

    // Stop the main music player when starting a preview
    pauseMainPlayer();

    setLoadingTrackId(track.id);
    try {
      const response = await fetch(`/api/tracks/${track.id}/stream`);
      if (!response.ok) {
        throw new Error('Failed to fetch stream URL');
      }
      const { streamUrl } = await response.json();
      
      if (!streamUrl) {
        throw new Error('No stream URL returned');
      }

      // Stop current audio if playing
      if (audioRef.current) {
        isCleaningUpRef.current = true;
        const oldAudio = audioRef.current;
        
        // Remove previous event listeners if they exist
        if (handlersRef.current.canplay) {
          oldAudio.removeEventListener('canplay', handlersRef.current.canplay);
        }
        if (handlersRef.current.ended) {
          oldAudio.removeEventListener('ended', handlersRef.current.ended);
        }
        if (handlersRef.current.error) {
          oldAudio.removeEventListener('error', handlersRef.current.error);
        }
        
        oldAudio.pause();
        oldAudio.src = '';
        isCleaningUpRef.current = false;
      }

      // Create new audio element
      const audio = new Audio(streamUrl);
      audioRef.current = audio;

      const handleCanPlay = () => {
        if (!isCleaningUpRef.current && audioRef.current === audio) {
          audio.play().catch((err) => {
            if (!isCleaningUpRef.current) {
              console.error('Error playing audio:', err);
            }
          });
          setLoadingTrackId(null);
          setPlayingTrackId(track.id);
        }
      };

      const handleEnded = () => {
        if (!isCleaningUpRef.current && audioRef.current === audio) {
          setPlayingTrackId(null);
        }
      };

      const handleError = () => {
        if (!isCleaningUpRef.current && audioRef.current === audio) {
          setLoadingTrackId(null);
          setPlayingTrackId(null);
          alert('Failed to play preview');
        }
      };

      // Store handlers for cleanup
      handlersRef.current = {
        canplay: handleCanPlay,
        ended: handleEnded,
        error: handleError,
      };

      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);
    } catch (error) {
      console.error('Error playing preview:', error);
      setLoadingTrackId(null);
      alert('Failed to load preview');
    }
  };

  useEffect(() => {
    return () => {
      // Clean up audio when component unmounts (e.g., when moving to next step)
      if (audioRef.current) {
        isCleaningUpRef.current = true; // Set flag to prevent error handlers from firing
        
        const audio = audioRef.current;
        
        // Remove all event listeners
        if (handlersRef.current.canplay) {
          audio.removeEventListener('canplay', handlersRef.current.canplay);
        }
        if (handlersRef.current.ended) {
          audio.removeEventListener('ended', handlersRef.current.ended);
        }
        if (handlersRef.current.error) {
          audio.removeEventListener('error', handlersRef.current.error);
        }
        
        // Stop and clear audio
        audio.pause();
        audio.src = '';
        audioRef.current = null;
        
        // Clear handlers
        handlersRef.current = {};
        
        // Reset state (but don't show alerts since we're cleaning up)
        setPlayingTrackId(null);
        setLoadingTrackId(null);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-gray-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchPlaylist}
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-2xl font-bold mb-2 text-gray-900">Choose a Song</h3>
        <p className="text-sm text-gray-500">Select a song and click Next to continue</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
        {tracks.map((track) => (
          <div
            key={track.id}
            className={`relative p-4 rounded-lg border transition-all bg-white cursor-pointer ${
              selectedTrack?.id === track.id
                ? 'border-gray-900 bg-gray-50 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
            onClick={() => onSelect(track)}
          >
            <div className="flex gap-3">
              {track.artwork?.['150x150'] && (
                <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                  <AudiusImage
                    src={track.artwork['150x150']}
                    mirrors={(track.artwork as any)?.mirrors || []}
                    alt={track.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate text-gray-900">{track.title}</div>
                <div className="text-sm text-gray-600 truncate">{track.user.name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                </div>
              </div>
            </div>
            
            {/* Play button */}
            <button
              onClick={(e) => handlePlayPreview(e, track)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white border border-gray-300 hover:border-gray-400 flex items-center justify-center shadow-sm hover:shadow transition-all"
              title={playingTrackId === track.id ? 'Pause' : 'Play preview'}
            >
              {loadingTrackId === track.id ? (
                <svg className="animate-spin h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : playingTrackId === track.id ? (
                <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-700 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              )}
            </button>

            {/* Selected indicator */}
            {selectedTrack?.id === track.id && (
              <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
