import { Request, Response } from 'express';
import { meiliClient } from '../../lib/meilisearch.js';
import { meilisearchIndexerQueue } from '../../lib/queues.js';
import { SearchService } from './search.service.js';

export class SearchController {
  static async bulkReindex(req: Request, res: Response) {
    try {
      const { type } = req.body;
      if (!['students', 'resources', 'all'].includes(type)) {
        return res.status(400).json({ error: 'Invalid reindex type' });
      }

      if (type === 'all') {
        await meilisearchIndexerQueue.add('bulk-reindex', { type: 'students' });
        await meilisearchIndexerQueue.add('bulk-reindex', { type: 'resources' });
      } else {
        await meilisearchIndexerQueue.add('bulk-reindex', { type });
      }

      res.json({ success: true, message: `Reindex job for ${type} enqueued` });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getStats(req: Request, res: Response) {
    try {
      const stats = await meiliClient.getStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSuggestions(req: Request, res: Response) {
    try {
      const { query, type } = req.query;
      if (!query || !type) return res.json([]);
      
      const suggestions = await SearchService.getSuggestions(
        query as string, 
        type as 'students' | 'resources'
      );
      res.json(suggestions);
    } catch {
      res.json([]);
    }
  }
}
