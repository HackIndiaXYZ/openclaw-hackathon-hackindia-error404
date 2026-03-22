import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchService } from '../../src/modules/search/search.service.js';
import { studentsIndex } from '../../src/lib/meilisearch.js';
import { StudentModel } from '@edusync/db';

vi.mock('../../src/lib/meilisearch.js', () => ({
  studentsIndex: {
    search: vi.fn()
  }
}));

vi.mock('@edusync/db', () => ({
  StudentModel: {
    find: vi.fn(),
    countDocuments: vi.fn()
  }
}));

describe('SearchService Fallback (PHASE 9 HARDENED)', () => {
  const requester = {
    uid: 'req-1',
    campusId: 'IIT_JAMMU',
    partnerCampuses: []
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1-second timeout triggers fallback', async () => {
    // Mock Meilisearch to hang for 2 seconds
    (studentsIndex.search as any).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ hits: [], totalHits: 0 }), 2000)
        )
    );

    // Mock MongoDB to return results quickly
    (StudentModel.find as any).mockReturnValue({
      lean: vi.fn().mockResolvedValue([{ firebaseUid: 'h1', name: 'Fallback Student', karma: 100 }])
    });
    (StudentModel.countDocuments as any).mockResolvedValue(1);

    const result = await SearchService.search('Python', {}, requester);

    // Should fallback to MongoDB before 1.5 seconds (allow buffer)
    expect(result.latencyMs).toBeLessThan(1500);
    expect(result.provider).toBe('mongodb');
    expect(result.fallbackReason).toContain('timeout');
    expect(result.hits[0].name).toBe('Fallback Student');
  });

  it('Meilisearch error triggers fallback', async () => {
    (studentsIndex.search as any).mockRejectedValue(new Error('Connection refused'));

    (StudentModel.find as any).mockReturnValue({
      lean: vi.fn().mockResolvedValue([{ firebaseUid: 'h2', name: 'Error Student', karma: 200 }])
    });
    (StudentModel.countDocuments as any).mockResolvedValue(1);

    const result = await SearchService.search('Python', {}, requester);

    expect(result.provider).toBe('mongodb');
    expect(result.fallbackReason).toContain('Connection refused');
    expect(result.hits[0].name).toBe('Error Student');
  });

  it('Same response shape for both providers', async () => {
    // 1. Meili Success
    (studentsIndex.search as any).mockResolvedValue({ hits: [{ firebaseUid: 'meili', name: 'Meili User' }], totalHits: 1 });
    const meiliRes = await SearchService.search('Python', {}, requester);

    // 2. Mongo Success (via Meili Error)
    (studentsIndex.search as any).mockRejectedValue(new Error('fail'));
    (StudentModel.find as any).mockReturnValue({ lean: vi.fn().mockResolvedValue([{ firebaseUid: 'mongo', name: 'Mongo User' }]) });
    (StudentModel.countDocuments as any).mockResolvedValue(1);
    const mongoRes = await SearchService.search('Python', {}, requester);

    expect(meiliRes).toHaveProperty('hits');
    expect(meiliRes).toHaveProperty('provider');
    expect(meiliRes).toHaveProperty('latencyMs');

    expect(mongoRes).toHaveProperty('hits');
    expect(mongoRes).toHaveProperty('provider');
    expect(mongoRes).toHaveProperty('latencyMs');
  });
});
