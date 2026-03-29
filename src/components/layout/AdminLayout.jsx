import React, { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldAlert, LayoutDashboard, Users, 
  Settings, LogOut, Menu, X, 
  Bell, Search, Globe, Activity,
  Database, ShieldCheck
} from 'lucide-react'
import Avatar from '../ui/Avatar'
import { useAuthStore } from '../../stores/authStore'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Core Dashboard', path: '/admin' },
  { icon: ShieldAlert, label: 'Moderation Feed', path: '/admin/moderation' },
  { icon: Users, label: 'Campus Directory', path: '/admin/users' },
  { icon: Activity, label: 'System Health', path: '/admin/health' },
  { icon: Database, label: 'Vault Audit', path: '/admin/vault' },
  { icon: Settings, label: 'Node Settings', path: '/admin/settings' },
]

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const location = useLocation()
  const { profile, signOut } = useAuthStore()

  return (
    <div className="flex h-screen bg-[#020617] text-slate-400 font-sans overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className="bg-[#0f172a] border-r border-white/5 relative z-50 overflow-hidden hidden md:flex flex-col"
      >
        <div className="p-8 pb-12">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-600/20">
              <ShieldAlert size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black font-outfit uppercase tracking-tighter text-xl leading-none">Admin Cell</span>
              <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest mt-1">Institutional Node</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group
                  ${isActive 
                    ? 'bg-rose-600 text-white shadow-xl shadow-rose-600/20' 
                    : 'hover:bg-white/5 hover:text-white'}
                `}
              >
                <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-rose-400'} />
                <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-8 border-t border-white/5">
          <button 
            onClick={signOut}
            className="flex items-center gap-4 text-slate-500 hover:text-rose-500 transition-colors uppercase tracking-[0.2em] text-[10px] font-black"
          >
            <LogOut size={16} /> Termination Session
          </button>
        </div>
      </motion.aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-[#020617] border-b border-white/5 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-400"><Menu size={24} /></button>
            <div className="relative group hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-rose-500 transition-colors" size={18} />
              <input 
                placeholder="Search global repository..."
                className="bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 py-2 text-xs text-white outline-none focus:border-rose-500 transition-all w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All Nodes Operational
            </div>
            
            <div className="w-px h-6 bg-white/10" />
            
            <div className="flex items-center gap-4">
               <div className="text-right hidden sm:block">
                  <div className="text-xs font-black text-white">{profile?.full_name || 'Admin'}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Master Oversight</div>
               </div>
               <Avatar seed={profile?.full_name} size="sm" ring border />
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <Outlet />
        </main>
      </div>

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full" />
      </div>
    </div>
  )
}
