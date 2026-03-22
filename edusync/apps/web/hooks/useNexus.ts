import { useState, useEffect, useCallback } from 'react';
import apiClient from '../lib/api-client';
import { getSocket } from '../lib/socket-client';
import { toast } from '../lib/toast';
import { KarmaTier } from '@edusync/shared';

export function useNexus() {
  const [skills, setSkills] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [partners, setPartners] = useState([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [nexusMeta, setNexusMeta] = useState<any>(null);
  const [nexusEnabled, setNexusEnabled] = useState(false);
  const [totalSkills, setTotalSkills] = useState(0);
  const [globalRank, setGlobalRank] = useState<{ rank: string | number, tier: KarmaTier, xp: number }>({ rank: '---', tier: 'bronze', xp: 0 });

  const fetchSwaps = useCallback(async (status?: string) => {
    try {
      const { data } = await apiClient.get('/swaps', { params: { status } });
      setSwaps(data.data);
    } catch (error) {
      console.error('Fetch Swaps Error:', error);
    }
  }, []);

  useEffect(() => {
    const socket = getSocket();
    
    socket.on('swap:new_request', (data) => {
      toast.success(`🚀 New Swap Request: ${data.skill}`, { icon: '🤝' });
      fetchSwaps();
    });

    socket.on('swap:accepted', (data) => {
      toast.success('🤝 Swap Proposal Accepted!', { icon: '✅' });
      fetchSwaps();
    });

    socket.on('swap:rejected', (data) => {
      toast.error('❌ Swap Proposal Rejected');
      fetchSwaps();
    });

    socket.on('swap:completed', (data) => {
      toast.success('✨ Skill Swap Completed! Karma Transferred.', { icon: '⭐' });
      fetchSwaps();
    });

    socket.on('swap:admin_resolved', (data) => {
      toast.success(`⚖️ Admin Resolution: ${data.action}`, { icon: '🛡️' });
      fetchSwaps();
    });

    return () => {
      socket.off('swap:new_request');
      socket.off('swap:accepted');
      socket.off('swap:rejected');
      socket.off('swap:completed');
      socket.off('swap:admin_resolved');
    };
  }, [fetchSwaps]);

  const searchSkills = async (query = '', campus = '', offset = 0, limit = 30) => {
    setLoading(true);
    try {
      const { data } = await apiClient.get('/skills', {
        params: { query, campus, offset, limit }
      });
      setSkills(data.data);
      setTotalSkills(data.meta?.pagination?.total || 0);
    } catch (error) {
      console.error('Nexus Discovery Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const proposeSwap = async (providerUid: string, skill: string, karma: number, campus: string) => {
    try {
      const { data } = await apiClient.post('/swaps/propose', {
        providerUid,
        skill,
        karmaStaked: karma,
        providerCampus: campus,
        isCrossCampus: campus !== 'IIT_JAMMU'
      });
      toast.success('Proposal Transmitted to Nexus');
      return data;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Swap Proposal Failed');
      throw error;
    }
  };

  const fetchNexusExplore = async (q: string = '', offset = 0, limit = 30) => {
    setLoading(true);
    try {
      const { data } = await apiClient.get('/nexus/explore', {
        params: { q, offset, limit }
      });
      if (data.success && data.data) {
        setSkills(data.data.students || []);
        setTotalSkills(data.meta?.pagination?.total || 0);
        return data.data;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Nexus Discovery Error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCrossCampusProfile = async (uid: string) => {
    setLoading(true);
    try {
      const { data } = await apiClient.get(`/nexus/profile/${uid}`);
      if (data.success && data.data) {
        setProfileData(data.data.profile);
        setNexusMeta(data.data.nexusMeta);
        setGlobalRank(data.data.globalRank || { rank: '---', tier: 'bronze', xp: 0 });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Nexus Profile Error');
    } finally {
      setLoading(false);
    }
  };

  const fetchMOUPartners = async () => {
    try {
      const { data } = await apiClient.get('/nexus/partners');
      if (data.success && data.data) {
        setPartners(data.data.partners || []);
      }
    } catch (error) {
      console.error('Fetch partners error:', error);
    }
  };

  const updateNexusSettings = async (enabled: boolean) => {
    try {
      await apiClient.post('/profile/nexus/toggle', { enabled });
      toast.success(`Nexus ${enabled ? 'Enabled' : 'Disabled'}`);
    } catch (error: any) {
      toast.error('Nexus Toggle Failed');
    }
  };

  const updateNotificationPreferences = async (preferences: any) => {
    try {
      await apiClient.post('/profile/notifications', { preferences });
      toast.success('Notification Preferences Updated');
    } catch (error: any) {
      toast.error('Notification Update Failed');
    }
  };

  const updatePrivacySettings = async (settings: any) => {
    try {
      await apiClient.post('/profile/privacy', { settings });
      toast.success('Privacy Settings Updated');
    } catch (error: any) {
      toast.error('Privacy Update Failed');
    }
  };

  const acceptSwap = async (swapId: string) => {
    try {
      await apiClient.patch(`/swaps/${swapId}/accept`);
      toast.success('Swap Accepted! Escrow Initialized.');
      fetchSwaps('pending');
    } catch (error: any) {
      toast.error('Acceptance Failed');
    }
  };

  const rejectSwap = async (swapId: string) => {
    try {
      await apiClient.patch(`/swaps/${swapId}/reject`);
      toast.info('Swap Proposal Rejected');
      fetchSwaps('pending');
    } catch (error: any) {
      toast.error('Rejection Failed');
    }
  };

  const completeSwap = async (swapId: string) => {
    try {
      await apiClient.patch(`/swaps/${swapId}/complete`);
      toast.success('Session Completed! Karma Transfer Initiated.');
      fetchSwaps('accepted');
    } catch (error: any) {
      toast.error('Completion Failed');
    }
  };

  const requestCancel = async (swapId: string) => {
    try {
      await apiClient.patch(`/swaps/${swapId}/cancel`);
      toast.warning('Cancellation Request Transmitted');
      fetchSwaps('accepted');
    } catch (error: any) {
      toast.error('Cancellation Request Failed');
    }
  };

  return { 
    skills, 
    totalSkills,
    swaps, 
    loading, 
    searchSkills, 
    proposeSwap, 
    fetchNexusExplore, 
    fetchMOUPartners,
    fetchSwaps,
    fetchCrossCampusProfile,
    updateNexusSettings,
    updateNotificationPreferences,
    updatePrivacySettings,
    acceptSwap,
    rejectSwap,
    completeSwap,
    requestCancel,
    partners,
    profileData,
    nexusMeta,
    nexusEnabled,
    globalRank
  };
}
