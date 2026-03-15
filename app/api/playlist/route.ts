import { NextResponse } from 'next/server';
import { getPlaylist } from '@/lib/audius';

export async function GET() {
  try {
    const playlist = await getPlaylist('dp2Vo4m');
    // The API response already includes mirrors in the artwork object
    // We just pass it through - the component will extract mirrors
    return NextResponse.json(playlist);
  } catch (error) {
    console.error('Error fetching playlist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch playlist' },
      { status: 500 }
    );
  }
}
