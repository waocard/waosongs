// app/dashboard/songs/[id]/page.tsx
'use client';
import React, { useState } from 'react';
import { 
  Music, 
  User, 
  Clock, 
  Download, 
  Play, 
  Pause, 
  CheckCircle,
  ChevronLeft,
  Send,
  PenTool,
  FileText,
  Eye,
  X,
  Heart,
  Share2,
  ExternalLink
} from 'lucide-react';

const SongDetailPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime] = useState(0); // setCurrentTime will be used when audio player is implemented
  const [activeTab, setActiveTab] = useState('overview');
  const [newMessage, setNewMessage] = useState('');
  const [showLyricsModal, setShowLyricsModal] = useState(false);

  // Sample song data
  const song = {
    id: 2,
    title: "Birthday Celebration",
    category: "Birthday Song",
    status: "review",
    progress: 90,
    deadline: "April 30, 2025",
    artist: "Maria Kim",
    artistAvatar: "MK",
    created: "April 5, 2025",
    description: "An upbeat, joyful birthday song for Sarah's 30th birthday celebration. The song should capture her vibrant personality and love for dancing.",
    specifications: {
      length: "2-3 minutes",
      tempo: "Upbeat",
      mood: "Celebratory, Fun, Energetic",
      vocals: "Female",
      instruments: ["Piano", "Guitar", "Drums", "Violin"]
    },
    timeline: [
      { date: "April 5, 2025", event: "Order Placed", completed: true },
      { date: "April 10, 2025", event: "Artist Assigned", completed: true },
      { date: "April 15, 2025", event: "Concept Approved", completed: true },
      { date: "April 20, 2025", event: "First Preview", completed: true },
      { date: "April 25, 2025", event: "Final Revisions", completed: true },
      { date: "April 28, 2025", event: "Final Preview", completed: true },
      { date: "April 30, 2025", event: "Delivery", completed: false }
    ],
    messages: [
      { id: 1, sender: "Maria Kim", senderRole: "Artist", time: "April 15, 2025", content: "Hi there! I'm Maria and I'll be creating your birthday song. I've reviewed your requirements and have some exciting ideas for the melody and lyrics. Is there any specific memory or inside joke you'd like to include?" },
      { id: 2, sender: "You", senderRole: "Client", time: "April 16, 2025", content: "Hi Maria! Thanks for taking on this project. Yes, Sarah loves to dance salsa and there's a funny story about her dancing at her sister's wedding where she accidentally knocked over the cake. But she saved the day by doing a dramatic spin! Maybe we could reference that?" },
      { id: 3, sender: "Maria Kim", senderRole: "Artist", time: "April 18, 2025", content: "That's perfect! A salsa-inspired rhythm with a reference to her dance moves and quick reflexes. I'll work on a first draft and share a preview with you soon." },
      { id: 4, sender: "Maria Kim", senderRole: "Artist", time: "April 20, 2025", content: "I've uploaded the first preview! It's a fun, upbeat track with Latin influences. Let me know what you think and if you'd like any changes." },
      { id: 5, sender: "You", senderRole: "Client", time: "April 21, 2025", content: "I love it! The melody is so catchy. Could we make the reference to the wedding incident a bit more subtle though? And maybe add some more percussion in the chorus?" },
      { id: 6, sender: "Maria Kim", senderRole: "Artist", time: "April 25, 2025", content: "Absolutely! I've made those changes and uploaded the revised version. I've made the lyrics more subtle and added more percussion to make the chorus really pop." },
      { id: 7, sender: "Maria Kim", senderRole: "Artist", time: "April 28, 2025", content: "The final preview is ready for your approval! I've made a few small tweaks to perfect the sound. Once you approve, I'll deliver the final high-quality files." }
    ],
    lyrics: `Happy Birthday dear Sarah,
Dancing queen of the night
Thirty years of laughter and joy
Lighting up every room so bright

You move with grace, you move with flair
Quick on your feet, beyond compare
Spinning through life with perfect style
Saving the moment with a smile

CHORUS:
It's your special day
Time to celebrate
Dance like nobody's watching
It's never too late

Another year, another chance
To live, to love, to laugh, to dance
Happy Birthday, Sarah dear
May this be your best year!`
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Not used in current implementation but will be used when audio player is added
  // const handleTimeUpdate = (e: { target: { currentTime: React.SetStateAction<number>; }; }) => {
  //   setCurrentTime(e.target.currentTime);
  // };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleMessageChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setNewMessage(e.target.value);
  };

  const sendMessage = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // This would typically send the message to the backend
      console.log("Sending message:", newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <a href="/dashboard" className="inline-flex items-center text-gray-300 hover:text-white mb-6">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Dashboard
        </a>
        
        {/* Song Header */}
        <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm mb-8">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-64 lg:w-80 flex-shrink-0 mb-6 md:mb-0 md:mr-8">
              <div className="aspect-square bg-gradient-to-tr from-purple-500/30 to-pink-500/30 rounded-xl flex flex-col items-center justify-center p-6 relative">
                <Music className="w-20 h-20 text-pink-400 mb-4" />
                <h2 className="text-xl font-bold text-center mb-2">{song.title}</h2>
                <p className="text-gray-300 text-center mb-4">{song.category}</p>
                
                <button
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center hover:opacity-90 transition"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </button>
                
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="w-full bg-gray-700 rounded-full h-1 mb-1">
                    <div className="bg-pink-500 h-1 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>2:45</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs bg-pink-500 bg-opacity-20 flex items-center`}>
                      <span className="w-2 h-2 rounded-full bg-pink-500 mr-2"></span>
                      Ready for Review
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span>{song.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full" 
                      style={{ width: `${song.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-700 bg-opacity-50 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium">Delivery By</p>
                      <p className="text-xs text-gray-400">{song.deadline}</p>
                    </div>
                  </div>
                  <div className="h-10 w-px bg-gray-600"></div>
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium">Artist</p>
                      <p className="text-xs text-gray-400">{song.artist}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <button className="flex-1 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg text-sm font-medium transition flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </button>
                  <button className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition flex items-center justify-center">
                    <PenTool className="w-4 h-4 mr-2" />
                    Request Changes
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex border-b border-gray-700 mb-6">
                <button 
                  className={`pb-3 px-4 font-medium ${activeTab === 'overview' ? 'text-pink-400 border-b-2 border-pink-400' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button 
                  className={`pb-3 px-4 font-medium ${activeTab === 'messages' ? 'text-pink-400 border-b-2 border-pink-400' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setActiveTab('messages')}
                >
                  Messages
                </button>
                <button 
                  className={`pb-3 px-4 font-medium ${activeTab === 'files' ? 'text-pink-400 border-b-2 border-pink-400' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setActiveTab('files')}
                >
                  Files
                </button>
              </div>
              
              {/* Overview Tab */}
              {activeTab === 'overview' && (
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
                  
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-medium">Lyrics</h3>
                      <button 
                        onClick={() => setShowLyricsModal(true)}
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
              )}
              
              {/* Messages Tab */}
              {activeTab === 'messages' && (
                <div className="flex flex-col h-[600px]">
                  <div className="flex-1 overflow-y-auto pr-2 mb-4">
                    <div className="space-y-4">
                      {song.messages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex ${message.sender === "You" ? 'justify-end' : ''}`}
                        >
                          {message.sender !== "You" && (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center mr-3 flex-shrink-0">
                              {message.sender.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}
                          
                          <div className={`max-w-[75%] ${message.sender === "You" ? 'bg-pink-600 bg-opacity-50' : 'bg-gray-700 bg-opacity-50'} rounded-xl p-4`}>
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-medium">{message.sender}</span>
                              <span className="text-xs text-gray-400 ml-2">{message.time}</span>
                            </div>
                            <p className="text-gray-200">{message.content}</p>
                          </div>
                          
                          {message.sender === "You" && (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center ml-3 flex-shrink-0">
                              You
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <form onSubmit={sendMessage} className="flex items-center mt-auto">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={handleMessageChange}
                      placeholder="Type your message..."
                      className="flex-1 p-3 bg-gray-700 bg-opacity-50 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                    <button 
                      type="submit" 
                      className="p-3 bg-pink-500 hover:bg-pink-600 rounded-r-lg transition"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              )}
              
              {/* Files Tab */}
              {activeTab === 'files' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Preview Files</h3>
                    <div className="space-y-3">
                      <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-pink-500 bg-opacity-30 flex items-center justify-center mr-3">
                            <Music className="w-5 h-5 text-pink-400" />
                          </div>
                          <div>
                            <p className="font-medium">FirstPreview.mp3</p>
                            <p className="text-xs text-gray-400">April 20, 2025 • 3.2 MB</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <button className="p-2 text-gray-400 hover:text-white">
                            <Play className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-white">
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-pink-500 bg-opacity-30 flex items-center justify-center mr-3">
                            <Music className="w-5 h-5 text-pink-400" />
                          </div>
                          <div>
                            <p className="font-medium">RevisedVersion.mp3</p>
                            <p className="text-xs text-gray-400">April 25, 2025 • 3.4 MB</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <button className="p-2 text-gray-400 hover:text-white">
                            <Play className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-white">
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-pink-500 bg-opacity-30 flex items-center justify-center mr-3">
                            <Music className="w-5 h-5 text-pink-400" />
                          </div>
                          <div>
                            <p className="font-medium">FinalPreview.mp3</p>
                            <p className="text-xs text-gray-400">April 28, 2025 • 3.5 MB</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <button className="p-2 text-gray-400 hover:text-white">
                            <Play className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-white">
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Lyrics & Documentation</h3>
                    <div className="space-y-3">
                      <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-blue-500 bg-opacity-30 flex items-center justify-center mr-3">
                            <FileText className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium">Birthday_Song_Lyrics.pdf</p>
                            <p className="text-xs text-gray-400">April 25, 2025 • 156 KB</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <button className="p-2 text-gray-400 hover:text-white">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-white">
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-green-500 bg-opacity-30 flex items-center justify-center mr-3">
                            <FileText className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <p className="font-medium">Usage_License.pdf</p>
                            <p className="text-xs text-gray-400">April 28, 2025 • 245 KB</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <button className="p-2 text-gray-400 hover:text-white">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-white">
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex space-x-4 mb-4 sm:mb-0">
            <button className="flex items-center text-gray-300 hover:text-white">
              <Heart className="w-5 h-5 mr-2" />
              <span>Favorite</span>
            </button>
            <button className="flex items-center text-gray-300 hover:text-white">
              <Share2 className="w-5 h-5 mr-2" />
              <span>Share</span>
            </button>
            <a href="#" className="flex items-center text-gray-300 hover:text-white">
              <ExternalLink className="w-5 h-5 mr-2" />
              <span>View All Songs</span>
            </a>
          </div>
          
          <div>
            <button className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-medium transition">
              <Download className="w-5 h-5 mr-2 inline-block" />
              Download Files
            </button>
          </div>
        </div>
      </div>
      
      {/* Lyrics Modal */}
      {showLyricsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Full Lyrics: {song.title}</h3>
              <button 
                onClick={() => setShowLyricsModal(false)}
                className="p-1 rounded-full hover:bg-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="bg-gray-700 bg-opacity-50 p-6 rounded-lg">
              <p className="text-gray-200 whitespace-pre-line">
                {song.lyrics}
              </p>
            </div>
            <div className="mt-6 flex justify-between">
              <button 
                onClick={() => setShowLyricsModal(false)} 
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Download Lyrics
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SongDetailPage;