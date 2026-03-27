import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, Users, BookOpen, Shield, TrendingUp, ArrowUpRight, MessageSquare, Star, Info, Clock, Globe, Plus, ShieldCheck, Building2, ExternalLink } from 'lucide-react'
import { API_URL } from '../config'
import { DASHBOARD_STATS, NEXUS_ACTIVITY } from '../data/mockData'

const Dashboard = ({ setActiveTab }) => {
  const [stats, setStats] = useState({
    activeSwaps: 12,
    karmaBalance: 1240,
    mouPartners: 4,
    complianceScore: 98
  });

  useEffect(() => {
    // Simulation of real API call
    fetch(`${API_URL}/health`)
      .then(res => res.json())
      .then(data => {
        console.log('Nexus Backend Status:', data.status);
      })
      .catch(err => console.error('Backend Offline:', err));
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      className="p-8 space-y-8 max-w-7xl mx-auto"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
        <div>
          <h1 className="text-4xl font-black text-white m-0 tracking-tight leading-none uppercase italic">Ecosystem Dashboard</h1>
          <p className="text-slate-400 mt-4 text-lg">Connected to <span className="text-indigo-400 font-bold">IIT Jammu</span> & 12 Partner Campuses.</p>
        </div>
        <div className="flex gap-4">
          <button className="btn-secondary group">
            <Globe size={18} className="group-hover:rotate-12 transition-transform" /> Campus Network
          </button>
          <button className="btn-primary" onClick={() => setActiveTab('explore')}>
            <Plus size={20} /> New Skill Swap
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {DASHBOARD_STATS.map((stat, i) => (
          <div key={i} className="glass-card p-6 border-white/5 bg-slate-900/40 relative group overflow-hidden hover:border-indigo-500/30 transition-all">
            <div className={`absolute top-0 right-0 p-6 opacity-[0.05] group-hover:scale-110 transition-transform text-${stat.color}-400`}>
                <stat.icon size={80} />
            </div>
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 bg-${stat.color === 'indigo' ? 'indigo' : stat.color === 'amber' ? 'amber' : stat.color === 'emerald' ? 'emerald' : 'purple'}-500/10 text-${stat.color === 'indigo' ? 'indigo' : stat.color === 'amber' ? 'amber' : stat.color === 'emerald' ? 'emerald' : 'purple'}-400 rounded-xl`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] text-${stat.color}-400`}>{stat.label}</span>
            </div>
            <div className="text-4xl font-black text-white tracking-tighter">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-3 flex items-center gap-1.5 font-medium uppercase tracking-widest italic">
              <ExternalLink size={12} /> {stat.sub}
            </div>
          </div>
        ))}
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8 border-white/5 relative overflow-hidden group bg-slate-950/20">
          <div className="absolute -top-10 -right-10 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
             <Globe size={240} className="text-indigo-400" />
          </div>
          <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3 italic uppercase tracking-tight">
            <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
            Nexus Activity feed
          </h2>
          <div className="space-y-4">
            {NEXUS_ACTIVITY.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-all px-4 -mx-4 rounded-xl cursor-pointer group">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                      <Zap size={18} />
                   </div>
                   <div>
                      <div className="flex items-center gap-2">
                         <span className="font-bold text-white text-sm">{item.user}</span>
                         <span className="text-[8px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded italic">{item.badge}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 font-medium">{item.action}</p>
                   </div>
                </div>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-8 border-white/5 flex flex-col justify-between bg-slate-900/40">
          <div>
            <h2 className="text-2xl font-black text-white mb-4 italic uppercase">Security & Oversight</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
              EduSync's multi-campus protocol ensures that all peer interactions adhere to your institution's MOU and academic integrity codes. 
            </p>
          </div>
          
          <div className="bg-amber-500/5 rounded-2xl p-6 border border-amber-500/10 mb-6">
             <div className="flex gap-4 items-start">
                <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                  <Shield size={24} />
                </div>
                <div>
                   <h4 className="font-black text-amber-500 leading-tight text-lg uppercase tracking-tight">Platform Moderation Active</h4>
                   <p className="text-sm text-amber-400/70 mt-2 leading-relaxed italic font-medium">
                     "Autonomous NLP Guardian AI is monitoring local and cross-campus knowledge transfers."
                   </p>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="btn-secondary text-[10px] uppercase font-black tracking-[0.2em] py-4" onClick={() => setActiveTab('admin')}>View Compliance</button>
            <button className="btn-secondary text-[10px] uppercase font-black tracking-[0.2em] py-4">Network Help</button>
          </div>
        </div>
      </section>
    </motion.div>
  )
}

export default Dashboard
