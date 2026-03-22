'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, TrendingUp, Users, Award, ShieldCheck, Download } from 'lucide-react';

const MOU_DATA = [
  { partner: 'NIT_TRICHY_GROUP', activeSwaps: 42, completed: 156, satisfaction: '4.8/5' },
  { partner: 'IIT_ALLIANCE_SOUTH', activeSwaps: 12, completed: 89, satisfaction: '4.5/5' },
  { partner: 'BITS_NETWORK', activeSwaps: 28, completed: 210, satisfaction: '4.9/5' },
];

export default function MOUConsole() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      {/* Admin Header */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Institutional MOU Analytics</h1>
          <p className="text-slate-400 mt-2">Measuring real outcomes from institutional partnerships.</p>
        </div>
        <button className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95">
          <Download className="w-5 h-5" />
          <span>Export ROI Report</span>
        </button>
      </div>

      {/* KPI Ribbons */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { icon: TrendingUp, label: 'Cross-Campus Activity', value: '+24%', color: 'text-emerald-400' },
          { icon: Users, label: 'Active Nexus Connections', value: '1,240', color: 'text-indigo-400' },
          { icon: Award, label: 'Average Karma Exchange', value: '15,400', color: 'text-amber-400' },
          { icon: ShieldCheck, label: 'MOU Health Score', value: '92/100', color: 'text-blue-400' },
        ].map((kpi, i) => (
          <div key={i} className="p-6 bg-slate-900 border border-slate-800 rounded-3xl">
            <kpi.icon className={`w-6 h-6 ${kpi.color} mb-4`} />
            <p className="text-sm text-slate-500 font-medium">{kpi.label}</p>
            <h4 className="text-2xl font-bold mt-1">{kpi.value}</h4>
          </div>
        ))}
      </div>

      {/* MOU Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden mb-12">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xl font-bold">Active Institutional Links</h3>
          <span className="text-xs font-mono text-slate-500">REF: NEXUS-MOU-2026</span>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-800/50 text-slate-400 text-sm uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Partner Institution</th>
              <th className="px-6 py-4">Active Swaps</th>
              <th className="px-6 py-4">Completed Total</th>
              <th className="px-6 py-4">Satisfaction</th>
              <th className="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {MOU_DATA.map((row, i) => (
              <tr key={i} className="hover:bg-slate-800/30 transition-colors cursor-pointer group">
                <td className="px-6 py-5 font-bold text-indigo-400">{row.partner}</td>
                <td className="px-6 py-5">{row.activeSwaps}</td>
                <td className="px-6 py-5">{row.completed}</td>
                <td className="px-6 py-5">
                  <span className="px-2 py-1 bg-slate-800 rounded-md border border-slate-700">⭐ {row.satisfaction}</span>
                </td>
                <td className="px-6 py-5 text-right">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                  <span className="text-emerald-400 font-bold text-xs">LIVE</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOU Ledger Sidebar/Panel Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-indigo-900/20 to-slate-900 p-8 border border-indigo-500/20 rounded-3xl">
          <div className="flex items-center space-x-3 mb-6">
            <FileText className="w-6 h-6 text-indigo-400" />
            <h3 className="text-xl font-bold">MOU Transparency Ledger</h3>
          </div>
          <p className="text-slate-400 mb-6 text-sm">
            Immutable log of all cross-campus academic exchanges facilitating research and tutoring credits.
          </p>
          <div className="space-y-4">
            <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 text-xs font-mono text-slate-500">
              [2026-03-22 10:45] TX_SKILL_SWAP_COMPLETE: IITJ ↔ NIT_TRICHY :: OFFSET: 0.04
            </div>
            <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 text-xs font-mono text-slate-500">
              [2026-03-22 09:12] TX_VAULT_SHARE: IITD 🤝 BITS_PILANI :: 4 NC_CREDITS
            </div>
          </div>
        </div>
        
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col items-center justify-center text-center">
          <ShieldCheck className="w-16 h-16 text-slate-700 mb-4" />
          <h3 className="text-xl font-bold mb-2">Audit-Ready Protocol</h3>
          <p className="text-slate-400 text-sm max-w-xs">
            All data is processed according to DPDPA and Institutional Data Privacy Agreements.
          </p>
        </div>
      </div>
    </div>
  );
}
