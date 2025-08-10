'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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

// Remove or comment out the separate PageProps type definition
// type PageProps = {
//   params: { id: string };
//   searchParams?: { [key: string]: string | string[] | undefined };
// };

// Define the props type directly in the component signature
const SongDetailPage = () => {
  const params = useParams();
  const songId = params.id as string; // Using params to get the song ID
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime] = useState(0); // Consider if this should be updated based on audio playback
  const [activeTab, setActiveTab] = useState('overview');
  const [newMessage, setNewMessage] = useState('');
  const [showLyricsModal, setShowLyricsModal] = useState(false);

  // In a real app, you would fetch song data using the songId
  console.log(`Workspaceing song with ID: ${songId}`);
  // Use useEffect hook for fetching data based on songId

  // Sample song data (replace with actual data fetching)
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
      // ... (messages remain the same)
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
    // Add actual audio play/pause logic here
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // This would typically send the message to the backend
      // and update the messages state
      console.log("Sending message:", newMessage);
      // Example: setMessages([...song.messages, { id: Date.now(), sender: 'You', ... }])
      setNewMessage('');
    }
  };

  // --- REST OF YOUR COMPONENT JSX ---
  // (No changes needed in the return statement)
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white">
      {/* ... rest of your JSX */}
        <div className="container mx-auto px-4 py-8">
          {/* Back Navigation */}
          <Link href="/dashboard" className="inline-flex items-center text-gray-300 hover:text-white mb-6">
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Dashboard
          </Link>
          
          {/* Song Header */}
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm mb-8">
            <div className="flex flex-col md:flex-row">
              {/* Left Column (Player, Status, Actions) */}
              <div className="w-full md:w-64 lg:w-80 flex-shrink-0 mb-6 md:mb-0 md:mr-8">
                {/* Player Card */}
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
                  
                  {/* Progress Bar */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="w-full bg-gray-700 rounded-full h-1 mb-1">
                      {/* TODO: Link width to actual audio progress state */}
                      <div className="bg-pink-500 h-1 rounded-full" style={{ width: `${(currentTime / (2 * 60 + 45)) * 100}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                       {/* TODO: Link first span to actual audio currentTime state */}
                      <span>{formatTime(currentTime)}</span>
                      <span>2:45</span> {/* Assuming 2:45 is the total duration */}
                    </div>
                  </div>
                </div>
                
                {/* Status & Info Cards */}
                <div className="mt-6 space-y-4">
                  {/* Progress Card */}
                  <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      {/* TODO: Make status dynamic based on song.status */}
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
                  
                  {/* Deadline & Artist Card */}
                  <div className="flex items-center justify-between p-4 bg-gray-700 bg-opacity-50 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Delivery By</p>
                        <p className="text-xs text-gray-400">{song.deadline}</p>
                      </div>
                    </div>
                    <div className="h-10 w-px bg-gray-600 mx-3"></div> {/* Adjusted margin */}
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Artist</p>
                        <p className="text-xs text-gray-400">{song.artist}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
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
              
              {/* Right Column (Tabs) */}
              <div className="flex-1">
                {/* Tabs Navigation */}
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
                
                {/* Tab Content */}
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6 animate-fade-in"> {/* Added animation */}
                    {/* Description */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Description</h3>
                      <p className="text-gray-300 leading-relaxed">{song.description}</p> {/* Adjusted leading */}
                    </div>
                    
                    {/* Specifications */}
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
                      
                      {/* Instruments */}
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
                    
                    {/* Lyrics Preview */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-medium">Lyrics</h3>
                        <button 
                          onClick={() => setShowLyricsModal(true)}
                          className="text-pink-400 text-sm hover:text-pink-300 flex items-center transition"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Full Lyrics
                        </button>
                      </div>
                      <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg max-h-40 overflow-hidden relative group"> {/* Added max-h and overflow */}
                         <p className="text-gray-300 whitespace-pre-line line-clamp-6"> {/* line-clamp limits visible lines */}
                          {song.lyrics}
                        </p>
                         {/* Optional: Add a fade-out effect if content overflows */}
                         <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-800/80 via-gray-800/50 to-transparent pointer-events-none"></div>
                      </div>
                    </div>
                    
                    {/* Timeline */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Timeline</h3> {/* Adjusted margin */}
                      <div className="relative pl-4 before:absolute before:left-[-1px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-700"> {/* Simplified timeline line */}
                        <div className="space-y-6">
                          {song.timeline.map((event, index) => (
                            <div key={index} className="relative pl-8"> {/* Adjusted padding */}
                              {/* Timeline dot */}
                              <div className={`absolute left-[-8px] top-1 w-4 h-4 rounded-full flex items-center justify-center border-2 border-gray-800 ${event.completed ? 'bg-green-500' : 'bg-gray-600'}`}> {/* Adjusted size/position */}
                                {event.completed && <CheckCircle className="w-3 h-3 text-white" />} {/* Adjusted icon size */}
                              </div>
                              
                              {/* Event details */}
                              <div>
                                <p className="font-medium text-sm">{event.event}</p> {/* Adjusted text size */}
                                <p className="text-xs text-gray-400">{event.date}</p> {/* Adjusted text size */}
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
                  <div className="flex flex-col h-[600px] animate-fade-in"> {/* Added animation */}
                     {/* Message List */}
                    <div className="flex-1 overflow-y-auto pr-2 mb-4 space-y-4"> {/* Added space-y */}
                      {song.messages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex items-end ${message.sender === "You" ? 'justify-end' : 'justify-start'}`}
                        >
                          {/* Avatar for Artist */}
                          {message.sender !== "You" && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center mr-2 flex-shrink-0 text-xs font-bold">
                              {/* Generates initials like MK */}
                              {message.sender.split(' ').map(n => n[0]).join('')} 
                            </div>
                          )}
                          
                          {/* Message Bubble */}
                          <div className={`max-w-[75%] rounded-xl p-3 shadow-md ${message.sender === "You" ? 'bg-pink-600 bg-opacity-60 rounded-br-none' : 'bg-gray-700 bg-opacity-60 rounded-bl-none'}`}>
                             {/* Sender Info (optional for 'You') */}
                             {message.sender !== "You" && (
                               <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-sm">{message.sender}</span>
                                <span className="text-xs text-gray-400 ml-2">{message.time}</span>
                              </div>
                             )}
                            <p className="text-gray-200 text-sm leading-relaxed">{message.content}</p> {/* Adjusted text size/leading */}
                            {/* Timestamp for 'You' (optional, could be inside or outside) */}
                            {message.sender === "You" && (
                                <span className="text-xs text-gray-400 mt-1 block text-right">{message.time}</span>
                            )}
                          </div>

                          {/* Avatar for You (optional) */}
                          {/* If you want an avatar for "You" as well */}
                           {/* {message.sender === "You" && (
                             <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center ml-2 flex-shrink-0 text-xs font-bold">
                               You
                             </div>
                           )} */}
                        </div>
                      ))}
                    </div>
                    
                    {/* Message Input Form */}
                    <form onSubmit={sendMessage} className="flex items-center mt-auto border-t border-gray-700 pt-4">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={handleMessageChange}
                        placeholder="Type your message..."
                        className="flex-1 p-3 bg-gray-700 bg-opacity-50 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm" // Adjusted text size
                      />
                      <button 
                        type="submit" 
                        className="p-3 bg-pink-500 hover:bg-pink-600 rounded-r-lg transition disabled:opacity-50"
                        disabled={!newMessage.trim()} // Disable if input is empty
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </form>
                  </div>
                )}

                
                {/* Files Tab */}
                {activeTab === 'files' && (
                  <div className="space-y-6 animate-fade-in"> {/* Added animation */}
                    {/* Preview Files Section */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Preview Files</h3>
                      <div className="space-y-3">
                        {/* Example File Item (Repeat for others) */}
                        <div className="bg-gray-700 bg-opacity-50 p-3 rounded-lg flex items-center justify-between hover:bg-gray-700 transition"> {/* Adjusted padding */}
                          <div className="flex items-center overflow-hidden mr-2"> {/* Added overflow */}
                            <div className="w-10 h-10 rounded-lg bg-pink-500 bg-opacity-30 flex items-center justify-center mr-3 flex-shrink-0">
                              <Music className="w-5 h-5 text-pink-400" />
                            </div>
                            <div className="overflow-hidden whitespace-nowrap"> {/* Prevent text wrapping */}
                              <p className="font-medium text-sm truncate">FirstPreview.mp3</p> {/* Truncate long names */}
                              <p className="text-xs text-gray-400">April 20, 2025 • 3.2 MB</p>
                            </div>
                          </div>
                          <div className="flex items-center flex-shrink-0 space-x-1"> {/* Added space */}
                             {/* TODO: Add onClick handlers for Play/Download */}
                            <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-600 transition">
                              <Play className="w-4 h-4" /> {/* Adjusted size */}
                            </button>
                            <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-600 transition">
                              <Download className="w-4 h-4" /> {/* Adjusted size */}
                            </button>
                          </div>
                        </div>
                        {/* Repeat for RevisedVersion.mp3 and FinalPreview.mp3 */}
                         <div className="bg-gray-700 bg-opacity-50 p-3 rounded-lg flex items-center justify-between hover:bg-gray-700 transition"> {/* Adjusted padding */}
                          <div className="flex items-center overflow-hidden mr-2"> {/* Added overflow */}
                            <div className="w-10 h-10 rounded-lg bg-pink-500 bg-opacity-30 flex items-center justify-center mr-3 flex-shrink-0">
                              <Music className="w-5 h-5 text-pink-400" />
                            </div>
                            <div className="overflow-hidden whitespace-nowrap"> {/* Prevent text wrapping */}
                              <p className="font-medium text-sm truncate">RevisedVersion.mp3</p> {/* Truncate long names */}
                              <p className="text-xs text-gray-400">April 25, 2025 • 3.4 MB</p>
                            </div>
                          </div>
                          <div className="flex items-center flex-shrink-0 space-x-1"> {/* Added space */}
                            <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-600 transition">
                              <Play className="w-4 h-4" /> {/* Adjusted size */}
                            </button>
                            <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-600 transition">
                              <Download className="w-4 h-4" /> {/* Adjusted size */}
                            </button>
                          </div>
                        </div>
                         <div className="bg-gray-700 bg-opacity-50 p-3 rounded-lg flex items-center justify-between hover:bg-gray-700 transition"> {/* Adjusted padding */}
                          <div className="flex items-center overflow-hidden mr-2"> {/* Added overflow */}
                            <div className="w-10 h-10 rounded-lg bg-pink-500 bg-opacity-30 flex items-center justify-center mr-3 flex-shrink-0">
                              <Music className="w-5 h-5 text-pink-400" />
                            </div>
                            <div className="overflow-hidden whitespace-nowrap"> {/* Prevent text wrapping */}
                              <p className="font-medium text-sm truncate">FinalPreview.mp3</p> {/* Truncate long names */}
                              <p className="text-xs text-gray-400">April 28, 2025 • 3.5 MB</p>
                            </div>
                          </div>
                          <div className="flex items-center flex-shrink-0 space-x-1"> {/* Added space */}
                            <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-600 transition">
                              <Play className="w-4 h-4" /> {/* Adjusted size */}
                            </button>
                            <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-600 transition">
                              <Download className="w-4 h-4" /> {/* Adjusted size */}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Lyrics & Documentation Section */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Lyrics & Documentation</h3>
                      <div className="space-y-3">
                        {/* Example Document Item (Repeat for others) */}
                        <div className="bg-gray-700 bg-opacity-50 p-3 rounded-lg flex items-center justify-between hover:bg-gray-700 transition"> {/* Adjusted padding */}
                           <div className="flex items-center overflow-hidden mr-2"> {/* Added overflow */}
                             <div className="w-10 h-10 rounded-lg bg-blue-500 bg-opacity-30 flex items-center justify-center mr-3 flex-shrink-0">
                               <FileText className="w-5 h-5 text-blue-400" />
                             </div>
                             <div className="overflow-hidden whitespace-nowrap"> {/* Prevent text wrapping */}
                               <p className="font-medium text-sm truncate">Birthday_Song_Lyrics.pdf</p> {/* Truncate long names */}
                               <p className="text-xs text-gray-400">April 25, 2025 • 156 KB</p>
                             </div>
                           </div>
                           <div className="flex items-center flex-shrink-0 space-x-1"> {/* Added space */}
                              {/* TODO: Add onClick handlers for View/Download */}
                             <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-600 transition">
                               <Eye className="w-4 h-4" /> {/* Adjusted size */}
                             </button>
                             <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-600 transition">
                               <Download className="w-4 h-4" /> {/* Adjusted size */}
                             </button>
                           </div>
                         </div>
                         {/* Repeat for Usage_License.pdf */}
                          <div className="bg-gray-700 bg-opacity-50 p-3 rounded-lg flex items-center justify-between hover:bg-gray-700 transition"> {/* Adjusted padding */}
                           <div className="flex items-center overflow-hidden mr-2"> {/* Added overflow */}
                             <div className="w-10 h-10 rounded-lg bg-green-500 bg-opacity-30 flex items-center justify-center mr-3 flex-shrink-0">
                               <FileText className="w-5 h-5 text-green-400" />
                             </div>
                             <div className="overflow-hidden whitespace-nowrap"> {/* Prevent text wrapping */}
                               <p className="font-medium text-sm truncate">Usage_License.pdf</p> {/* Truncate long names */}
                               <p className="text-xs text-gray-400">April 28, 2025 • 245 KB</p>
                             </div>
                           </div>
                           <div className="flex items-center flex-shrink-0 space-x-1"> {/* Added space */}
                             <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-600 transition">
                               <Eye className="w-4 h-4" /> {/* Adjusted size */}
                             </button>
                             <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-600 transition">
                               <Download className="w-4 h-4" /> {/* Adjusted size */}
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
          
          {/* Bottom Actions */}
          <div className="flex flex-wrap justify-between items-center mt-8 border-t border-gray-700 pt-6"> {/* Added margin/padding/border */}
            <div className="flex flex-wrap gap-4 mb-4 sm:mb-0"> {/* Added gap for spacing */}
              {/* TODO: Add onClick handlers */}
              <button className="flex items-center text-gray-300 hover:text-white text-sm transition">
                <Heart className="w-4 h-4 mr-2" /> {/* Adjusted size */}
                <span>Favorite</span>
              </button>
              <button className="flex items-center text-gray-300 hover:text-white text-sm transition">
                <Share2 className="w-4 h-4 mr-2" /> {/* Adjusted size */}
                <span>Share</span>
              </button>
              {/* Link to all songs */}
              <Link href="/dashboard/songs" className="flex items-center text-gray-300 hover:text-white text-sm transition">
                <ExternalLink className="w-4 h-4 mr-2" /> {/* Adjusted size */}
                <span>View All Songs</span>
              </Link>
            </div>
            
            <div>
              {/* TODO: Add onClick handler */}
              <button className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-medium text-sm transition hover:opacity-90 flex items-center"> {/* Adjusted padding/text size */}
                <Download className="w-4 h-4 mr-2 inline-block" /> {/* Adjusted size */}
                Download Files
              </button>
            </div>
          </div>
        </div>
        
        {/* Lyrics Modal */}
        {showLyricsModal && (
           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 p-4 animate-fade-in"> {/* Added backdrop opacity/animation */}
            <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl"> {/* Added shadow/flex column */}
               {/* Modal Header */}
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700 flex-shrink-0"> {/* Added border */}
                <h3 className="text-xl font-bold">Full Lyrics: {song.title}</h3>
                <button 
                  onClick={() => setShowLyricsModal(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition"
                  aria-label="Close modal" // Accessibility
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              {/* Modal Body (Scrollable) */}
              <div className="overflow-y-auto flex-grow pr-2"> {/* Make body scrollable */}
                <div className="bg-gray-700 bg-opacity-50 p-6 rounded-lg">
                  <p className="text-gray-200 whitespace-pre-line leading-relaxed"> {/* Adjusted leading */}
                    {song.lyrics}
                  </p>
                </div>
              </div>
              {/* Modal Footer */}
              <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-700 flex-shrink-0"> {/* Added border */}
                <button 
                  onClick={() => setShowLyricsModal(false)} 
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm transition" // Adjusted colors/size
                >
                  Close
                </button>
                 {/* TODO: Add onClick handler for download */}
                <button className="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg flex items-center text-sm transition"> {/* Adjusted size */}
                  <Download className="w-4 h-4 mr-2" />
                  Download Lyrics
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Simple CSS for fade-in animation (add to global CSS or style tag) */}
        <style jsx global>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .animate-fade-in {
              animation: fadeIn 0.3s ease-out forwards;
            }
        `}</style>
    </div>
  );
};

export default SongDetailPage;