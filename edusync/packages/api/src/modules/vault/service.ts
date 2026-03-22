import { ResourceModel } from '@edusync/db';
import { KarmaService } from '../karma/service.js';
import { NotificationService } from '../notifications/service.js';
import { AnalyticsService } from '../analytics/service.js';
import { buildResourceVisibilityFilter } from '@edusync/shared';

// Centralized Queues
import { resourceScreenerQueue, meilisearchIndexerQueue } from '../../lib/queues.js';

export class VaultService {
  /**
   * Upload a new resource to the Knowledge Vault.
   * Sequence: Cloudinary Upload -> Mongo Create -> Karma Bonus (+10) -> AI Screening -> Meilisearch Index
   */
  static async uploadResource(data: {
    ownerUid: string;
    title: string;
    description: string;
    subject?: string;
    courseCode?: string;
    campusId: string;
    collegeGroupId: string;
    fileUrl: string;
    fileType: 'PDF' | 'Video' | 'Image' | 'Archive';
    karmaCost: number;
    tags?: string[];
  }) {
    // 1. Create in MongoDB
    const newResource = await ResourceModel.create({
      ...data,
      verification: { 
        status: 'pending',
        aiSafetyVerdict: 'unscreened',
        reviewAttempts: 0
      },
      downloads: 0
    });

    // 2. Trigger AI Screening (Asynchronous)
    try {
      await resourceScreenerQueue.add('screen-resource', { resourceId: newResource._id.toString() });
    } catch (queueErr) {
      console.error('⚠️ AI Screener Queue Trigger Failed:', queueErr);
    }

    // 3. Meilisearch Indexing
    const indexingJob = await meilisearchIndexerQueue.add('index-resource', {
      resourceId: newResource._id.toString(),
      operation: 'upsert'
    }, {
      jobId: `index-resource:${newResource._id.toString()}`,
      removeOnComplete: true
    });

    // 4. Grant Bounty: +10 Karma for contribution
    try {
      await KarmaService.recordTransaction({
        fromUid: 'NEXUS_TREASURY',
        toUid: data.ownerUid,
        amount: 10,
        reason: `Resource Contribution: ${newResource.title}`,
        institutionalNode: data.campusId
      });
      await NotificationService.create(data.ownerUid, 'karma_earned', {
        amount: 10,
        reason: 'Resource contribution bonus',
        resourceId: newResource._id
      });
    } catch (e) {
      console.error('⚠️ Contribution Bonus Notification Failed:', e);
    }

    await AnalyticsService.invalidateCache(data.campusId);

    console.log(`📦 Nexus Vault: New resource pending review - ${newResource.title} by @${data.ownerUid}`);
    
    return {
      success: true,
      data: newResource,
      indexingJobId: indexingJob.id
    };
  }

  /**
   * Resubmit a resource after changes were requested.
   */
  static async resubmitResource(id: string, ownerUid: string, data: any) {
    const resource = await ResourceModel.findById(id);
    if (!resource) throw new Error('Resource not found');
    if (resource.ownerUid !== ownerUid) throw new Error('Unauthorized');

    Object.assign(resource, data);
    if (resource.verification) {
      resource.verification.status = 'pending';
    }
    await resource.save();

    // Re-trigger AI Screening
    await resourceScreenerQueue.add('screen-resource', { resourceId: resource._id.toString() });

    // Re-trigger Meilisearch Indexing
    const job = await meilisearchIndexerQueue.add('index-resource', {
      resourceId: resource._id.toString(),
      operation: 'upsert'
    }, {
      jobId: `index-resource:${resource._id.toString()}`,
      removeOnComplete: true
    });

    return { success: true, data: resource, indexingJobId: job.id };
  }

  /**
   * List resources with shared visibility logic.
   */
  static async listResources(filters: {
    studentProfile: any;
    nexusMode?: boolean;
    search?: string;
    fileType?: string;
    limit?: number;
    offset?: number;
  }) {
    const { studentProfile, nexusMode, limit = 20, offset = 0 } = filters;
    
    // 1. Get Shared Visibility Predicate
    const visibility = buildResourceVisibilityFilter(
      {
        firebaseUid: studentProfile.firebaseUid,
        campusId: studentProfile.campus,
        collegeGroupId: studentProfile.collegeGroupId,
        nexus: { crossCampusEnabled: studentProfile.nexus?.crossCampusEnabled || false },
        moderation: studentProfile.moderation || { status: 'good_standing' }
      },
      nexusMode
    );

    // 2. Build MongoDB Query
    const query: any = {
      ...visibility.mongodbFilter,
      'verification.status': 'verified'
    };

    if (filters.search) query.$text = { $search: filters.search };
    if (filters.fileType) query.fileType = filters.fileType;

    const resources = await ResourceModel.find(query)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    return resources;
  }

  /**
   * Purchase/Unlock a resource (P2P Karma transfer)
   */
  static async purchaseResource(resourceId: string, buyerUid: string, buyerCampusId: string) {
    const resource = await ResourceModel.findById(resourceId);
    if (!resource) throw new Error('Resource not found');

    if (resource.ownerUid === buyerUid) {
      return { success: true, fileUrl: resource.fileUrl, isOwner: true };
    }

    const cost = Math.round(resource.karmaCost || 0);
    if (cost > 0) {
      await KarmaService.recordTransaction({
        fromUid: buyerUid,
        toUid: resource.ownerUid,
        amount: cost,
        reason: `Vault Purchase: ${resource.title}`,
        institutionalNode: buyerCampusId
      });

      await NotificationService.create(resource.ownerUid, 'karma_earned', {
        amount: cost,
        reason: `Resource download: ${resource.title}`,
        resourceId: resource._id
      });
    }

    resource.downloads += 1;
    await resource.save();

    return { success: true, fileUrl: resource.fileUrl };
  }

  static async getResourceById(id: string) {
    return ResourceModel.findById(id);
  }
}
