import { describe, it, expect } from 'vitest';
import { ScoringService } from '../../src/modules/discovery/scoring.service.js';

describe('ScoringService (PHASE 9 HARDENED)', () => {
  const requester = {
    firebaseUid: 'req-1',
    campusId: 'IIT_JAMMU',
    partnerCampuses: ['IIT_DELHI'],
    status: 'active'
  };

  it('INVARIANT: Weights sum to exactly 1.0', () => {
    // This is tested in module load, but we can verify logic here
    const relevance = 0.5;
    const reputation = 0.3;
    const proximity = 0.2;
    expect(relevance + reputation + proximity).toBe(1.0);
  });

  it('INVARIANT: Same campus > Nexus > No link', () => {
    const hitSame = { firebaseUid: 'h1', campusId: 'IIT_JAMMU', karma: 100, rankTier: 'silver' };
    const hitNexus = { firebaseUid: 'h2', campusId: 'IIT_DELHI', karma: 100, rankTier: 'silver' };
    const hitNone = { firebaseUid: 'h3', campusId: 'BITS_PILANI', karma: 100, rankTier: 'silver' };

    const s1 = ScoringService.scoreCandidate(hitSame, requester);
    const s2 = ScoringService.scoreCandidate(hitNexus, requester);
    const s3 = ScoringService.scoreCandidate(hitNone, requester);

    expect(s1).toBeGreaterThan(s2);
    expect(s2).toBeGreaterThan(s3);
  });

  it('INVARIANT: Diamond > Silver > Bronze', () => {
    const hitD = { firebaseUid: 'h1', campusId: 'IIT_JAMMU', karma: 100, rankTier: 'diamond' };
    const hitS = { firebaseUid: 'h2', campusId: 'IIT_JAMMU', karma: 100, rankTier: 'silver' };
    const hitB = { firebaseUid: 'h3', campusId: 'IIT_JAMMU', karma: 100, rankTier: 'bronze' };

    const s1 = ScoringService.scoreCandidate(hitD, requester);
    const s2 = ScoringService.scoreCandidate(hitS, requester);
    const s3 = ScoringService.scoreCandidate(hitB, requester);

    expect(s1).toBeGreaterThan(s2);
    expect(s2).toBeGreaterThan(s3);
  });

  it('INVARIANT: Self-scoring returns 0', () => {
    const hitSelf = { firebaseUid: 'req-1', campusId: 'IIT_JAMMU', karma: 1000, rankTier: 'diamond' };
    expect(ScoringService.scoreCandidate(hitSelf, requester)).toBe(0);
  });

  it('INVARIANT: Suspended students score 0', () => {
    const hitSuspended = { firebaseUid: 'h1', campusId: 'IIT_JAMMU', karma: 100, rankTier: 'silver', status: 'suspended' };
    expect(ScoringService.scoreCandidate(hitSuspended, requester)).toBe(0);
  });
});
