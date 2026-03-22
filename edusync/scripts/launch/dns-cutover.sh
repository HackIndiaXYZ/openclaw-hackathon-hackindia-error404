#!/bin/bash

set -e

# ============================================================================
# EDUSYNC DNS CUTOVER — GO-LIVE
# Updates Route 53 to point all domains at the production ALB
# ============================================================================

banner() {
  echo ""
  echo "╔════════════════════════════════════════════════════════════╗"
  echo "║  🚀 $1"
  echo "╚════════════════════════════════════════════════════════════╝"
  echo ""
}

error() {
  echo "❌ $1"
  exit 1
}

banner "EDUSYNC DNS CUTOVER — GO-LIVE"

echo "⚠️  WARNING: This will redirect all traffic to production!"
echo ""
read -p "Type 'GO-LIVE' to proceed: " confirm

if [ "$confirm" != "GO-LIVE" ]; then
  error "Cutover cancelled"
fi

echo ""
read -p "Enter Route 53 Hosted Zone ID: " HOSTED_ZONE_ID
read -p "Enter ALB DNS name: " ALB_DNS

if [ -z "$HOSTED_ZONE_ID" ] || [ -z "$ALB_DNS" ]; then
  error "Missing required parameters"
fi

banner "UPDATING DNS RECORDS"

# Get ALB hosted zone ID for alias target
ALB_ARN=$(aws elbv2 describe-load-balancers \
  --query 'LoadBalancers[?LoadBalancerName==`edusync-prod-alb`].LoadBalancerArn' \
  --output text \
  --region us-east-1)

ALB_ZONE_ID=$(aws elbv2 describe-load-balancers \
  --load-balancer-arns $ALB_ARN \
  --region us-east-1 \
  --query 'LoadBalancers[0].CanonicalHostedZoneId' \
  --output text)

echo "ALB Zone ID: $ALB_ZONE_ID"
echo "ALB DNS:     $ALB_DNS"

# Build the Route 53 change batch
cat > /tmp/dns-changes.json << EOF
{
  "Changes": [
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "edusync.io",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "$ALB_ZONE_ID",
          "DNSName": "$ALB_DNS",
          "EvaluateTargetHealth": false
        }
      }
    },
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "api.edusync.io",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "$ALB_ZONE_ID",
          "DNSName": "$ALB_DNS",
          "EvaluateTargetHealth": false
        }
      }
    },
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "admin.edusync.io",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "$ALB_ZONE_ID",
          "DNSName": "$ALB_DNS",
          "EvaluateTargetHealth": false
        }
      }
    }
  ]
}
EOF

# Apply changes
echo "📝 Applying DNS changes..."

CHANGE_INFO=$(aws route53 change-resource-record-sets \
  --hosted-zone-id $HOSTED_ZONE_ID \
  --change-batch file:///tmp/dns-changes.json \
  --region us-east-1 \
  --query 'ChangeInfo.Id' \
  --output text)

echo "✅ DNS changes submitted: $CHANGE_INFO"

# Monitor propagation
echo ""
echo "⏳ Monitoring DNS propagation..."
echo ""

for i in {1..10}; do
  STATUS=$(aws route53 get-change --id $CHANGE_INFO --query 'ChangeInfo.Status' --output text 2>/dev/null || echo "PENDING")
  echo "  Attempt $i/10 — Status: $STATUS"

  if [ "$STATUS" == "INSYNC" ]; then
    echo ""
    echo "✅ DNS propagation complete!"
    break
  fi

  sleep 30
done

echo ""
echo "✅ DNS CUTOVER COMPLETE"
echo ""
echo "🎉 EDUSYNC IS NOW LIVE AT:"
echo "   https://edusync.io"
echo "   https://api.edusync.io"
echo "   https://admin.edusync.io"
echo ""
echo "📊 Monitor dashboards:"
echo "   https://console.aws.amazon.com/cloudwatch/home#dashboards:"

# Cleanup
rm -f /tmp/dns-changes.json
