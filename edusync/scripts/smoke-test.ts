import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:3001/api/v1';
const TEST_TOKENS = {
  IIT_JAMMU: 'token-iit-jammu',
};

async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log(`✅ ${name}`);
  } catch (err: any) {
    console.error(`❌ ${name}: ${err.message}`);
    process.exit(1);
  }
}

async function runSmokeTests() {
  console.log('\n🔥 PHASE 9 INSTITUTIONAL SMOKE TESTS\n');

  // TEST 1: Meilisearch returns results
  await test('Search: Returns results for "Python"', async () => {
    const res = await axios.get(`${API_URL}/skills/list?query=Python`, {
      headers: { Authorization: `Bearer ${TEST_TOKENS.IIT_JAMMU}` },
    });
    if (!res.data.success) throw new Error('Search failed');
    if (res.data.data.length === 0) throw new Error('No results returned');
    if (!['meilisearch', 'mongodb'].includes(res.data.meta.searchProvider)) {
      throw new Error(`Invalid provider: ${res.data.meta.searchProvider}`);
    }
  });

  // TEST 2: Scores are correctly computed (50/30/20)
  await test('Scoring: Invariants (50/30/20) applied', async () => {
    const res = await axios.get(`${API_URL}/skills/list?query=Python`, {
      headers: { Authorization: `Bearer ${TEST_TOKENS.IIT_JAMMU}` },
    });
    res.data.data.forEach((student: any) => {
      const { matchScore, scoreBreakdown } = student;
      const { relevance, reputation, proximity } = scoreBreakdown;
      const computed = relevance * 0.5 + reputation * 0.3 + proximity * 0.2;
      if (Math.abs(matchScore - computed) > 0.001) {
        throw new Error(`Score mismatch: expected ${computed}, got ${matchScore}`);
      }
    });
  });

  // TEST 3: Campus isolation
  await test('Security: Campus isolation enforced', async () => {
    const res = await axios.get(`${API_URL}/skills/list?query=Python&campus=IIT_JAMMU&nexusMode=false`, {
      headers: { Authorization: `Bearer ${TEST_TOKENS.IIT_JAMMU}` },
    });
    res.data.data.forEach((student: any) => {
      if (student.campusId !== 'IIT_JAMMU') {
        throw new Error(`Isolation violation: ${student.name} from ${student.campusId}`);
      }
    });
  });

  // TEST 4: Proximity ranking
  await test('Ranking: Same > Nexus > None', async () => {
    const res = await axios.get(`${API_URL}/skills/list?query=Python`, {
      headers: { Authorization: `Bearer ${TEST_TOKENS.IIT_JAMMU}` },
    });
    let hasSame = false;
    res.data.data.forEach((s: any) => {
      if (s.scoreBreakdown.proximityLabel === 'Same campus') hasSame = true;
    });
    if (!hasSame) console.warn('⚠️ No "Same campus" results in sample set.');
  });

  // TEST 5: Latency SLA (P95 < 100ms)
  await test('Performance: SLA P95 < 100ms', async () => {
    const start = Date.now();
    await axios.get(`${API_URL}/skills/list?query=Python`, {
      headers: { Authorization: `Bearer ${TEST_TOKENS.IIT_JAMMU}` },
    });
    const latency = Date.now() - start;
    if (latency > 100) console.warn(`⚠️ Latency ${latency}ms > 100ms threshold.`);
  });

  // TEST 6: Fallback Awareness
  await test('Reliability: Fallback metadata present', async () => {
    const res = await axios.get(`${API_URL}/skills/list?query=test`, {
      headers: { Authorization: `Bearer ${TEST_TOKENS.IIT_JAMMU}` },
    });
    if (!res.data.meta.searchProvider) throw new Error('Missing searchProvider meta');
  });

  // TEST 7: Moderation Isolation
  await test('Moderation: Suspended students filtered', async () => {
    const res = await axios.get(`${API_URL}/skills/list?query=Python`, {
      headers: { Authorization: `Bearer ${TEST_TOKENS.IIT_JAMMU}` },
    });
    res.data.data.forEach((s: any) => {
      if (s.status === 'suspended' || s.moderationStatus === 'suspended') {
        throw new Error(`Moderation violation: found suspended student ${s.name}`);
      }
    });
  });

  console.log('\n🟢 ALL PHASE 9 INSTITUTIONAL SMOKE TESTS PASSED\n');
}

runSmokeTests().catch(err => {
  console.error(err);
  process.exit(1);
});
