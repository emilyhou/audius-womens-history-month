import { NextRequest, NextResponse } from 'next/server';
import { getTrackStreamUrl } from '@/lib/audius';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const streamUrl = await getTrackStreamUrl(params.id);
    
    if (!streamUrl) {
      return NextResponse.json(
        { error: 'Failed to get stream URL' },
        { status: 404 }
      );
    }

    return NextResponse.json({ streamUrl });
  } catch (error) {
    console.error('Error fetching stream URL:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stream URL' },
      { status: 500 }
    );
  }
}
