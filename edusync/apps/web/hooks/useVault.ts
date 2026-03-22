import { useState } from 'react';
import apiClient from '../lib/api-client';

export function useVault() {
  const [resources, setResources] = useState<any[]>([]);
  const [totalResources, setTotalResources] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchResources = async (filters: {
    query?: string;
    type?: string;
    campus?: string;
    nexusMode?: boolean;
    verificationStatus?: string;
    offset?: number;
    limit?: number;
  } = {}) => {
    setLoading(true);
    try {
      const { data } = await apiClient.get('/vault', { params: { ...filters } });
      setResources(data.data || []);
      setTotalResources(data.meta?.pagination?.total || 0);
      return data;
    } catch (error) {
      console.error('Vault Retrieval Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getResourceById = async (id: string) => {
    try {
      const { data } = await apiClient.get(`/vault/${id}`);
      return data.data;
    } catch (error) {
      console.error('Resource Fetch Error:', error);
      return null;
    }
  };

  const purchaseAsset = async (resourceId: string) => {
    try {
      const { data } = await apiClient.post(`/vault/purchase/${resourceId}`);
      if (data.success) return data.data;
      throw new Error(data.error);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Transaction Denied: Check Karma Balance');
    }
  };

  const uploadAsset = async (formData: FormData) => {
    try {
      const { data } = await apiClient.post('/vault/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Upload Protocol Failure');
    }
  };

  const resubmitAsset = async (id: string, metadata: any) => {
    try {
      const { data } = await apiClient.post(`/vault/resubmit/${id}`, metadata);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Resubmission Failed');
    }
  };

  return { 
    resources, 
    totalResources,
    loading, 
    fetchResources, 
    getResourceById, 
    purchaseAsset, 
    uploadAsset,
    resubmitAsset
  };
}
