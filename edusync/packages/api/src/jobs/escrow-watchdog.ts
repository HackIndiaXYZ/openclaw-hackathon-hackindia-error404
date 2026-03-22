import { SwapModel } from '@edusync/db';
import { NotificationService } from '../modules/notifications/service.js';

export class EscrowWatchdogJob {
  /**
   * Escrow Watchdog Job handler
   * Flags swaps that have been 'accepted' but forgotten for > 7 days.
   */
  static async handle(job: any) {
    console.log('🧐 Escrow Watchdog: Scanning for stale swaps...');
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const staleSwaps = await SwapModel.find({
      status: 'accepted',
      updatedAt: { $lt: sevenDaysAgo },
      isStale: { $ne: true }
    });

    console.log(`🧐 Escrow Watchdog: Found ${staleSwaps.length} stale swaps.`);

    for (const swap of staleSwaps) {
      swap.isStale = true;
      await swap.save();
      
      // Notify both parties of administrative flagging
      await NotificationService.create(swap.requesterUid, 'swap_admin_resolved', { 
        swapId: swap._id,
        notes: 'Swap flagged as stale by system watchdog.' 
      });
      await NotificationService.create(swap.providerUid, 'swap_admin_resolved', { 
        swapId: swap._id,
        notes: 'Swap flagged as stale by system watchdog.' 
      });
    }

    return { flagged: staleSwaps.length };
  }
}
