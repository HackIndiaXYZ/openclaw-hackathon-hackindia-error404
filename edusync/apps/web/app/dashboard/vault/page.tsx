'use client';

import React, { useEffect, useState } from 'react';
import { 
  Compass, Search, Zap, Plus, FileText, Video, 
  Archive, ImageIcon, ShieldCheck, Star, Download, 
  ChevronRight, BookOpen, XCircle, RefreshCcw, AlertCircle, Filter, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useVault } from '../../../hooks/useVault';
import { useAuth } from '../../../hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { OffsetPagination } from '../../../components/shared/OffsetPagination';

export default function KnowledgeVaultPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { user: session } = useAuth();
  const { resources, totalResources, loading, fetchResources, resubmitAsset } = useVault();
  
  if (!mounted) return null;
  
  const [activeTab, setActiveTab] = useState<'explorer' | 'my-submissions'>('explorer');
  const [search, setSearch] = useState('');
  const [useAiSearch, setUseAiSearch] = useState(false);
  const [statusFilter, setStatusFilter] = useState('verified');
  const [offset, setOffset] = useState(0);
  const LIMIT = 30;
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  // Resubmit Modal State
  const [resubmitTarget, setResubmitTarget] = useState<any>(null);
  const [resubmitData, setResubmitData] = useState({ title: '', description: '', tags: '' });

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    setOffset(0);
    fetchResources({ 
        query: search, 
        nexusMode: useAiSearch, 
        verificationStatus: activeTab === 'explorer' ? 'verified' : statusFilter,
        offset: 0,
        limit: LIMIT
    });
  };

  useEffect(() => {
    fetchResources({ 
      query: search, 
      nexusMode: useAiSearch,
      verificationStatus: activeTab === 'explorer' ? 'verified' : statusFilter,
      offset,
      limit: LIMIT
    });
  }, [offset, activeTab, statusFilter, useAiSearch]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const { data } = await (await import('../../../lib/api-client')).default.get('/search/suggestions', {
          params: { query: search, type: 'resources' }
        });
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [search]);

  const projects = resources;

  if (loading && resources.length === 0) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-center bg-slate-950">
         <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin shadow-[0_0_20px_rgba(99,102,241,0.2)]" />
         <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest italic animate-pulse mt-4">Syncing Vault...</p>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText size={20} />;
      case 'Video': return <Video size={20} />;
      case 'Archive': return <Archive size={20} />;
      default: return <ImageIcon size={20} />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified': return <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded uppercase text-[8px] font-black italic">Certified</span>;
      case 'rejected': return <span className="px-2 py-0.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded uppercase text-[8px] font-black italic">Rejected</span>;
      case 'changes_requested': return <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded uppercase text-[8px] font-black italic">Changes Requested</span>;
      case 'under_review': return <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 rounded uppercase text-[8px] font-black italic animate-pulse">Reviewing...</span>;
      default: return <span className="px-2 py-0.5 bg-slate-500/10 text-slate-500 border border-slate-500/20 rounded uppercase text-[8px] font-black italic">Pending</span>;
    }
  };

  const startResubmit = (resource: any) => {
    setResubmitTarget(resource);
    setResubmitData({ title: resource.title, description: resource.description, tags: (resource.tags || []).join(', ') });
  };

  const handleResubmit = async () => {
    if (!resubmitTarget) return;
    try {
      await resubmitAsset(resubmitTarget._id, {
        ...resubmitData,
        tags: resubmitData.tags.split(',').map(t => t.trim()).filter(Boolean)
      });
      setResubmitTarget(null);
      fetchResources({ query: search, offset: 0, limit: LIMIT });
    } catch (e) { console.error(e); }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
             <Compass className="text-indigo-500" /> Knowledge Vault
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2 italic">Institutional Intelligence Marketplace</p>
          
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 mt-6 w-fit">
            <button onClick={() => { setActiveTab('explorer'); setOffset(0); }} className={`px-6 py-2 rounded-lg text-xs font-black uppercase italic transition-all ${activeTab === 'explorer' ? 'bg-indigo-500 text-white' : 'text-slate-500 hover:text-white'}`}>Nexus Explorer</button>
            <button onClick={() => { setActiveTab('my-submissions'); setOffset(0); }} className={`px-6 py-2 rounded-lg text-xs font-black uppercase italic transition-all ${activeTab === 'my-submissions' ? 'bg-indigo-500 text-white' : 'text-slate-500 hover:text-white'}`}>My Contributions</button>
          </div>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto self-end">
           <form onSubmit={handleSearch} className="relative flex-1 md:w-96 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  placeholder={useAiSearch ? "Describe what you want to learn..." : "Search resources..."}
                  className={`w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white text-sm outline-none transition-all ${useAiSearch ? 'ring-2 ring-indigo-500/20' : ''}`}
                  value={search}
                  onChange={e => { setSearch(e.target.value); setOffset(0); }}
                />
                <AnimatePresence>
                    {suggestions.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                        {suggestions.map((s, idx) => (
                        <button key={idx} onClick={() => { setSearch(s); setSuggestions([]); setOffset(0); }} className="w-full text-left px-4 py-3 hover:bg-indigo-600/20 text-xs font-black uppercase italic text-slate-300 transition-colors border-b border-white/5 last:border-0">{s}</button>
                        ))}
                    </motion.div>
                    )}
                </AnimatePresence>
              </div>
              <button type="button" onClick={() => setUseAiSearch(!useAiSearch)} className={`p-3 rounded-2xl border transition-all ${useAiSearch ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}><Zap size={18} /></button>
           </form>
           <Link href="/dashboard/vault/upload" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all shadow-xl flex items-center gap-2"><Plus size={16} /> Contribute</Link>
        </div>
      </header>

      {activeTab === 'my-submissions' && (
        <div className="flex gap-4">
            {['verified', 'pending', 'rejected'].map((s) => (
            <button key={s} onClick={() => { setStatusFilter(s); setOffset(0); }} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${statusFilter === s ? 'bg-white/10 border-indigo-500 text-white shadow-glow' : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'}`}>{s} Status</button>
            ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {projects.map((resource: any, i: number) => (
            <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} key={resource._id} className="glass-card group border-white/5 bg-slate-900/40 hover:bg-slate-900/60 transition-all flex flex-col h-full overflow-hidden">
              <div className="p-6 space-y-4 flex-1">
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-2xl bg-white/5 text-indigo-400 border border-white/10">{getIcon(resource.fileType)}</div>
                  <div className="flex flex-col items-end gap-2">{activeTab === 'my-submissions' ? getStatusBadge(resource.verification?.status) : resource.verification?.status === 'verified' && <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[8px] font-black uppercase text-emerald-500 italic shadow-glow"><ShieldCheck size={10} className="inline mr-1"/> Certified</span>}</div>
                </div>
                <div>
                   <h3 className="text-lg font-black text-white uppercase italic tracking-tight line-clamp-1 group-hover:text-indigo-400 transition-colors">{resource.title}</h3>
                   <div className="flex items-center gap-2 mt-1">
                      <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest italic flex items-center gap-1"><Clock size={10} /> {resource.createdAt ? formatDistanceToNow(new Date(resource.createdAt)) : 'Recently'} ago</p>
                      <span className="text-slate-700">•</span>
                      <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest italic">By {resource.ownerUid === session?.email ? 'You' : `@${resource.ownerUid?.slice(0, 6)}`}</p>
                   </div>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 italic font-medium">{resource.description}</p>
              </div>
              <div className="p-4 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-amber-500 text-[10px] font-black uppercase italic tracking-widest italic tabular-nums"><Star size={12} className="fill-current" /> {resource.karmaCost}</div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-black uppercase tracking-widest tabular-nums"><Download size={12} /> {resource.downloads}</div>
                </div>
                <Link href={`/dashboard/vault/${resource._id}`} className="px-4 py-2 bg-white/5 hover:bg-indigo-600 text-[10px] font-black uppercase italic rounded-xl border border-white/10 transition-all flex items-center gap-1">Details <ChevronRight size={12} /></Link>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {projects.length === 0 && !loading && (
        <div className="py-32 flex flex-col items-center justify-center text-center opacity-30"><BookOpen size={64} className="text-slate-700 mb-6" /><p className="text-slate-500 font-black uppercase tracking-[0.3em] italic">The Vault is Silent</p></div>
      )}

      <OffsetPagination total={totalResources} limit={LIMIT} currentOffset={offset} onOffsetChange={setOffset} />

      {/* Resubmit Modal (Omitting for brevity if same) */}
    </div>
  );
}
