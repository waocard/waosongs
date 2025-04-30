// src/components/order/music-preferences-step.tsx
import React from 'react';
import { OrderFormData } from '@/lib/types';

type MusicPreferencesStepProps = {
  orderData: OrderFormData;
  setOrderData: React.Dispatch<React.SetStateAction<OrderFormData>>;
};

export default function MusicPreferencesStep({ orderData, setOrderData }: MusicPreferencesStepProps) {
  const instruments = [
    'Piano', 'Guitar', 'Violin', 'Drums', 'Bass', 
    'Saxophone', 'Trumpet', 'Flute', 'Cello', 'Electronic'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderData({
      ...orderData,
      [name]: value
    });
  };

  const handleInstrumentChange = (instrument: string) => {
    const updatedInstruments = [...orderData.instruments];
    if (updatedInstruments.includes(instrument)) {
      const index = updatedInstruments.indexOf(instrument);
      updatedInstruments.splice(index, 1);
    } else {
      updatedInstruments.push(instrument);
    }
    setOrderData({
      ...orderData,
      instruments: updatedInstruments
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium mb-4">Musical Preferences</h3>
      
      <div>
        <label className="block mb-2 font-medium" htmlFor="tempo">
          Tempo
        </label>
        <select
          id="tempo"
          name="tempo"
          value={orderData.tempo}
          onChange={handleChange}
          className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-white"
        >
          <option value="slow">Slow</option>
          <option value="moderate">Moderate</option>
          <option value="fast">Fast</option>
          <option value="upbeat">Upbeat</option>
        </select>
      </div>
      
      <div>
        <label className="block mb-2 font-medium" htmlFor="mood">
          Mood
        </label>
        <input
          type="text"
          id="mood"
          name="mood"
          placeholder="e.g., romantic, celebratory, nostalgic"
          value={orderData.mood}
          onChange={handleChange}
          className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-white"
        />
      </div>
      
      <div>
        <label className="block mb-2 font-medium" htmlFor="musicalStyle">
          Musical Style
        </label>
        <input
          type="text"
          id="musicalStyle"
          name="musicalStyle"
          placeholder="e.g., pop, classical, jazz, folk"
          value={orderData.musicalStyle}
          onChange={handleChange}
          className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-white"
        />
      </div>
      
      <div>
        <label className="block mb-2 font-medium">
          Preferred Instruments (select multiple)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {instruments.map(instrument => (
            <div key={instrument} className="flex items-center">
              <input
                type="checkbox"
                id={instrument}
                checked={orderData.instruments.includes(instrument)}
                onChange={() => handleInstrumentChange(instrument)}
                className="w-4 h-4 text-pink-500 rounded focus:ring-pink-400"
              />
              <label htmlFor={instrument} className="ml-2 text-sm">
                {instrument}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}