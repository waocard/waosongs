// src/components/dashboard/messaging-tab.tsx
'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

interface Message {
  id: number;
  sender: string;
  senderRole: string;
  time: string;
  content: string;
}

interface MessagingTabProps {
  messages: Message[];
  onSendMessage?: (content: string) => Promise<void>;
}

export default function MessagingTab({ messages, onSendMessage }: MessagingTabProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || isSending) return;
    
    setIsSending(true);
    
    try {
      if (onSendMessage) {
        await onSendMessage(newMessage);
      }
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto pr-2 mb-4">
        <div className="space-y-4">
          {messages.map((message) => (
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
          
          {messages.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p>No messages yet. Start the conversation with the artist!</p>
            </div>
          )}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex items-center mt-auto">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-3 bg-gray-700 bg-opacity-50 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-white"
          disabled={isSending}
        />
        <button 
          type="submit" 
          className={`p-3 rounded-r-lg transition ${
            isSending ? 'bg-gray-600' : 'bg-pink-500 hover:bg-pink-600'
          }`}
          disabled={isSending}
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}