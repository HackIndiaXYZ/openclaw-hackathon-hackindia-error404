import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

import { useAuthStore } from './stores/useAuthStore'
import { useUIStore } from './stores/useUIStore'

import Navbar from './components/layout/Navbar'
import Dashboard from './pages/Dashboard'
import Explore from './pages/Explore'
import Vault from './pages/Vault'
import Chat from './pages/Chat'
import Admin from './pages/Admin'
import Profile from './pages/Profile'
import Onboarding from './pages/Onboarding'
import KarmaWallet from './pages/KarmaWallet'
import Login from './pages/Login'
import Signup from './pages/Signup'

// Wrapper component to handle routing logic
const AppContent = () => {
  const { user, loading, initialize } = useAuthStore()
  const { currentCampus } = useUIStore()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const location = useLocation()
  const isAuthPage = ['/login', '/signup'].includes(location.pathname)
  
  useEffect(() => {
    const unsubscribe = initialize()
    
    const hasSeenOnboarding = localStorage.getItem('edusync_onboarded')
    if (!hasSeenOnboarding) {
      setShowOnboarding(true)
    }

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [initialize])

  const handleOnboardingComplete = () => {
    localStorage.setItem('edusync_onboarded', 'true')
    setShowOnboarding(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="space-y-6 text-center">
           <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-2xl shadow-indigo-600/30 animate-bounce">
              <span className="text-3xl font-black">E</span>
           </div>
           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] animate-pulse">Establishing Nexus Connection...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen selection:bg-indigo-500/30 overflow-x-hidden font-inter bg-slate-950">
      {/* Background Orbs for Deep Dark Aura */}
      <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-emerald-900/5 rounded-full blur-[100px] animate-bounce"></div>
      </div>

      <AnimatePresence>
        {showOnboarding && !isAuthPage && user && <Onboarding onComplete={handleOnboardingComplete} key="onboarding" />}
      </AnimatePresence>

      {!isAuthPage && user && <Navbar currentCampus={currentCampus} />}
      
      <main className={!isAuthPage ? "container mx-auto pb-32" : ""}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
            
            <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/explore" element={user ? <Explore /> : <Navigate to="/login" />} />
            <Route path="/vault" element={user ? <Vault /> : <Navigate to="/login" />} />
            <Route path="/chat" element={user ? <Chat /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/admin" element={user ? <Admin /> : <Navigate to="/login" />} />
            <Route path="/wallet" element={user ? <KarmaWallet /> : <Navigate to="/login" />} />
          </Routes>
        </AnimatePresence>
      </main>
      
      {!isAuthPage && user && (
        <footer className="mt-32 py-24 border-t border-white/5 text-center bg-slate-950/40 relative overflow-hidden">
           <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none flex items-center justify-center">
              <h1 className="text-[24rem] font-black rotate-12 tracking-tighter uppercase italic">NEXUS</h1>
           </div>
           <div className="container mx-auto px-8 relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-2xl shadow-indigo-600/30">E</div>
                 <div className="text-left">
                    <span className="text-2xl font-black tracking-tighter text-white uppercase italic block">EduSync Ecosystem</span>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Proprietary Multi-Campus Protocol v4.0</span>
                 </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-12 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                 <span className="flex items-center gap-2 hover:text-indigo-400 transition-colors cursor-pointer"><div className="w-1 h-1 bg-indigo-500 rounded-full"></div> MOU Verified</span>
                 <span className="flex items-center gap-2 hover:text-emerald-400 transition-colors cursor-pointer"><div className="w-1 h-1 bg-emerald-500 rounded-full"></div> AES-256 Auth</span>
                 <span className="flex items-center gap-2 hover:text-amber-400 transition-colors cursor-pointer"><div className="w-1 h-1 bg-amber-500 rounded-full"></div> OpenClaw Hackathon</span>
              </div>

              <p className="text-[9px] text-slate-600 font-bold max-w-xs text-right hidden lg:block leading-relaxed">
                 Part of the HackIndia 2026 Initiative. Bridging the gap between theory and multi-institutional execution.
              </p>
           </div>
           
           <div className="mt-20 text-[9px] font-black text-slate-800 uppercase tracking-[0.6em]">
              Digital Campus Bridge Strategy • Secured Infrastructure
           </div>
        </footer>
      )}
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}
