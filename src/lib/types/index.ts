// src/lib/types/index.ts
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface Song {
  id: number;
  title: string;
  category: string;
  status: 'in-progress' | 'review' | 'completed';
  progress: number;
  deadline: string;
  artist: string;
  artistAvatar?: string;
  created: string;
  description: string;
  preview: boolean;
  messagesCount: number;
  specifications: {
    length: string;
    tempo: string;
    mood: string;
    vocals: string;
    instruments: string[];
  };
  timeline: Array<{
    date: string;
    event: string;
    completed: boolean;
  }>;
  messages: Array<{
    id: number;
    sender: string;
    senderRole: string;
    time: string;
    content: string;
  }>;
  lyrics?: string;
  files?: Array<{
    id: number;
    name: string;
    type: string;
    size: string;
    date: string;
    url: string;
  }>;
}

export interface OrderFormData {
  category: string;
  occasion: string;
  songLength: string;
  deadline: string;
  tempo: string;
  mood: string;
  references: string;
  lyrics: boolean;
  vocalGender: string;
  musicalStyle: string;
  instruments: string[];
  specificDetails: string;
  files: File[] | []; // Explicitly allow empty array for TypeScript
  hasFiles?: boolean; // Optional flag for local storage
}

export interface Order extends Omit<OrderFormData, 'files'> {
  id: number;
  status: string;
  paymentStatus?: 'paid' | 'pending' | 'failed' | 'unpaid' | 'refunded';
  totalPrice: number;
  createdAt: string;
  userId?: number;
  songId?: number;
}

export interface OrderWithSong extends Order {
  song?: {
    id: number;
    title?: string;
    progress?: number;
  };
}