import { useState, useEffect, useCallback } from 'react';
import apiClient from '../lib/api-client';
import { getSocket } from '../lib/socket-client'; // Assuming existence, or I'll create it
import { toast } from '../lib/toast';

export function useNexus() {
  const [skills, setSkills] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(false);

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

    return () => {
      socket.off('swap:new_request');
      socket.off('swap:accepted');
      socket.off('swap:rejected');
      socket.off('swap:completed');
    };
  }, [fetchSwaps]);

  const searchSkills = async (query = '', campus = '') => {
    setLoading(true);
    try {
      const { data } = await apiClient.get('/skills', {
        params: { query, campus }
      });
      setSkills(data);
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

  const acceptSwap = async (id: string) => {
    try {
      await apiClient.patch(`/swaps/${id}/accept`);
      toast.success('Swap Accepted');
      fetchSwaps();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Accept Failed');
    }
  };

  const rejectSwap = async (id: string) => {
    try {
      await apiClient.patch(`/swaps/${id}/reject`);
      toast.success('Swap Rejected');
      fetchSwaps();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Reject Failed');
    }
  };

  const completeSwap = async (id: string) => {
    try {
      await apiClient.patch(`/swaps/${id}/complete`);
      toast.success('Swap Marked Complete');
      fetchSwaps();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Completion Failed');
    }
  };

  return { 
    skills, 
    swaps, 
    loading, 
    searchSkills, 
    proposeSwap, 
    acceptSwap, 
    rejectSwap, 
    completeSwap, 
    fetchSwaps 
  };
}
