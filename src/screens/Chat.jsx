import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Shield, Settings, Plus, AlertTriangle, ShieldCheck, Zap, Globe, MessageCircle, MoreVertical } from 'lucide-react'
import { io } from 'socket.io-client'
import { SOCKET_URL } from '../config'

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! 👋 My Prof at IIT Delhi approved the MOU exchange credits! I've uploaded the VLSI CMOS layout workbook to the vault for you. Available for a session soon?", sender: 'Sneha', time: '10:00 AM' },
    { id: 2, text: "Perfect! I just saw the notification. I've prepped the React architecture session for you in return. Wednesday 3PM works for me! 🚀", sender: 'me', time: '10:05 AM' }
  ]);
  const [inputText, setInputText] = useState('');
  const [moderationAlert, setModerationAlert] = useState(null);
  const socketRef = useRef();
  const chatEndRef = useRef();

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);
    
    socketRef.current.emit('join_collab', 'room_iitj_iitd_001');

    socketRef.current.on('receive_message', (data) => {
      setMessages(prev => [...prev, { id: Date.now(), text: data.content, sender: data.sender, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    });

    socketRef.current.on('moderation_alert', (data) => {
      setModerationAlert(data.message);
      setTimeout(() => setModerationAlert(null), 5000);
    });

    return () => socketRef.current.disconnect();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const msgData = {
      content: inputText,
      sender: 'me',
      roomId: 'room_iitj_iitd_001'
    };

    socketRef.current.emit('send_message', msgData);
    setMessages(prev => [...prev, { id: Date.now(), text: inputText, sender: 'me', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setInputText('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="h-[calc(100vh-140px)] p-8 flex gap-8 max-w-[1600px] mx-auto"
    >
      {/* Sidebar: matched peers */}
      <div className="w-[400px] glass-card p-6 overflow-hidden flex flex-col hidden lg:flex border-white/5 bg-slate-950/20 shadow-2xl">
        <div className="flex items-center justify-between mb-8 px-2">
           <h2 className="text-2xl font-black text-white tracking-tight uppercase italic flex items-center gap-3">
              <MessageCircle size={24} className="text-indigo-500" /> Peer Sync
           </h2>
           <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-indigo-400 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all">
              <Plus size={22} />
           </button>
        </div>
        
        <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {[
            { name: 'Sneha (IIT Delhi)', status: 'Nexus Link Active', online: true, active: true },
            { name: 'Aryan K. (IIT Jammu)', status: 'Local Peer', online: true },
            { name: 'Dr. Vikram (IITD)', status: 'Nexus Admin Node', online: false },
          ].map((peer, i) => (
            <div key={i} className={`p-5 rounded-2xl cursor-pointer transition-all flex items-center gap-5 border ${peer.active ? 'bg-indigo-600 border-indigo-500 text-white shadow-2xl' : 'hover:bg-white/5 text-slate-400 border-white/5'}`}>
              <div className="relative">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${peer.name}`} className="w-12 h-12 rounded-2xl border-2 border-white/10" />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-slate-950 ${peer.online ? 'bg-emerald-500' : 'bg-slate-700'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-black text-sm truncate uppercase tracking-tighter text-white">{peer.name}</div>
                <div className="text-[10px] font-black uppercase tracking-widest mt-0.5 opacity-60">{peer.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 glass-card flex flex-col overflow-hidden border-white/5 bg-slate-950/30">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-3xl shadow-lg relative z-10">
          <div className="flex items-center gap-5">
             <div className="relative">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha (IIT Delhi)" className="w-14 h-14 rounded-2xl border-2 border-indigo-500/50" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-slate-950"></div>
             </div>
             <div>
               <div className="font-black text-white text-xl tracking-tight flex items-center gap-3">
                 Sneha (IIT Delhi) <span className="nexus-badge animate-pulse">MOU Bridge Link</span>
               </div>
               <div className="text-xs text-indigo-400 font-black flex items-center gap-2 mt-1 uppercase tracking-widest">
                 <ShieldCheck size={14} className="text-emerald-500" /> Active Skill-Swap: VLSI Design ↔ React architecture
               </div>
             </div>
          </div>
          <button className="p-3 bg-white/5 text-slate-400 rounded-xl hover:text-white border border-white/5"><MoreVertical size={20} /></button>
        </div>
        
        <div className="flex-1 p-10 space-y-8 overflow-y-auto bg-slate-950/20 custom-scrollbar relative">
          <AnimatePresence>
            {moderationAlert && (
              <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="flex justify-center sticky top-0 z-50">
                 <div className="px-6 py-3 bg-amber-500/20 border border-amber-500/30 rounded-2xl text-[11px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-3 shadow-2xl backdrop-blur-3xl">
                    <Shield size={16} /> {moderationAlert}
                 </div>
              </motion.div>
            )}
          </AnimatePresence>

          {messages.map((msg, i) => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-5 rounded-3xl max-w-lg shadow-2xl ${msg.sender === 'me' ? 'bg-indigo-600 text-white rounded-tr-none border border-indigo-500' : 'bg-white/10 text-slate-200 rounded-tl-none border border-white/10 backdrop-blur-md'}`}>
                <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                <div className={`text-[9px] font-black uppercase tracking-widest mt-3 opacity-60 ${msg.sender === 'me' ? 'text-indigo-200' : 'text-slate-500'}`}>
                  {msg.sender === 'me' ? 'Arjun' : msg.sender} • {msg.time}
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        
        <div className="p-8 bg-slate-950/50 border-t border-white/5">
          <form className="flex gap-4 p-2 bg-white/5 rounded-[2rem] border border-white/10 group focus-within:border-indigo-500/50 transition-all" onSubmit={handleSendMessage}>
            <button type="button" className="p-4 text-slate-500 hover:text-indigo-400 transition-colors"><Plus size={24} /></button>
            <input 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Send a secure peer message..." 
              className="flex-1 bg-transparent border-none outline-none text-white font-medium text-lg placeholder:text-slate-600" 
            />
            <button type="submit" className="p-5 bg-indigo-600 text-white rounded-[1.5rem] hover:bg-indigo-500 shadow-xl transition-all">
               <Send size={28} className="fill-current" />
            </button>
          </form>
          <div className="flex justify-center gap-8 mt-4 text-[9px] font-black text-slate-700 uppercase tracking-widest">
             <span className="flex items-center gap-1"><Zap size={10} className="text-indigo-500" /> End-to-End Encrypted</span>
             <span className="flex items-center gap-1"><ShieldCheck size={10} className="text-emerald-500" /> Guardian AI Active</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Chat
