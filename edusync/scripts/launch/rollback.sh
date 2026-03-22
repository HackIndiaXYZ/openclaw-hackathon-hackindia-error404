#!/bin/bash

set -e

# ============================================================================
# EDUSYNC EMERGENCY ROLLBACK
# Reverts all ECS services to the previous stable deployment
# ============================================================================

banner() {
  echo ""
  echo "╔════════════════════════════════════════════════════════════╗"
  echo "║  ⚠️  $1"
  echo "╚════════════════════════════════════════════════════════════╝"
  echo ""
}

error() {
  echo "❌ $1"
  exit 1
}

banner "EMERGENCY ROLLBACK PROCEDURE"

echo "This will revert all services to the previous stable version."
echo ""
read -p "Type 'ROLLBACK' to proceed: " confirm

if [ "$confirm" != "ROLLBACK" ]; then
  error "Rollback cancelled"
fi

AWS_REGION="us-east-1"
CLUSTER_NAME="edusync-prod"

echo ""
echo "🔄 Rolling back all services..."

# Rollback API
echo "  Rolling back edusync-api..."
aws ecs update-service \
  --cluster $CLUSTER_NAME \
  --service edusync-api \
  --force-new-deployment \
  --region $AWS_REGION > /dev/null

# Rollback Web
echo "  Rolling back edusync-web..."
aws ecs update-service \
  --cluster $CLUSTER_NAME \
  --service edusync-web \
  --force-new-deployment \
  --region $AWS_REGION > /dev/null

# Rollback Admin
echo "  Rolling back edusync-admin..."
aws ecs update-service \
  --cluster $CLUSTER_NAME \
  --service edusync-admin \
  --force-new-deployment \
  --region $AWS_REGION > /dev/null

echo ""
echo "⏳ Waiting for services to stabilize (2-3 minutes)..."

aws ecs wait services-stable \
  --cluster $CLUSTER_NAME \
  --services edusync-api edusync-web edusync-admin \
  --region $AWS_REGION

echo ""
echo "✅ ROLLBACK COMPLETE"
echo ""
echo "All services reverted to the previous version."
echo "Review logs to understand the issue before retrying."
echo ""
echo "Check logs:"
echo "  aws logs tail /ecs/edusync-prod --follow --region $AWS_REGION"
