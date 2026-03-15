const AUDIUS_API_URL = process.env.AUDIUS_API_URL || 'https://api.audius.co';

// Get a healthy Audius host
async function getHealthyHost(): Promise<string> {
  try {
    const response = await fetch(`${AUDIUS_API_URL}/v1/hosts`);
    const data = await response.json();
    if (data.data && data.data.length > 0) {
      return data.data[0];
    }
  } catch (error) {
    console.error('Error fetching healthy host:', error);
  }
  return AUDIUS_API_URL;
}

export async function getPlaylist(playlistId: string = 'dp2Vo4m') {
  try {
    const host = await getHealthyHost();
    const response = await fetch(`${host}/v1/playlists/${playlistId}`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch playlist: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching playlist:', error);
    throw error;
  }
}

export async function getTrackStreamUrl(trackId: string): Promise<string | null> {
  try {
    const host = await getHealthyHost();
    // The stream endpoint returns a redirect or the URL directly
    const response = await fetch(`${host}/v1/tracks/${trackId}/stream?app_name=DedicateASong`, {
      headers: {
        'Accept': 'application/json',
      },
      redirect: 'follow',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch stream URL: ${response.statusText}`);
    }
    
    // Check if response is a redirect
    if (response.redirected) {
      return response.url;
    }
    
    // Try to parse as JSON first
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      // Audius API returns the stream URL in various formats
      if (typeof data === 'string') {
        return data;
      }
      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        return data.data[0];
      }
      if (Array.isArray(data) && data.length > 0) {
        return data[0];
      }
      if (data.url) {
        return data.url;
      }
    }
    
    // If not JSON, the URL might be in the response URL itself
    return response.url;
  } catch (error) {
    console.error('Error fetching track stream URL:', error);
    return null;
  }
}

export async function getTrack(trackId: string) {
  try {
    const host = await getHealthyHost();
    const response = await fetch(`${host}/v1/tracks/${trackId}`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch track: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data?.[0] || null;
  } catch (error) {
    console.error('Error fetching track:', error);
    return null;
  }
}
