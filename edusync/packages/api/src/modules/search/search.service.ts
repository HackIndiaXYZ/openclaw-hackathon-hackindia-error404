import { StudentModel, ResourceModel } from '@edusync/db';
import { studentsIndex, resourcesIndex } from '../../lib/meilisearch.js';

/**
 * PHASE 9 HARDENED SEARCH SERVICE
 * 
 * Double-Safety Pattern:
 * 1. Try Meilisearch (fast path) with 1-second timeout
 * 2. Fallback to MongoDB if timeout or error occurs
 * 3. Log fallback event for monitoring
 * 
 * CRITICAL: Same response shape for both providers
 */
export class SearchService {
  /**
   * Alias for search (used by DiscoveryService/Controller)
   */
  static async searchStudents(query: string, filters: any, requester: any, pagination?: any) {
    return this.search(query, filters, requester);
  }

  /**
   * Orchestrates report requests from the controller (Phase 9 requirement)
   */
  static async requestReport(campus: string, adminUid: string, type: 'roi' | 'mou' = 'roi', mouId?: string) {
    // In a production environment, this would push to a BullMQ queue.
    // For now, we'll just log it.
    console.log(`Report request received: Type=${type}, Campus=${campus}, Admin=${adminUid}, MOU_ID=${mouId}`);
    return { success: true, message: 'Report request acknowledged.' };
  }

  /**
   * Search suggestions (Phase 9 requirement)
   */
  static async getSuggestions(query: string, requester: any) {
    const results = await studentsIndex.search(query, {
      limit: 5,
      attributesToRetrieve: ['name', 'skills']
    });
    return results.hits.map(h => ({
      text: h.name,
      type: 'student',
      subtext: (h as any).skills?.[0] || ''
    }));
  }

  static async search(
    query: string,
    filters: {
      campus?: string;
      nexusMode?: boolean;
      minKarma?: number;
      rankTier?: string;
    },
    requester: any
  ): Promise<{
    hits: any[];
    total: number;
    provider: 'meilisearch' | 'mongodb';
    latencyMs: number;
    fallbackReason?: string;
  }> {
    const startTime = Date.now();

    try {
      // Strategy: Promise.race with timeout
      const meilisearchPromise = this.searchMeilisearch(query, filters, requester);
      const timeoutPromise = new Promise<{ hits: any[], total: number }>((_, reject) =>
        setTimeout(
          () => reject(new Error('Meilisearch timeout (1s threshold)')),
          1000
        )
      );

      const results = await Promise.race([meilisearchPromise, timeoutPromise]);

      // If Meilisearch is empty, fall back to MongoDB for resilience (it might be sync delay)
      if (results.hits.length === 0 && query.length > 0) {
        throw new Error('Meilisearch returned 0 results; falling back to MongoDB for higher discovery recall.');
      }

      return {
        hits: results.hits,
        total: results.total,
        provider: 'meilisearch',
        latencyMs: Date.now() - startTime,
      };
    } catch (err: any) {
      // FALLBACK: Try MongoDB
      const fallbackStart = Date.now();
      
      try {
        const mongoResults = await this.searchMongoDB(query, filters, requester);

        return {
          hits: mongoResults.hits,
          total: mongoResults.total,
          provider: 'mongodb',
          latencyMs: Date.now() - startTime,
          fallbackReason: err.message,
        };
      } catch (mongoErr: any) {
        // Both failed — return empty results (don't crash)
        return {
          hits: [],
          total: 0,
          provider: 'mongodb',
          latencyMs: Date.now() - startTime,
          fallbackReason: `Meilisearch: ${err.message}, MongoDB: ${mongoErr.message}`,
        };
      }
    }
  }

  private static async searchMeilisearch(query: string, filters: any, requester: any) {
    const filterArray: string[] = [];
    
    if (filters.campus && !filters.nexusMode) {
      filterArray.push(`campusId = "${filters.campus}"`);
    } else if (filters.campus && filters.nexusMode) {
      // Nexus Partner logic would go here in actual filter syntax
      // e.g. campusId IN ["IIT_JAMMU", "IIT_DELHI"]
      const partners = requester?.partnerCampuses || [filters.campus];
      const partnerFilter = Object.values(partners).map(c => `campusId = "${c}"`).join(' OR ');
      filterArray.push(`(${partnerFilter})`);
    }

    if (filters.minKarma) filterArray.push(`karma >= ${filters.minKarma}`);
    if (filters.rankTier) filterArray.push(`rankTier = "${filters.rankTier}"`);

    const results = await studentsIndex.search(query, {
      filter: filterArray.join(' AND '),
      limit: 100
    });

    return {
      hits: results.hits,
      total: (results as any).totalHits || results.hits.length,
    };
  }

  static async searchResources(
    query: string,
    filters: {
      campus?: string;
      fileType?: string;
      nexusMode?: boolean;
      verificationStatus?: string;
    },
    requester: any,
    pagination: { limit: number, offset: number }
  ): Promise<{
    hits: any[];
    total: number;
    provider: 'meilisearch' | 'mongodb';
    latencyMs: number;
    searchProvider: 'meilisearch' | 'mongodb';
    processingTimeMs: number;
  }> {
    const startTime = Date.now();
    try {
      const filterArray: string[] = [];
      if (filters.campus) filterArray.push(`campusId = "${filters.campus}"`);
      if (filters.fileType) filterArray.push(`fileType = "${filters.fileType}"`);
      if (filters.verificationStatus) filterArray.push(`verificationStatus = "${filters.verificationStatus}"`);

      const results = await resourcesIndex.search(query, {
        filter: filterArray.join(' AND '),
        limit: pagination.limit,
        offset: pagination.offset
      });

      return {
        hits: results.hits,
        total: (results as any).totalHits || results.hits.length,
        provider: 'meilisearch',
        searchProvider: 'meilisearch',
        latencyMs: Date.now() - startTime,
        processingTimeMs: Date.now() - startTime
      };
    } catch (err) {
      // Fallback to Mongo for resources
      const mongoQuery: any = {};
      if (filters.campus) mongoQuery.campusId = filters.campus;
      if (filters.fileType) mongoQuery.fileType = filters.fileType;
      
      if (query) mongoQuery.$text = { $search: query };

      const hits = await ResourceModel.find(mongoQuery)
        .skip(pagination.offset)
        .limit(pagination.limit)
        .lean();
      
      const total = await ResourceModel.countDocuments(mongoQuery);

      return {
        hits,
        total,
        provider: 'mongodb',
        searchProvider: 'mongodb',
        latencyMs: Date.now() - startTime,
        processingTimeMs: Date.now() - startTime
      };
    }
  }

  private static async searchMongoDB(query: string, filters: any, requester: any) {
    const mongoQuery: any = {};
    
    if (filters.campus && !filters.nexusMode) {
      mongoQuery.campusId = filters.campus;
    } else if (filters.campus && filters.nexusMode) {
      mongoQuery.campusId = { $in: Object.values(requester?.partnerCampuses || [filters.campus]) };
    }

    if (filters.minKarma) mongoQuery.karma = { $gte: filters.minKarma };
    if (filters.rankTier) mongoQuery.rankTier = filters.rankTier;

    // Use $text search if query exists, otherwise just filters
    if (query) {
      mongoQuery.$text = { $search: query };
    }

    const hits = await StudentModel.find(mongoQuery)
      .limit(100)
      .lean();

    const total = await StudentModel.countDocuments(mongoQuery);

    return { hits, total };
  }
}
