'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Zap, ShieldCheck, ArrowRight, Star, AlertCircle } from 'lucide-react';
import { useKarma } from '../../../../hooks/useKarma';

function SwapRequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { balance } = useKarma();
  
  const targetUid = searchParams.get('uid') || '';
  const initialSkill = searchParams.get('skill') || '';
  const targetCampus = searchParams.get('campus') || '';

  const [form, setForm] = useState({
    skill: initialSkill,
    offer: '',
    karmaStaked: 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (form.karmaStaked > balance) {
      setError(`Insufficient Karma. You have ${balance}, but tried to stake ${form.karmaStaked}.`);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/v1/swaps/propose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerUid: targetUid,
          skill: form.skill,
          offer: form.offer,
          karmaStaked: form.karmaStaked,
          isCrossCampus: targetCampus !== 'IIT_JAMMU',
          providerCampus: targetCampus,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      router.push('/dashboard?swap_requested=true');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 glass-card p-10 bg-slate-900/40 border-white/5 shadow-2xl">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm font-bold italic">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Target Peer</label>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-white font-bold text-sm">
              @{targetUid || 'Unknown User'}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Campus Node</label>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-indigo-400 font-bold text-sm flex items-center gap-2">
              <ShieldCheck size={16} /> {targetCampus || 'Local'}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Skill Requested (from them)</label>
        <input 
          type="text"
          required
          className="w-full p-4 bg-slate-950/50 border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500 transition-all font-bold italic"
          value={form.skill}
          onChange={(e) => setForm({ ...form, skill: e.target.value })}
        />
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Skill Offered (from you)</label>
        <input 
          type="text"
          required
          placeholder="Ex: React Optimization"
          className="w-full p-4 bg-slate-950/50 border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500 transition-all font-bold italic text-sm"
          value={form.offer}
          onChange={(e) => setForm({ ...form, offer: e.target.value })}
        />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Karma Stake</label>
          <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Available: {balance}</span>
        </div>
        <div className="relative">
          <Star className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" size={18} />
          <input 
            type="number"
            min="10"
            required
            className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500 transition-all font-black text-xl tracking-widest"
            value={form.karmaStaked}
            onChange={(e) => setForm({ ...form, karmaStaked: parseInt(e.target.value) })}
          />
        </div>
        <p className="text-[9px] text-slate-500 italic font-bold uppercase tracking-widest">
          * Min 10 Karma. Amount is locked in Escrow until completion or rejection.
        </p>
      </div>

      <button 
        type="submit"
        disabled={loading}
        className="w-full btn-primary py-5 font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
      >
        {loading ? 'Transmitting...' : (
          <>Send Nexus Request <ArrowRight size={18} /></>
        )}
      </button>
    </form>
  );
}

export default function SwapRequestPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 max-w-2xl mx-auto min-h-screen"
    >
      <header className="mb-12">
        <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Propose Skill Swap</h1>
        <p className="text-slate-500 mt-2 font-bold uppercase text-xs tracking-widest">
          Initiating Federated Knowledge Exchange via Nexus
        </p>
      </header>

      <Suspense fallback={<div className="glass-card p-10 text-center text-slate-500 animate-pulse">Initializing Nexus Handshake...</div>}>
        <SwapRequestForm />
      </Suspense>

      <div className="mt-8 flex justify-center">
        <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-full border border-white/10 shadow-inner">
           <Zap size={14} className="text-indigo-400" />
           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Compliance: Nexus FIPH v2.0-secure</span>
        </div>
      </div>
    </motion.div>
  );
}
