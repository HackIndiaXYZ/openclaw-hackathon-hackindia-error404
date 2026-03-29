import { create } from 'zustand'
import { auth } from '../lib/firebase'
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

export const useAuthStore = create((set) => ({
  user: null,
  profile: null,
  loading: true,

  initialize: () => {
    // Initial check (Firebase holds internal persistence)
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      set({ loading: true })
      if (firebaseUser && firebaseUser.uid) {
        // Fetch or create profile in Supabase
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', firebaseUser.uid)
          .single()
        
        if (profileError) {
          console.error('Profile fetch error:', profileError)
          // Profile might not exist yet if they're a new user
          set({ user: firebaseUser, profile: null, loading: false })
        } else {
          set({ user: firebaseUser, profile, loading: false })
        }
      } else {
        set({ user: null, profile: null, loading: false })
      }
    })

    return unsubscribe
  },

  setProfile: (profile) => set({ profile }),

  updateProfile: async (updates) => {
    const { user, profile } = useAuthStore.getState()
    if (!user) return

    // Update local state first for responsiveness
    set(state => ({ profile: { ...state.profile, ...updates } }))

    // Persist to Supabase
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.uid)
      
      if (error) throw error
    } catch (error) {
      console.error('Failed to update profile in database:', error)
      // Revert local state if error? No, let's keep it for now as the user may fix it.
    }
  },

  signOut: async () => {
    await firebaseSignOut(auth)
    // We don't sign out of Supabase because we're not using their Auth sessions anymore
    set({ user: null, profile: null })
  }
}))
