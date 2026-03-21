import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, BookOpen, Download, Star, Shield, Filter, Zap, Building2, LayoutDashboard, Plus } from 'lucide-react'

const RESOURCES = [
  { id: 1, name: "CS101 Cheat Sheet", type: "PDF", downloads: 1.2, cost: 10, subject: "Computer Science", campus: "IIT Jammu", verified: true, level: "Sem 1", rating: 4.8 },
  { id: 2, name: "Advanced Robotics Lab", type: "Docs", downloads: 0.5, cost: 25, subject: "Mechanical", campus: "IIT Bombay", nexus: true, verified: true, level: "Sem 6", rating: 5.0 },
  { id: 3, name: "Discrete Math Notes", type: "Docs", downloads: 0.8, cost: 15, subject: "Mathematics", campus: "IIT Jammu", verified: false, level: "Sem 3", rating: 4.5 },
  { id: 4, name: "VLSI Design Handbook", type: "PDF", downloads: 2.1, cost: 40, subject: "Electronics", campus: "IIT Delhi", nexus: true, verified: true, level: "Sem 5", rating: 4.9 },
]

const Vault = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('All')

  const filteredResources = RESOURCES.filter(res => (filter === 'All' || res.subject === filter) && res.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="p-8 max-w-7xl mx-auto space-y-10"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1 space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tight m-0 uppercase italic">Knowledge Vault</h1>
          <p className="text-slate-400 text-lg">Access verified academic assets across the Nexus network.</p>
        </div>
        
        <div className="flex items-center gap-6 bg-white/5 px-6 py-3 glass-card border-white/10">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Current Balance</span>
              <div className="flex items-center gap-2 text-amber-400 font-black text-xl">
                 <Star size={20} className="fill-current" /> 1,240 <span className="text-xs opacity-60">Karma</span>
              </div>
           </div>
           <div className="w-[1px] h-10 bg-white/10"></div>
           <button className="btn-primary py-2.5 px-6 gap-2 text-xs font-black uppercase tracking-widest">
              <Plus size={18} /> Upload Resource
           </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 relative w-full">
           <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
           <input 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             placeholder="Search by title, subject, or course code (e.g., MA201)..." 
             className="w-full pl-16 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all outline-none text-lg" 
           />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto overflow-hidden">
          {['All', 'Computer Science', 'Electronics', 'Mathematics', 'Mechanical'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border ${filter === f ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-500/20' : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence>
          {filteredResources.map(res => (
            <motion.div 
              layout
              key={res.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className={`glass-card p-8 flex flex-col lg:flex-row items-center justify-between border-l-8 gap-8 transition-all group ${res.verified ? 'border-emerald-500' : 'border-slate-800'}`}
            >
              <div className="flex items-center gap-6 w-full lg:w-auto">
                <div className={`p-6 rounded-2xl border transition-all group-hover:scale-110 ${res.verified ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]' : 'bg-white/5 text-slate-600 border-white/10'}`}>
                   <BookOpen size={40} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                     <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                        <Building2 size={12} /> {res.campus}
                     </span>
                     {res.verified && (
                       <span className="verified-badge flex items-center gap-1 animate-pulse">
                          <Shield size={10} className="fill-current" /> Admin Verified
                       </span>
                     )}
                     {res.nexus && <span className="nexus-badge">Nexus Network</span>}
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight leading-none group-hover:text-indigo-400 transition-colors truncate">{res.name}</h3>
                  <div className="flex items-center gap-4 mt-3 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1.5"><Download size={14} /> {res.downloads}k</span>
                    <span className="flex items-center gap-1.5"><Star size={14} className="text-amber-400 fill-amber-400" /> {res.rating}</span>
                    <span className="px-2 py-0.5 bg-white/5 rounded border border-white/10 text-[10px] uppercase font-black tracking-widest">{res.level}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center lg:text-right w-full lg:w-auto pt-6 lg:pt-0 border-t lg:border-t-0 border-white/5 flex flex-col gap-4">
                <div className="flex flex-col lg:items-end">
                   <div className="text-3xl font-black text-white tracking-tighter flex items-center justify-center lg:justify-end gap-2 group-hover:text-amber-400 transition-colors">
                      {res.cost} <span className="text-xs font-black uppercase tracking-widest text-slate-500">Karma</span>
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mt-1">Single Access License</p>
                </div>
                <button className={`btn-primary py-3.5 w-full lg:px-8 text-xs font-black uppercase tracking-widest ${res.verified ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20' : ''}`}>
                   Unlock Asset
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredResources.length === 0 && (
         <div className="text-center py-20 glass-card border-white/10 bg-white/5">
            <BookOpen size={48} className="mx-auto text-slate-800 mb-6" />
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Vault Empty</h3>
            <p className="text-slate-400 max-w-md mx-auto">No resources match your search. Be the first to contribute to this category and earn 50 Bonus Karma!</p>
            <button className="mt-8 btn-secondary mx-auto uppercase tracking-widest text-xs font-black px-10">
               Contribute Now
            </button>
         </div>
      )}
    </motion.div>
  )
}

export default Vault
