import React from 'react'
import { motion } from 'framer-motion'
import { User, Plus, Star, Shield, Zap, Building2, ExternalLink, Settings, Edit3, Award, Bookmark } from 'lucide-react'

const Profile = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
    className="p-10 max-w-5xl mx-auto space-y-12 pb-24"
  >
    <div className="glass-card overflow-hidden border-white/5 bg-slate-950/20 shadow-2xl">
      <div className="h-64 bg-gradient-to-r from-indigo-950 via-purple-950 to-emerald-950 relative border-b border-white/10 group">
         <div className="absolute inset-0 opacity-10 flex items-center justify-center -z-10 group-hover:scale-110 transition-transform">
            <h1 className="text-[14rem] font-black tracking-tighter text-white">IIT JAMMU</h1>
         </div>
         <div className="absolute bottom-6 right-8 flex gap-4">
            <button className="btn-secondary px-6"><Edit3 size={18} /> Edit Background</button>
            <button className="btn-secondary px-6"><Settings size={18} /> Global Settings</button>
         </div>
      </div>
      
      <div className="p-10 relative">
        <div className="absolute -top-24 left-10 group">
           <div className="relative">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-48 h-48 rounded-[3rem] bg-slate-900 p-2 shadow-2xl border-4 border-white/20 group-hover:border-indigo-500 transition-all group-hover:scale-105" />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white border-4 border-slate-950 shadow-xl shadow-indigo-600/20">
                 <Zap size={24} className="fill-current" />
              </div>
           </div>
        </div>
        
        <div className="mt-28 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
               <h1 className="text-5xl font-black text-white m-0 tracking-tighter italic uppercase">Felix Miller</h1>
               <div className="flex items-center gap-2.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 font-black text-[10px] tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                  Top Tier Helper
               </div>
            </div>
            <div className="flex items-center gap-6 text-slate-400 font-black text-xs tracking-widest uppercase italic">
               <span className="flex items-center gap-1.5"><Building2 size={16} /> Computer Science Junior</span>
               <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
               <span className="flex items-center gap-1.5"><Globe size={16} /> IIT Jammu Protocol</span>
            </div>
            <p className="max-w-xl text-slate-500 text-sm font-medium leading-relaxed mt-4 italic">
               "Bridging the gap between theory and execution. Passionate about AI architecture and peer-to-peer knowledge transfers within the Nexus ecosystem."
            </p>
          </div>
          <button className="btn-primary px-12 py-4 h-16 rounded-3xl font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/30">Connect Peer</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 p-10 bg-white/5 rounded-[3rem] border border-white/10 shadow-inner">
           {[
             { label: 'Karma Earned', value: '1,240', color: 'indigo', icon: Zap },
             { label: 'Network Swaps', value: '18', color: 'emerald', icon: Star },
             { label: 'Audit Grade', value: 'Nexus-A', color: 'amber', icon: Shield },
           ].map((stat, i) => (
             <div key={i} className="text-center group">
                <div className={`w-12 h-12 bg-${stat.color}-500/10 text-${stat.color}-500 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-${stat.color}-500/20 group-hover:scale-110 transition-transform`}>
                   <stat.icon size={24} />
                </div>
                <div className={`text-4xl font-black text-white tracking-tighter group-hover:text-${stat.color}-400 transition-colors`}>{stat.value}</div>
                <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-2">{stat.label}</div>
             </div>
           ))}
        </div>
        
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
             <h2 className="text-2xl font-black text-white tracking-tight uppercase italic flex items-center gap-4">
                <div className="w-1.5 h-8 bg-indigo-500 rounded-full"></div> Nexus Skills Protocol
             </h2>
             <div className="flex flex-wrap gap-4">
                {['React.js Architecture', 'Neural Networks', 'Discrete Math', 'Advanced UI/UX', 'Cloud Infrastructure'].map(s => (
                  <span key={s} className="px-6 py-3.5 bg-white/5 rounded-2xl border border-white/10 font-black text-xs text-slate-300 shadow-xl hover:bg-white/10 transition-all hover:border-indigo-500/50 cursor-pointer">{s}</span>
                ))}
                <button className="px-6 py-3.5 bg-indigo-500/10 text-indigo-400 rounded-2xl font-black text-xs border border-indigo-500/20 hover:bg-indigo-500/20 transition-all flex items-center gap-3 shadow-lg">
                  <Plus size={18} /> Update Data
                </button>
             </div>
          </div>

          <div className="space-y-8">
             <h2 className="text-2xl font-black text-white tracking-tight uppercase italic flex items-center gap-4">
                <div className="w-1.5 h-8 bg-emerald-500 rounded-full"></div> Recent Achievements
             </h2>
             <div className="space-y-4">
                {[
                  { icon: Award, label: 'Cross-Campus Mentor', desc: 'Facilitated 10+ inter-IIT swaps' },
                  { icon: Bookmark, label: 'Vault Contributor', desc: 'Top verified resource uploader' },
                ].map((ach, i) => (
                  <div key={i} className="flex gap-4 p-5 bg-white/5 border border-white/5 rounded-3xl group hover:bg-white/10 transition-all">
                     <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20 group-hover:scale-110 transition-all">
                        <ach.icon size={24} />
                     </div>
                     <div>
                        <p className="font-black text-white text-sm uppercase tracking-tight">{ach.label}</p>
                        <p className="text-xs text-slate-500 mt-1 font-medium">{ach.desc}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
)

export default Profile
