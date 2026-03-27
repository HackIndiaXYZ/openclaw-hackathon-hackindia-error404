import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Zap, Star, Shield, Globe, ArrowUpRight, Info, MapPin, Building2, AlertTriangle, Users } from 'lucide-react'
import { API_URL } from '../config'
import { MOCK_SKILLS } from '../data/mockData'

const Explore = () => {
  const [nexusEnabled, setNexusEnabled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    fetch(`${API_URL}/skills/explore?nexusMode=${nexusEnabled}&skill=${searchQuery}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setResults(data)
        } else {
          // Fallback to mock data if API returns empty or invalid
          const filteredMock = MOCK_SKILLS.filter(s => 
            s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            s.campus.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setResults(filteredMock.map(s => ({
            id: s.id,
            skill: s.title,
            name: s.mentor,
            campus: s.campus,
            status: s.campus === 'IIT Jammu' ? 'LocalCampus' : 'NexusPartner',
            karma: s.karma,
            rating: s.rating
          })));
        }
        setIsLoading(false)
      })
      .catch(err => {
        console.error('Skill API Error:', err)
        // Fallback to mock data on error
        const filteredMock = MOCK_SKILLS.filter(s => 
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          s.campus.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setResults(filteredMock.map(s => ({
          id: s.id,
          skill: s.title,
          name: s.mentor,
          campus: s.campus,
          status: s.campus === 'IIT Jammu' ? 'LocalCampus' : 'NexusPartner',
          karma: s.karma,
          rating: s.rating
        })));
        setIsLoading(false)
      })
  }, [nexusEnabled, searchQuery])

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="p-8 max-w-7xl mx-auto space-y-10"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1 space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tight m-0">Nexus Explorer</h1>
          <p className="text-slate-400 text-lg">Bridge the knowledge gap across institutions.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 bg-white/5 px-6 py-3 glass-card border-white/10">
           <div className="flex items-center gap-4">
              <span className={`text-[10px] font-black uppercase tracking-widest ${!nexusEnabled ? 'text-indigo-400' : 'text-slate-500'}`}>Local Campus</span>
              <button 
                onClick={() => setNexusEnabled(!nexusEnabled)}
                className={`w-12 h-6 rounded-full transition-all relative border border-white/10 ${nexusEnabled ? 'bg-indigo-600' : 'bg-white/5'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full transition-all shadow-lg ${nexusEnabled ? 'left-7 bg-white' : 'left-1 bg-slate-500'}`} />
              </button>
              <span className={`text-[10px] font-black uppercase tracking-widest ${nexusEnabled ? 'text-indigo-400' : 'text-slate-500'}`}>Nexus Mode</span>
           </div>
           {nexusEnabled && <div className="hidden lg:block w-[1px] h-6 bg-white/10 mx-2"></div>}
           {nexusEnabled && (
              <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                <Globe size={12} className="text-indigo-400" />
                <span className="text-[10px] font-black uppercase tracking-tighter text-indigo-400">Inter-MOU Active</span>
              </div>
           )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
           <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
           <input 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             placeholder="Search by skill, campus, or course code..." 
             className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all outline-none text-lg" 
           />
        </div>
        <button className="btn-secondary h-16 px-8 flex items-center gap-3">
          <Filter size={20} /> Advanced Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {results.map((item, i) => (
            <motion.div 
              layout
              key={item.id || i} 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`glass-card overflow-hidden group border-white/5 ${item.status === 'NexusPartner' ? 'ring-2 ring-indigo-500/30' : ''}`}
            >
              <div className={`h-28 p-6 flex items-start justify-between relative overflow-hidden ${item.status === 'NexusPartner' ? 'bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-950' : 'bg-white/5'}`}>
                 {item.status === 'NexusPartner' && <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Building2 size={120} className="text-white" /></div>}
                 <div className="p-3 bg-white/10 rounded-2xl text-white border border-white/10">
                    <Users size={24} />
                 </div>
                 <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${item.status === 'NexusPartner' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/20' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20'}`}>
                    {item.status}
                 </span>
              </div>
              
              <div className="p-8 pt-10 relative">
                <div className="absolute -top-12 right-8 w-24 h-24 rounded-2xl bg-slate-900 p-1 shadow-2xl border-2 border-white/10 group-hover:border-indigo-500/50 transition-colors">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name}`} alt="mentor" className="rounded-xl w-full h-full" />
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-slate-950 ${item.status !== 'NexusPartner' ? 'bg-emerald-500' : 'bg-indigo-500'}`}></div>
                </div>
                
                <h3 className="text-2xl font-black text-white tracking-tight leading-none group-hover:text-indigo-400 transition-colors uppercase italic">{item.skill}</h3>
                <p className="text-sm font-bold text-slate-400 mt-2 flex items-center gap-2">
                  <MapPin size={14} /> {item.campus}
                </p>
                
                <div className="flex items-center gap-6 mt-6 pt-6 border-t border-white/5">
                   <div className="flex items-center gap-1.5 font-black text-amber-400">
                      <Star size={16} className="fill-current" /> {item.rating || 4.8}
                   </div>
                   <div className="flex items-center gap-1.5 font-black text-indigo-400">
                      <Zap size={16} className="fill-current" /> {item.karma || 250} Karma
                   </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button className="flex-1 btn-primary py-3 rounded-xl font-black text-xs uppercase tracking-widest">
                    Request Swap
                  </button>
                  <button className="p-3 btn-secondary rounded-xl hover:text-white transition-colors">
                     <AlertTriangle size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {results.length === 0 && !isLoading && (
         <div className="text-center py-20 glass-card border-white/5 bg-white/5">
            <Search size={48} className="mx-auto text-slate-700 mb-6" />
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">No mentors found</h3>
            <p className="text-slate-400 max-w-md mx-auto">Try broadening your search or switching to Nexus Mode to explore other campuses.</p>
            <button 
              onClick={() => setNexusEnabled(true)}
              className="mt-8 btn-primary mx-auto"
            >
              Enable Nexus Mode
            </button>
         </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      )}
    </motion.div>
  )
}

export default Explore
