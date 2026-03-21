import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Dashboard from './screens/Dashboard'
import Explore from './screens/Explore'
import Vault from './screens/Vault'
import Chat from './screens/Chat'
import Admin from './screens/Admin'
import Profile from './screens/Profile'
import Onboarding from './screens/Onboarding'
import KarmaWallet from './screens/KarmaWallet'

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [currentCampus, setCurrentCampus] = useState('IIT Jammu')
  const [showOnboarding, setShowOnboarding] = useState(false)
  
  // Simulation: Show onboarding for new users
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('edusync_onboarded')
    if (!hasSeenOnboarding) {
      setShowOnboarding(true)
    }
  }, [])

  const handleOnboardingComplete = () => {
    localStorage.setItem('edusync_onboarded', 'true')
    setShowOnboarding(false)
  }

  return (
    <div className="min-h-screen selection:bg-indigo-500/30 overflow-x-hidden font-inter">
      {/* Background Orbs for Deep Dark Aura */}
      <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-emerald-900/5 rounded-full blur-[100px] animate-bounce"></div>
      </div>

      <AnimatePresence>
        {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} key="onboarding" />}
      </AnimatePresence>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} currentCampus={currentCampus} />
      
      <main className="container mx-auto pb-32">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && <Dashboard key="dashboard" setActiveTab={setActiveTab} />}
          {activeTab === 'explore' && <Explore key="explore" />}
          {activeTab === 'vault' && <Vault key="vault" />}
          {activeTab === 'chat' && <Chat key="chat" />}
          {activeTab === 'profile' && <Profile key="profile" />}
          {activeTab === 'admin' && <Admin key="admin" />}
          {activeTab === 'wallet' && <KarmaWallet key="wallet" />}
        </AnimatePresence>
      </main>
      
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
    </div>
  )
}
