import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, Zap, Star, Globe, 
  CheckCircle, XCircle, MessageSquare, 
  ArrowRight, ShieldCheck, Clock, Flag
} from 'lucide-react'
import { toast } from 'sonner'
import Button from '../components/ui/Button'
import Avatar from '../components/ui/Avatar'

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'SWAP_REQUEST', title: 'New Swap Request!', message: 'Arjun P. from NIT-N wants to learn "React Hooks" from you.', time: '2 mins ago', status: 'pending', sender: 'Arjun P.' },
  { id: 2, type: 'KARMA_EARNED', title: 'Karma Credited!', message: 'You earned 50 Karma for "CMOS Layout" resource unlock.', time: '1h ago', status: 'read' },
  { id: 3, type: 'NEXUS_ALERT', title: 'Nexus Mode Active', message: 'Indravali Technical University (ITU) has joined the Nexus.', time: '4h ago', status: 'read' },
  { id: 4, type: 'SWAP_ACCEPTED', title: 'Swap Confirmed!', message: 'Priya S. accepted your request for "VLSI Design".', time: '12h ago', status: 'read' },
]

export default function Notifications() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

  const handleAction = (id, action) => {
    setNotifications(notifications.filter(n => n.id !== id))
    toast.success(action === 'accept' ? 'Swap Request Accepted! Bridge channel opened.' : 'Request Declined. Karma refunded to requester.')
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 pb-24 lg:pb-10 font-sans">
      <div className="flex items-center justify-between mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Nexus Real-time Feed</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 font-outfit tracking-tighter mb-2">Notifications</h1>
          <p className="text-slate-500 font-medium">Platform-wide updates and peer-to-peer signals.</p>
        </div>
        
        <button className="p-4 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all border border-slate-100 flex items-center gap-2 text-xs font-black uppercase tracking-widest">
          <CheckCircle size={16} /> Mark all read
        </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {notifications.map((notif, idx) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: idx * 0.05 }}
              className={`
                group relative bg-white rounded-3xl p-6 border-2 transition-all overflow-hidden
                ${notif.status === 'pending' ? 'border-indigo-100 bg-indigo-50/10 shadow-xl shadow-indigo-100/20' : 'border-slate-50 hover:border-slate-200'}
              `}
            >
              <div className="flex items-start gap-6 relative z-10">
                <div className={`
                  w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg
                  ${notif.type === 'SWAP_REQUEST' ? 'bg-indigo-600 text-white' : 
                    notif.type === 'KARMA_EARNED' ? 'bg-emerald-500 text-white' : 
                    'bg-slate-900 text-white'}
                `}>
                  {notif.type === 'SWAP_REQUEST' ? <Zap size={24} /> : 
                   notif.type === 'KARMA_EARNED' ? <Star size={24} fill="currentColor" /> : 
                   <Bell size={24} />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-black text-slate-900 font-outfit uppercase tracking-tighter">{notif.title}</h3>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                      <Clock size={12} /> {notif.time}
                    </div>
                  </div>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed mb-4">
                    {notif.message}
                  </p>

                  {notif.type === 'SWAP_REQUEST' && (
                    <div className="flex items-center gap-3">
                      <Button 
                        size="sm" 
                        variant="primary" 
                        className="rounded-xl px-6"
                        onClick={() => handleAction(notif.id, 'accept')}
                      >
                        Accept Request
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="rounded-xl px-6 text-rose-500 hover:bg-rose-50"
                        onClick={() => handleAction(notif.id, 'reject')}
                      >
                        Decline
                      </Button>
                      <div className="w-px h-6 bg-slate-100 mx-1" />
                      <button className="text-[10px] font-black uppercase text-indigo-600 tracking-widest hover:underline">View Profile</button>
                    </div>
                  )}

                  {notif.type === 'KARMA_EARNED' && (
                    <div className="flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 self-start px-3 py-1 rounded-lg">
                      <ShieldCheck size={14} /> Institution Verified Transaction
                    </div>
                  )}
                </div>

                {/* Status Dot */}
                {notif.status === 'pending' && (
                  <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full absolute top-6 right-6 ring-4 ring-indigo-50" />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {notifications.length === 0 && (
          <div className="py-24 text-center bg-white rounded-[3rem] border border-slate-50">
            <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest font-outfit">Feed Clear</h3>
            <p className="text-slate-400 text-sm mt-2">Check back later for inter-campus signals.</p>
          </div>
        )}
      </div>
      
      {/* Footer Info */}
      <div className="mt-16 flex items-center justify-center gap-12 opacity-30 grayscale border-t border-slate-100 pt-10">
        <div className="flex items-center gap-2">
           <ShieldCheck size={16} />
           <span className="text-[10px] font-bold uppercase tracking-widest">Safe Exchange</span>
        </div>
        <div className="flex items-center gap-2">
           <Flag size={16} />
           <span className="text-[10px] font-bold uppercase tracking-widest">Report Misconduct</span>
        </div>
      </div>
    </div>
  )
}
