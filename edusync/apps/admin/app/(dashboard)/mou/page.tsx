'use client';

import React, { useState } from 'react';
import { useMOU, MOU } from '../../../hooks/useMOU';
import { 
  Activity, 
  ShieldCheck, 
  Layers, 
  Heart,
  ChevronRight,
  RefreshCcw,
  FileText,
  AlertTriangle,
  ExternalLink,
  Plus,
  ArrowUpRight,
  TrendingUp,
  History,
  Settings
} from 'lucide-react';
import { format } from 'date-fns';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export default function MOUConsole() {
  const { 
    mouList, 
    healthDashboard, 
    selectedMOU, 
    loading, 
    acceptProposal, 
    suspendMOU, 
    renewMOU,
    fetchMOUDetail,
    setSelectedMOU,
    requestExport
  } = useMOU();

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'trend' | 'log' | 'actions'>('overview');

  const handleRowClick = async (mou: MOU) => {
    await fetchMOUDetail(mou.mouId);
    setSelectedMOU(mou);
    setIsPanelOpen(true);
  };

  const pendingMOUs = mouList.filter(m => m.status === 'pending');
  const activeMOUs = mouList.filter(m => m.status !== 'pending');

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Institutional MOU Console
          </h1>
          <p className="text-white/40 mt-1">Institutional partnership governance and ROI transparency.</p>
        </div>
        
        {pendingMOUs.length > 0 && (
          <div className="flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full border border-amber-500/30 text-sm font-medium">
             <AlertTriangle className="w-4 h-4" />
             {pendingMOUs.length} Proposals Pending
          </div>
        )}
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <HealthCard 
          label="Cross-Campus Swaps" 
          value={healthDashboard?.totalCrossSwapsAllTime || 0} 
          sub={`+${healthDashboard?.swapsLast30Days || 0} this month`}
          icon={Activity} 
          color="emerald" 
        />
        <HealthCard 
          label="Active Nexus Students" 
          value={mouList.reduce((acc, curr) => acc + (curr.metrics?.activeNexusStudents || 0), 0)} 
          sub={`Across ${mouList.filter(m => m.isActive).length} partnerships`}
          icon={Layers} 
          color="indigo" 
        />
        <HealthCard 
          label="Karma Exchanged" 
          value={healthDashboard?.totalKarmaExchangedAllTime?.toLocaleString() || '0'} 
          sub="Institutional liquidity"
          icon={Heart} 
          color="amber" 
        />
        <HealthCard 
          label="Avg Health Score" 
          value={healthDashboard?.averageMOUHealthScore ? `${healthDashboard.averageMOUHealthScore}/100` : '--'} 
          sub={healthDashboard?.averageMOUHealthScore > 70 ? 'Healthy' : 'Requires Review'}
          icon={ShieldCheck} 
          color={healthDashboard?.averageMOUHealthScore > 70 ? 'emerald' : 'red'} 
        />
      </div>

      {/* Pending Proposals SECTION 2 */}
      {pendingMOUs.length > 0 && (
        <section className="space-y-4">
           <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-400" />
              Incoming Partnership Proposals
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingMOUs.map(mou => (
                <div key={mou.mouId} className="p-6 rounded-3xl border border-amber-500/30 bg-amber-500/5 backdrop-blur-xl flex flex-col justify-between">
                   <div>
                      <div className="text-white font-bold text-lg mb-1">{mou.partnerCampus.replace('_', ' ')}</div>
                      <p className="text-white/40 text-sm mb-4">Proposed Terms: {mou.terms.substring(0, 100)}...</p>
                      <div className="flex gap-4 text-xs text-white/40 mb-6">
                         <span>Rate: {mou.creditExchangeRate}x</span>
                         <span>Cap: {mou.maxCrossConnections} sw/mo</span>
                      </div>
                   </div>
                   <div className="flex gap-3">
                      <button 
                        onClick={() => acceptProposal(mou.mouId)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl text-sm font-medium transition-all"
                      >
                         Accept Partnership
                      </button>
                      <button className="flex-1 bg-white/5 hover:bg-white/10 text-white/60 py-2 rounded-xl text-sm font-medium transition-all border border-white/10 opacity-50 cursor-not-allowed">
                         Decline
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </section>
      )}

      {/* Active MOUs Table SECTION 3 */}
      <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Active Institutional Links</h3>
          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 transition-all">
            <RefreshCcw className={`w-4 h-4 ${loading.list ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-widest">Partner Institution</th>
                <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-widest text-center">Active Swaps</th>
                <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-widest text-center">ROI Health</th>
                <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-widest"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {activeMOUs.map((mou) => (
                <tr 
                  key={mou.mouId} 
                  onClick={() => handleRowClick(mou)}
                  className={`group hover:bg-white/5 transition-all cursor-pointer ${mou.expiryStatus === 'expiring_soon' ? 'border-l-4 border-l-amber-500' : ''}`}
                >
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 text-indigo-400 font-bold">
                        {mou.partnerCampus[0]}
                      </div>
                      <div>
                        <div className="text-white font-medium">{mou.partnerCampus.replace('_', ' ')}</div>
                        <div className="text-xs text-white/40">{mou.referenceNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="text-white font-medium">{mou.metrics?.totalCrossSwaps || 0}</div>
                    <div className="text-[10px] text-white/30 uppercase">Concurrent</div>
                  </td>
                  <td className="px-6 py-6 font-mono text-center">
                    <span className={mou.metrics.mouHealthScore > 70 ? 'text-emerald-400' : 'text-amber-400'}>
                      {mou.metrics.mouHealthScore || 0}%
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <StatusBadge status={mou.expiryStatus} baseStatus={mou.status} days={mou.daysUntilExpiry} />
                  </td>
                  <td className="px-6 py-6 text-right">
                    <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
                  </td>
                </tr>
              ))}
              {activeMOUs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/20">
                    No active institutional partnerships.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side Panel: MOU Detail SECTION 4 */}
      {isPanelOpen && selectedMOU && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-all duration-500 ease-in-out" 
            onClick={() => setIsPanelOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-[#0a0a0c]/80 backdrop-blur-3xl border-l border-white/10 z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
             {/* Panel Header */}
             <div className="p-8 border-b border-white/10 flex items-center justify-between">
                <div>
                   <h2 className="text-2xl font-bold text-white">{selectedMOU.partnerCampus?.replace('_', ' ')}</h2>
                   <p className="text-white/40 text-sm">{selectedMOU.referenceNumber || 'Institutional Partner'}</p>
                </div>
                <button 
                  onClick={() => setIsPanelOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 transition-all"
                >
                   <ChevronRight className="w-6 h-6 rotate-180" />
                </button>
             </div>

             {/* Tab Navigation */}
             <div className="flex border-b border-white/10 px-8">
                <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Overview" icon={Activity} />
                <TabButton active={activeTab === 'trend'} onClick={() => setActiveTab('trend')} label="Swap Trend" icon={TrendingUp} />
                <TabButton active={activeTab === 'log'} onClick={() => setActiveTab('log')} label="Transparency Log" icon={History} />
                <TabButton active={activeTab === 'actions'} onClick={() => setActiveTab('actions')} label="Actions" icon={Settings} />
             </div>

             {/* Tab Content */}
             <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                           <div className="text-xs text-white/40 uppercase mb-2">Karma Exchanged</div>
                           <div className="text-2xl font-bold text-white">{selectedMOU.utilization?.totalKarmaExchanged || 0}</div>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                           <div className="text-xs text-white/40 uppercase mb-2">Completion Rate</div>
                           <div className="text-2xl font-bold text-emerald-400">{(selectedMOU.utilization?.completionRate * 100).toFixed(1)}%</div>
                        </div>
                     </div>

                     <div>
                        <h4 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-4">MOU Perspective</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                           <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                              <div className="text-xs text-white/40 mb-1 font-medium">Initiator</div>
                              {selectedMOU.perspective?.initiatorLabel}
                           </div>
                           <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300">
                             <div className="text-xs text-white/40 mb-1 font-medium">Receiver</div>
                              {selectedMOU.perspective?.receiverLabel}
                           </div>
                        </div>
                     </div>

                     <div>
                        <h4 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-4">Top Collaborators</h4>
                        <div className="space-y-3">
                           {selectedMOU.topCollaborators?.map((collab: any, index: number) => (
                             <div key={index} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                <span className="text-white text-sm">Student {collab._id.substring(0, 8)}...</span>
                                <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
                                   {collab.count} Swaps
                                </span>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
                )}

                {activeTab === 'trend' && (
                  <div className="h-[300px] w-full mt-4">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={selectedMOU.utilization?.swapTrend}>
                           <defs>
                              <linearGradient id="colorInitiatedMOU" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                 <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                           <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={10} tickFormatter={(str: string) => format(new Date(str), 'MMM d')} />
                           <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                           <Tooltip contentStyle={{ backgroundColor: '#1e1b4b', border: '1px outset rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                           <Area type="monotone" dataKey="initiated" stroke="#6366f1" fillOpacity={1} fill="url(#colorInitiatedMOU)" strokeWidth={2} />
                           <Area type="monotone" dataKey="completed" stroke="#10b981" fillOpacity={0} strokeWidth={2} />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
                )}

                {activeTab === 'actions' && (
                  <div className="space-y-6">
                     <div className="p-6 rounded-3xl border border-white/10 bg-white/5">
                        <h4 className="text-white font-medium mb-2">Export Partnership ROI</h4>
                        <p className="text-sm text-white/40 mb-4">Generate an official institutional report of cross-campus activities.</p>
                        <button 
                           onClick={() => requestExport(selectedMOU.mou.id)}
                           className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl transition-all font-medium"
                        >
                           <FileText className="w-5 h-5" />
                           Export PDF Report
                        </button>
                     </div>

                     <div className="p-6 rounded-3xl border border-amber-500/30 bg-amber-500/5">
                        <h4 className="text-amber-400 font-medium mb-2">Suspend Partnership</h4>
                        <p className="text-sm text-white/40 mb-4">Caution: This will immediately cancel all pending cross-campus swaps between your institutions.</p>
                        <button 
                           onClick={() => suspendMOU(selectedMOU.mou.id, 'Routine institutional audit')}
                           className="text-amber-400 hover:text-white border border-amber-500/30 hover:bg-amber-500 px-6 py-3 rounded-2xl transition-all font-medium"
                        >
                           Suspend Link
                        </button>
                     </div>
                  </div>
                )}
             </div>
          </div>
        </>
      )}
    </div>
  );
}

function HealthCard({ label, value, sub, icon: Icon, color }: any) {
  const colors: any = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20'
  };
  
  return (
    <div className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${colors[color]} mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-white/40 mb-2">{label}</div>
      <div className="text-xs text-white/20">{sub}</div>
    </div>
  );
}

function StatusBadge({ status, baseStatus, days }: any) {
    if (baseStatus === 'suspended') return <span className="bg-slate-500/20 text-slate-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest border border-slate-500/30 uppercase">Suspended</span>;
    if (status === 'expired') return <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest border border-red-500/30 uppercase">Expired</span>;
    if (status === 'expiring_soon') return (
        <div className="flex flex-col items-start gap-1">
            <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest border border-amber-500/30 uppercase">Expiring</span>
            <span className="text-[10px] text-amber-500/60 font-medium">{days} days left</span>
        </div>
    );
    if (status === 'ongoing') return <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest border border-indigo-500/30 uppercase">Ongoing</span>;
    
    return (
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-emerald-400 text-[10px] font-bold tracking-widest uppercase">Live</span>
        </div>
    );
}

function TabButton({ active, onClick, label, icon: Icon }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all font-medium text-sm ${
        active 
          ? 'border-indigo-500 text-indigo-400' 
          : 'border-transparent text-white/40 hover:text-white/60'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
