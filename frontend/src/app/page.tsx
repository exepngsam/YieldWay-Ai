'use client';

import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    farmerId: 'FARMER-' + Math.floor(Math.random() * 10000),
    cropType: '',
    quantity: '',
    location: '',
  });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Submitting...');
    try {
      const API_URL = '/api/requests';
      
      console.log('Payload:', formData);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('API Request Failed');
      
      setStatus('Success! Request queued. AI is calculating optimal route & selling window.');
      setFormData({ ...formData, cropType: '', quantity: '', location: '' });
    } catch (error) {
      console.error(error);
      setStatus('Failed to submit request.');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-gray-50">
      <div className="z-10 w-full max-w-md items-center justify-between font-sans text-sm">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">YieldWay-Ai</h1>
            <p className="text-gray-500 font-medium">Smart Logistics Request</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Crop Type</label>
              <select
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={formData.cropType}
                onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
              >
                <option value="" disabled>Select a crop...</option>
                <option value="Tomatoes">Tomatoes</option>
                <option value="Onions">Onions</option>
                <option value="Potatoes">Potatoes</option>
                <option value="Wheat">Wheat</option>
                <option value="Rice">Rice</option>
                <option value="Sugarcane">Sugarcane</option>
                <option value="Cotton">Cotton</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Quantity (kg)</label>
              <input
                type="number"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g., 500"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Village / Location</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g., Nashik, Maharashtra"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Request Pickup
            </button>
          </form>

          {status && (
            <div className={`mt-6 p-4 rounded-lg text-sm font-medium border ${status.includes('Success') ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
              {status}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

