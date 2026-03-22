import { useState, useEffect, useCallback } from 'react';
import apiClient from '../lib/api-client';

export function useKarma() {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get('/karma/balance');
      if (data.success && data.data) {
        setBalance(data.data?.balance ?? 0);
      } else {
        throw new Error(data.error?.message || 'Failed to sync with Nexus Ledger');
      }
    } catch (err: any) {
      console.error('Karma Registry Error:', err);
      setError(err.message || 'Institutional Ledger Connection Timeout');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { balance, loading, error, refreshBalance: fetchBalance };
}
