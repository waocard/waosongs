// lib/utils/auth-temp.tsx
'use client';

import React, { ReactNode, createContext } from 'react';

// Create a simple context
const AuthContext = createContext(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Return the children wrapped in the context provider
  return (
    <AuthContext.Provider value={null}>
      {children}
    </AuthContext.Provider>
  );
}