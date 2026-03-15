import { Metadata } from 'next';
import { DedicationView } from '@/components/DedicationView';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';

async function getDedication(id: string) {
  try {
    const { data, error } = await supabase
      .from('dedications')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching dedication:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const dedication = await getDedication(params.id);

  if (!dedication) {
    return {
      title: 'Dedication Not Found',
    };
  }

  const dedicatedTo = dedication.dedicated_to === 'Other'
    ? dedication.dedicated_to_custom
    : dedication.dedicated_to;

  // Only use "my" for standard personal relationships
  const standardRelationships = ['Mom', 'Sister', 'Mentor', 'Partner', 'Friend'];
  const useMy = standardRelationships.includes(dedicatedTo);
  const openGraphTitle = useMy
    ? `A song dedicated to my ${dedicatedTo}`
    : `A song dedicated to ${dedicatedTo}`;

  return {
    title: `${dedication.song_title} - Dedicated to ${dedicatedTo}`,
    description: dedication.message.substring(0, 160),
    openGraph: {
      title: openGraphTitle,
      description: `${dedication.song_title} by ${dedication.artist_name}. ${dedication.message.substring(0, 100)}...`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `A song dedicated to ${dedicatedTo}`,
      description: `${dedication.song_title} by ${dedication.artist_name}`,
    },
  };
}

export default async function DedicationPage({ params }: { params: { id: string } }) {
  const dedication = await getDedication(params.id);

  if (!dedication) {
    notFound();
  }

  return <DedicationView dedication={dedication} />;
}
