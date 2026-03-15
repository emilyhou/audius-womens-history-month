export interface AudiusTrack {
  id: string;
  title: string;
  user: {
    name: string;
    handle: string;
  };
  artwork?: {
    "150x150": string;
    "480x480": string;
    "1000x1000": string;
    mirrors?: string[];
  };
  duration: number;
  play_count: number;
}

export interface AudiusPlaylist {
  data: Array<{
    playlist_id: number;
    playlist_name: string;
    tracks: AudiusTrack[];
    track_count: number;
  }>;
}

export interface Dedication {
  id: string;
  song_id: string;
  song_title: string;
  artist_name: string;
  dedicated_to: string;
  dedicated_to_custom?: string;
  message: string;
  theme: "floral" | "neon" | "vintage" | "watercolor" | "cosmic";
  author_name?: string;
  location?: string;
  created_at: string;
  x_position: number;
  y_position: number;
  rotation: number;
}

export interface Reaction {
  id: string;
  dedication_id: string;
  reaction_type: "heart" | "fire" | "clap" | "sparkle";
  created_at: string;
}

export interface ReactionCounts {
  heart: number;
  fire: number;
  clap: number;
  sparkle: number;
}

export type DedicatedToOption =
  | "Mom"
  | "Sister"
  | "Grandmother"
  | "Friend"
  | "Mentor"
  | "Partner"
  | "Artist who inspires me"
  | "Other";
