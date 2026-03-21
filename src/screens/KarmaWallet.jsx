import React from 'react'
import { motion } from 'framer-motion'
import { Zap, ArrowUpRight, ArrowDownLeft, Shield, Star, Award, TrendingUp, History, CreditCard, Building2, Globe, ExternalLink } from 'lucide-react'

const KarmaWallet = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
    className="p-10 max-w-7xl mx-auto space-y-12 pb-24"
  >
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div className="space-y-3">
           <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase flex items-center gap-4">
              <Zap className="text-amber-500 fill-current" size={40} /> Karma Ledger
           </h1>
           <p className="text-slate-400 text-lg">Detailed history of peer exchanges and audit compliance ratings.</p>
        </div>
        <div className="flex gap-4">
           <button className="btn-secondary group">
              <History size={18} className="group-hover:-rotate-45 transition-transform" /> Transaction History
           </button>
           <button className="btn-primary">
              <ArrowUpRight size={20} /> Request Audit
           </button>
        </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-10">
         <div className="glass-card p-10 border-white/10 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 relative overflow-hidden flex flex-col justify-between h-[360px] group">
            <div className="absolute top-0 right-0 p-10 opacity-[0.05] group-hover:scale-110 transition-transform">
               <Zap size={240} className="text-amber-400 fill-current" />
            </div>
            <div className="flex justify-between items-start relative z-10">
               <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">Total Available Balance</p>
                  <h2 className="text-8xl font-black text-white tracking-tighter flex items-end gap-4 leading-none">
                     1,240 <span className="text-2xl text-amber-500 font-bold mb-3 italic">KRMA</span>
                  </h2>
               </div>
               <div className="p-4 bg-white/5 rounded-3xl border border-white/10 text-white backdrop-blur-3xl shadow-2xl">
                  <CreditCard size={32} />
               </div>
            </div>
            
            <div className="flex items-center gap-6 relative z-10">
               <div className="flex-1 p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Total Earned</span>
                     <TrendingUp size={14} className="text-emerald-500" />
                  </div>
                  <p className="text-2xl font-black text-white uppercase tracking-tighter leading-none">+2,450</p>
               </div>
               <div className="flex-1 p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Spent</span>
                     <TrendingUp size={14} className="text-slate-600 rotate-180" />
                  </div>
                  <p className="text-2xl font-black text-white uppercase tracking-tighter leading-none">-1,210</p>
               </div>
               <div className="flex items-center gap-4 py-8 px-12 bg-amber-500/10 border border-amber-500/20 rounded-[2.5rem] shadow-[0_0_50px_rgba(245,158,11,0.2)] scale-110">
                  <Star size={32} className="text-amber-500 fill-current" />
                  <div>
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Nexus Level</p>
                    <p className="text-2xl font-black text-white leading-none tracking-tighter italic">VETERAN-2</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="glass-card p-10 border-white/5 bg-slate-950/20">
            <h3 className="text-2xl font-black text-white mb-10 tracking-tight flex items-center gap-4 uppercase italic">
               <History size={24} className="text-indigo-400" /> Recent Transactions
            </h3>
            <div className="space-y-4">
              {[
                { type: 'Earned', amt: '+50', desc: 'Verified CS101 Resource Upload', user: 'IIT Jammu Vault', time: '2h ago', pos: true },
                { type: 'Spent', amt: '-25', desc: 'Unlocked Advanced Robotics Lab', user: 'IIT Bombay Node', time: '1d ago', pos: false },
                { type: 'Earned', amt: '+120', desc: 'Skill-Swap Session: VLSI Basics', user: 'Sneha (IITD)', time: '3d ago', pos: true },
                { type: 'Bonus', amt: '+100', desc: 'Weekly Contribution Milestone', user: 'Protocol Node', time: '5d ago', pos: true },
              ].map((tx, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group cursor-pointer">
                  <div className="flex items-center gap-6">
                     <div className={`p-4 rounded-2xl border transition-all group-hover:scale-110 ${tx.pos ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' : 'bg-slate-500/10 text-slate-500 border-white/5'}`}>
                        {tx.pos ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                     </div>
                     <div>
                        <p className="text-lg font-black text-white leading-none tracking-tight">{tx.desc}</p>
                        <p className="text-[10px] text-slate-600 mt-2 font-black uppercase tracking-widest flex items-center gap-2">
                           {tx.user} <span className="w-1 h-1 bg-slate-800 rounded-full"></span> {tx.time}
                        </p>
                     </div>
                  </div>
                  <div className={`text-2xl font-black tracking-tighter italic ${tx.pos ? 'text-emerald-400' : 'text-slate-400 group-hover:text-white'}`}>
                     {tx.amt}
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 py-5 text-xs font-black uppercase tracking-[0.4em] text-slate-600 hover:text-white transition-colors border-t border-white/5 pt-10">Load Full Audit History</button>
         </div>
      </div>

      <div className="space-y-10">
         <div className="glass-card p-10 border-white/5 bg-slate-900 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
               <Shield size={160} />
            </div>
            <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500 mb-8 border border-emerald-500/10 shadow-2xl shadow-emerald-600/10">
               <Shield size={32} />
            </div>
            <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase italic underline decoration-emerald-500 decoration-4">Audit Compliance</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-medium mb-10">
              Your Karma balance is verified by the multi-campus protocol. High compliance scores (Nexus-A) unlock premium Cross-Campus bridge links and lower resource costs.
            </p>
            <div className="space-y-6 mb-10">
               <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-600 mb-2">
                  <span>Trust Score</span>
                  <span className="text-emerald-500">98% Verified</span>
               </div>
               <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '98%' }}
                    transition={{ duration: 2, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  />
               </div>
            </div>
            <button className="btn-secondary w-full py-4 text-[10px] uppercase tracking-widest font-black flex items-center justify-center gap-3">
               <ExternalLink size={18} /> View Verification Node
            </button>
         </div>

         <div className="glass-card p-10 border-white/10 bg-gradient-to-br from-amber-600/10 to-amber-900/10">
            <div className="flex justify-between items-start mb-10">
               <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-500 border border-amber-500/20">
                  <Award size={32} />
               </div>
               <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/5 px-2 py-1 rounded">Next Milestone</span>
            </div>
            <h3 className="text-2xl font-black text-white mb-2 italic">Nexus Elite Unlock</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Earn <span className="text-amber-400 font-black">260 more Karma</span> to unlock Nexus Elite status and participate in exclusive inter-IIT research collaborative groups.
            </p>
            <button className="mt-10 btn-primary w-full py-4 uppercase tracking-[0.3em] font-black bg-amber-600 hover:bg-amber-500 shadow-amber-600/20">Claim Weekly Bonus</button>
         </div>

         <div className="glass-card p-10 border-white/5 bg-white/5 flex items-center gap-6 group hover:translate-x-2 transition-all cursor-pointer">
            <div className="p-4 bg-white/5 rounded-2xl text-slate-600 group-hover:text-indigo-400 transition-colors">
               <Building2 size={32} />
            </div>
            <div>
               <p className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors">Campus MOU Benefits</p>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Check active discounts</p>
            </div>
         </div>
      </div>
    </div>
  </motion.div>
)

export default KarmaWallet
