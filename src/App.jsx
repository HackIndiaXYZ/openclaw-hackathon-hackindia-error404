import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, BookOpen, MessageSquare, User, LayoutDashboard, 
  Plus, ArrowRight, Star, ShieldCheck, Zap, Download, 
  Send, Bell, Settings, Filter, ArrowLeft, CheckCircle,
  Globe, Shield, AlertTriangle, Building2, ExternalLink
} from 'lucide-react'

// --- Mock Data ---
const SKILLS = [
  { id: 1, name: "Python Basics", category: "Coding", mentor: "Aryan K.", karma: 450, rating: 4.8, campus: "IIT Jammu", local: true },
  { id: 2, name: "UI Design", category: "Design", mentor: "Sneha R.", karma: 320, rating: 4.9, campus: "IIT Jammu", local: true },
  { id: 3, name: "VLSI Design", category: "Electronics", mentor: "Dr. Vikram", karma: 890, rating: 5.0, campus: "IIT Delhi", local: false, nexus: true },
  { id: 4, name: "Calc II Tutoring", category: "Academia", mentor: "Rahul M.", karma: 180, rating: 4.5, campus: "IIT Jammu", local: true },
]

const RESOURCES = [
  { id: 1, name: "CS101 Cheat Sheet", type: "PDF", downloads: 1.2, cost: 10, subject: "Computer Science", campus: "IIT Jammu", verified: true },
  { id: 2, name: "Advanced Robotics Lab", type: "Docs", downloads: 0.5, cost: 25, subject: "Mechanical", campus: "IIT Bombay", local: false, nexus: true },
  { id: 3, name: "Discrete Math Notes", type: "Docs", downloads: 0.8, cost: 15, subject: "Mathematics", campus: "IIT Jammu", verified: false },
]

// --- Components ---

const Navbar = ({ activeTab, setActiveTab, currentCampus }) => (
  <nav className="glass-nav px-8 py-4 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">E</div>
        <span className="text-2xl font-bold tracking-tight text-slate-800">EduSync</span>
      </div>
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
        <Building2 size={14} className="text-slate-500" />
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{currentCampus}</span>
      </div>
    </div>
    
    <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-2xl border border-slate-200/50">
      {[
        { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
        { id: 'explore', icon: Search, label: 'Nexus' },
        { id: 'vault', icon: BookOpen, label: 'Vault' },
        { id: 'chat', icon: MessageSquare, label: 'Chat' },
        { id: 'admin', icon: Shield, label: 'Admin' },
      ].map(tab => (
        <button 
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 ${activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50 scale-105' : 'text-slate-500 hover:bg-white/50 hover:text-slate-800'}`}
        >
          <tab.icon size={18} />
          <span className="font-medium">{tab.label}</span>
        </button>
      ))}
    </div>

    <div className="flex items-center gap-4">
      <button className="p-2.5 text-slate-400 hover:text-indigo-600 transition-colors relative">
        <Globe size={20} />
      </button>
      <button onClick={() => setActiveTab('profile')} className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden hover:border-indigo-400 transition-all">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
      </button>
    </div>
  </nav>
)

const Dashboard = ({ setActiveTab }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
    className="p-8 space-y-8 max-w-7xl mx-auto"
  >
    <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 m-0 tracking-tight">Ecosystem Dashboard</h1>
        <p className="text-slate-500 mt-2">Connected to <span className="text-indigo-600 font-bold">IIT Jammu</span> & 12 Partner Campuses.</p>
      </div>
      <div className="flex gap-3">
        <button className="btn-secondary">
          <Globe size={18} /> Campus Network
        </button>
        <button className="btn-primary">
          <Plus size={20} /> New Listing
        </button>
      </div>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="glass-card p-6 border-indigo-100">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl"><Zap size={24} /></div>
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Active Swaps</span>
        </div>
        <div className="text-4xl font-black text-slate-800 tracking-tighter">03</div>
        <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
          <ExternalLink size={12} /> 1 Inter-Campus
        </div>
      </div>
      
      <div className="glass-card p-6 border-emerald-100">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><Star size={24} /></div>
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Karma Balance</span>
        </div>
        <div className="text-4xl font-black text-slate-800 tracking-tighter">1,240</div>
        <div className="text-xs text-slate-500 mt-2">Global Rank: #42</div>
      </div>

      <div className="glass-card p-6 border-amber-100">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><ShieldCheck size={24} /></div>
          <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Verified Work</span>
        </div>
        <div className="text-4xl font-black text-slate-800 tracking-tighter">12</div>
        <div className="text-xs text-slate-500 mt-2">Admin Certified</div>
      </div>

      <div className="glass-card p-6 border-purple-100 bg-gradient-to-br from-purple-50/50 to-white/50">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><Building2 size={24} /></div>
          <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Partner MOUs</span>
        </div>
        <div className="text-4xl font-black text-slate-800 tracking-tighter">05</div>
        <div className="text-xs text-slate-500 mt-2">Active Multi-Campus</div>
      </div>
    </div>

    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="glass-card p-8 border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Globe size={120} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Globe size={20} className="text-indigo-600" /> Nexus Activity
        </h2>
        <div className="space-y-4">
          {[
            { user: "Sneha (IITD)", action: "Requested Skill Swap", time: "2m ago" },
            { user: "Admin (IITJ)", action: "Verified CS101 Notes", time: "1h ago" },
            { user: "Aryan (IITB)", action: "Joined Engineering Nexus", time: "3h ago" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-all px-2 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-indigo-500" />
                 <div>
                    <span className="font-bold text-slate-800 text-sm">{item.user}</span>
                    <p className="text-xs text-slate-500">{item.action}</p>
                 </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-8 border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Security & Transparency</h2>
        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
           <div className="flex gap-4 items-start">
              <div className="p-2 bg-white rounded-xl text-amber-500 shadow-sm"><Shield size={20} /></div>
              <div>
                 <h4 className="font-bold text-amber-900 leading-tight">Admin Oversight Active</h4>
                 <p className="text-sm text-amber-700 mt-1 leading-relaxed">
                   Your interactions are being monitored by campus moderators to ensure academic integrity and safety across the Nexus network. 
                 </p>
                 <button className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-amber-800 underline">View Governance Policy</button>
              </div>
           </div>
        </div>
      </div>
    </section>
  </motion.div>
)

const Explore = () => {
  const [nexusEnabled, setNexusEnabled] = useState(false)

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="p-8 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight m-0">Nexus Exploration</h1>
          <p className="text-slate-500 mt-1 italic">Bridge the gap between campuses.</p>
        </div>
        
        <div className="flex items-center gap-6 bg-white/50 px-6 py-3 glass-card border-slate-200">
           <div className="flex items-center gap-3">
              <span className={`text-xs font-black uppercase tracking-widest ${!nexusEnabled ? 'text-indigo-600' : 'text-slate-400'}`}>Local Only</span>
              <button 
                onClick={() => setNexusEnabled(!nexusEnabled)}
                className={`w-12 h-6 rounded-full transition-all relative ${nexusEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${nexusEnabled ? 'left-7' : 'left-1'}`} />
              </button>
              <span className={`text-xs font-black uppercase tracking-widest ${nexusEnabled ? 'text-indigo-600' : 'text-slate-400'}`}>Nexus Mode</span>
           </div>
           <div className="h-4 w-[1px] bg-slate-200" />
           <button className="btn-secondary py-1.5 px-3 text-xs"><Filter size={14} /> Filter</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SKILLS.filter(s => nexusEnabled || s.local).map(skill => (
          <motion.div 
            layout
            key={skill.id} 
            className={`glass-card overflow-hidden group border-slate-100 ${!skill.local ? 'ring-2 ring-indigo-500/20' : ''}`}
          >
            <div className={`h-24 p-6 flex items-start justify-between relative overflow-hidden ${!skill.local ? 'bg-gradient-to-br from-indigo-600 to-purple-700' : 'bg-slate-100'}`}>
               {!skill.local && <div className="absolute top-0 right-0 p-4 opacity-10"><Globe size={80} className="text-white" /></div>}
               <span className={`px-3 py-1 rounded-lg text-xs font-bold ${!skill.local ? 'bg-white/20 text-white' : 'bg-white text-slate-600 shadow-sm'}`}>{skill.category}</span>
               {skill.nexus && <span className="bg-amber-400 text-[10px] font-black uppercase tracking-widest text-white px-2 py-1 rounded-md shadow-lg">Partner Campus</span>}
            </div>
            <div className="p-6 relative">
              <div className="absolute -top-10 right-6 w-20 h-20 rounded-2xl bg-white p-1 shadow-2xl border border-slate-100">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${skill.mentor}`} alt="mentor" className="rounded-xl" />
              </div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">{skill.name}</h3>
              <p className="text-xs font-bold text-indigo-600 mb-4">{skill.campus}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                  <Star size={16} className="text-amber-400 fill-amber-400" /> {skill.rating}
                </div>
                <button className={`btn-primary py-2 px-4 text-xs font-bold ${!skill.local ? 'bg-indigo-600' : ''}`}>
                  Request Swap
                </button>
              </div>
              <button className="absolute top-48 right-6 text-slate-300 hover:text-red-500 transition-colors">
                 <AlertTriangle size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

const Admin = () => (
   <motion.div 
    initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
    className="p-8 max-w-7xl mx-auto"
  >
     <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight">University Oversight</h1>
           <p className="text-slate-500">Ensuring integrity across the EduSync Nexus.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-100 font-bold flex items-center gap-2">
              <CheckCircle size={18} /> Network Stable
           </div>
        </div>
     </div>

     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <div className="glass-card p-6 border-slate-100">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                 <AlertTriangle size={20} className="text-amber-500" /> Pending Reports
              </h3>
              <div className="space-y-4">
                {[
                  { id: '#431', reporter: "Aryan K.", target: "Misc. Notes", reason: "Misleading Title", status: "Urgent" },
                  { id: '#432', reporter: "Sneha R.", target: "Calc II Swap", reason: "AI Generated Content", status: "Review" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                       <span className="text-xs font-bold text-slate-400">{item.id}</span>
                       <div>
                          <p className="text-sm font-bold text-slate-800">{item.reason}</p>
                          <p className="text-xs text-slate-500">By {item.reporter} on {item.target}</p>
                       </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${item.status === 'Urgent' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                       {item.status}
                    </span>
                  </div>
                ))}
              </div>
           </div>

           <div className="glass-card p-6 border-slate-100">
              <h3 className="text-lg font-bold mb-6">MOU Governance Dashboard</h3>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 border border-slate-100 rounded-2xl bg-indigo-50/30">
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Active Links</p>
                    <p className="text-2xl font-black text-slate-800">12 Schools</p>
                 </div>
                 <div className="p-4 border border-slate-100 rounded-2xl bg-emerald-50/30">
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">MOU Compliance</p>
                    <p className="text-2xl font-black text-slate-800">98.2%</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="glass-card p-6 border-slate-100 bg-slate-900 text-white shadow-2xl shadow-slate-200">
              <Shield size={32} className="text-indigo-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Policy Guard</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Automated NLP models are analyzing inter-campus trades to ensure adherence to university MOUs and academic codes.
              </p>
              <button className="w-full py-3 bg-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all">
                 Configure AI Rules
              </button>
           </div>
        </div>
     </div>
  </motion.div>
)

const Vault = () => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    className="p-8 max-w-7xl mx-auto"
  >
    <div className="flex justify-between items-center mb-10">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight m-0">Knowledge Vault</h1>
        <p className="text-slate-500 mt-1 italic">Verified academic resources across the Nexus.</p>
      </div>
      <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-100 font-bold flex items-center gap-2">
        <Star size={20} /> 1,240 <span className="text-xs opacity-60">Karma</span>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {RESOURCES.map(res => (
        <motion.div 
          key={res.id} 
          whileHover={{ y: -5 }}
          className={`glass-card p-6 flex flex-col md:flex-row items-center justify-between border-l-8 gap-6 transition-all ${res.verified ? 'border-emerald-500 shadow-emerald-50/50' : 'border-slate-300'}`}
        >
          <div className="flex items-center gap-5">
            <div className={`p-5 rounded-2xl border ${res.verified ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
               <BookOpen size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{res.campus}</span>
                 {res.verified && <span className="flex items-center gap-1 text-[8px] bg-emerald-500 text-white px-1.5 py-0.5 rounded uppercase font-black tracking-tighter"><Shield size={8} /> Admin Verified</span>}
              </div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">{res.name}</h3>
              <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                <Download size={14} /> {res.downloads}k downloads • {res.subject}
              </p>
            </div>
          </div>
          <div className="text-center md:text-right w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
            <div className="text-2xl font-black text-slate-800 mb-2">{res.cost} <span className="text-sm font-normal text-slate-500">Karma</span></div>
            <button className={`btn-primary w-full md:w-auto ${res.verified ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}>
               Unlock Resource
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
)

const Chat = () => (
   <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="h-[calc(100vh-120px)] p-8 flex gap-6"
  >
    {/* Sidebar */}
    <div className="w-80 glass-card p-4 overflow-hidden flex flex-col hidden lg:flex border-slate-100 shadow-sm shadow-indigo-50">
      <div className="flex items-center justify-between mb-6 px-2">
         <h2 className="text-xl font-black text-slate-800 tracking-tighter">Messages</h2>
         <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-400 flex items-center justify-center"><Plus size={18} /></div>
      </div>
      <div className="space-y-1 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {['Sneha (IITD)', 'Aryan (IITJ)', 'Moderator Node'].map((name, i) => (
          <div key={i} className={`p-4 rounded-xl cursor-pointer transition-all flex items-center gap-4 ${i === 0 ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'hover:bg-slate-50 text-slate-700'}`}>
            <div className="relative">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} className={`w-12 h-12 rounded-full border-2 ${i === 0 ? 'border-indigo-400' : 'border-white shadow-sm'}`} />
              {i === 2 ? <span className="absolute bottom-0 right-0 w-3 h-3 bg-amber-400 rounded-full border-2 border-white" /> : <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-black text-sm truncate uppercase tracking-tighter">{name}</div>
              <div className={`text-xs truncate ${i === 0 ? 'opacity-80 font-medium' : 'opacity-50'}`}>Available for the Nexus sync?</div>
            </div>
            {i === 1 && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
          </div>
        ))}
      </div>
    </div>
    
    {/* Main Chat Area */}
    <div className="flex-1 glass-card flex flex-col overflow-hidden border-slate-100 shadow-2xl shadow-indigo-100/20">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha (IITD)" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
           <div>
             <div className="font-black text-slate-800 tracking-tight flex items-center gap-2">
               Sneha (IIT Delhi) <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-600 text-[8px] rounded font-black tracking-widest uppercase">Bridge Access</span>
             </div>
             <div className="text-xs text-emerald-500 font-bold flex items-center gap-1.5 flex uppercase tracking-wider">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Nexus Connected
             </div>
           </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"><Shield size={18} /></button>
          <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"><Settings size={18} /></button>
        </div>
      </div>
      
      <div className="flex-1 p-8 space-y-6 overflow-y-auto bg-slate-50/50">
        <div className="flex justify-start">
          <div className="bg-white p-5 rounded-3xl rounded-tl-none shadow-sm max-w-md border border-slate-100 leading-relaxed text-slate-700 text-sm">
            Hey Felix! 👋 I'm from IIT Delhi. Saw you were looking for help with VLSI? We just finished our lab and I have some surplus Nexus credits to trade for your React expertise!
          </div>
        </div>
        
        <div className="text-center my-6">
           <span className="px-4 py-1.5 bg-white shadow-sm border border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest rounded-full">Nexus Bridge Established</span>
        </div>

        <div className="flex justify-end">
          <div className="bg-indigo-600 text-white p-5 rounded-3xl rounded-tr-none shadow-xl shadow-indigo-100 max-w-md leading-relaxed text-sm">
            Perfect! I'm struggling with the CMOS layout. I'd love to swap hours. I'll share my Stanford-curated React notes with you. 🚀
          </div>
        </div>

        <div className="flex justify-start">
           <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 text-amber-900 text-xs italic flex items-center gap-3">
              <AlertTriangle size={16} /> <p>This conversation is monitored by administrators for MOU compliance.</p>
           </div>
        </div>
      </div>
      
      <div className="p-5 bg-white border-t border-slate-100">
        <form className="flex gap-3" onSubmit={(e) => e.preventDefault()}>
          <button type="button" className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100"><Shield size={22} /></button>
          <input 
            type="text" 
            placeholder="Type a secure message..." 
            className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 ring-indigo-500/20 outline-none transition-all text-slate-700 font-medium" 
          />
          <button type="submit" className="p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-95 transition-all">
             <Send size={24} />
          </button>
        </form>
      </div>
    </div>
  </motion.div>
)

const Profile = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
    className="p-8 max-w-4xl mx-auto"
  >
    <div className="glass-card overflow-hidden border-indigo-100">
      <div className="h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />
      <div className="p-8 relative">
        <div className="absolute -top-20 left-8 group">
           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-40 h-40 rounded-3xl bg-white p-2 shadow-2xl border-4 border-white group-hover:scale-105 transition-transform" />
           <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
        </div>
        <div className="mt-20 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
               <h1 className="text-4xl font-black text-slate-900 m-0 tracking-tight">Felix Miller</h1>
               <span className="bg-indigo-600 text-[10px] text-white px-2 py-1 rounded font-black tracking-widest uppercase">Top Contributor</span>
            </div>
            <p className="text-indigo-600 font-black tracking-widest uppercase mt-2 text-xs">CS Junior • IIT Jammu Protocol</p>
          </div>
          <button className="btn-secondary font-black text-xs uppercase tracking-widest px-8">Settings</button>
        </div>

        <div className="grid grid-cols-3 gap-8 mt-12 bg-slate-50 p-8 rounded-3xl border border-slate-100">
           <div className="text-center">
              <div className="text-3xl font-black text-indigo-600">1.2k</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Karma Earned</div>
           </div>
           <div className="text-center border-x border-slate-200">
              <div className="text-3xl font-black text-emerald-600">12</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Trades Sync'd</div>
           </div>
           <div className="text-center">
              <div className="text-3xl font-black text-amber-500">Nexus-A</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Audit Grade</div>
           </div>
        </div>
        
        <div className="mt-12">
           <h2 className="text-xl font-bold mb-6 tracking-tight flex items-center gap-2 underline decoration-indigo-200 decoration-4">Nexus Skills Protocol</h2>
           <div className="flex flex-wrap gap-3">
              {['React.js Architecture', 'Neural Networks', 'Discrete Math', 'Advanced UI/UX'].map(s => (
                <span key={s} className="px-6 py-3 bg-white rounded-2xl border border-slate-200 font-bold text-sm text-slate-600 shadow-sm hover:border-indigo-500 transition-colors cursor-default">{s}</span>
              ))}
              <button className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-sm border border-indigo-100 hover:bg-indigo-100 transition-all flex items-center gap-2">
                <Plus size={18} /> Update Nexus Data
              </button>
           </div>
        </div>
      </div>
    </div>
  </motion.div>
)

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [currentCampus, setCurrentCampus] = useState('IIT Jammu')

  return (
    <div className="min-h-screen selection:bg-indigo-100 overflow-x-hidden bg-slate-50/20 pb-20">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} currentCampus={currentCampus} />
      
      <main className="container mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && <Dashboard key="dashboard" setActiveTab={setActiveTab} />}
          {activeTab === 'explore' && <Explore key="explore" />}
          {activeTab === 'vault' && <Vault key="vault" />}
          {activeTab === 'chat' && <Chat key="chat" />}
          {activeTab === 'profile' && <Profile key="profile" />}
          {activeTab === 'admin' && <Admin key="admin" />}
        </AnimatePresence>
      </main>
      
      <footer className="mt-32 py-16 border-t border-slate-100 text-center bg-white/50 relative overflow-hidden">
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none flex items-center justify-center">
            <h1 className="text-[20rem] font-black rotate-12">NEXUS</h1>
         </div>
         <div className="flex items-center justify-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-xl shadow-indigo-100">E</div>
            <span className="text-2xl font-black tracking-tighter text-slate-800">EduSync Ecosystem</span>
         </div>
         <p className="text-[10px] text-slate-400 mt-6 font-black uppercase tracking-[0.5em] relative z-10">
           Bridging IIT Infrastructure • HackIndia 2026 Submission
         </p>
         <div className="mt-8 flex justify-center gap-8 text-[10px] font-black text-slate-300 uppercase tracking-widest relative z-10">
            <span>MOU Verified</span>
            <span>AES-256 Encrypted</span>
            <span>Student First</span>
         </div>
      </footer>
    </div>
  )
}
