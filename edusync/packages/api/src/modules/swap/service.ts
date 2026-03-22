import { SwapModel, nexusConnector } from '@edusync/db';
import { KarmaService } from '../karma/service.js';
import { getIO } from '../../socket.js';
import { v4 as uuidv4 } from 'uuid';

export class SwapService {
  /**
   * Propose a new skill swap
   * Deducts karmaStaked into KARMA_ESCROW immediately.
   */
  static async proposeSwap(input: {
    requesterUid: string;
    providerUid: string;
    skill: string;
    karmaStaked: number;
    isCrossCampus: boolean;
    requesterCampus: string;
    providerCampus: string;
  }) {
    if (input.karmaStaked < 10) throw new Error('Minimum karma stake is 10');
    if (input.requesterUid === input.providerUid) throw new Error('Cannot swap with yourself');

    const balance = await KarmaService.getBalance(input.requesterUid);
    if (balance < input.karmaStaked) throw new Error('Insufficient karma for this stake');

    // 1. Create Swap in MongoDB
    const swap = await SwapModel.create({
      ...input,
      status: 'pending'
    });

    // 2. Escrow Karma
    await KarmaService.recordTransaction({
      fromUid: input.requesterUid,
      toUid: 'KARMA_ESCROW',
      amount: input.karmaStaked,
      reason: `Swap Escrow: ${swap._id}`,
      institutionalNode: input.requesterCampus
    });

    // 3. Log to Transparency Log if cross-campus
    if (input.isCrossCampus) {
      await this.logTransparency(swap._id.toString(), {
        requester_id: input.requesterUid,
        responder_id: input.providerUid,
        requester_campus_id: input.requesterCampus,
        responder_campus_id: input.providerCampus,
        action: 'swap_requested'
      });
    }

    // 4. Emit Socket.io notification
    getIO().to(`user:${input.providerUid}`).emit('swap:new_request', {
      swapId: swap._id,
      requesterUid: input.requesterUid,
      skill: input.skill
    });

    return swap;
  }

  /**
   * Accept a pending swap
   */
  static async acceptSwap(swapId: string, providerUid: string) {
    const swap = await SwapModel.findById(swapId);
    if (!swap) throw new Error('Swap not found');
    if (swap.providerUid !== providerUid) throw new Error('Unauthorized');
    if (swap.status !== 'pending') throw new Error('Swap is no longer pending');

    swap.status = 'accepted';
    await swap.save();

    if (swap.isCrossCampus) {
      await this.logTransparency(swapId, {
        requester_id: swap.requesterUid,
        responder_id: swap.providerUid,
        requester_campus_id: (swap as any).requesterCampus,
        responder_campus_id: (swap as any).providerCampus,
        action: 'swap_accepted'
      });
    }

    getIO().to(`user:${swap.requesterUid}`).emit('swap:accepted', { swapId });
    return swap;
  }

  /**
   * Reject a pending swap
   * Refunds escrow back to requester.
   */
  static async rejectSwap(swapId: string, providerUid: string) {
    const swap = await SwapModel.findById(swapId);
    if (!swap) throw new Error('Swap not found');
    if (swap.providerUid !== providerUid) throw new Error('Unauthorized');
    if (swap.status !== 'pending') throw new Error('Only pending swaps can be rejected');

    swap.status = 'canceled';
    await swap.save();

    // Refund Escrow
    await KarmaService.recordTransaction({
      fromUid: 'KARMA_ESCROW',
      toUid: swap.requesterUid,
      amount: swap.karmaStaked,
      reason: `Swap Refund (Rejected): ${swapId}`,
      institutionalNode: (swap as any).requesterCampus
    });

    getIO().to(`user:${swap.requesterUid}`).emit('swap:rejected', { swapId });
    return swap;
  }

  /**
   * Complete a swap session
   * Transfers escrowed karma to responder.
   */
  static async completeSwap(swapId: string, callerUid: string) {
    const swap = await SwapModel.findById(swapId);
    if (!swap) throw new Error('Swap not found');
    if (swap.requesterUid !== callerUid && swap.providerUid !== callerUid) throw new Error('Unauthorized');
    if (swap.status !== 'accepted') throw new Error('Swap must be accepted to be completed');

    swap.status = 'completed';
    await swap.save();

    // Release Escrow to Provider
    await KarmaService.recordTransaction({
      fromUid: 'KARMA_ESCROW',
      toUid: swap.providerUid,
      amount: swap.karmaStaked,
      reason: `Swap Completion: ${swapId}`,
      institutionalNode: (swap as any).providerCampus
    });

    if (swap.isCrossCampus) {
      await this.logTransparency(swapId, {
        requester_id: swap.requesterUid,
        responder_id: swap.providerUid,
        requester_campus_id: (swap as any).requesterCampus,
        responder_campus_id: (swap as any).providerCampus,
        action: 'swap_completed'
      });
    }

    getIO().to(`user:${swap.requesterUid}`).emit('swap:completed', { swapId });
    getIO().to(`user:${swap.providerUid}`).emit('swap:completed', { swapId });
    
    return swap;
  }

  /**
   * cancelSwap (in-progress cancellation) deferred to Session 4.
   * Handles accepted swaps that are abandoned.
   */

  static async getSwapsByUser(uid: string, status?: string, limit = 20) {
    const query: any = { $or: [{ requesterUid: uid }, { providerUid: uid }] };
    if (status) query.status = status;
    return SwapModel.find(query).sort({ _id: -1 }).limit(limit);
  }

  static async getSwapById(swapId: string, uid: string) {
    const swap = await SwapModel.findById(swapId);
    if (!swap) throw new Error('Swap not found');
    if (swap.requesterUid !== uid && swap.providerUid !== uid) throw new Error('Unauthorized');
    return swap;
  }

  private static async logTransparency(swapId: string, data: any) {
    const client = await nexusConnector.pg.connect();
    try {
      await client.query(
        `INSERT INTO nexus_transparency_log 
        (swap_id, requester_id, responder_id, requester_campus_id, responder_campus_id, action) 
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [swapId, data.requester_id, data.responder_id, data.requester_campus_id, data.responder_campus_id, data.action]
      );
    } finally {
      client.release();
    }
  }
}
