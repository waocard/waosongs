'use client';

import React from 'react';
import { Info } from 'lucide-react';

/**
 * A component that provides a hint about admin login credentials for development
 */
const AdminLoginHint = () => {
  const fillAdminCredentials = () => {
    // Find the email and password inputs
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    
    if (emailInput && passwordInput) {
      emailInput.value = 'admin@waosongs.com';
      passwordInput.value = 'admin123';
      
      // Trigger change events to update React state
      // Create native events so it properly triggers React's onChange
      const emailEvent = new Event('input', { bubbles: true });
      const passwordEvent = new Event('input', { bubbles: true });
      
      emailInput.dispatchEvent(emailEvent);
      passwordInput.dispatchEvent(passwordEvent);
      
      // Also create a change event to be extra safe
      const emailChangeEvent = new Event('change', { bubbles: true });
      const passwordChangeEvent = new Event('change', { bubbles: true });
      
      emailInput.dispatchEvent(emailChangeEvent);
      passwordInput.dispatchEvent(passwordChangeEvent);
    }
  };

  return (
    <div className="mt-4 text-center">
      <button
        onClick={fillAdminCredentials}
        className="text-xs text-gray-400 hover:text-pink-400 flex items-center justify-center mx-auto"
        type="button"
      >
        <Info className="w-3 h-3 mr-1" />
        <span>Use admin credentials for testing</span>
      </button>
    </div>
  );
};

export default AdminLoginHint;