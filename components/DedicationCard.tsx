'use client';

import { motion } from 'framer-motion';
import { Dedication } from '@/types';
import { getDedicatedToLabel, truncateText } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface DedicationCardProps {
  dedication: Dedication;
  onClick: () => void;
  zIndex?: number;
}

export function DedicationCard({ dedication, onClick, zIndex = 1 }: DedicationCardProps) {
  const themeClass = `card-theme-${dedication.theme}`;
  const dedicatedToLabel = getDedicatedToLabel(
    dedication.dedicated_to,
    dedication.dedicated_to_custom
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="absolute cursor-pointer"
      style={{
        left: `${dedication.x_position}%`,
        top: `${dedication.y_position}%`,
        transform: `rotate(${dedication.rotation}deg)`,
        zIndex: zIndex,
      }}
      onClick={onClick}
    >
      <div
        className={cn(
          'relative w-56 md:w-64 p-4 md:p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 card-wiggle',
          themeClass
        )}
      >

        <div className={cn(
          "space-y-2",
          dedication.theme === 'neon' || dedication.theme === 'cosmic' 
            ? "text-white" 
            : "text-gray-900"
        )}>
          <div className={cn(
            "text-xs font-semibold uppercase tracking-wide",
            dedication.theme === 'neon' || dedication.theme === 'cosmic' 
              ? "text-white/90" 
              : "text-gray-700"
          )}>
            Dedicated to: {dedicatedToLabel}
          </div>
          
          <div className={cn(
            "font-bold text-lg leading-tight",
            dedication.theme === 'neon' || dedication.theme === 'cosmic' 
              ? "text-white" 
              : "text-gray-900"
          )}>
            {dedication.song_title}
          </div>
          
          <div className={cn(
            "text-sm",
            dedication.theme === 'neon' || dedication.theme === 'cosmic' 
              ? "text-white/90" 
              : "text-gray-700"
          )}>
            by {dedication.artist_name}
          </div>
          
          <div className={cn(
            "text-sm mt-2 line-clamp-3",
            dedication.theme === 'neon' || dedication.theme === 'cosmic' 
              ? "text-white/95" 
              : "text-gray-800"
          )}>
            {truncateText(dedication.message, 100)}
          </div>

          {dedication.author_name && (
            <div className={cn(
              "text-xs mt-2 italic",
              dedication.theme === 'neon' || dedication.theme === 'cosmic' 
                ? "text-white/80" 
                : "text-gray-600"
            )}>
              — {dedication.author_name}
            </div>
          )}

          {dedication.location && (
            <div className={cn(
              "text-xs mt-2 flex items-center gap-1",
              dedication.theme === 'neon' || dedication.theme === 'cosmic' 
                ? "text-white/70" 
                : "text-gray-500"
            )}>
              <span>📍</span>
              <span>{dedication.location}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
