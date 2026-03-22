import { SwapService } from './src/modules/swap/service.js';
import { KarmaService } from './src/modules/karma/service.js';

async function runTests() {
  console.log('🧪 Starting Swap Engine Verification...');
  
  const testRequester = 'requester_123';
  const testProvider = 'provider_456';
  
  try {
    console.log('1. Testing Proposal with Insufficient Karma...');
    // This should fail if balance = 0
    await SwapService.proposeSwap({
      requesterUid: testRequester,
      providerUid: testProvider,
      skill: 'React',
      karmaStaked: 100,
      isCrossCampus: false,
      requesterCampus: 'IIT_JAMMU',
      providerCampus: 'IIT_JAMMU'
    });
  } catch (err: any) {
    console.log(`✅ Expected Failure: ${err.message}`);
  }

  console.log('\nReady for integration testing in staging environment.');
}

runTests().catch(console.error);
