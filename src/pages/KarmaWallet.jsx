import { motion } from 'framer-motion'
import { Zap, ArrowUpRight, ArrowDownLeft, Shield, Star, Award, TrendingUp, History, CreditCard, Building2, ExternalLink } from 'lucide-react'

export default function KarmaWallet() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
      className="p-10 max-w-7xl mx-auto space-y-12 pb-24 font-sans"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div className="space-y-3">
             <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase flex items-center gap-4">
                <Zap className="text-amber-500 fill-current" size={40} /> Karma Ledger
             </h1>
             <p className="text-slate-500 text-lg font-medium">Detailed history of peer exchanges and audit compliance ratings.</p>
          </div>
          <div className="flex gap-4">
             <button className="h-12 px-6 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2">
                <History size={18} /> Transaction History
             </button>
             <button className="h-12 px-8 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2">
                <ArrowUpRight size={20} /> Request Audit
             </button>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
           <div className="p-10 rounded-[40px] border border-slate-100 bg-navy relative overflow-hidden flex flex-col justify-between h-[360px] group shadow-2xl">
              <div className="absolute top-0 right-0 p-10 opacity-[0.05] group-hover:scale-110 transition-transform">
                 <Zap size={240} className="text-amber-400 fill-current" />
              </div>
              <div className="flex justify-between items-start relative z-10 text-white">
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

           <div className="p-10 rounded-[40px] border border-slate-100 bg-white shadow-xl">
              <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight flex items-center gap-4 uppercase italic">
                 <History size={24} className="text-indigo-600" /> Recent Transactions
              </h3>
              <div className="space-y-4">
                {[
                  { type: 'Earned', amt: '+50', desc: 'Verified CS101 Resource Upload', user: 'IIT Jammu Vault', time: '2h ago', pos: true },
                  { type: 'Spent', amt: '-25', desc: 'Unlocked Advanced Robotics Lab', user: 'IIT Bombay Node', time: '1d ago', pos: false },
                  { type: 'Earned', amt: '+120', desc: 'Skill-Swap Session: VLSI Basics', user: 'Sneha (IITD)', time: '3d ago', pos: true },
                  { type: 'Bonus', amt: '+100', desc: 'Weekly Contribution Milestone', user: 'Protocol Node', time: '5d ago', pos: true },
                ].map((tx, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all group cursor-pointer shadow-sm">
                    <div className="flex items-center gap-6">
                       <div className={`p-4 rounded-2xl border transition-all group-hover:scale-110 ${tx.pos ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' : 'bg-slate-200 text-slate-500 border-slate-300'}`}>
                          {tx.pos ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                       </div>
                       <div>
                          <p className="text-lg font-black text-slate-900 leading-none tracking-tight">{tx.desc}</p>
                          <p className="text-[10px] text-slate-400 mt-2 font-black uppercase tracking-widest flex items-center gap-2">
                             {tx.user} <span className="w-1 h-1 bg-slate-200 rounded-full"></span> {tx.time}
                          </p>
                       </div>
                    </div>
                    <div className={`text-2xl font-black tracking-tighter italic ${tx.pos ? 'text-emerald-500' : 'text-slate-400'}`}>
                       {tx.amt}
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-10 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 hover:text-indigo-600 transition-colors border-t border-slate-100 pt-10">Load Full Audit History</button>
           </div>
        </div>

        <div className="space-y-10">
           <div className="p-10 rounded-[40px] border border-slate-100 bg-slate-900 relative overflow-hidden flex flex-col shadow-xl">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-white">
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
                 <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">
                    <span>Trust Score</span>
                    <span className="text-emerald-500">98% Verified</span>
                 </div>
                 <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '98%' }}
                      transition={{ duration: 2, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                    />
                 </div>
              </div>
              <button className="w-full h-14 bg-white/5 text-white rounded-2xl text-[10px] uppercase tracking-widest font-black flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                 <ExternalLink size={18} /> View Verification Node
              </button>
           </div>

           <div className="p-10 rounded-[40px] border border-amber-100 bg-amber-50 shadow-xl">
              <div className="flex justify-between items-start mb-10">
                 <div className="p-4 bg-white rounded-2xl text-amber-500 border border-amber-200 shadow-sm">
                    <Award size={32} />
                 </div>
                 <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-200/50 px-2 py-1 rounded">Next Milestone</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2 italic tracking-tight">Nexus Elite Unlock</h3>
              <p className="text-sm text-amber-700/60 font-medium leading-relaxed">
                Earn <span className="text-amber-600 font-black">260 more Karma</span> to unlock Nexus Elite status and participate in exclusive collaborative groups.
              </p>
              <button className="mt-10 w-full h-16 bg-amber-500 text-white rounded-2xl text-xs uppercase tracking-[0.3em] font-black hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/30">Claim Weekly Bonus</button>
           </div>

           <div className="p-10 rounded-[40px] border border-slate-100 bg-white shadow-lg flex items-center gap-6 group hover:translate-x-2 transition-all cursor-pointer">
              <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-indigo-600 transition-colors">
                 <Building2 size={32} />
              </div>
              <div>
                 <p className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">Campus MOU Benefits</p>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Check active discounts</p>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  )
}
