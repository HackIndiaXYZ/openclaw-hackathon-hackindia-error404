import { supabase } from './supabase'

export const karmaService = {
  getProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) throw error
    return data
  },

  updateKarma: async (userId, amount) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ karma_balance: amount })
      .eq('id', userId)
    if (error) throw error
    return data
  },

  getTransactionHistory: async (userId) => {
    const { data, error } = await supabase
      .from('karma_transactions')
      .select('*, resources(title)')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  unlockResource: async (userId, resourceId, cost) => {
    // 1. Check balance
    const { data: profile } = await supabase.from('profiles').select('karma_balance').eq('id', userId).single()
    if (profile.karma_balance < cost) throw new Error('Insufficient Karma')

    // 2. Perform Transaction
    const { data: transaction, error: txError } = await supabase
      .from('karma_transactions')
      .insert({
        sender_id: userId,
        amount: cost,
        resource_id: resourceId,
        type: 'unlock',
        description: `Unlocked Resource #${resourceId}`
      })

    if (txError) throw txError

    // 3. Update Balances (Simulated Atomic)
    await supabase.rpc('decrement_karma', { user_id: userId, amount: cost })
    
    return transaction
  }
}
