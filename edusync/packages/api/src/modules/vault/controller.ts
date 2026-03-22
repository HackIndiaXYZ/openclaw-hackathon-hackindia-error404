import { Request, Response } from 'express';
import { VaultService } from './service.js';
import { v2 as cloudinary } from 'cloudinary';
import { SearchService } from '../search/search.service.js';

export class VaultController {
  static async uploadResource(req: Request, res: Response) {
    try {
      if (!req.file) throw new Error('No file uploaded');
      const student = (req as any).student;

      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      
      const cldRes = await cloudinary.uploader.upload(dataURI, {
        resource_type: "auto",
        folder: "nexus_vault"
      });

      const result: any = await VaultService.uploadResource({
        ...req.body,
        ownerUid: student.uid,
        campusId: student.campus,
        collegeGroupId: student.collegeGroupId,
        fileUrl: cldRes.secure_url,
        fileType: req.body.fileType || 'PDF',
        karmaCost: parseInt(req.body.karmaCost || '0')
      });

      res.status(201).json(result);
    } catch (error: any) {
      console.error('Vault Upload Error:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async listResources(req: Request, res: Response) {
    try {
      const student = (req as any).student;
      const { query, type, campus, nexusMode, verificationStatus, offset, limit } = req.query;

      const _offset = offset ? parseInt(offset as string) : 0;
      const _limit = limit ? parseInt(limit as string) : 50;

      const results = await SearchService.searchResources(
        query as string || '',
        {
          campus: campus as string,
          fileType: type as string,
          nexusMode: nexusMode === 'true',
          verificationStatus: verificationStatus as string
        },
        student,
        { limit: _limit, offset: _offset }
      );

      res.json({ 
        success: true, 
        data: results.hits,
        meta: {
          pagination: { 
            total: results.total, 
            limit: _limit, 
            offset: _offset 
          },
          searchProvider: results.searchProvider,
          processingTimeMs: results.processingTimeMs
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async purchaseResource(req: Request, res: Response) {
    try {
      const { resourceId } = req.params;
      const student = (req as any).student;
      const resource = await VaultService.purchaseResource(resourceId, student.uid, student.campus);
      res.json({ success: true, data: resource });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async getResource(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const resource = await VaultService.getResourceById(id);
      if (!resource) return res.status(404).json({ success: false, error: 'Resource not found' });
      res.json({ success: true, data: resource });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async resubmitResource(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const student = (req as any).student;
      const result: any = await VaultService.resubmitResource(id, student.uid, req.body);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async semanticSearch(req: Request, res: Response) {
    // Phase 9: Stub for semantic search (implemented in Phase 10 with vector embeddings)
    res.json({ success: true, data: [], note: 'Semantic search unblocked for Phase 10' });
  }
}
