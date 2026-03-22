import { nexusConnector, StudentModel, ResourceModel, SwapModel } from './nexus-connector.js';
import { FlagModel } from '../mongo/models/flag.js';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const CAMPUSES = ['IIT_JAMMU', 'IIT_DELHI', 'IIT_BOMBAY', 'IIT_KANPUR', 'NIT_TRICHY'];
const SUBJECTS = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Physics', 'Mathematics'];
const SKILLS = ['Python', 'React', 'Node.js', 'Machine Learning', 'Data Structures', 'Algorithms', 'UI Design', 'Cloud Computing'];

async function seed() {
  try {
    console.log('🌱 Nexus Seeder: Connecting...');
    await nexusConnector.connectNode();

    // 1. Clear Collections (Development Only)
    console.log('🧹 Clearing legacy data...');
    await Promise.all([
      StudentModel.deleteMany({}),
      ResourceModel.deleteMany({}),
      FlagModel.deleteMany({}),
      SwapModel.deleteMany({})
    ]);
    // Note: FlagModel might be in a different collection if it's imported differently
    await FlagModel.deleteMany({});

    await nexusConnector.pg.query('TRUNCATE mou_handshake_log, admin_actions, karma_ledger RESTART IDENTITY CASCADE');

    // 2. Seed Students (100+)
    console.log('👥 Seeding 100+ students...');
    const students = [];
    for (let i = 1; i <= 105; i++) {
       const campus = CAMPUSES[i % CAMPUSES.length];
       const dept = SUBJECTS[i % SUBJECTS.length];
       
       students.push({
         firebaseUid: `user-seed-${i}`,
         name: `Student Node ${i}`,
         email: `student${i}@${campus.toLowerCase()}.edu.in`,
         campus,
         campusId: campus, // Required field
         collegeGroupId: 'NEXUS_ALPHA', // Required field
         department: dept,
         year: (i % 4) + 1,
         karma: 100 + (i * 5),
         reputationScore: 0.5 + (Math.random() * 0.5),
         rankTier: i > 90 ? 'platinum' : (i > 60 ? 'gold' : 'silver'), // Fixed enum mismatch (no diamond)
         skills: [SKILLS[i % SKILLS.length], SKILLS[(i + 1) % SKILLS.length]],
         wantToLearn: [SKILLS[(i + 2) % SKILLS.length]],
         onboardingStatus: 'complete',
         moderation: { status: 'good_standing' },
         nexus: { crossCampusEnabled: i % 2 === 0 }
       });
    }
    await StudentModel.insertMany(students);

    // 3. Seed Resources (30+)
    console.log('📦 Seeding Knowledge Vault...');
    const resources = [];
    for (let i = 1; i <= 35; i++) {
      const uploader = students[i];
      resources.push({
        ownerUid: uploader.firebaseUid,
        title: `Research Notes: ${SUBJECTS[i % SUBJECTS.length]} Module ${i}`,
        description: `Comprehensive study guide and laboratory notes for ${SUBJECTS[i % SUBJECTS.length]}.`,
        subject: SUBJECTS[i % SUBJECTS.length],
        campusId: uploader.campus,
        collegeGroupId: 'NEXUS_ALPHA',
        fileUrl: 'https://cloudinary.com/sample-resource.pdf',
        fileType: 'PDF',
        karmaCost: 10 + (i * 2),
        verification: { 
          status: 'verified', 
          verifiedBy: 'system-admin',
          verifiedAt: new Date()
        }
      });
    }
    await ResourceModel.insertMany(resources);

    // 4. Seed MOUs (Nexus Partnerships)
    console.log('🤝 Establishing Institutional MOUs...');
    await nexusConnector.pg.query(`
      INSERT INTO mou_handshake_log (initiating_campus, accepting_campus, status, "isActive", valid_from, valid_until)
      VALUES 
        ('IIT_JAMMU', 'IIT_DELHI', 'active', true, NOW(), NOW() + INTERVAL '1 year'),
        ('IIT_JAMMU', 'NIT_TRICHY', 'active', true, NOW(), NOW() + INTERVAL '1 year'),
        ('IIT_DELHI', 'IIT_BOMBAY', 'active', true, NOW(), NOW() + INTERVAL '1 year')
    `);

    console.log('✅ Nexus Node Seeded Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Failed:', error);
    process.exit(1);
  }
}

seed();
