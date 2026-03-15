import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dedication_id, reaction_type } = body;

    if (!dedication_id || !reaction_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['heart', 'fire', 'clap', 'sparkle'].includes(reaction_type)) {
      return NextResponse.json(
        { error: 'Invalid reaction type' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('reactions')
      .insert({
        dedication_id,
        reaction_type,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating reaction:', error);
    return NextResponse.json(
      { error: 'Failed to create reaction' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dedicationId = searchParams.get('dedication_id');

    if (!dedicationId) {
      return NextResponse.json(
        { error: 'Missing dedication_id parameter' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('reactions')
      .select('reaction_type')
      .eq('dedication_id', dedicationId);

    if (error) {
      throw error;
    }

    // Count reactions by type
    const counts = {
      heart: 0,
      fire: 0,
      clap: 0,
      sparkle: 0,
    };

    data?.forEach((reaction) => {
      if (reaction.reaction_type in counts) {
        counts[reaction.reaction_type as keyof typeof counts]++;
      }
    });

    return NextResponse.json(counts);
  } catch (error) {
    console.error('Error fetching reactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reactions' },
      { status: 500 }
    );
  }
}
