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
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-green-50">
      <div className="z-10 w-full max-w-md items-center justify-between font-mono text-sm">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-green-100">
          <h1 className="text-2xl font-bold text-green-800 mb-2">KrishiChain AI</h1>
          <p className="text-gray-600 mb-6">Smart Logistics Request</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Crop Type</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-green-500 focus:ring-green-500"
                placeholder="e.g., Tomatoes"
                value={formData.cropType}
                onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity (kg)</label>
              <input
                type="number"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-green-500 focus:ring-green-500"
                placeholder="e.g., 500"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Village / Location</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-green-500 focus:ring-green-500"
                placeholder="e.g., Nashik, Maharashtra"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Request Pickup
            </button>
          </form>

          {status && (
            <div className={`mt-4 p-3 rounded-md text-sm ${status.includes('Success') ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
              {status}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
