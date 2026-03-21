import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CheckCircle, Shield, Building2, User, Zap, Globe, GraduationCap } from 'lucide-react'

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    campus: 'IIT Jammu',
    major: '',
    role: 'Student',
    interests: []
  })

  const steps = [
    { title: 'Identity Verification', icon: Shield, desc: 'Connect your institutional ID.' },
    { title: 'Campus Selection', icon: Building2, desc: 'Set your primary home campus.' },
    { title: 'Nexus Interests', icon: Zap, desc: 'What skills are you trading?' },
  ]

  const next = () => {
    if (step < 3) setStep(step + 1)
    else onComplete()
  }

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center p-8">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-[160px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[160px] animate-pulse delay-700"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-card w-full max-w-2xl p-12 border-white/10 relative overflow-hidden bg-slate-900/40 shadow-2xl"
      >
        <div className="flex justify-center gap-6 mb-16">
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-3 relative">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${step > i + 1 ? 'bg-emerald-500 border-emerald-500 text-white shadow-xl shadow-emerald-600/20' : step === i + 1 ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5 shadow-2xl shadow-indigo-600/10' : 'border-white/5 text-slate-700 bg-white/5'}`}>
                 {step > i + 1 ? <CheckCircle size={28} /> : <s.icon size={28} />}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] transform transition-all ${step === i + 1 ? 'text-white translate-y-2' : 'text-slate-600 opacity-60'}`}>{s.title}</span>
              {i < 2 && <div className={`absolute left-16 top-7 w-12 h-0.5 transition-all duration-500 ${step > i + 1 ? 'bg-emerald-500 shadow-lg shadow-emerald-600/50' : 'bg-white/5'}`}></div>}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            {step === 1 && (
              <div className="space-y-8 text-center">
                 <div className="space-y-4">
                    <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Initialize Identity</h2>
                    <p className="text-slate-400 max-w-sm mx-auto text-sm leading-relaxed font-medium">Verified student accounts ensure a high-trust environment across the EduSync Nexus network.</p>
                 </div>
                 <div className="space-y-6">
                    <div className="p-10 border-2 border-dashed border-white/10 rounded-[2.5rem] bg-white/5 group hover:border-indigo-500/30 hover:bg-white/10 transition-all cursor-pointer">
                       <User size={80} className="mx-auto text-slate-700 group-hover:text-indigo-500 group-hover:scale-110 transition-all" />
                       <p className="mt-8 text-xs font-black uppercase tracking-[0.3em] text-slate-500 group-hover:text-white">Upload .edu Credentials</p>
                    </div>
                    <div className="flex items-center gap-4 p-5 bg-indigo-600/10 border border-indigo-600/20 rounded-2xl text-indigo-400 text-xs font-bold leading-snug text-left italic">
                       <Shield size={24} className="shrink-0" />
                       "Multi-layered encryption protects your data during institution-level verification."
                    </div>
                 </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-10">
                 <div className="text-center space-y-4">
                    <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Bridge Selected</h2>
                    <p className="text-slate-400 text-sm font-medium">Your primary campus serves as your local node in the Nexus.</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    {['IIT Jammu', 'IIT Delhi', 'IIT Bombay', 'IIT Madras'].map(c => (
                      <button 
                        key={c}
                        onClick={() => setForm({...form, campus: c})}
                        className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 text-center ${form.campus === c ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-2xl shadow-indigo-600/20' : 'border-white/5 bg-white/5 text-slate-500 hover:border-white/10 hover:text-white'}`}
                      >
                         <Building2 size={32} />
                         <span className="font-black text-xs uppercase tracking-widest">{c}</span>
                      </button>
                    ))}
                 </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-10">
                 <div className="text-center space-y-4">
                    <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Sync Protocol</h2>
                    <p className="text-slate-400 text-sm font-medium">Select your core specializations to help matching algorithms.</p>
                 </div>
                 <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       {['CS & AI', 'UI/UX Design', 'Electronics', 'Mathematics', 'Robotics', 'Philosophy'].map(int => (
                         <button 
                           key={int}
                           onClick={() => {
                             const newInt = form.interests.includes(int) ? form.interests.filter(i => i !== int) : [...form.interests, int]
                             setForm({...form, interests: newInt})
                           }}
                           className={`p-5 rounded-2xl border transition-all text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 ${form.interests.includes(int) ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}
                         >
                            <Zap size={16} className={form.interests.includes(int) ? 'fill-current' : ''} /> {int}
                         </button>
                       ))}
                    </div>
                    <div className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl text-slate-500 text-xs font-bold leading-snug">
                       <GraduationCap size={24} className="shrink-0" />
                       Selecting your major helps us connect you with verified resources in the Knowledge Vault.
                    </div>
                 </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-16 flex justify-between items-center relative z-10 pt-10 border-t border-white/5">
           <div className="flex gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-indigo-500' : 'bg-white/5'}`}></span>
              <span className={`w-2 h-2 rounded-full ${step >= 3 ? 'bg-indigo-500' : 'bg-white/5'}`}></span>
           </div>
           <button 
             onClick={next}
             className="btn-primary py-4 px-12 rounded-3xl font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-indigo-600/30 transition-all flex items-center gap-4 group"
           >
             {step === 3 ? 'Initialize Nexus' : 'Continue'} <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
           </button>
        </div>
      </motion.div>
      
      <div className="absolute bottom-12 flex items-center gap-3 opacity-30 select-none">
         <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-sm">E</div>
         <span className="text-xl font-black tracking-tighter text-white">EduSync Protocol</span>
      </div>
    </div>
  )
}

export default Onboarding
