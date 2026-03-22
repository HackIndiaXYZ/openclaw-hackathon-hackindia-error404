import { nexusConnector } from './nexus-connector.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  console.log('🚀 Starting PostgreSQL Migration...');
  
  try {
    await nexusConnector.connectNode();
    const client = await nexusConnector.pg.connect();
    
    const sqlPath = path.join(__dirname, '..', 'postgres', 'schema', 'init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('📜 Checking migration status...');
    await client.query('BEGIN');
    
    // Create migrations table first if it doesn't exist (bootstrap)
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(50) PRIMARY KEY,
        applied_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    const version = 'v1_initial_karma_and_swap';
    const check = await client.query('SELECT 1 FROM schema_migrations WHERE version = $1', [version]);

    if (check.rows.length === 0) {
      console.log(`📜 Executing migration: ${version}...`);
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [version]);
      console.log('✅ Migration applied!');
    } else {
      console.log(`⏭️ Migration ${version} already applied. Skipping.`);
    }
    
    await client.query('COMMIT');
    
    // Verify tables
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('📊 Existing tables:', res.rows.map((r: any) => r.table_name).join(', '));
    
    client.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
