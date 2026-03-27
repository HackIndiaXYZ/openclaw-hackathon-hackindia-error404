import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../stores/useAuthStore'
import { Shield, Mail, Lock, ArrowRight, Github } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuthStore()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      await signIn(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
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
        className="w-full max-w-md"
      >
        <div className="glass-card p-10 border-white/5 bg-slate-900/40 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-20"></div>
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-indigo-600/30">
              <Shield size={32} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic mb-2">Nexus Portal</h1>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest italic">Academic Infrastructure Access v4.0</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold uppercase tracking-widest text-center">
                {error}
              </div>
            )}

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
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Access Key</label>
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
                  Authenticate <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/5 flex flex-col gap-6">
            <button className="flex items-center justify-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors">
              <Github size={18} /> Continue with GitHub
            </button>
            <div className="text-center text-[10px] font-black text-slate-600 uppercase tracking-widest">
              Don't have an ID? <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 ml-1">Deploy New Profile</Link>
            </div>
          </div>
        </div>
        
        <p className="mt-8 text-center text-[9px] font-black text-slate-700 uppercase tracking-[0.4em]">
          University Single Sign-On • Encrypted Nexus Protocol
        </p>
      </motion.div>
    </div>
  )
}

export default Login
