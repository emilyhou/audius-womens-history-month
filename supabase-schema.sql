-- Create dedications table
CREATE TABLE IF NOT EXISTS dedications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  song_id TEXT NOT NULL,
  song_title TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  dedicated_to TEXT NOT NULL,
  dedicated_to_custom TEXT,
  message TEXT NOT NULL,
  theme TEXT NOT NULL CHECK (theme IN ('floral', 'neon', 'vintage', 'watercolor', 'cosmic')),
  author_name TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  x_position FLOAT NOT NULL,
  y_position FLOAT NOT NULL,
  rotation FLOAT NOT NULL DEFAULT 0
);

-- Create reactions table
CREATE TABLE IF NOT EXISTS reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dedication_id UUID NOT NULL REFERENCES dedications(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('heart', 'fire', 'clap', 'sparkle')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_dedications_created_at ON dedications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reactions_dedication_id ON reactions(dedication_id);

-- Enable Row Level Security (RLS)
ALTER TABLE dedications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on dedications" ON dedications
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert on dedications" ON dedications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on reactions" ON reactions
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert on reactions" ON reactions
  FOR INSERT WITH CHECK (true);
