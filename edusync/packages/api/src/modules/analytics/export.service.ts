import { AnalyticsService } from './service.js';
import { getIO } from '../../socket.js';
// @ts-ignore
import html_to_pdf from 'html-pdf-node';
import fs from 'fs';
import path from 'path';

export class ExportService {
  static async generateROIReport(campus: string, adminUid: string) {
    const overview = await AnalyticsService.getOverview(campus);
    const karmaFlow = await AnalyticsService.getKarmaFlow(campus, '30d');
    
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            h1 { color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 10px; }
            .metric-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-top: 30px; }
            .metric-card { padding: 20px; border: 1px solid #eee; border-radius: 8px; }
            .label { font-size: 12px; color: #666; text-transform: uppercase; }
            .value { font-size: 24px; font-weight: bold; margin-top: 5px; }
            .footer { margin-top: 50px; font-size: 10px; color: #999; text-align: center; }
          </style>
        </head>
        <body>
          <h1>Nexus Node ROI Report: ${campus}</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          
          <div class="metric-grid">
            <div class="metric-card">
              <div class="label">Total Students</div>
              <div class="value">${overview.totalStudents}</div>
            </div>
            <div class="metric-card">
              <div class="label">Nexus Connectivity</div>
              <div class="value">${overview.nexusEnabledStudents}</div>
            </div>
            <div class="metric-card">
              <div class="label">Certified Resources</div>
              <div class="value">${overview.totalResourcesCertified}</div>
            </div>
            <div class="metric-card">
              <div class="label">MOU Health Score</div>
              <div class="value">${overview.mouUtilization}%</div>
            </div>
          </div>

          <h2 style="margin-top: 40px;">30-Day Karma Flow</h2>
          <p>Net Velocity: ${karmaFlow.aggregate.netVelocity}</p>
          
          <div class="footer">
            CONFIDENTIAL - Institutional Administrative Use Only. 
            EduSync Nexus Framework v1.0
          </div>
        </body>
      </html>
    `;

    const file = { content: htmlContent };
    const options = { format: 'A4' };

    const pdfBuffer = await html_to_pdf.generatePdf(file, options);
    const fileName = `ROI-Report-${campus}-${Date.now()}.pdf`;
    
    const publicPath = path.join(process.cwd(), 'public', 'reports');
    if (!fs.existsSync(publicPath)) fs.mkdirSync(publicPath, { recursive: true });
    
    const filePath = path.join(publicPath, fileName);
    fs.writeFileSync(filePath, pdfBuffer);

    getIO().to(`user:${adminUid}`).emit('report:ready', {
      downloadUrl: `/reports/${fileName}`,
      reportName: fileName
    });

    console.log(`✅ [ExportService] ROI Report generated for ${campus}: ${fileName}`);
  }

  static async generateMOUReport(campus: string, mouId: string) {
    const detail = await AnalyticsService.getMOUUtilization(campus, mouId, '90d');
    
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; line-height: 1.6; }
            h1 { color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 10px; }
            .metric-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-top: 30px; }
            .metric-card { padding: 20px; border: 1px solid #eee; border-radius: 8px; }
            .label { font-size: 12px; color: #666; text-transform: uppercase; }
            .value { font-size: 24px; font-weight: bold; margin-top: 5px; }
            .chart-proxy { height: 200px; background: #f9fafb; border-radius: 8px; margin-top: 30px; display: flex; align-items: center; justify-content: center; color: #999; }
            .footer { margin-top: 50px; font-size: 10px; color: #999; text-align: center; }
          </style>
        </head>
        <body>
          <h1>Institutional MOU Report: ${campus} ↔ Partner</h1>
          <p>MOU Reference: ${mouId}</p>
          <p>Reporting Period: 90 Days | Generated: ${new Date().toLocaleDateString()}</p>
          
          <div class="metric-grid">
            <div class="metric-card">
              <div class="label">Partnership Health Score</div>
              <div class="value">${detail.mouHealthScore}/100</div>
            </div>
            <div class="metric-card">
              <div class="label">Karma Exchanged</div>
              <div class="value">${detail.totalKarmaExchanged}</div>
            </div>
            <div class="metric-card">
              <div class="label">Swap Completion Rate</div>
              <div class="value">${(detail.completionRate * 100).toFixed(1)}%</div>
            </div>
            <div class="metric-card">
              <div class="label">Perspective Status</div>
              <div class="value">ACTIVE</div>
            </div>
          </div>

          <div class="chart-proxy">
            [Institutional ROI Trend Data Analysis Visualized]
          </div>
          
          <div class="footer">
            CONFIDENTIAL - Institutional Partnership Data. 
            EduSync Nexus Framework
          </div>
        </body>
      </html>
    `;

    const file = { content: htmlContent };
    const options = { format: 'A4' };
    const pdfBuffer = await html_to_pdf.generatePdf(file, options);
    const fileName = `MOU-ROI-${campus}-${mouId}.pdf`;
    
    const publicPath = path.join(process.cwd(), 'public', 'reports');
    if (!fs.existsSync(publicPath)) fs.mkdirSync(publicPath, { recursive: true });
    
    fs.writeFileSync(path.join(publicPath, fileName), pdfBuffer);

    getIO().to(`admin:${campus}`).emit('report:ready', {
      jobId: mouId,
      downloadUrl: `/reports/${fileName}`,
      reportName: fileName
    });
  }

  /**
   * Orchestrates report requests from the controller (Phase 9 requirement)
   */
  static async requestReport(campus: string, adminUid: string, type: 'roi' | 'mou' = 'roi', mouId?: string) {
    // In a production environment, this would push to a BullMQ queue.
    // For now, we'll trigger the generator asynchronously.
    if (type === 'roi') {
      this.generateROIReport(campus, adminUid).catch(console.error);
    } else if (type === 'mou' && mouId) {
      this.generateMOUReport(campus, mouId).catch(console.error);
    }
    return { success: true, message: 'Report generation queued' };
  }
}

export class ReportGeneratorJob {
  /**
   * Report Generator Job handler
   */
  static async handle(job: any) {
    const { campus, adminUid, mouId } = job.data;
    console.log(`📈 [ExportService] Job ${job.id} started: ${job.name} for ${campus}`);
    
    if (job.name === 'generate-roi-report') {
      await ExportService.generateROIReport(campus, adminUid);
    } else if (job.name === 'generate-mou-report') {
      await ExportService.generateMOUReport(campus, mouId);
    }
  }
}
