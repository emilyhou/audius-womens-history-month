import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getRandomPosition } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get('stats') === 'true';

    const { data, error } = await supabase
      .from('dedications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    if (includeStats) {
      // Get unique locations
      const locations = data
        ?.filter((d) => d.location)
        .map((d) => d.location)
        .filter((loc, index, self) => self.indexOf(loc) === index)
        .slice(0, 10) || [];

      return NextResponse.json({
        dedications: data,
        stats: {
          total: data?.length || 0,
          locations,
        },
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching dedications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dedications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      song_id,
      song_title,
      artist_name,
      dedicated_to,
      dedicated_to_custom,
      message,
      theme,
      author_name,
    } = body;

    // Get location from IP (optional)
    let location: string | undefined;
    try {
      const forwardedFor = request.headers.get('x-forwarded-for');
      const realIp = request.headers.get('x-real-ip');
      const ip = forwardedFor?.split(',')[0] || realIp;
      
      if (ip && ip !== 'unknown') {
        // Use ipapi.co free tier for geolocation
        const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`, {
          headers: {
            'User-Agent': 'DedicateASong/1.0',
          },
        });
        
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          if (geoData.city && geoData.region) {
            location = `${geoData.city}, ${geoData.region}`;
          } else if (geoData.city) {
            location = geoData.city;
          } else if (geoData.country_name) {
            location = geoData.country_name;
          }
        }
      }
    } catch (e) {
      // Location detection is optional - fail silently
      console.log('Location detection failed:', e);
    }

    // Generate random position for card placement
    // Using percentage-based positioning for responsiveness
    // x: 5% to 85%, y: 10% to 80%
    const { x, y, rotation } = getRandomPosition(5, 85, 10, 80);

    const { data, error } = await supabase
      .from('dedications')
      .insert({
        song_id,
        song_title,
        artist_name,
        dedicated_to,
        dedicated_to_custom: dedicated_to === 'Other' ? dedicated_to_custom : null,
        message,
        theme,
        author_name: author_name || null,
        location: location || null,
        x_position: x,
        y_position: y,
        rotation,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating dedication:', error);
    return NextResponse.json(
      { error: 'Failed to create dedication' },
      { status: 500 }
    );
  }
}
