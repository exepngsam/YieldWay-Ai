'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Truck, MapPin, TrendingUp, AlertTriangle, CloudRain, ShieldCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

const mockPriceData = [
  { name: 'Mon', price: 40 },
  { name: 'Tue', price: 42 },
  { name: 'Wed', price: 38 },
  { name: 'Thu', price: 45 },
  { name: 'Fri', price: 48 },
  { name: 'Sat', price: 52 },
  { name: 'Sun', price: 55 },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate AI processing delay
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-8 font-sans overflow-x-hidden relative">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/20 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto z-10 relative">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">YieldWay-Ai Intelligence</h1>
            <p className="text-gray-400 text-sm mt-1">Live routing and predictive market analytics</p>
          </div>
          <Link href="/">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors backdrop-blur-md text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Request
            </motion.button>
          </Link>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-cyan-400 font-medium animate-pulse">Amazon Bedrock is calculating optimal routes...</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left Column: Active Logistics */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Routing Card */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Truck className="w-32 h-32" />
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-lg font-bold text-white">AI-Optimized Route</h2>
                </div>
                
                <div className="bg-black/40 rounded-xl p-4 border border-white/5 mb-4 relative z-10">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Origin</p>
                      <p className="font-semibold text-white flex items-center gap-1 mt-1"><MapPin className="w-4 h-4 text-cyan-400"/> Nashik, MH</p>
                    </div>
                    <div className="flex-1 px-4">
                      <div className="h-0.5 w-full bg-gradient-to-r from-cyan-500/50 to-indigo-500/50 relative">
                        <motion.div 
                          initial={{ left: "0%" }}
                          animate={{ left: "100%" }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          className="absolute top-[-3px] w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Destination</p>
                      <p className="font-semibold text-white flex items-center gap-1 mt-1 justify-end">Navi Mumbai <MapPin className="w-4 h-4 text-indigo-400"/></p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 relative z-10">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <p className="text-xs text-gray-400">Est. Time</p>
                    <p className="text-lg font-bold text-white mt-1">3h 45m</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <p className="text-xs text-gray-400">Distance</p>
                    <p className="text-lg font-bold text-white mt-1">165 km</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <p className="text-xs text-gray-400">Fuel Saved</p>
                    <p className="text-lg font-bold text-emerald-400 mt-1">~12%</p>
                  </div>
                </div>
              </div>

              {/* Chart Card */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-3xl shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-lg font-bold text-white">Mandi Price Forecast (Tomatoes)</h2>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold bg-indigo-500/20 text-indigo-300 rounded-lg border border-indigo-500/30">
                    Confidence: 94%
                  </span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockPriceData}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="price" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Right Column: AI Insights */}
            <div className="space-y-6">
              <div className="backdrop-blur-xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 p-6 rounded-3xl shadow-xl">
                <h2 className="text-lg font-bold text-white mb-4">Bedrock Intelligence</h2>
                
                <div className="space-y-4">
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-red-200">Traffic Anomaly Detected</p>
                      <p className="text-xs text-red-300/80 mt-1">Accident reported on NH-3. AI has automatically rerouted via State Highway 15 to preserve perishable goods.</p>
                    </div>
                  </div>

                  <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-xl flex items-start gap-3">
                    <CloudRain className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-cyan-200">Weather Forecast</p>
                      <p className="text-xs text-cyan-300/80 mt-1">Light showers expected near destination around 16:00. Recommend covering cargo securely.</p>
                    </div>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-emerald-200">Optimal Selling Window</p>
                      <p className="text-xs text-emerald-300/80 mt-1">Prices at Vashi APMC are projected to peak on Friday morning. Recommended dispatch: Thursday 20:00.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-xs text-gray-500 text-center uppercase tracking-widest font-semibold">Model: Claude 3.5 Sonnet</p>
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </div>
    </main>
  );
}
