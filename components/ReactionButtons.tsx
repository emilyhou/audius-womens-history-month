'use client';

import { useState, useEffect } from 'react';
import { ReactionCounts } from '@/types';

interface ReactionButtonsProps {
  dedicationId: string;
}

const reactions = [
  { type: 'heart', emoji: '❤️', label: 'Heart' },
  { type: 'fire', emoji: '🔥', label: 'Fire' },
  { type: 'clap', emoji: '👏', label: 'Clap' },
  { type: 'sparkle', emoji: '✨', label: 'Sparkle' },
] as const;

export function ReactionButtons({ dedicationId }: ReactionButtonsProps) {
  const [counts, setCounts] = useState<ReactionCounts>({
    heart: 0,
    fire: 0,
    clap: 0,
    sparkle: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReactions();
  }, [dedicationId]);

  const fetchReactions = async () => {
    try {
      const response = await fetch(`/api/reactions?dedication_id=${dedicationId}`);
      if (response.ok) {
        const data = await response.json();
        setCounts(data);
      }
    } catch (error) {
      console.error('Error fetching reactions:', error);
    }
  };

  const handleReaction = async (reactionType: keyof ReactionCounts) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/reactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dedication_id: dedicationId,
          reaction_type: reactionType,
        }),
      });

      if (response.ok) {
        // Optimistically update counts
        setCounts((prev) => ({
          ...prev,
          [reactionType]: prev[reactionType] + 1,
        }));
        // Refetch to get accurate counts
        await fetchReactions();
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {reactions.map((reaction) => (
        <button
          key={reaction.type}
          onClick={() => handleReaction(reaction.type as keyof ReactionCounts)}
          disabled={loading}
          className="flex items-center gap-1 px-3 py-2 bg-white/90 hover:bg-white text-gray-900 rounded-full transition-colors disabled:opacity-50 shadow-md border border-gray-200"
          title={reaction.label}
        >
          <span className="text-xl">{reaction.emoji}</span>
          {counts[reaction.type as keyof ReactionCounts] > 0 && (
            <span className="text-sm font-semibold text-gray-900">
              {counts[reaction.type as keyof ReactionCounts]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
