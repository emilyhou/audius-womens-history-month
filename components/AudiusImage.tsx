'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface AudiusImageProps {
  src: string;
  mirrors?: string[];
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
}

/**
 * AudiusImage component with mirror retry logic
 * When an image fails to load, it automatically retries with mirror URLs
 * Based on https://audius.co/agents.md image loading guidelines
 * 
 * According to Audius docs: "retry by swapping the URL host with each mirror"
 */
export function AudiusImage({
  src,
  mirrors = [],
  alt,
  fill,
  width,
  height,
  className,
  sizes,
}: AudiusImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [currentMirrorIndex, setCurrentMirrorIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [imageKey, setImageKey] = useState(0); // Force re-render on src change

  // Reset when src changes
  useEffect(() => {
    setCurrentSrc(src);
    setCurrentMirrorIndex(0);
    setHasError(false);
    setImageKey(0);
  }, [src]);

  // Function to swap hostname with mirror
  const swapHostWithMirror = useCallback((urlString: string, mirror: string): string | null => {
    try {
      const url = new URL(urlString);
      
      // Check if mirror is a full URL or just a hostname
      try {
        const mirrorUrl = new URL(mirror);
        // It's a full URL - replace hostname, port, and protocol
        url.hostname = mirrorUrl.hostname;
        url.port = mirrorUrl.port || '';
        url.protocol = mirrorUrl.protocol;
        return url.toString();
      } catch {
        // It's just a hostname - swap the hostname while preserving path and protocol
        url.hostname = mirror;
        url.port = ''; // Remove port when swapping hostname
        return url.toString();
      }
    } catch (e) {
      console.error('Error swapping host with mirror:', e);
      return null;
    }
  }, []);

  const handleError = useCallback(() => {
    if (currentMirrorIndex < mirrors.length && mirrors.length > 0) {
      // Try next mirror by swapping the hostname
      const nextMirror = mirrors[currentMirrorIndex];
      if (nextMirror) {
        // Use currentSrc (which might already be a mirror) and swap with next mirror
        // But we need to get back to the original URL structure first
        const baseUrl = src; // Always use original src as base for mirror swapping
        const newSrc = swapHostWithMirror(baseUrl, nextMirror);
        if (newSrc) {
          setCurrentSrc(newSrc);
          setCurrentMirrorIndex(prev => prev + 1);
          setImageKey(prev => prev + 1);
        } else {
          // Failed to construct mirror URL, try next mirror
          setCurrentMirrorIndex(prev => {
            const next = prev + 1;
            if (next >= mirrors.length) {
              setHasError(true);
            }
            return next;
          });
        }
      } else {
        setHasError(true);
      }
    } else {
      // All mirrors exhausted
      setHasError(true);
    }
  }, [currentMirrorIndex, mirrors, src, swapHostWithMirror]);

  if (hasError) {
    // Fallback placeholder
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className || ''}`}
        style={fill ? undefined : { width, height }}
      >
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        key={imageKey}
        src={currentSrc}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        onError={handleError}
        onLoadingComplete={() => {
          // Reset error state on successful load
          if (hasError) {
            setHasError(false);
          }
        }}
        unoptimized
      />
    );
  }

  return (
    <Image
      key={imageKey}
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      onError={handleError}
      onLoadingComplete={() => {
        // Reset error state on successful load
        if (hasError) {
          setHasError(false);
        }
      }}
      unoptimized
    />
  );
}
