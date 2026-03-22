import { StudentModel, ResourceModel } from '@edusync/db';
import { studentsIndex, resourcesIndex } from '../../lib/meilisearch.js';

export class IndexingService {
  /**
   * Builds and syncs a Meilisearch document from a StudentModel
   */
  static async indexStudent(student: any) {
    const doc = {
      id: student.firebaseUid,
      name: student.name,
      skills: student.skills.map((s: any) => s.name),
      skillsWithLevel: student.skills.map((s: any) => `${s.name} ${s.level}`),
      wantToLearn: student.wantToLearn.map((w: any) => w.name),
      specialization: student.specialization,
      department: student.department,
      campus: student.campus,
      karma: student.karma,
      reputationScore: student.reputationScore,
      karmaRank: student.karmaRank,
      rankTier: student.rankTier,
      nexusCrossEnabled: student.nexus?.crossCampusEnabled,
      moderationStatus: student.moderation?.status,
      onboardingStatus: student.onboardingStatus,
      avatarUrl: student.avatarUrl,
      year: (student as any).year,
    };

    return await studentsIndex.addDocuments([doc]);
  }

  static async removeStudent(firebaseUid: string) {
    return await studentsIndex.deleteDocument(firebaseUid);
  }

  /**
   * Builds and syncs a Meilisearch document from a ResourceModel
   */
  static async indexResource(resource: any) {
    const doc = {
      id: resource._id.toString(),
      title: resource.title,
      description: resource.description,
      subject: resource.subject,
      courseCode: resource.courseCode,
      department: resource.department,
      tags: resource.tags,
      campus: resource.campusId,
      fileType: resource.fileType,
      verificationStatus: resource.verification?.status,
      visibility: resource.visibility,
      collegeGroupId: resource.collegeGroupId,
      karmaCost: resource.karmaCost,
      downloads: resource.downloads,
      ratingsAverage: resource.ratings?.average,
      semester: (resource as any).semester,
      year: (resource as any).year,
      uploaderUid: resource.ownerUid,
      createdAt: resource.createdAt instanceof Date ? resource.createdAt.getTime() : new Date(resource.createdAt).getTime(),
    };

    return await resourcesIndex.addDocuments([doc]);
  }

  static async removeResource(resourceId: string) {
    return await resourcesIndex.deleteDocument(resourceId);
  }

  /**
   * Partial update for resource verification status
   */
  static async updateResourceVerification(resourceId: string, newStatus: string) {
    return await resourcesIndex.updateDocuments([{ 
      id: resourceId, 
      verificationStatus: newStatus 
    }]);
  }

  /**
   * Performs a full reindex from MongoDB
   */
  static async bulkReindex(type: 'students' | 'resources') {
    console.log(`🚀 Starting bulk reindex for: ${type}`);
    let processed = 0;

    if (type === 'students') {
      const students = await StudentModel.find({});
      const batches = [];
      for (let i = 0; i < students.length; i += 500) {
        batches.push(students.slice(i, i + 500));
      }

      for (const batch of batches) {
        const docs = batch.map(s => ({
          id: s.firebaseUid,
          name: s.name,
          skills: s.skills.map((sk: any) => sk.name),
          wantToLearn: s.wantToLearn.map((w: any) => w.name),
          specialization: s.specialization,
          department: s.department,
          campus: s.campus,
          karma: s.karma,
          reputationScore: s.reputationScore,
          rankTier: s.rankTier,
          nexusCrossEnabled: s.nexus?.crossCampusEnabled,
          moderationStatus: s.moderation?.status,
          onboardingStatus: s.onboardingStatus,
          avatarUrl: s.avatarUrl,
          year: (s as any).year,
        }));
        await studentsIndex.addDocuments(docs);
        processed += batch.length;
        console.log(`📦 Students: Indexed ${processed}/${students.length}`);
      }
    } else {
      const resources = await ResourceModel.find({});
      const batches = [];
      for (let i = 0; i < resources.length; i += 500) {
        batches.push(resources.slice(i, i + 500));
      }

      for (const batch of batches) {
        const docs = batch.map(r => ({
          id: r._id.toString(),
          title: r.title,
          description: r.description,
          subject: r.subject,
          courseCode: r.courseCode,
          department: (r as any).department,
          tags: (r as any).tags,
          campus: (r as any).campusId,
          fileType: (r as any).fileType,
          verificationStatus: (r as any).verification?.status,
          visibility: (r as any).visibility,
          collegeGroupId: (r as any).collegeGroupId,
          karmaCost: (r as any).karmaCost,
          downloads: (r as any).downloads,
          ratingsAverage: (r as any).ratings?.average,
          semester: (r as any).semester,
          year: (r as any).year,
          uploaderUid: (r as any).ownerUid,
          createdAt: (r as any).createdAt?.getTime ? (r as any).createdAt.getTime() : new Date((r as any).createdAt).getTime()
        }));
        await resourcesIndex.addDocuments(docs);
        processed += batch.length;
        console.log(`📦 Resources: Indexed ${processed}/${resources.length}`);
      }
    }

    return { success: true, processed };
  }
}
