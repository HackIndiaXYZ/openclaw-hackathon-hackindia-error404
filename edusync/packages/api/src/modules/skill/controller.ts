import { Request, Response } from 'express';
import { StudentModel, SwapModel } from '@edusync/db';
import { SkillSwapSchema, encryptData } from '@edusync/shared';
import { SearchService } from '../search/search.service.js';
import { DiscoveryService } from '../discovery/discovery.service.js';
import { ScoringService } from '../discovery/scoring.service.js';
import { meilisearchIndexerQueue } from '../../lib/queues.js';

/**
 * PHASE 9 HARDENING: Search & Discovery Pipeline
 * 
 * REQUEST FLOW:
 * 
 * GET /api/v1/skills?query=Python&offset=0&limit=30
 *   ↓
 * 1. SearchService.search(query, campus)
 *    ├─ Try Meilisearch (fast path, 1s timeout)
 *    └─ Fallback: MongoDB regex if timeout/error
 *       Returns: raw hits + searchProvider + latencyMs
 *   ↓
 * 2. DiscoveryService.scoreAll(hits, requester)
 *    ├─ For each hit: score = (relevance×0.50) + (reputation×0.30) + (proximity×0.20)
 *    ├─ Sort by score DESC
 *    └─ Returns: scored hits with breakdown
 *   ↓
 * 3. Pagination (offset, limit) applied to scored results
 *   ↓
 * 4. Response with: data, meta.searchProvider, meta.latencyMs
 * 
 * CRITICAL INVARIANTS:
 * - Weights are locked (0.50/0.30/0.20), tested in DiscoveryService.test.ts
 * - Fallback is transparent (same response shape for both providers)
 * - Campus isolation enforced via visibility filter (before search)
 * - Scores are always [0, 1] (validated)
 * 
 * @see packages/api/src/modules/search/search.service.js (SearchService)
 * @see packages/api/src/modules/discovery/scoring.service.js (ScoringService)
 * @see MASTER_DEV_DOC.md § Phase 9 Search & Intelligence
 */
export const listSkills = async (req: Request, res: Response) => {
  const { query = '', campus, nexusMode, minKarma, rankTier, offset = '0', limit = '30' } = req.query;
  const student = (req as any).student;
  const startTime = Date.now();

  try {
    // Step 1: Raw search (with automatic fallback)
    const searchResults = await SearchService.search(
      query as string,
      { 
        campus: campus as string,
        nexusMode: nexusMode === 'true',
        minKarma: minKarma ? parseInt(minKarma as string) : undefined,
        rankTier: rankTier as string
      },
      student
    );

    // Step 2: Score and rank
    const scoredResults = await Promise.all(
      searchResults.hits.map(async (hit) => ({
        ...hit,
        matchScore: ScoringService.scoreCandidate(hit, student),
        scoreBreakdown: ScoringService.getScoreBreakdown(hit, student)
      }))
    );

    // Sort by score
    const sorted = scoredResults.sort((a, b) => b.matchScore - a.matchScore);

    // Step 3: Paginate
    const _offset = parseInt(offset as string);
    const _limit = parseInt(limit as string);
    const paginated = sorted.slice(_offset, _offset + _limit);

    const latencyMs = Date.now() - startTime;

    res.json({
      success: true,
      data: paginated,
      meta: {
        pagination: { 
          total: sorted.length, 
          limit: _limit, 
          offset: _offset 
        },
        searchProvider: searchResults.provider,
        latencyMs
      }
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false,
      error: { code: 'SEARCH_ERROR', message: error.message || 'Nexus Search Failure' } 
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = await StudentModel.findOne({ firebaseUid: id });
    if (!student) return res.status(404).json({ error: 'Student Node Not Found' });
    
    const profile = student.toObject();
    profile.firebaseUid = encryptData(profile.firebaseUid);
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Profile Retrieval Failure' });
  }
};

export const proposeSwap = async (req: Request, res: Response) => {
  try {
    const student = (req as any).student;
    if (!student) return res.status(401).json({ error: 'Auth Required' });

    const validatedBody = SkillSwapSchema.parse({
      ...req.body,
      requesterUid: student.uid
    });

    const requester = await StudentModel.findOne({ firebaseUid: student.uid });
    if (!requester || requester.karma < validatedBody.karmaStaked) {
      return res.status(403).json({ error: 'Insufficient Karma Balance' });
    }

    const newSwap = new SwapModel(validatedBody);
    await newSwap.save();

    res.status(201).json({ 
      message: 'Nexus Swap Proposal Broadcasted',
      swapId: newSwap._id 
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid Swap Protocol parameters' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const student = (req as any).student;
    if (!student) return res.status(401).json({ error: 'Auth Required' });

    const updated = await StudentModel.findOneAndUpdate(
      { firebaseUid: student.uid },
      { $set: req.body },
      { new: true, upsert: true }
    );

    // Trigger Meilisearch Indexing
    const job = await meilisearchIndexerQueue.add('index-student', {
      studentId: student.uid,
      operation: 'upsert'
    }, {
      jobId: `index-student:${student.uid}`,
      removeOnComplete: true
    });

    res.json({
      ...updated.toObject(),
      indexingJobId: job.id
    });
  } catch (error) {
    res.status(500).json({ error: 'Profile Sync Failure' });
  }
};

export const enhanceDescription = async (req: Request, res: Response) => {
  try {
    const { draft } = req.body;
    const { GeminiService } = await import('../../services/gemini-service.js');
    const enhanced = await GeminiService.generateSkillListing(draft);
    res.json({ enhanced });
  } catch (error) {
    res.status(500).json({ error: 'AI Enhancement Failure' });
  }
};

export const getSemanticMatches = async (req: Request, res: Response) => {
  try {
    const { query, library } = req.body;
    const { GeminiService } = await import('../../services/gemini-service.js');
    const matches = await GeminiService.matchSkillIntent(query, library);
    res.json({ matches });
  } catch (error) {
    res.status(500).json({ error: 'Semantic Match Failure' });
  }
};
