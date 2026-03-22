import { nexusConnector } from '@edusync/db';
import { redis } from '../services/redis-service.js';
import { AnalyticsService } from '../modules/analytics/service.js';
import { getIO } from '../socket.js';

export class MouExpiryWatchdogJob {
  /**
   * MOU Expiry Watchdog Job handler
   * Periodically checks for MOUs that are expiring or have expired.
   */
  static async handle(job: any) {
    console.log('⏳ Running MOU Expiry Watchdog Scan...');
    const io = getIO();

    try {
      const query = `
        SELECT * FROM mou_handshake_log
        WHERE "isActive" = true
        AND (valid_until IS NOT NULL AND valid_until <= NOW() + INTERVAL '30 days')
      `;
      const result = await nexusConnector.pg.query(query);
      const mous = result.rows;

      for (const mou of mous) {
        const now = new Date();
        const validUntil = new Date(mou.valid_until);
        const daysRemaining = Math.floor((validUntil.getTime() - now.getTime()) / 86400000);
        const partners = [mou.initiating_campus, mou.accepting_campus];

        if (daysRemaining <= 0) {
          // EXPIRED
          await nexusConnector.pg.query(`
            UPDATE mou_handshake_log 
            SET "isActive" = false, status = 'expired'
            WHERE id = $1
          `, [mou.id]);

          for (const campus of partners) {
            io.to(`admin:${campus}`).emit('mou:expired', { 
              mouId: mou.id, 
              partnerCampus: campus === mou.initiating_campus ? mou.accepting_campus : mou.initiating_campus 
            });
            await AnalyticsService.invalidateCache(campus);
            await redis.del(`mou:list:${campus}`);
          }

          await nexusConnector.pg.query(`
            INSERT INTO admin_actions (admin_uid, campus, action_type, target_type, target_id, reason)
            VALUES ('SYSTEM', $1, 'mou_auto_expired', 'MOU', $2, 'Partnership expired naturally')
          `, [mou.initiating_campus, mou.id]);

        } else if (daysRemaining <= 7) {
          // CRITICAL alert
          partners.forEach(campus => {
            io.to(`admin:${campus}`).emit('mou:expiring_soon', {
              mouId: mou.id,
              daysRemaining,
              partnerCampus: campus === mou.initiating_campus ? mou.accepting_campus : mou.initiating_campus
            });
          });
        } else if (daysRemaining <= 30) {
          // Standard alert with deduplication
          const alertKey = `mou:alert-sent:${mou.id}:30d`;
          const alreadySent = await redis.get(alertKey);

          if (!alreadySent) {
            partners.forEach(campus => {
              io.to(`admin:${campus}`).emit('mou:expiring_soon', {
                mouId: mou.id,
                daysRemaining,
                partnerCampus: campus === mou.initiating_campus ? mou.accepting_campus : mou.initiating_campus
              });
            });
            await redis.set(alertKey, 'true', { EX: 2160000 }); 
          }
        }
      }
      return { processed: mous.length };
    } catch (error) {
      console.error('❌ MOU Watchdog Logic Error:', error);
      throw error;
    }
  }
}
