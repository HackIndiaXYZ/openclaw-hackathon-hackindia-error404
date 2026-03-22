'use client';

// Simple toast shim for premium-looking notifications without external deps
export const toast = {
  success: (msg: string, options?: any) => {
    console.log(`✅ [TOAST]: ${msg}`);
  },
  error: (msg: string, options?: any) => {
    console.error(`❌ [TOAST]: ${msg}`);
  },
  warning: (msg: string, options?: any) => {
    console.warn(`⚠️ [TOAST]: ${msg}`);
  },
  info: (msg: string, options?: any) => {
    console.info(`ℹ️ [TOAST]: ${msg}`);
  }
};

export default toast;
