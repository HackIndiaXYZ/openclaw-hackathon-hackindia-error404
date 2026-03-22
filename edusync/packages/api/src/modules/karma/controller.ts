import { Request, Response } from 'express';
import { KarmaService } from './service.js';

/**
 * GET /api/v1/karma/balance
 * Returns the authenticated student's current karma balance.
 */
export const getBalance = async (req: Request, res: Response) => {
  try {
    const student = req.student;
    if (!student) return res.status(401).json({ 
      success: false, 
      error: { code: 'AUTH_REQUIRED', message: 'Nexus authentication required' } 
    });

    const balance = await KarmaService.getBalance(student.uid);
    res.json({ success: true, data: { balance } });
  } catch (error) {
    console.error('Balance Retrieval Failure:', error);
    res.status(500).json({ 
      success: false, 
      error: { code: 'LEDGER_ERROR', message: 'Failed to retrieve ledger balance' } 
    });
  }
};

/**
 * GET /api/v1/karma/history
 * Returns the transaction history with cursor-based pagination.
 */
export const getHistory = async (req: Request, res: Response) => {
  try {
    const student = req.student;
    if (!student) return res.status(401).json({ 
      success: false, 
      error: { code: 'AUTH_REQUIRED', message: 'Nexus authentication required' } 
    });

    const { limit, cursor } = req.query;
    const history = await KarmaService.getHistory(
      student.uid, 
      limit ? parseInt(limit as string) : 20, 
      cursor ? parseInt(cursor as string) : undefined
    );

    res.json({ 
      success: true, 
      data: history,
      meta: {
        pagination: {
          limit: limit ? parseInt(limit as string) : 20,
          nextCursor: history.length > 0 ? history[history.length - 1].block_sequence_id : null
        }
      }
    });
  } catch (error) {
    console.error('History Retrieval Failure:', error);
    res.status(500).json({ 
      success: false, 
      error: { code: 'LEDGER_ERROR', message: 'Failed to retrieve transaction history' } 
    });
  }
};
