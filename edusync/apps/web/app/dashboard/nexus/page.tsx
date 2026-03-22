'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Shield, Search, Zap, Building2, ArrowUpRight } from 'lucide-react';

const PARTNER_NODES = [
  { id: 'IIT_DELHI', name: 'IIT Delhi', status: 'ACTIVE', focus: 'VLSI & Microelectronics', users: 1240 },
  { id: 'IIT_BOMBAY', name: 'IIT Bombay', status: 'ACTIVE', focus: 'Aerospace & Robotics', users: 3105 },
  { id: 'NIT_TRICHY', name: 'NIT Trichy', status: 'ACTIVE', focus: 'Materials Science', users: 890 },
];

export default function NexusExplorer() {
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8">
      {/* Nexus Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
            <Globe className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              Nexus Cross-Campus Explorer
            </h1>
            <p className="text-gray-400">Expanding your learning node beyond local boundaries.</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search for skills or resources across partner nodes (e.g., VLSI, Robotics)..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 ring-indigo-500 outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Active MOU Partners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {PARTNER_NODES.map((node, idx) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:border-indigo-500/50 transition-all group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-neutral-800 rounded-lg">
                <Building2 className="w-6 h-6 text-indigo-400" />
              </div>
              <span className="text-xs font-bold px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md border border-emerald-500/30">
                {node.status}
              </span>
            </div>
            <h3 className="text-xl font-bold mb-1">{node.name}</h3>
            <p className="text-sm text-gray-400 mb-4">{node.focus}</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs text-gray-500">{node.users} Active Users</span>
              <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Nexus Transparency Feed */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="bg-white/5 border border-white/10 rounded-3xl p-8"
      >
        <div className="flex items-center space-x-2 mb-6">
          <Shield className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-bold">Nexus Connectivity Log</h2>
        </div>
        
        <div className="space-y-4">
          {[
            { tag: 'IITJ 🤝 IITD', msg: 'New Cross-Campus Skill Swap Initiated (VLSI Design)', time: '2m ago' },
            { tag: 'MOU UPDATE', msg: 'New Academic MOU Signed with IIIT Alliance', time: '1h ago' },
            { tag: 'VAULT SYNC', msg: 'Syncing 45 Verified Resources from IIT Bombay Node', time: '4h ago' },
          ].map((log, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-2xl border border-white/5">
              <div className="flex items-center space-x-4">
                <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
                  {log.tag}
                </span>
                <span className="text-sm text-gray-300">{log.msg}</span>
              </div>
              <span className="text-xs text-gray-500">{log.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
