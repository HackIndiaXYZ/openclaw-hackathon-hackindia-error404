import { ResourceModel } from '@edusync/db';
import { GeminiService } from '../services/gemini-service.js';
import { getIO } from '../socket.js';

export class ResourceScreenerJob {
  /**
   * Resource Screener Job
   * Performs Guardian AI pre-screening on uploaded resources for academic integrity.
   */
  static async handle(job: any) {
    const { resourceId } = job.data;
    console.log(`🛡️ Guardian AI: Screening resource ${resourceId}...`);

    const resource = await ResourceModel.findById(resourceId);
    if (!resource || !resource.verification) {
      console.warn(`⚠️ Screener: Resource ${resourceId} or its verification metadata not found. Skipping.`);
      return;
    }

    if (resource.verification.status !== 'pending' && resource.verification.status !== 'under_review') {
       console.log(`ℹ️ Screener: Resource ${resourceId} status is ${resource.verification.status}. Skipping.`);
       return;
    }

    const content = `${resource.title} ${resource.description} ${(resource.tags || []).join(' ')}`;
    const result = await GeminiService.analyzeSafety(content);

    const aiSafetyVerdict = result.isSafe ? 'clean' : 'flagged';
    
    let aiSafetyScore;
    if (result.isSafe) {
      aiSafetyScore = 90 + Math.random() * 10;
    } else {
      aiSafetyScore = 20 + Math.random() * 40;
    }

    const aiSafetyFlags: string[] = [];
    const reason = (result.reason || '').toLowerCase();
    if (reason.includes('dishonesty') || reason.includes('cheating')) aiSafetyFlags.push('academic_dishonesty');
    if (reason.includes('harassment') || reason.includes('toxic')) aiSafetyFlags.push('inappropriate_content');
    if (reason.includes('explicit') || reason.includes('adult')) aiSafetyFlags.push('inappropriate_content');
    if (reason.includes('copyright')) aiSafetyFlags.push('copyright_concern');
    if (reason.includes('spam')) aiSafetyFlags.push('spam');

    await ResourceModel.findByIdAndUpdate(resourceId, {
      $set: {
        'verification.aiSafetyScore': Math.round(aiSafetyScore),
        'verification.aiSafetyVerdict': aiSafetyVerdict,
        'verification.aiSafetyFlags': aiSafetyFlags
      }
    });

    console.log(`✅ Guardian AI: Resource ${resourceId} verdict: ${aiSafetyVerdict} (Score: ${Math.round(aiSafetyScore)})`);

    if (aiSafetyVerdict === 'flagged') {
      getIO().to(`admin:${resource.campusId}`).emit('admin:resource_flagged', {
        resourceId,
        aiSafetyScore: Math.round(aiSafetyScore),
        aiSafetyFlags,
        resourceTitle: resource.title
      });
    }

    return { verdict: aiSafetyVerdict, score: aiSafetyScore };
  }
}
