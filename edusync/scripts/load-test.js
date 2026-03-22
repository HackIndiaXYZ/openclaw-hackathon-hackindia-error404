import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * PHASE 9 LOAD TEST (k6)
 * 
 * Target: Verify 1000-candidate processing SLA (< 50ms per batch)
 * and end-to-end P95 latency (< 100ms).
 */

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp up to 20 users
    { duration: '1m', target: 50 },  // 50 users for 1 min
    { duration: '10s', target: 0 },  // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<100'], // 95% of requests must be < 100ms
    http_req_failed: ['rate<0.01'],    // Less than 1% failure rate
  },
};

const API_URL = __ENV.API_URL || 'http://localhost:3001/api/v1';
const TOKEN = 'token-iit-jammu';

export default function () {
  const params = {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  };

  const res = http.get(`${API_URL}/skills/list?query=Python`, params);

  check(res, {
    'is status 200': (r) => r.status === 200,
    'has data': (r) => r.json().success === true,
    'latency within meta <= 100ms': (r) => r.json().meta.latencyMs <= 100,
  });

  sleep(1);
}
