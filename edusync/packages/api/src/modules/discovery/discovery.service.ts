import { redis } from '../../services/redis-service.js';
import { MOUService } from '../mou/service.js';
import { SearchService } from '../search/search.service.js';
import { ScoringService } from './scoring.service.js';

export class DiscoveryService {
  private static CACHE_TTL = 600; // 10 minutes

  /**
   * Enhanced student discovery with weighted scoring (V2)
   * 
   * DATA FLOW:
   * 1. Query raw candidates from SearchService (Meilisearch -> MongoDB fallback)
   * 2. Fetch Institutional Context (Campus + MOU Partners)
   * 3. Apply ScoringService.scoreBatch() to calculate weighted ranks
   * 4. Cache and return to controller
   */
  static async getMatchingStudents(student: any, query: string, filters: any, pagination: any) {
    const cacheKey = `discovery:matches:${student.firebaseUid}:${query}:${JSON.stringify(filters)}:${pagination.offset}:${pagination.limit}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    // 1. Fetch Candidates (Meilisearch -> MongoDB Fallback)
    const searchResult = await SearchService.searchStudents(query, filters, student, pagination);
    if (!searchResult.hits.length) return searchResult;

    // 2. Resolve Institutional Context
    const campus = student.campusId || student.campus;
    const mouResult = await MOUService.getMOUList(campus);
    const partnerCampuses = new Set(
      mouResult.mous.filter((m: any) => m.isActive).map((m: any) => m.partnerCampus)
    );

    // 3. Batch Scoring (50/30/20 Weighted Engine)
    const scoredHits = ScoringService.scoreBatch(searchResult.hits, {
      campusId: campus,
      partnerCampuses
    });

    const result = {
      ...searchResult,
      hits: scoredHits,
      algorithm: 'complementary-matching-v2'
    };

    // 4. Cache & Return
    await redis.set(cacheKey, JSON.stringify(result), { EX: this.CACHE_TTL });
    return result;
  }
}
