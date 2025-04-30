// src/lib/api/index.ts
import { OrderFormData } from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.waosongs.com';

// Function to handle API errors
function handleApiError(response: Response) {
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

// Get auth token from localStorage
function getAuthToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

// Get all songs for the current user
export async function getUserSongs() {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await fetch(`${API_BASE_URL}/songs`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  return handleApiError(response);
}

// Get a single song by ID
export async function getSongById(id: number) {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await fetch(`${API_BASE_URL}/songs/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  return handleApiError(response);
}

// Submit a new order
export async function submitOrder(orderData: OrderFormData) {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  // Create a FormData object to handle file uploads
  const formData = new FormData();
  
  // Add basic form data
  Object.entries(orderData).forEach(([key, value]) => {
    if (key !== 'files' && key !== 'instruments') {
      formData.append(key, String(value));
    }
  });
  
  // Add instruments as JSON string
  formData.append('instruments', JSON.stringify(orderData.instruments));
  
  // Add files
  if (orderData.files && orderData.files.length > 0) {
    Array.from(orderData.files).forEach((file, index) => {
      formData.append(`file${index}`, file);
    });
  }
  
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });
  
  return handleApiError(response);
}

// Send a message in a song thread
export async function sendMessage(songId: number, content: string) {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await fetch(`${API_BASE_URL}/songs/${songId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content })
  });
  
  return handleApiError(response);
}

// Approve a song
export async function approveSong(songId: number) {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await fetch(`${API_BASE_URL}/songs/${songId}/approve`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  return handleApiError(response);
}

// Request revisions for a song
export async function requestRevisions(songId: number, notes: string) {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await fetch(`${API_BASE_URL}/songs/${songId}/revisions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ notes })
  });
  
  return handleApiError(response);
}