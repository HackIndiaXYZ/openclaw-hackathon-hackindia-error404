'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, Star, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useNexus } from '../../../hooks/useNexus';

export default function SwapOutboxPage() {
  const { swaps, fetchSwaps } = useNexus();

  useEffect(() => {
    fetchSwaps(); // Fetch all for outbox, we can filter locally
  }, [fetchSwaps]);

  // Filter for swaps WHERE I AM THE REQUESTER
  // Note: In a real app, this filtering would happen on the backend or via a 'role' param
  const sentSwaps = swaps; 

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'accepted': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
      case 'completed': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'canceled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-slate-500 bg-white/5 border-white/10';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-8 space-y-8 max-w-5xl mx-auto"
    >
      <header className="mb-12">
        <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Swap Outbox</h1>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Active Proposals & Sent Requests</p>
      </header>

      <div className="space-y-6">
        {sentSwaps.length === 0 ? (
          <div className="glass-card p-20 border-white/5 bg-slate-900/20 flex flex-col items-center justify-center text-center opacity-50">
             <Zap size={48} className="text-slate-700 mb-4" />
             <p className="text-slate-500 font-black uppercase tracking-widest italic text-sm">No Sent Proposals</p>
             <p className="text-slate-600 text-xs mt-2 italic">Your sent requests will appear here once you propose a swap in the Explorer.</p>
          </div>
        ) : (
          sentSwaps.map((swap: any) => (
            <motion.div 
              key={swap._id}
              layout
              className="glass-card p-6 border-white/5 bg-slate-900/40 hover:bg-slate-900/60 transition-all group shadow-2xl overflow-hidden relative"
            >
              <div className="flex justify-between items-center relative z-10">
                <div className="flex gap-6 items-center">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${getStatusColor(swap.status)} shadow-lg`}>
                    {swap.status === 'completed' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase italic tracking-tight">Requesting: {swap.skill}</h3>
                    <div className="flex items-center gap-4 mt-1">
                       <span className="text-slate-400 text-xs font-medium italic">Recipient: <span className="text-indigo-400 font-bold">@{swap.providerUid}</span></span>
                       <span className="text-[8px] font-black uppercase text-slate-600 tracking-widest">{swap.providerCampus}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                   <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${getStatusColor(swap.status)}`}>
                     {swap.status}
                   </span>
                   <div className="flex items-center gap-1.5 text-amber-500/80 text-[10px] font-black uppercase tracking-widest">
                     <Star size={10} className="fill-current" /> {swap.karmaStaked} Staked
                   </div>
                </div>
              </div>

              {swap.status === 'pending' && (
                <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-3 text-[10px] text-slate-500 font-bold italic uppercase tracking-widest">
                  <ShieldCheck size={14} className="text-indigo-500" /> 
                  Funds are secured in Karma Escrow. Waiting for peer acceptance.
                </div>
              )}

              {/* Decorative Background Icon */}
              <div className="absolute top-1/2 right-[-20px] -translate-y-1/2 opacity-[0.03] scale-150 pointer-events-none group-hover:rotate-12 transition-transform duration-700">
                <Zap size={150} className="text-white" />
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
