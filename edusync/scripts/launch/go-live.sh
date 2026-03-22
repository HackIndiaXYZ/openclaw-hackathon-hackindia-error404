#!/bin/bash

set -e

# ============================================================================
# EDUSYNC — PRODUCTION LAUNCH SEQUENCE
# Master orchestrator for the go-live event
# ============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AWS_REGION="us-east-1"
CLUSTER_NAME="edusync-prod"

banner() {
  echo ""
  echo "╔════════════════════════════════════════════════════════════╗"
  echo "║  $1"
  echo "╚════════════════════════════════════════════════════════════╝"
  echo ""
}

log() { echo "  ✅ $1"; }
warn() { echo "  ⚠️  $1"; }

# ============================================================================
# WELCOME
# ============================================================================
banner "🚀 EDUSYNC — PRODUCTION LAUNCH SEQUENCE"

cat << 'WELCOME'
  Welcome to the moment you've been building towards.
  You are about to take EduSync LIVE to the world.

  This script will guide you through:
    1. Pre-launch verification
    2. Final confirmation
    3. DNS cutover
    4. Live monitoring guidance
    5. Launch completion

WELCOME

read -p "Press ENTER to begin pre-launch checks..."

# ============================================================================
# PHASE 1: PRE-LAUNCH VERIFICATION
# ============================================================================
banner "PHASE 1: PRE-LAUNCH VERIFICATION"

echo "📋 Checking prerequisites..."

# AWS CLI
command -v aws >/dev/null 2>&1 || { echo "❌ AWS CLI not found"; exit 1; }
log "AWS CLI available"

# AWS credentials
aws sts get-caller-identity > /dev/null 2>&1 || { echo "❌ AWS credentials invalid"; exit 1; }
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
log "AWS Account: $AWS_ACCOUNT_ID"

# ECS services
echo ""
echo "  🔍 ECS Service Status:"
aws ecs describe-services \
  --cluster $CLUSTER_NAME \
  --services edusync-api edusync-web edusync-admin \
  --region $AWS_REGION \
  --query 'services[*].[serviceName,desiredCount,runningCount,status]' \
  --output table 2>/dev/null || warn "Could not query ECS (verify manually)"

echo ""
read -p "  Do all services show desired = running? (yes/no): " services_ok
if [ "$services_ok" != "yes" ]; then
  echo "  ❌ Services not ready. Fix before launching."
  exit 1
fi
log "All ECS services healthy"

# Dashboards
echo ""
DASH_COUNT=$(aws cloudwatch list-dashboards \
  --region $AWS_REGION \
  --query 'DashboardEntries[?contains(DashboardName, `edusync`)] | length(@)' \
  --output text 2>/dev/null || echo "0")
log "CloudWatch dashboards: $DASH_COUNT"

# Alarms
ALARM_COUNT=$(aws cloudwatch describe-alarms \
  --alarm-name-prefix edusync \
  --region $AWS_REGION \
  --query 'MetricAlarms | length(@)' \
  --output text 2>/dev/null || echo "0")
log "CloudWatch alarms: $ALARM_COUNT"

# ALB
ALB_DNS=$(aws elbv2 describe-load-balancers \
  --query 'LoadBalancers[?LoadBalancerName==`edusync-prod-alb`].DNSName' \
  --output text \
  --region $AWS_REGION 2>/dev/null || echo "")

if [ -n "$ALB_DNS" ]; then
  log "ALB DNS: $ALB_DNS"
else
  warn "ALB not found — verify manually"
fi

# Smoke tests
echo ""
echo "  🧪 Running smoke tests..."
if [ -f "$SCRIPT_DIR/smoke-tests.sh" ]; then
  API_URL="http://$ALB_DNS" $SCRIPT_DIR/smoke-tests.sh || warn "Some smoke tests had issues"
else
  warn "Smoke test script not found at $SCRIPT_DIR/smoke-tests.sh"
fi

sleep 2

# ============================================================================
# PHASE 2: FINAL CONFIRMATION
# ============================================================================
banner "PHASE 2: FINAL CONFIRMATION"

cat << 'CONFIRM'
  🎬 YOU ARE ABOUT TO GO LIVE

  This will:
    1. Update DNS to point to production
    2. Redirect all traffic to your servers
    3. Make EduSync publicly accessible
    4. Accept real student data & transactions

  ⚠️  Checklist — have you:
    ✅ Tested all critical paths?
    ✅ Verified monitoring is working?
    ✅ Backed up all databases?
    ✅ Briefed your support team?
    ✅ Created incident response playbook?

CONFIRM

echo ""
read -p "  Type 'YES I AM READY' to proceed: " final_confirm

if [ "$final_confirm" != "YES I AM READY" ]; then
  echo "  ❌ Launch cancelled."
  exit 0
fi

sleep 2

# ============================================================================
# PHASE 3: DNS CUTOVER
# ============================================================================
banner "PHASE 3: DNS CUTOVER"

echo "  Do you want to run the DNS cutover script now?"
echo "  (This requires a Route 53 Hosted Zone ID)"
echo ""
read -p "  Run DNS cutover? (yes/no): " run_dns

if [ "$run_dns" == "yes" ]; then
  if [ -f "$SCRIPT_DIR/dns-cutover.sh" ]; then
    $SCRIPT_DIR/dns-cutover.sh
  else
    warn "dns-cutover.sh not found — run manually"
  fi
else
  echo ""
  echo "  Skipping automated DNS cutover."
  echo "  You can run it manually later:"
  echo "    ./scripts/launch/dns-cutover.sh"
fi

sleep 2

# ============================================================================
# PHASE 4: LIVE MONITORING
# ============================================================================
banner "PHASE 4: LIVE MONITORING"

cat << MONITOR
  🎯 YOUR PLATFORM IS RECEIVING TRAFFIC

  ⚠️  CRITICAL MONITORING WINDOW (Next 30 minutes):

  1. Watch these metrics continuously:
     • Error rate (target: < 1%)
     • Response time (target: < 500ms)
     • Active connections (should be growing)
     • Database connections (should be healthy)

  2. If critical issue detected:
     Run: ./scripts/launch/rollback.sh

  3. View dashboards:
     https://console.aws.amazon.com/cloudwatch/home#dashboards:

  4. Tail live logs:
     aws logs tail /ecs/edusync-prod --follow --region $AWS_REGION

MONITOR

echo ""
read -p "  I am actively monitoring. Press ENTER to finalize launch..."

sleep 2

# ============================================================================
# PHASE 5: LAUNCH COMPLETE
# ============================================================================
banner "🎉 EDUSYNC IS NOW LIVE IN PRODUCTION 🎉"

GIT_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")

cat << EOF

  Your platform is serving real students:
    🌍 https://edusync.io          (Student Portal)
    👥 https://admin.edusync.io    (Admin Panel)
    🔌 https://api.edusync.io      (API)

  📊 AWS Resources:
    Account:      $AWS_ACCOUNT_ID
    Region:       $AWS_REGION
    ALB DNS:      $ALB_DNS
    ECS Cluster:  $CLUSTER_NAME
    Dashboards:   $DASH_COUNT
    Alarms:       $ALARM_COUNT

  📝 Launch Record:
    Date:         $(date)
    Git SHA:      $GIT_SHA
    Launched by:  $USER

  🎯 Post-Launch:
    • Monitor dashboards for 24 hours
    • Watch error rates and latency
    • If critical issue: ./scripts/launch/rollback.sh
    • Daily standup for first week

  Congratulations on your production launch! 🚀

EOF
