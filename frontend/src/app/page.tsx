'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ThreeDScene from '@/components/ThreeDScene';

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
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 overflow-hidden bg-gray-900">
      {/* 3D Background */}
      <ThreeDScene />

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 w-full max-w-md items-center justify-between font-sans text-sm"
      >
        <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl shadow-2xl border border-white/20">
          <div className="mb-8 text-center">
            <motion.h1 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 tracking-tight mb-2"
            >
              YieldWay-Ai
            </motion.h1>
            <p className="text-gray-300 font-medium tracking-wide">Smart Logistics Engine</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-1">Crop Type</label>
              <select
                required
                className="mt-1 block w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white shadow-inner focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors backdrop-blur-md"
                value={formData.cropType}
                onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
              >
                <option value="" disabled className="text-gray-500">Select a crop...</option>
                <option value="Tomatoes" className="text-black">Tomatoes</option>
                <option value="Onions" className="text-black">Onions</option>
                <option value="Potatoes" className="text-black">Potatoes</option>
                <option value="Wheat" className="text-black">Wheat</option>
                <option value="Rice" className="text-black">Rice</option>
                <option value="Sugarcane" className="text-black">Sugarcane</option>
                <option value="Cotton" className="text-black">Cotton</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-1">Quantity (kg)</label>
              <input
                type="number"
                required
                className="mt-1 block w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-gray-500 shadow-inner focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors backdrop-blur-md"
                placeholder="e.g., 500"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-1">Village / Location</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-gray-500 shadow-inner focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors backdrop-blur-md"
                placeholder="e.g., Nashik, Maharashtra"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.5)] text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-900 transition-all"
            >
              Request AI Routing
            </motion.button>
          </form>

          {status && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`mt-6 p-4 rounded-xl text-sm font-medium border backdrop-blur-md ${status.includes('Success') ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}`}
            >
              {status}
            </motion.div>
          )}
        </div>
      </motion.div>
    </main>
  );
}

