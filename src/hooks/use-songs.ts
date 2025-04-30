// src/hooks/use-songs.ts
import { useState, useEffect } from 'react';
import { Song } from '@/lib/types';

export function useSongs() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        // In a real app, make an API call to fetch songs
        const response = await fetch('/api/songs');
        
        if (!response.ok) {
          throw new Error('Failed to fetch songs');
        }
        
        const data = await response.json();
        setSongs(data);
      } catch (error) {
        setError(error as Error);
        console.error('Error fetching songs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSongs();
  }, []);

  const getSongById = (id: number) => {
    return songs.find(song => song.id === id) || null;
  };

  return {
    songs,
    isLoading,
    error,
    getSongById
  };
}