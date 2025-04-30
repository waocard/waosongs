// src/components/dashboard/song-details.tsx
import { Song } from '@/lib/types';
import { Eye, CheckCircle } from 'lucide-react';

interface SongDetailsProps {
  song: Song;
  onViewLyrics: () => void;
}

export default function SongDetails({ song, onViewLyrics }: SongDetailsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Description</h3>
        <p className="text-gray-300">{song.description}</p>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3">Specifications</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-700 bg-opacity-50 p-3 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Length</p>
            <p className="font-medium">{song.specifications.length}</p>
          </div>
          <div className="bg-gray-700 bg-opacity-50 p-3 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Tempo</p>
            <p className="font-medium">{song.specifications.tempo}</p>
          </div>
          <div className="bg-gray-700 bg-opacity-50 p-3 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Mood</p>
            <p className="font-medium">{song.specifications.mood}</p>
          </div>
          <div className="bg-gray-700 bg-opacity-50 p-3 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Vocals</p>
            <p className="font-medium">{song.specifications.vocals}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-400 mb-2">Instruments</p>
          <div className="flex flex-wrap gap-2">
            {song.specifications.instruments.map((instrument, index) => (
              <span key={index} className="px-3 py-1 bg-gray-700 bg-opacity-50 rounded-full text-sm">
                {instrument}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {song.lyrics && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Lyrics</h3>
            <button 
              onClick={onViewLyrics}
              className="text-pink-400 text-sm hover:text-pink-300 flex items-center"
            >
              <Eye className="w-4 h-4 mr-1" />
              View Full Lyrics
            </button>
          </div>
          <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
            <p className="text-gray-300 whitespace-pre-line line-clamp-6">
              {song.lyrics}
            </p>
          </div>
        </div>
      )}
      
      <div>
        <h3 className="text-lg font-medium mb-3">Timeline</h3>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-700"></div>
          
          {/* Timeline events */}
          <div className="space-y-6 pl-12 relative">
            {song.timeline.map((event, index) => (
              <div key={index} className="relative">
                {/* Timeline dot */}
                <div className={`absolute left-[-24px] w-6 h-6 rounded-full flex items-center justify-center ${event.completed ? 'bg-green-500' : 'bg-gray-600'}`}>
                  {event.completed && <CheckCircle className="w-4 h-4" />}
                </div>
                
                <div>
                  <p className="font-medium">{event.event}</p>
                  <p className="text-sm text-gray-400">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}