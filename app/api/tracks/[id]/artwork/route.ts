import { NextRequest, NextResponse } from 'next/server';
import { getTrack } from '@/lib/audius';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const track = await getTrack(params.id);
    
    if (!track) {
      return NextResponse.json(
        { error: 'Track not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      artwork: track.artwork || null,
    });
  } catch (error) {
    console.error('Error fetching track artwork:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artwork' },
      { status: 500 }
    );
  }
}
