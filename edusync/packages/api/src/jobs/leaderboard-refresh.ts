import { StudentModel } from '@edusync/db';
import { KARMA_TIERS, KarmaTier, CampusSchema } from '@edusync/shared';
import { NotificationService } from '../modules/notifications/service.js';
import { redis } from '../services/redis-service.js';
import { getIO } from '../socket.js';

const calculateTier = (karma: number): KarmaTier => {
  if (karma >= KARMA_TIERS.platinum.min) return 'platinum';
  if (karma >= KARMA_TIERS.gold.min) return 'gold';
  if (karma >= KARMA_TIERS.silver.min) return 'silver';
  return 'bronze';
};

export class LeaderboardRefreshJob {
  /**
   * Leaderboard Refresh Job
   * Recomputes ranks across all campuses and global, updates Redis cache.
   */
  static async handle(job: any) {
    console.log('🏆 Leaderboard Job: Starting Full Recompute...');
    
    // 1. Fetch all relevant student metrics
    const students = await StudentModel.find({}, {
      _id: 1, firebaseUid: 1, name: 1, campus: 1, karma: 1, 
      reputationScore: 1, avatarUrl: 1, karmaRank: 1, rankTier: 1
    }).lean();

    const campuses = CampusSchema.options;
    const updatedCampuses: string[] = [];

    // 2. Process each campus
    for (const campus of campuses) {
      const campusStudents = students
        .filter(s => s.campus === campus)
        .sort((a, b) => b.karma - a.karma || b.reputationScore - a.reputationScore);

      if (campusStudents.length === 0) continue;

      const redisKey = `leaderboard:campus:${campus}`;
      await redis.del(redisKey); // Clear old set

      const bulkOps: any[] = [];
      
      for (let i = 0; i < campusStudents.length; i++) {
        const s = campusStudents[i];
        const newRank = i + 1;
        const newTier = calculateTier(s.karma);
        const previousRank = s.karmaRank ?? null;
        const previousTier = s.rankTier || 'bronze';

        // Redis Payload
        const payload = JSON.stringify({
          uid: s.firebaseUid,
          name: s.name,
          avatarUrl: s.avatarUrl,
          campus: s.campus,
          rankTier: newTier,
          karma: s.karma,
          karmaRank: newRank,
          previousRank: previousRank,
          swapsCompleted: 0
        });

        await redis.zAdd(redisKey, { score: s.karma, value: payload });

        // Notification Logic
        if (previousRank !== null && newRank < previousRank) {
          if (newTier !== previousTier && s.karma >= KARMA_TIERS[newTier].min) {
            await NotificationService.create(s.firebaseUid, 'karma_tier_upgrade', {
              newTier, previousTier, currentRank: newRank
            });
          } else if (newRank <= 10 && previousRank > 10) {
            await NotificationService.create(s.firebaseUid, 'leaderboard_top10', {
              campus, currentRank: newRank
            });
          }
        }

        // MongoDB Batch Update
        bulkOps.push({
          updateOne: {
            filter: { _id: s._id },
            update: { $set: { karmaRank: newRank, previousRank: previousRank, rankTier: newTier } }
          }
        });
      }

      if (bulkOps.length > 0) {
        await StudentModel.bulkWrite(bulkOps);
      }
      
      updatedCampuses.push(campus);
    }

    // 3. Global Top 100
    const sortedGlobal = [...students]
      .sort((a, b) => b.karma - a.karma || b.reputationScore - a.reputationScore)
      .slice(0, 100);

    const globalKey = 'leaderboard:global';
    await redis.del(globalKey);

    for (const s of sortedGlobal) {
        const payload = JSON.stringify({
            uid: s.firebaseUid,
            name: s.name,
            avatarUrl: s.avatarUrl,
            campus: s.campus,
            rankTier: s.rankTier,
            karma: s.karma,
            karmaRank: s.karmaRank
        });
        await redis.zAdd(globalKey, { score: s.karma, value: payload });
    }

    await redis.set('leaderboard:last_computed', new Date().toISOString());

    // 4. Emit real-time update event
    getIO().emit('leaderboard:updated', { campuses: updatedCampuses });

    console.log(`✅ Leaderboard Job: Recompute Complete for ${updatedCampuses.length} campuses.`);
    return { campuses: updatedCampuses.length, studentsProcessed: students.length };
  }
}
