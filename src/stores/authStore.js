import { create } from 'zustand'
import { auth } from '../lib/firebase'
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'
import { supabase } from '../lib/supabase'

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  loading: true,

  initialize: () => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      set({ loading: true })
      if (firebaseUser && firebaseUser.uid) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', firebaseUser.uid)
            .single()

          if (profileError) {
            console.warn('[EduSync] Profile fetch error (non-fatal):', profileError.message)
            // CRITICAL FIX: Do NOT wipe existing local profile on fetch error.
            // If the user just completed onboarding, the local profile already has
            // onboarding_completed=true. Overwriting with null would break ProtectedRoute.
            const existingProfile = get().profile
            set({ user: firebaseUser, profile: existingProfile, loading: false })
          } else {
            set({ user: firebaseUser, profile, loading: false })
          }
        } catch (err) {
          console.warn('[EduSync] Auth init exception (non-fatal):', err.message)
          const existingProfile = get().profile
          set({ user: firebaseUser, profile: existingProfile, loading: false })
        }
      } else {
        set({ user: null, profile: null, loading: false })
      }
    })

    return unsubscribe
  },

  setProfile: (profile) => set({ profile }),

  updateProfile: async (updates) => {
    const { user } = get()
    if (!user) return

    // Always update local state immediately — this is the source of truth for routing
    set(state => ({ profile: { ...state.profile, ...updates } }))

    // Best-effort DB persist
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.uid)

      if (error) {
        console.warn('[EduSync] DB profile update failed (non-fatal):', error.message)
      }
    } catch (err) {
      console.warn('[EduSync] DB profile update exception (non-fatal):', err.message)
    }
  },

  signOut: async () => {
    await firebaseSignOut(auth)
    set({ user: null, profile: null })
  }
}))
