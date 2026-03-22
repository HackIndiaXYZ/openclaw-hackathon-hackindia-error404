import { FlagModel, StudentModel, SwapModel } from '@edusync/db';
import { GeminiService } from '../services/gemini-service.js';
import { NotificationService } from '../modules/notifications/service.js';
import { getIO } from '../socket.js';

export class ChatScreenerJob {
  /**
   * Chat Screener Job
   * Performs Guardian AI analysis on chat messages for policy violations.
   */
  static async handle(job: any) {
    const { content, roomId, swapId, senderUid, campus } = job.data;
    console.log(`🛡️ [ChatScreener] Analyzing message from ${senderUid} in room ${roomId}`);

    try {
      const analysis = await GeminiService.analyzeSafety(content);

      if (analysis.isFlagged) {
        console.warn(`🚨 [ChatScreener] Policy violation detected: ${analysis.reason}`);

        const flag = await FlagModel.create({
          flagType: 'chat_message',
          severity: analysis.severity || 'high',
          sourceEntityId: roomId,
          sourceEntityType: 'swap_room',
          involvedUids: [senderUid],
          campus: campus,
          flaggedContent: content,
          detectionMethod: 'gemini_async',
          aiAnalysisReason: analysis.reason,
          status: 'pending'
        });

        await StudentModel.findOneAndUpdate(
          { firebaseUid: senderUid },
          { $inc: { 'moderation.flags': 1 } }
        );

        await SwapModel.findOneAndUpdate(
           { _id: swapId },
           { $push: { 'sessions.$[].flags': flag._id } }
        );

        getIO().to(`admin:${campus}`).emit('guardian:flag_raised', {
          flagId: flag._id,
          severity: flag.severity,
          reason: analysis.reason
        });

        if (flag.severity === 'high' || flag.severity === 'critical') {
          await NotificationService.create(senderUid, 'guardian_warning', {
            swapId: swapId,
            reason: 'Automated safety scan detected potential policy violation.'
          });
        }
      }
      return { analysis };
    } catch (error) {
      // The provided snippet `if (error instanceof z.ZodError) return res.status(400).json({ error: error.issues });`
      // appears to be from a controller context and is not applicable here as `res` and `z` are undefined.
      // To maintain syntactic correctness and adhere to the job's context, this line cannot be directly inserted.
      // The original error handling for the job will be preserved.
      console.error(`❌ [ChatScreener] Analysis failed for job ${job.id}:`, error);
      throw error;
    }
  }
}
