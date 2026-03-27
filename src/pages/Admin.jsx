import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, AlertTriangle, CheckCircle, Users, Activity, BarChart, Settings, ArrowUpRight, Globe, Lock, Info, Zap, Building2, ShieldAlert, FileText, ExternalLink } from 'lucide-react'
import { API_URL } from '../config'
import { MOCK_REPORTS } from '../data/mockData'

const Admin = () => {
  const [healthData, setHealthData] = useState({
    uptime: '99.99%',
    throughput: '8.4 GB/s',
    nodes: [
      { name: 'IIT Jammu (Master)', latency: '12ms', status: 'online' },
      { name: 'IIT Delhi (Edge)', latency: '45ms', status: 'online' },
      { name: 'MOU Cloud Broker', latency: '8ms', status: 'online' },
    ]
  });

  useEffect(() => {
    fetch(`${API_URL}/admin/system-health`)
      .then(res => res.json())
      .then(data => {
        if (data && data.uptime) setHealthData(data);
      })
      .catch(err => console.error('Admin API Error:', err));
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="p-10 max-w-[1600px] mx-auto space-y-12 pb-20"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
         <div className="space-y-3">
            <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase flex items-center gap-4">
               <Shield className="text-indigo-500" size={40} /> University Oversight Hub
            </h1>
            <p className="text-slate-400 text-lg">Maintaining academic integrity and administrative compliance across the Nexus network.</p>
         </div>
         <div className="flex flex-wrap gap-4 items-center">
            <div className="bg-emerald-500/10 text-emerald-400 px-5 py-2.5 rounded-2xl border border-emerald-500/20 font-black text-xs flex items-center gap-2.5 shadow-[0_0_30px_rgba(16,185,129,0.1)] animate-pulse">
               <CheckCircle size={18} /> {healthData?.uptime === '99.99%' ? 'Network Stable' : 'System Syncing...'}
            </div>
            <button className="btn-secondary px-6">
               <Settings size={18} /> Governance Config
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {[
           { icon: Users, label: 'Active Students', value: '2,940', trend: '+12% this week', color: 'indigo' },
           { icon: Building2, label: 'Verified Campuses', value: '13/20', trend: 'MOU Active', color: 'emerald' },
           { icon: ShieldAlert, label: 'Pending Requests', value: '42', trend: 'Audit Required', color: 'amber' },
           { icon: FileText, label: 'MOU Utilization', value: '98.2%', trend: 'Overall System Health', color: 'purple' },
         ].map((stat, i) => (
           <div key={i} className="glass-card p-6 border-white/5 relative group overflow-hidden">
             <div className={`absolute top-0 right-0 p-6 opacity-[0.05] group-hover:opacity-10 group-hover:scale-110 transition-all text-${stat.color}-400`}>
                <stat.icon size={100} />
             </div>
             <p className={`text-[10px] font-black uppercase tracking-[0.2em] text-${stat.color}-400 mb-4`}>{stat.label}</p>
             <h3 className="text-4xl font-black text-white tracking-tighter mb-2">{stat.value}</h3>
             <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-widest italic">{stat.trend}</p>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-10 border-white/5 relative overflow-hidden bg-slate-950/20">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-4">
                     <ShieldAlert size={28} className="text-amber-500" /> Administrative Moderation Queue
                  </h3>
                  <button className="text-xs font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors">View full history</button>
               </div>
               <div className="space-y-4">
                 {MOCK_REPORTS.map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer group">
                     <div className="flex items-center gap-6">
                        <span className="text-xs font-black text-slate-600 font-mono italic">{item.id}</span>
                        <div className="p-3 bg-white/5 rounded-2xl text-slate-400 group-hover:text-white group-hover:scale-110 transition-all">
                           {item.id.includes('431') ? <FileText size={20} /> : <Zap size={20} />}
                        </div>
                        <div>
                           <p className="text-lg font-black text-white leading-none">{item.reason}</p>
                           <p className="text-xs text-slate-500 mt-2 font-bold uppercase tracking-widest">Reported by {item.reporter} on {item.target}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl ${
                           item.id.includes('431') ? 'bg-amber-500/20 text-amber-500 border border-amber-500/20' : 
                           'bg-red-500/20 text-red-500 border border-red-500/20'
                        }`}>
                           {item.status}
                        </span>
                        <button className="p-2.5 text-slate-600 hover:text-white transition-colors border border-white/5 rounded-xl hover:bg-white/5">
                           <ExternalLink size={18} />
                        </button>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="glass-card p-10 border-white/5 bg-slate-950/20">
                  <h3 className="text-xl font-black text-white mb-8 italic uppercase tracking-tighter">MOU Governance Ledger</h3>
                  <div className="space-y-6">
                     <div className="p-6 border border-white/10 rounded-3xl bg-indigo-500/5 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform">
                           <Building2 size={80} />
                        </div>
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Connected Institutions</p>
                        <p className="text-3xl font-black text-white tracking-tighter">23 Campuses</p>
                        <div className="mt-4 flex items-center justify-between">
                           <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Active Multi-Campus MOUs</span>
                           <span className="text-xs font-black text-emerald-500 flex items-center gap-1"><Zap size={10} className="fill-current" /> Healthy</span>
                        </div>
                     </div>
                     <div className="p-6 border border-white/5 rounded-3xl bg-white/5 relative group overflow-hidden">
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Network-Wide Audits</p>
                        <p className="text-3xl font-black text-white tracking-tighter">98.2% Pass</p>
                        <div className="mt-4 flex items-center justify-between">
                           <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Compliant Inter-Peer Swaps</span>
                           <button className="text-xs font-black text-indigo-400 flex items-center gap-1 underline underline-offset-4 decoration-2">Audit Logs</button>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="glass-card p-10 border-white/5 bg-slate-900 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                     <Shield size={160} />
                  </div>
                  <div>
                     <div className="w-14 h-14 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl shadow-indigo-600/20">
                        <Shield size={32} />
                     </div>
                     <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase italic underline decoration-indigo-500 decoration-4">EduSync Guardian AI</h3>
                     <p className="text-sm text-slate-400 leading-relaxed font-medium mb-8">
                       Autonomous NLP models are currently analyzing inter-campus knowledge transfers to ensure zero malpractices and strict adherence to administrative policies.
                     </p>
                  </div>
                  <button className="btn-primary w-full py-4 uppercase tracking-[0.3em] font-black group">
                     <Settings size={18} className="group-hover:rotate-90 transition-transform" /> Tweak Neural Rules
                  </button>
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="glass-card p-10 border-white/5 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 relative overflow-hidden">
               <div className="text-center">
                  <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full mx-auto flex items-center justify-center mb-6 border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                     <Globe size={40} className="animate-pulse" />
                  </div>
                  <h4 className="text-xl font-black text-white mb-2 italic">Global Network Analysis</h4>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">Inter-College Exchange Metrics ({healthData?.throughput || 'Syncing...'})</p>
               </div>
               <div className="space-y-6">
                  {[
                    { label: 'Campus Swap Rate', val: 78, color: 'indigo' },
                    { label: 'Resource Verification', val: 92, color: 'emerald' },
                    { label: 'MOU Compliance', val: 98, color: 'amber' },
                  ].map((stat, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                          <span className="text-slate-400">{stat.label}</span>
                          <span className={`${stat.color === 'indigo' ? 'text-indigo-400' : stat.color === 'emerald' ? 'text-emerald-400' : 'text-amber-400'}`}>{stat.val}%</span>
                       </div>
                       <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.val}%` }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                            className={`h-full ${stat.color === 'indigo' ? 'bg-indigo-500 shadow-indigo-500/30' : stat.color === 'emerald' ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-amber-500 shadow-amber-500/30'} shadow-[0_0_15px]`}
                          />
                       </div>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-10 py-4 bg-white/5 rounded-2xl border border-white/10 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                  <FileText size={18} /> Export MOU Report
               </button>
            </div>
            
            <div className="glass-card p-10 border-white/5 bg-slate-950/40">
               <h3 className="text-sm font-black text-white/50 uppercase tracking-[0.3em] mb-6 border-b border-white/5 pb-4 flex items-center gap-3">
                  <Zap size={16} className="text-indigo-400" /> System Scalability Matrix
               </h3>
               <div className="space-y-6">
                  {healthData.nodes.map((node, i) => (
                    <div key={i} className="flex flex-col gap-2 p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all group">
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">{node.name}</span>
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded ${node.status === 'online' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'}`}>{node.status === 'online' ? 'Optimal' : 'Stable'}</span>
                       </div>
                       <div className="flex justify-between text-[9px] font-bold text-slate-500 font-mono">
                          <span>Lat: {node.latency}</span>
                          <span className="group-hover:text-indigo-400 transition-colors">Load: Balancer Active</span>
                       </div>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-8 py-3 bg-indigo-600/10 border border-indigo-600/20 rounded-xl text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
                  Scale Nexus Nodes
               </button>
            </div>
         </div>
      </div>
    </motion.div>
  )
}

export default Admin
