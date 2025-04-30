// src/components/order/lyrics-references-step.tsx
'use client';

import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { OrderFormData } from '@/lib/types';

type LyricsAndReferencesStepProps = {
  orderData: OrderFormData;
  setOrderData: React.Dispatch<React.SetStateAction<OrderFormData>>;
};

export default function LyricsAndReferencesStep({ orderData, setOrderData }: LyricsAndReferencesStepProps) {
  const [fileNames, setFileNames] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (type === 'checkbox') {
      setOrderData({
        ...orderData,
        [name]: checked
      });
    } else {
      setOrderData({
        ...orderData,
        [name]: value
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileList = e.target.files;
      const fileArray = Array.from(fileList);
      
      // Update file names for display
      setFileNames(fileArray.map(file => file.name));
      
      // Update form data
      setOrderData({
        ...orderData,
        files: fileArray
      });
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium mb-4">Lyrics & References</h3>
      
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="lyrics"
          name="lyrics"
          checked={orderData.lyrics}
          onChange={handleChange}
          className="w-5 h-5 text-pink-500 rounded focus:ring-pink-400"
        />
        <label htmlFor="lyrics" className="ml-2 font-medium">
          Include Lyrics/Vocals
        </label>
      </div>
      
      {orderData.lyrics && (
        <div>
          <label className="block mb-2 font-medium" htmlFor="vocalGender">
            Vocal Preference
          </label>
          <select
            id="vocalGender"
            name="vocalGender"
            value={orderData.vocalGender}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-white"
          >
            <option value="">No preference</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="duet">Duet</option>
          </select>
        </div>
      )}
      
      <div>
        <label className="block mb-2 font-medium" htmlFor="references">
          Reference Songs (optional)
        </label>
        <input
          type="text"
          id="references"
          name="references"
          placeholder="List songs that have a similar style/vibe to what you want"
          value={orderData.references}
          onChange={handleChange}
          className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-white"
        />
      </div>
      
      <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
        <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-300 mb-2">Upload reference files (optional)</p>
        <p className="text-xs text-gray-400 mb-4">
          MP3, WAV, PDF, or DOC files. Max 10MB each.
        </p>
        
        <input
          type="file"
          id="fileUpload"
          multiple
          onChange={handleFileChange}
          className="hidden"
          accept=".mp3,.wav,.pdf,.doc,.docx"
        />
        
        <label
          htmlFor="fileUpload"
          className="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg font-medium transition text-sm inline-block cursor-pointer"
        >
          Browse Files
        </label>
        
        {fileNames.length > 0 && (
          <div className="mt-4 text-left">
            <p className="text-sm font-medium mb-2">Selected files:</p>
            <ul className="space-y-1">
              {fileNames.map((name, index) => (
                <li key={index} className="text-sm text-gray-300">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}