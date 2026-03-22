import { Router, Request, Response } from 'express';
import * as VaultController from './modules/vault/controller.js';
import * as AdminController from './modules/admin/controller.js';
import * as SkillController from './modules/skill/controller.js';
import * as KarmaController from './modules/karma/controller.js';
import { SwapController } from './modules/swap/controller.js';
import { institutionalAuth, adminOnly } from './middleware/auth.js';
import { KarmaService } from './modules/karma/service.js';

const router = Router();

// Public Health Check
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'Nexus Node Active', timestamp: new Date() });
});

// Profile & Skill Nexus
router.get('/skills', SkillController.listSkills);
router.get('/profile/:id', SkillController.getProfile);
router.post('/profile/sync', institutionalAuth, SkillController.updateProfile);
router.post('/swaps/propose', institutionalAuth, SkillController.proposeSwap);

// Knowledge Vault
router.get('/vault', VaultController.listResources);
router.post('/vault/upload', institutionalAuth, VaultController.uploadResource);
router.post('/vault/purchase/:resourceId', institutionalAuth, VaultController.purchaseResource);

// Institutional Admin Hub (Guardian Protocol)
router.get('/admin/stats', institutionalAuth, adminOnly, AdminController.getSystemStats);
router.get('/admin/queue', institutionalAuth, adminOnly, AdminController.getModerationQueue);
router.post('/admin/resolve', institutionalAuth, adminOnly, AdminController.resolveFlag);
router.post('/admin/audit', institutionalAuth, adminOnly, AdminController.runSafetyAudit);

// Karma Nexus Ledger
router.get('/karma/balance', institutionalAuth, KarmaController.getBalance);
router.get('/karma/history', institutionalAuth, KarmaController.getHistory);

// --- SKILL SWAP ENGINE ---
router.post('/swaps/propose', institutionalAuth, SwapController.proposeSwap);
router.patch('/swaps/:id/accept', institutionalAuth, SwapController.acceptSwap);
router.patch('/swaps/:id/reject', institutionalAuth, SwapController.rejectSwap);
router.patch('/swaps/:id/complete', institutionalAuth, SwapController.completeSwap);
router.get('/swaps', institutionalAuth, SwapController.getSwaps);
router.get('/swaps/:id', institutionalAuth, SwapController.getSwapById);

// AI Genesis Endpoints
router.post('/ai/enhance', institutionalAuth, SkillController.enhanceDescription);
router.post('/ai/match', institutionalAuth, SkillController.getSemanticMatches);

export default router;
