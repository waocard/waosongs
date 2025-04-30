// src/components/order/basic-info-step.tsx
import { OrderFormData } from '@/lib/types';

type BasicInfoStepProps = {
  orderData: OrderFormData;
  setOrderData: React.Dispatch<React.SetStateAction<OrderFormData>>;
};

export default function BasicInfoStep({ orderData, setOrderData }: BasicInfoStepProps) {
  const categories = [
    { id: 'love', name: 'Love Song' },
    { id: 'birthday', name: 'Birthday Song' },
    { id: 'wedding', name: 'Wedding Music' },
    { id: 'anniversary', name: 'Anniversary Song' },
    { id: 'celebration', name: 'Celebration' },
    { id: 'business', name: 'Business Jingle' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium mb-4">Basic Information</h3>
      
      <div>
        <label className="block mb-2 font-medium">Select Category</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map(category => (
            <div key={category.id}>
              <input
                type="radio"
                id={category.id}
                name="category"
                value={category.id}
                checked={orderData.category === category.id}
                onChange={handleChange}
                className="sr-only"
              />
              <label
                htmlFor={category.id}
                className={`block p-3 text-center rounded-lg cursor-pointer transition ${
                  orderData.category === category.id
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block mb-2 font-medium" htmlFor="occasion">
          Describe Your Occasion
        </label>
        <input
          type="text"
          id="occasion"
          name="occasion"
          placeholder="e.g., 5th anniversary, product launch"
          value={orderData.occasion}
          onChange={handleChange}
          className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-white"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-medium" htmlFor="songLength">
            Song Length (minutes)
          </label>
          <select
            id="songLength"
            name="songLength"
            value={orderData.songLength}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-white"
          >
            <option value="1-2">1-2 minutes</option>
            <option value="2-3">2-3 minutes</option>
            <option value="3-4">3-4 minutes</option>
            <option value="4+">4+ minutes</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-2 font-medium" htmlFor="deadline">
            When Do You Need It?
          </label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={orderData.deadline}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-white"
          />
        </div>
      </div>
    </div>
  );
}