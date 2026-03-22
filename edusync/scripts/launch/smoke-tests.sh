#!/bin/bash

set -e

# ============================================================================
# EDUSYNC SMOKE TEST SUITE
# Validates all critical paths before and after launch
# ============================================================================

PASS=0
FAIL=0
WARN=0

pass() { echo "  ✅ $1"; PASS=$((PASS+1)); }
fail() { echo "  ❌ $1"; FAIL=$((FAIL+1)); }
warn() { echo "  ⚠️  $1"; WARN=$((WARN+1)); }

echo ""
echo "🧪 EDUSYNC SMOKE TEST SUITE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -z "$API_URL" ]; then
  read -p "Enter API base URL (e.g., https://api.edusync.io or http://ALB_DNS): " API_URL
fi

echo "Testing against: $API_URL"
echo ""

# ── Test 1: Health Check ──────────────────────────────────────────
echo "Test 1: Health Check"
HEALTH=$(curl -sf -o /dev/null -w "%{http_code}" "$API_URL/api/v1/health" 2>/dev/null || echo "000")
if [ "$HEALTH" == "200" ]; then
  pass "API health endpoint returned 200"
else
  fail "API health endpoint returned $HEALTH"
fi

# ── Test 2: Response Time ─────────────────────────────────────────
echo "Test 2: Response Time"
TIME=$(curl -sf -o /dev/null -w "%{time_total}" "$API_URL/api/v1/health" 2>/dev/null || echo "99")
TIME_MS=$(echo "$TIME * 1000" | bc 2>/dev/null || echo "9999")
if (( $(echo "$TIME < 0.5" | bc -l 2>/dev/null || echo 0) )); then
  pass "Response time: ${TIME_MS}ms (< 500ms)"
else
  warn "Response time: ${TIME_MS}ms (target < 500ms)"
fi

# ── Test 3: Security Headers ─────────────────────────────────────
echo "Test 3: Security Headers"
HEADERS=$(curl -sI "$API_URL/api/v1/health" 2>/dev/null)

if echo "$HEADERS" | grep -qi "x-content-type-options"; then
  pass "X-Content-Type-Options present"
else
  warn "X-Content-Type-Options missing"
fi

if echo "$HEADERS" | grep -qi "x-frame-options"; then
  pass "X-Frame-Options present"
else
  warn "X-Frame-Options missing"
fi

if echo "$HEADERS" | grep -qi "strict-transport-security"; then
  pass "HSTS header present"
else
  warn "HSTS header missing (expected behind HTTPS)"
fi

# ── Test 4: CORS ──────────────────────────────────────────────────
echo "Test 4: CORS Configuration"
CORS=$(curl -sI -H "Origin: https://edusync.io" "$API_URL/api/v1/health" 2>/dev/null | grep -i "access-control-allow-origin")
if [ -n "$CORS" ]; then
  pass "CORS headers present"
else
  warn "CORS headers not detected (may require HTTPS origin)"
fi

# ── Test 5: Rate Limit Headers ────────────────────────────────────
echo "Test 5: Rate Limiting"
RL=$(curl -sI "$API_URL/api/v1/health" 2>/dev/null | grep -i "ratelimit")
if [ -n "$RL" ]; then
  pass "Rate-limit headers present"
else
  warn "Rate-limit headers not found (health check may be excluded)"
fi

# ── Test 6: Invalid Route Returns 404 ────────────────────────────
echo "Test 6: 404 Handling"
NOT_FOUND=$(curl -sf -o /dev/null -w "%{http_code}" "$API_URL/api/v1/this-does-not-exist" 2>/dev/null || echo "000")
if [ "$NOT_FOUND" == "404" ]; then
  pass "Unknown route returns 404"
else
  warn "Unknown route returned $NOT_FOUND (expected 404)"
fi

# ── Test 7: No Server Leaks ──────────────────────────────────────
echo "Test 7: Server Information Leak"
POWERED=$(curl -sI "$API_URL/api/v1/health" 2>/dev/null | grep -i "x-powered-by")
if [ -z "$POWERED" ]; then
  pass "X-Powered-By header removed"
else
  warn "X-Powered-By header leaking server info"
fi

# ── Test 8: Web Frontend ─────────────────────────────────────────
echo "Test 8: Web Frontend"
WEB_URL=$(echo "$API_URL" | sed 's|api\.||')
WEB_STATUS=$(curl -sf -o /dev/null -w "%{http_code}" "$WEB_URL" 2>/dev/null || echo "000")
if [ "$WEB_STATUS" == "200" ]; then
  pass "Web frontend returned 200"
else
  warn "Web frontend returned $WEB_STATUS (may need separate URL)"
fi

# ── Summary ───────────────────────────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  RESULTS: $PASS passed, $FAIL failed, $WARN warnings"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $FAIL -gt 0 ]; then
  echo ""
  echo "❌ SMOKE TESTS FAILED — Do NOT proceed with launch until failures are resolved."
  exit 1
fi

if [ $WARN -gt 0 ]; then
  echo ""
  echo "⚠️  Some warnings detected — review before launch but not blocking."
fi

echo ""
echo "✅ Smoke tests passed. EduSync is ready for production traffic."
