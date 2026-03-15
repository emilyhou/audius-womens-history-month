'use client';

import { useEffect, useState } from 'react';
import { DedicationCard } from './DedicationCard';
import { DedicationModal } from './DedicationModal';
import { Dedication } from '@/types';

export function Corkboard() {
  const [dedications, setDedications] = useState<Dedication[]>([]);
  const [selectedDedication, setSelectedDedication] = useState<Dedication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDedications();
  }, []);

  const fetchDedications = async () => {
    try {
      const response = await fetch('/api/dedications');
      if (response.ok) {
        const data = await response.json();
        // Handle both array and object response formats
        if (Array.isArray(data)) {
          setDedications(data);
        } else if (data.dedications) {
          setDedications(data.dedications);
        } else {
          setDedications([]);
        }
      }
    } catch (error) {
      console.error('Error fetching dedications:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-gray-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen" style={{ height: '100vh', overflow: 'hidden' }}>
      {/* Corkboard background is handled by the parent's corkboard-bg class */}

      {dedications.length === 0 ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <p className="text-xl text-gray-800 mb-4 font-medium">
              No dedications yet. Be the first! ✨
            </p>
            <p className="text-sm text-gray-500">
              Click &quot;Dedicate a Song&quot; to get started.
            </p>
          </div>
        </div>
      ) : (
        dedications.map((dedication, index) => (
          <DedicationCard
            key={dedication.id}
            dedication={dedication}
            onClick={() => setSelectedDedication(dedication)}
            zIndex={dedications.length - index}
          />
        ))
      )}

      {selectedDedication && (
        <DedicationModal
          dedication={selectedDedication}
          onClose={() => setSelectedDedication(null)}
        />
      )}
    </div>
  );
}
