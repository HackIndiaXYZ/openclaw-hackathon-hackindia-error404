import { StudentModel, ResourceModel } from '@edusync/db';
import { IndexingService } from '../modules/search/indexing.service.js';

export class MeilisearchIndexerJob {
  /**
   * Meilisearch Indexer Job handler
   */
  static async handle(job: any) {
    const { name, data } = job;
    console.log(`🔍 Search Indexer [${job.id}]: Processing ${name}...`);

    try {
      switch (name) {
        case 'index-student': {
          const { studentId, operation } = data;
          if (operation === 'delete') {
            await IndexingService.removeStudent(studentId);
          } else {
            const student = await StudentModel.findOne({ firebaseUid: studentId });
            if (student) await IndexingService.indexStudent(student);
          }
          break;
        }

        case 'index-resource': {
          const { resourceId, operation } = data;
          if (operation === 'delete') {
            await IndexingService.removeResource(resourceId);
          } else {
            const resource = await ResourceModel.findById(resourceId);
            if (!resource || resource.verification?.status === 'rejected') {
              await IndexingService.removeResource(resourceId);
            } else {
              await IndexingService.indexResource(resource);
            }
          }
          break;
        }

        case 'update-resource-verification': {
          const { resourceId, status } = data;
          await IndexingService.updateResourceVerification(resourceId, status);
          break;
        }

        case 'bulk-reindex': {
          const { type } = data;
          await IndexingService.bulkReindex(type);
          break;
        }

        default:
          console.warn(`⚠️ Unknown indexing job: ${name}`);
      }
    } catch (error) {
      console.error(`❌ Indexing Job [${job.id}] failed:`, error);
      throw error;
    }
  }
}
