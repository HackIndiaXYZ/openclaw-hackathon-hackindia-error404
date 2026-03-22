'use client';

// Simple toast shim for premium-looking notifications without external deps
export const toast = {
  success: (msg: string, options?: any) => {
    console.log(`✅ [TOAST]: ${msg}`);
    // In a real app, this would trigger a global state update for a toast component
  },
  error: (msg: string) => {
    console.error(`❌ [TOAST]: ${msg}`);
  }
};
