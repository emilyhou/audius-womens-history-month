'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Step1ChooseTrack } from '@/components/DedicationFlow/Step1ChooseTrack';
import { Step2DedicatedTo } from '@/components/DedicationFlow/Step2DedicatedTo';
import { Step3WriteMessage } from '@/components/DedicationFlow/Step3WriteMessage';
import { Step4ChooseTheme } from '@/components/DedicationFlow/Step4ChooseTheme';
import { AudiusTrack, DedicatedToOption } from '@/types';

type Theme = 'floral' | 'neon' | 'vintage' | 'watercolor' | 'cosmic';

export default function DedicatePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedTrack, setSelectedTrack] = useState<AudiusTrack | null>(null);
  const [dedicatedTo, setDedicatedTo] = useState<DedicatedToOption | null>(null);
  const [dedicatedToCustom, setDedicatedToCustom] = useState('');
  const [message, setMessage] = useState('');
  const [theme, setTheme] = useState<Theme | null>(null);
  const [authorName, setAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleStep1Select = (track: AudiusTrack) => {
    setSelectedTrack(track);
  };

  const handleStep2Complete = (option: DedicatedToOption, custom?: string) => {
    setDedicatedTo(option);
    if (custom) {
      setDedicatedToCustom(custom);
    }
    // Only auto-advance for non-Other options
    // For "Other", user must click Next button
    if (option !== 'Other') {
      setStep(3);
    }
  };

  const handleStep3Complete = () => {
    if (message.trim()) {
      setStep(4);
    }
  };

  const handleStep4Complete = (selectedTheme: Theme) => {
    setTheme(selectedTheme);
  };

  const handleSubmit = async () => {
    if (!selectedTrack || !dedicatedTo || !message || !theme) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/dedications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          song_id: selectedTrack.id,
          song_title: selectedTrack.title,
          artist_name: selectedTrack.user.name,
          dedicated_to: dedicatedTo,
          dedicated_to_custom: dedicatedTo === 'Other' ? dedicatedToCustom : null,
          message: message.trim(),
          theme,
          author_name: authorName.trim() || null,
        }),
      });

      if (response.ok) {
        router.push('/');
      } else {
        throw new Error('Failed to create dedication');
      }
    } catch (error) {
      console.error('Error creating dedication:', error);
      alert('Failed to create dedication. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedTrack !== null;
      case 2:
        return dedicatedTo !== null && (dedicatedTo !== 'Other' || dedicatedToCustom.trim());
      case 3:
        return message.trim().length > 0;
      case 4:
        return theme !== null;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen figjam-bg py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 relative">
          {/* Close button */}
          <Link
            href="/"
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            title="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="relative pb-12">
              {/* Step circles and labels container */}
              <div className="relative flex justify-between">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className="relative z-10 flex flex-col items-center flex-1">
                    <div className="relative w-12 h-12">
                      {/* Background circle (outer ring) */}
                      <div className={`absolute inset-0 rounded-full transition-all duration-300 ${step >= s
                        ? 'bg-gradient-to-br from-pink-500 to-purple-600'
                        : 'bg-gray-100'
                        }`} />

                      {/* Inner white circle for content */}
                      <div
                        className={`relative w-11 h-11 m-0.5 rounded-full flex items-center justify-center font-semibold transition-all duration-300 shadow-sm ${step >= s
                          ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white scale-105 shadow-md'
                          : 'bg-white border-2 border-gray-200 text-gray-400'
                          }`}
                      >
                        {step > s ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="text-sm">{s}</span>
                        )}
                      </div>
                    </div>
                    <span className={`text-xs font-medium mt-4 transition-colors whitespace-nowrap ${step >= s ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                      {s === 1 && 'Choose Track'}
                      {s === 2 && 'Who For'}
                      {s === 3 && 'Message'}
                      {s === 4 && 'Theme'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Steps */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <Step1ChooseTrack
                  onSelect={handleStep1Select}
                  selectedTrack={selectedTrack}
                />
              )}
              {step === 2 && (
                <Step2DedicatedTo
                  onSelect={handleStep2Complete}
                  selected={dedicatedTo}
                  customValue={dedicatedToCustom}
                  onCustomChange={setDedicatedToCustom}
                />
              )}
              {step === 3 && (
                <Step3WriteMessage
                  message={message}
                  onChange={setMessage}
                  songTitle={selectedTrack?.title || ''}
                  dedicatedTo={
                    dedicatedTo === 'Other'
                      ? dedicatedToCustom
                      : dedicatedTo || ''
                  }
                />
              )}
              {step === 4 && (
                <div className="space-y-6">
                  <Step4ChooseTheme
                    onSelect={handleStep4Complete}
                    selected={theme}
                  />

                  <div className="mt-6">
                    <label className="block text-sm font-medium mb-2 text-gray-900">
                      Your name (optional):
                    </label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none shadow-sm focus:shadow-sm transition-all text-gray-900 bg-white"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="px-6 py-2.5 border border-gray-300 bg-white text-gray-900 font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400 hover:bg-gray-50 transition-colors shadow-sm"
            >
              Back
            </button>

            {step < 4 ? (
              <button
                onClick={() => {
                  if (step === 1 && canProceed()) {
                    setStep(2);
                  } else if (step === 2 && canProceed()) {
                    // For step 2, explicitly check "Other" case
                    if (dedicatedTo !== 'Other' || dedicatedToCustom.trim()) {
                      setStep(3);
                    }
                  } else if (step === 3) {
                    handleStep3Complete();
                  } else if (canProceed()) {
                    setStep(step + 1);
                  }
                }}
                disabled={!canProceed()}
                className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors shadow-sm"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || submitting}
                className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors shadow-sm"
              >
                {submitting ? 'Creating...' : 'Create Dedication'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
