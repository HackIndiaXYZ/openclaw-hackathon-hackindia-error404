import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api-client';
import { socket } from '../lib/socket-client';
import { toast } from '../lib/toast';

export interface MOU {
  mouId: string;
  referenceNumber: string;
  partnerCampus: string;
  status: 'active' | 'expired' | 'pending' | 'suspended';
  isActive: boolean;
  validFrom: string;
  validUntil: string | null;
  daysUntilExpiry: number | null;
  expiryStatus: 'active' | 'expired' | 'expiring_soon' | 'ongoing';
  creditExchangeRate: number;
  maxCrossConnections: number;
  dataShareLevel: string;
  terms: string;
  metrics: {
    totalKarmaExchanged: number;
    totalCrossSwaps: number;
    completionRate: number;
    mouHealthScore: number;
    activeNexusStudents: number;
    swapTrend: Array<{ date: string; initiated: number; completed: number }>;
  };
}

export interface TransparencyLogEntry {
  id: string;
  swap_id: string;
  requester_id: string;
  responder_id: string;
  requester_campus_id: string;
  responder_campus_id: string;
  action: string;
  metadata: any;
  timestamp: string;
}

export function useMOU() {
  const [mouList, setMouList] = useState<MOU[]>([]);
  const [healthDashboard, setHealthDashboard] = useState<any>(null);
  const [selectedMOU, setSelectedMOU] = useState<any>(null);
  const [transparencyLog, setTransparencyLog] = useState<TransparencyLogEntry[]>([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string | null>>({});

  const fetchMOUList = useCallback(async () => {
    setLoading(prev => ({ ...prev, list: true }));
    try {
      const response = await api.get('/admin/mou');
      setMouList(response.data.data.mous);
      setHealthDashboard(response.data.data.health);
    } catch (err: any) {
      setError(prev => ({ ...prev, list: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, list: false }));
    }
  }, []);

  const fetchMOUDetail = useCallback(async (mouId: string) => {
    setLoading(prev => ({ ...prev, detail: true }));
    try {
      const response = await api.get(`/admin/mou/${mouId}`);
      setSelectedMOU(response.data);
    } catch (err: any) {
      setError(prev => ({ ...prev, detail: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, detail: false }));
    }
  }, []);

  const acceptProposal = async (mouId: string) => {
    try {
      await api.patch(`/admin/mou/${mouId}/accept`);
      toast.success('MOU Proposal Accepted');
      fetchMOUList();
    } catch (err: any) {
      toast.error(err.message || 'Failed to accept proposal');
    }
  };

  const suspendMOU = async (mouId: string, reason: string) => {
    try {
      await api.patch(`/admin/mou/${mouId}/suspend`, { reason });
      toast.success('MOU Suspended');
      fetchMOUList();
      if (selectedMOU?.mou?.id === mouId) fetchMOUDetail(mouId);
    } catch (err: any) {
      toast.error(err.message || 'Failed to suspend MOU');
    }
  };

  const renewMOU = async (mouId: string, newExpiryDate: string) => {
    try {
      await api.patch(`/admin/mou/${mouId}/renew`, { newExpiryDate });
      toast.success('MOU Renewed');
      fetchMOUList();
      if (selectedMOU?.mou?.id === mouId) fetchMOUDetail(mouId);
    } catch (err: any) {
      toast.error(err.message || 'Failed to renew MOU');
    }
  };

  const fetchTransparencyLog = useCallback(async (mouId: string, cursor?: string) => {
    setLoading(prev => ({ ...prev, log: true }));
    try {
      const response = await api.get(`/admin/mou/${mouId}/log`, { params: { cursor } });
      setTransparencyLog(prev => cursor ? [...prev, ...response.data.entries] : response.data.entries);
      return response.data.nextCursor;
    } catch (err: any) {
      setError(prev => ({ ...prev, log: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, log: false }));
    }
  }, []);

  const requestExport = async (mouId: string) => {
    try {
      const response = await api.post(`/admin/mou/${mouId}/export`);
      toast.info(`Export requested. Estimating completion in ${response.data.estimatedReadyIn}.`);
      return response.data.jobId;
    } catch (err: any) {
      toast.error(err.message || 'Export failed');
    }
  };

  useEffect(() => {
    fetchMOUList();

    socket.on('mou:expiring_soon', ({ mouId, daysRemaining, partnerCampus }) => {
      setMouList(prev => prev.map(m => 
        m.mouId === mouId ? { ...m, expiryStatus: 'expiring_soon', daysUntilExpiry: daysRemaining } : m
      ));
      toast.warning(`MOU with ${partnerCampus} expires in ${daysRemaining} days`);
    });

    socket.on('mou:expired', ({ mouId, partnerCampus }) => {
      setMouList(prev => prev.map(m => 
        m.mouId === mouId ? { ...m, isActive: false, status: 'expired', expiryStatus: 'expired' } : m
      ));
      toast.error(`MOU with ${partnerCampus} has expired`);
    });

    socket.on('mou:suspended', ({ mouId }) => {
      setMouList(prev => prev.map(m => 
        m.mouId === mouId ? { ...m, status: 'suspended', isActive: false } : m
      ));
    });

    socket.on('mou:proposal_accepted', ({ mouId, acceptingCampus }) => {
      toast.success(`${acceptingCampus} accepted your MOU proposal`);
      fetchMOUList();
    });

    socket.on('report:ready', ({ jobId, downloadUrl }) => {
        toast.success(`ROI Report Ready: ${downloadUrl}`);
    });

    return () => {
      socket.off('mou:expiring_soon');
      socket.off('mou:expired');
      socket.off('mou:suspended');
      socket.off('mou:proposal_accepted');
      socket.off('report:ready');
    };
  }, [fetchMOUList]);

  return {
    mouList,
    healthDashboard,
    selectedMOU,
    transparencyLog,
    loading,
    error,
    fetchMOUList,
    fetchMOUDetail,
    acceptProposal,
    suspendMOU,
    renewMOU,
    fetchTransparencyLog,
    requestExport,
    setSelectedMOU
  };
}
