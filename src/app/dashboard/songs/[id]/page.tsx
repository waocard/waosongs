// app/dashboard/songs/[id]/page.tsx
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import SongHeader from '@/components/dashboard/song-header';
import SongDetails from '@/components/dashboard/song-details';
import MessagingTab from '@/components/dashboard/messaging-tab';
import FilesTab from '@/components/dashboard/files-tab';
import LyricsModal from '@/components/dashboard/lyrics-modal';
import { getSongById } from '@/lib/api';
import { Song } from '@/lib/types';

// Mock data for initial development
const mockSong: Song = {
    id: 0,
    title: '',
    category: '',
    status: 'in-progress',
    progress: 0,
    deadline: '',
    artist: '',
    created: '',
    description: '',
    preview: false,
    messagesCount: 0,
    specifications: {
        length: '',
        tempo: '',
        mood: '',
        vocals: '',
        instruments: []
    },
    timeline: [],
    messages: []
};

export default function SongDetailPage() {
  const { id } = useParams();
  const [song, setSong] = useState<Song>(mockSong);
  const [activeTab, setActiveTab] = useState('overview');
  const [showLyricsModal, setShowLyricsModal] = useState(false);
  
  // In a real app, fetch the song data based on ID
  // useEffect(() => {
  //   const fetchSong = async () => {
  //     const songData = await getSongById(id);
  //     setSong(songData);
  //   };
  //   fetchSong();
  // }, [id]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <a href="/dashboard" className="inline-flex items-center mb-6">
        Back to Dashboard
      </a>
      
      <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm">
        <SongHeader song={song} />
        
        <div className="flex border-b border-gray-700 mb-6">
          {['overview', 'messages', 'files'].map(tab => (
            <button
              key={tab}
              className={activeTab === tab ? 'active-tab' : 'inactive-tab'}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        {activeTab === 'overview' && (
          <SongDetails 
            song={song} 
            onViewLyrics={() => setShowLyricsModal(true)} 
          />
        )}
        
        {activeTab === 'messages' && <MessagingTab messages={song.messages} />}
        
        {activeTab === 'files' && <FilesTab files={song.files} />}
      </div>
      
      {showLyricsModal && (
        <LyricsModal 
          lyrics={song.lyrics} 
          title={song.title} 
          onClose={() => setShowLyricsModal(false)} 
        />
      )}
    </div>
  );
}