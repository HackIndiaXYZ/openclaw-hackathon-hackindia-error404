import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { socket } from '../lib/socket-client';
import { useAuth } from './useAuth';
import { LeaderboardStudent } from '@edusync/shared';

export function useLeaderboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState<LeaderboardStudent[]>([]);
  const [myRankData, setMyRankData] = useState<any>({ rank: '??', karma: 0, tier: 'bronze', karmaToNextTier: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'campus' | 'global'>('campus');
  const [lastComputed, setLastComputed] = useState<Date | null>(null);

  const fetchLeaderboard = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const url = mode === 'global' ? '/api/v1/leaderboard/global' : '/api/v1/leaderboard';
      const res = await axios.get(url);
      
      if (res.data.success && res.data.data) {
        setStudents(res.data.data.students || []);
        setLastComputed(res.data.data.lastComputed ? new Date(res.data.data.lastComputed) : null);
        if (mode === 'campus') {
          setMyRankData({
            rank: res.data.data.requestingStudentRank ?? '??',
            score: res.data.data.requestingStudentScore ?? 0,
            totalStudents: res.data.data.totalStudents ?? 0
          });
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, [mode]);

  const fetchMyRank = useCallback(async () => {
    try {
      const res = await axios.get('/api/v1/leaderboard/me');
      if (res.data.success && res.data.data) {
        setMyRankData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch individual rank:', err);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  useEffect(() => {
    const handleUpdate = () => {
      console.log('🏆 Leaderboard Update Received via Socket');
      fetchLeaderboard(true);
    };

    socket.on('leaderboard:updated', handleUpdate);
    return () => {
      socket.off('leaderboard:updated', handleUpdate);
    };
  }, [fetchLeaderboard]);

  return {
    students,
    myRankData,
    loading,
    error,
    mode,
    setMode,
    lastComputed,
    fetchLeaderboard,
    fetchMyRank
  };
}
