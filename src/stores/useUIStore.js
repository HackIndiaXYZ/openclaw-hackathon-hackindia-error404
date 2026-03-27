import { create } from 'zustand'

export const useUIStore = create((set) => ({
  isSidebarOpen: true,
  currentCampus: 'IIT Jammu',
  notifications: [],
  
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setCampus: (currentCampus) => set({ currentCampus }),
  
  addNotification: (notification) => set((state) => ({ 
    notifications: [...state.notifications, { ...notification, id: Date.now() }] 
  })),
  
  removeNotification: (id) => set((state) => ({ 
    notifications: state.notifications.filter(n => n.id !== id) 
  })),

  clearNotifications: () => set({ notifications: [] })
}))
