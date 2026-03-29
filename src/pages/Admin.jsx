import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldAlert, ShieldCheck, UserCheck, 
  FileCheck, AlertTriangle, Search, 
  Filter, CheckCircle, XCircle, MoreVertical,
  Activity, Users, Zap, BookOpen, Clock, Lock
} from 'lucide-react'
import { toast } from 'sonner'
import Button from '../components/ui/Button'
import Avatar from '../components/ui/Avatar'

const MODERATION_ITEMS = [
  { id: 1, type: 'RESOURCE', title: 'VLSI Final Notes - PDF', uploader: 'Arjun P.', campus: 'NIT-N', time: '2h ago', status: 'pending' },
  { id: 2, type: 'SKILL', title: 'React Hooks Mastery', uploader: 'Priya S.', campus: 'DEU', time: '4h ago', status: 'pending' },
  { id: 3, type: 'REPORT', title: 'Inappropriate Message', uploader: 'Nexus Bridge #42', campus: 'Inter', time: '12h ago', status: 'flagged' },
]

export default function Admin() {
  const [activeTab, setActiveTab] = useState('queue')
  const [items, setItems] = useState(MODERATION_ITEMS)

  const handleAction = (id, action) => {
    setItems(items.filter(i => i.id !== id))
    toast.success(`Action recorded: Content ${action === 'approve' ? 'Published' : 'Rejected'}`)
  }

  return (
    <div className="p-6 lg:p-12 font-sans bg-transparent">
      <div className="max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-rose-500/10 text-rose-500 rounded-lg text-[10px] font-black uppercase tracking-widest leading-none border border-rose-500/20">Institutional Oversight</span>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">• Total Federation Control</span>
            </div>
            <h1 className="text-4xl font-black text-white font-outfit tracking-tighter mb-2">Nexus Core Control</h1>
            <p className="text-slate-400 font-medium">Monitoring academic integrity across the 5 partner repositories.</p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" icon={Activity}>System Status</Button>
            <Button variant="primary" icon={Lock}>Nexus Lockdown</Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Seekers', value: '2,408', icon: Users, color: 'indigo' },
            { label: 'Knowledge Swaps', value: '842', icon: Zap, color: 'amber' },
            { label: 'Vault Resources', value: '1,205', icon: BookOpen, color: 'emerald' },
            { label: 'Awaiting Review', value: items.length, icon: Clock, color: 'rose' },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex flex-col justify-between"
            >
              <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-500 mb-4`}>
                <stat.icon size={20} />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">{stat.label}</div>
                <div className="text-3xl font-black text-white font-outfit">{stat.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dashboard Tabs */}
        <div className="flex gap-1 mb-8 bg-white/5 border border-white/10 p-1.5 rounded-2xl self-start inline-flex">
          {[
            { id: 'queue', label: 'Moderation Queue', icon: FileCheck },
            { id: 'reports', label: 'Security Reports', icon: AlertTriangle },
            { id: 'users', label: 'Student Directory', icon: UserCheck },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-6 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2
                ${activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'}
              `}
            >
              <tab.icon size={16} />
              {tab.label}
              {tab.id === 'queue' && items.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center text-[10px] ml-1">
                  {items.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-lg font-black text-white italic">Active Governance Pipeline</h3>
            <div className="flex gap-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Filter queue..." 
                  className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-indigo-500 transition-all"
                />
              </div>
              <Button icon={Filter} variant="ghost" className="text-xs h-9">Institutional Filter</Button>
            </div>
          </div>

          <div className="divide-y divide-white/5">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black
                      ${item.type === 'RESOURCE' ? 'bg-emerald-600' : item.type === 'SKILL' ? 'bg-indigo-600' : 'bg-rose-600'}
                    `}>
                      {item.type[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-black text-white">{item.title}</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter
                          ${item.status === 'flagged' ? 'bg-rose-500/20 text-rose-500' : 'bg-amber-500/20 text-amber-500'}
                        `}>
                          {item.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium font-outfit">
                        Proposed by {item.uploader} • {item.campus} • <Clock size={12} className="inline mx-1" /> {item.time}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    <Button 
                      onClick={() => handleAction(item.id, 'approve')}
                      size="sm" 
                      variant="ghost" 
                      className="text-emerald-500 hover:bg-emerald-500/10 h-10 px-4" 
                      icon={CheckCircle}
                    >
                      Authenticate
                    </Button>
                    <Button 
                      onClick={() => handleAction(item.id, 'reject')}
                      size="sm" 
                      variant="ghost" 
                      className="text-rose-500 hover:bg-rose-500/10 h-10 px-4" 
                      icon={XCircle}
                    >
                      Purge
                    </Button>
                    <div className="w-px h-6 bg-white/10 mx-2" />
                    <button className="p-2 text-slate-500 hover:text-white transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {items.length === 0 && (
              <div className="p-20 text-center">
                <ShieldCheck size={48} className="mx-auto text-emerald-500/20 mb-6" />
                <h4 className="text-xl font-black text-white font-outfit">Institutional Order Maintained</h4>
                <p className="text-slate-500 max-w-xs mx-auto text-sm mt-2">All student contributions have been synchronized and authenticated.</p>
              </div>
            )}
          </div>
        </div>

        {/* Federation Footer */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 opacity-30 grayscale saturate-0 hover:grayscale-0 hover:saturate-100 hover:opacity-100 transition-all duration-700">
           <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Federation Audit Trail | 2026-NEXUS-01</div>
           <div className="flex items-center gap-8">
              {['NIT-N', 'DEU', 'VCST', 'ITU', 'SIAS'].map(c => (
                <span key={c} className="text-[10px] font-bold text-slate-600 tracking-tighter">{c} SECURE</span>
              ))}
           </div>
        </div>
      </div>
    </div>
  )
}
