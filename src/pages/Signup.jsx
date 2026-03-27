import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../stores/useAuthStore'
import { Shield, Mail, Lock, User, ArrowRight, Building2, Zap } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [campus, setCampus] = useState('IIT Jammu')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuthStore()
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      await signUp(email, password, { full_name: name, campus: campus })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
        <center className="space-y-6">
          <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full mx-auto flex items-center justify-center border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
            <Zap size={48} className="animate-pulse" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-widest uppercase italic">Profile Deployed!</h1>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">A verification link is on its way. Use it to activate your Nexus access.</p>
          <p className="text-indigo-400 text-xs font-black uppercase tracking-[0.2em] mt-8 animate-bounce">Redirecting to login portal...</p>
        </center>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
      <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/20 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="glass-card p-10 border-white/5 bg-slate-900/40 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-20"></div>
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-indigo-600/30">
              <Shield size={32} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic mb-2">New Nexus ID</h1>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest italic">Provisioning Student Infrastructure v4.0</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold uppercase tracking-widest text-center">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Full Name</label>
                 <div className="relative">
                   <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                   <input 
                     type="text" 
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     placeholder="John Doe"
                     className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-700 focus:border-indigo-500/50 outline-none transition-all"
                     required
                   />
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Institute</label>
                 <div className="relative">
                   <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                   <select 
                     value={campus}
                     onChange={(e) => setCampus(e.target.value)}
                     className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-700 focus:border-indigo-500/50 outline-none transition-all appearance-none"
                   >
                      {['IIT Jammu', 'IIT Delhi', 'IIT Bombay', 'IIT Kharagpur'].map(c => (
                        <option key={c} value={c} className="bg-slate-900">{c}</option>
                      ))}
                   </select>
                 </div>
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Institute E-Mail</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-700 focus:border-indigo-500/50 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Master Access Key</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-700 focus:border-indigo-500/50 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-5 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-indigo-500/20 group h-14"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Deploy Profile <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/5 flex flex-col gap-6">
            <div className="text-center text-[10px] font-black text-slate-600 uppercase tracking-widest">
              Nexus Profile Ready? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 ml-1">Authenticate Portal</Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Signup
