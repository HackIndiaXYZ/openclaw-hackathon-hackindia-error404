# EduSync Nexus: Master Development Document

The definitive source of truth for the Federated Campus Collaboration Engine.

---

## 🏗️ System Architecture: The Nexus Node

### Architecture Diagram
```
┌─────────────────────────────────────────────────────────┐
│                     EDUSYNC ARCHITECTURE                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐          ┌──────────────────┐    │
│  │   Student Web    │          │   Admin Panel    │    │
│  │   (Next.js 15)   │          │  (Next.js 15)    │    │
│  │ ─────────────    │          │ ──────────────── │    │
│  │ S01-S20 Screens  │          │ S21-S28 Screens  │    │
│  │ Socket.io client │          │ Socket.io client │    │
│  └────────┬─────────┘          └────────┬─────────┘    │
│           │                             │               │
│           └──────────────┬──────────────┘               │
│                          │                              │
│              ┌───────────▼────────────┐                │
│              │   Express API Layer    │                │
│              │ ────────────────────── │                │
│              │ 50+ Routes + Middleware│                │
│              │ Socket.io rooms        │                │
│              └───────────┬────────────┘                │
│                          │                              │
│        ┌─────────────────┼─────────────────┐           │
│        │                 │                 │           │
│   ┌────▼────┐      ┌────▼────┐      ┌────▼────┐      │
│   │ MongoDB  │      │PostgreSQL│      │  Redis  │      │
│   │ ────── │      │ ──────  │      │ ──────  │      │
│   │Profiles │      │ Karma   │      │Sessions │      │
│   │Swaps    │      │ Ledger  │      │Queues   │      │
│   │Resources│      │ Audits  │      │Cache    │      │
│   └────┬────┘      └────┬────┘      └────┬────┘      │
│        │                │                 │            │
│        └────────────────┼─────────────────┘            │
│                         │                              │
│              ┌──────────┴──────────┐                  │
│              │                     │                  │
│         ┌────▼────┐          ┌────▼────┐            │
│         │Meilisearch│          │ Gemini  │            │
│         │ ────── │          │ ──────  │            │
│         │Search  │          │ AI      │            │
│         │Indexes │          │ Safety  │            │
│         └────────┘          └────────┘            │
│                                                          │
│              BullMQ Jobs (8 Queues)                    │
│         escrow | leaderboard | screener |             │
│        analytics | chat | reports | mou | index       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 TECHNOLOGY STACK

- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Framer Motion.
- **Backend**: Node.js, Express.js, TypeScript.
- **Database**: 
  - **MongoDB**: (Mongoose) Student profiles, Resources, Discovery metadata.
  - **PostgreSQL**: (pg) Immutable Karma ledger, Admin audit logs.
- **Caching & Queues**: Redis (BullMQ) for 8 asynchronous utility queues.
- **Search**: Meilisearch (High-performance full-text search).
- **AI**: Google Gemini (AI Safety screening, semantic matchmaking).
- **Storage**: Cloudinary (Media assets, resource files).
- **Identity**: Keycloak (OIDC/SAML) for Institutional SSO.

---

## 📡 API CONTRACT EXAMPLES

### 1. GET /api/v1/skills
**Request**: `GET /api/v1/skills?query=Python&campus=IIT_JAMMU&offset=0&limit=30`

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "student": {
        "firebaseUid": "user-123",
        "name": "Arjun Patel",
        "skills": [{ "name": "Python", "level": "advanced" }],
        "karma": 250,
        "rankTier": "silver",
        "campus": "IIT_JAMMU"
      },
      "matchScore": 0.87,
      "scoreBreakdown": {
        "skillOverlap": 0.8,
        "relevance": 0.9,
        "campusProximity": 1.0,
        "reputation": 0.8
      }
    }
  ],
  "meta": {
    "pagination": { "offset": 0, "limit": 30, "total": 145 },
    "searchProvider": "meilisearch"
  }
}
```

### 2. POST /api/v1/swaps/propose
**Request**:
```json
{
  "providerUid": "user-456",
  "offer": { "skill": "Python", "level": "advanced" },
  "request": { "skill": "React", "level": "intermediate" },
  "type": "swap"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "_id": "swap-789",
    "requesterUid": "user-123",
    "providerUid": "user-456",
    "status": "pending",
    "karmaStaked": 25,
    "createdAt": "2025-03-22T10:00:00Z"
  }
}
```

---

## 🚀 DEPLOYMENT & OPERATIONS

### Environment Variables (.env)
```bash
# Databases
MONGODB_URI=mongodb://[user:pass@]host:27017/edusync
DATABASE_URL=postgresql://[user:pass@]host:5432/edusync
REDIS_HOST=localhost
REDIS_PORT=6379

# Search (Meilisearch)
MEILI_HOST=http://localhost:7700
MEILI_MASTER_KEY=nexus_master_key

# AI & Media
GEMINI_API_KEY=your_key_here
CLOUDINARY_URL=cloudinary://key:secret@cloud_name

# Auth
KEYCLOAK_URL=https://auth.edusync.edu
KEYCLOAK_REALM=Nexus
```

### Local Deployment
```bash
docker-compose up -d
pnpm install
pnpm dev
```

### AWS ECS Deployment
1. **Build & Push**: `docker build -t edusync:latest . && docker push ...`
2. **Update Service**: `aws ecs update-service --cluster edusync --service api --force-new-deployment`
3. **Health Check**: `curl https://api.edusync.edu/api/v1/health`

---

## 🧪 TESTING STRATEGY

### Coverage Targets
- **Overall**: ≥ 75%
- **Critical Pathes (API/Services)**: ≥ 85%

### Test pyramid
- **Unit (60%)**: Services, Utils (Vitest).
- **Integration (30%)**: API Endpoints + DB (Supertest).
- **E2E (10%)**: Critical User Flows (Playwright).

### Commands
- `pnpm test`: Run all tests.
- `pnpm test:e2e`: Run Playwright suite.
- `pnpm test:coverage`: Generate coverage report.

---

## 📊 PHASE 9 MONITORING & OBSERVABILITY

### Key Metrics to Track
- **edusync_search_fallback_rate**: (%) of queries hitting MongoDB due to Meilisearch timeout/error. **Threshold: < 5%**.
- **edusync_search_latency_p95**: (ms) end-to-end discovery response time. **Threshold: < 100ms**.
- **edusync_discovery_avg_match_score**: (0-1) average quality of top 10 matches. **Threshold: > 0.6**.

### Alerts & Escalation
- **CRITICAL (P1)**: `edusync_search_fallback_rate` > 10% for 5 mins → **Page @search-oncall** immediately.
- **CRITICAL (P1)**: `campus_isolation_violations` > 0 → **Page @security-oncall** immediately.
- **WARNING (P2)**: `edusync_search_latency_p95` > 200ms for 10 mins → **Page @backend-oncall**.

### Dashboard: EDUSYNC_SEARCH_HEALTH
- Displays: Meilisearch RT, Fallback Rate, P95 Latency, Last Fallback Reason.

---

## ⚖️ TECHNICAL DEBT & A/B TESTING

### Discovery Scoring A/B Test (S16)
- **Control (Variant A)**: 50/30/20 (Relevance/Reputation/Proximity).
- **Candidate (Variant B)**: 50/40/10 (Higher Reputation Weight).
- **Measurement**: Click-Through Rate (CTR) on top 3 results.
- **Decision**: CTR improvement > 3% with 10k samples.

### Load Testing SLA
- **Requirement**: Batch processing of 1000+ candidates in < 50ms.
- **Tool**: `pnpm run test:load` (using k6).

---

## 🚨 INCIDENT RESPONSE & ROLLBACK

### Rollback Runbook (Search)
1. **Scenario: Bad Ranking**: Revert to Control weights via LaunchDarkly feature flag `scoring-weights-v2` (toggle OFF).
2. **Scenario: Index Corruption**: Trigger manual reindex: `POST /api/v1/admin/search/reindex`.
3. **Scenario: Cache Staleness**: Clear Redis: `redis-cli DEL "matches:*"`.

### Decision Tree
- Fallback > 5%? → Meilisearch issue (Check logs/Restart).
- Fallback < 5% but bad results? → Scoring issue (Rollback weights).

---

## 🛡️ INSTITUTIONAL COMPLIANCE (Nexus Guard)

### Campus Isolation Test (Smoke Test S17)
- **Rule**: Students from Campus A MUST NOT see authorized content from Campus B.
- **Verification**: `pnpm run test:smoke` validates 7+ institutional cases on every deploy.

---

## 📚 FAQ

**Q: How do I run a full reindex?**
A: `POST /api/v1/search/bulk-reindex` with `{ "type": "all" }`.

**Q: Where are the Postgres migrations?**
A: `packages/db/migrations/`.

---

**Built with ❤️ by Team EduSync for the HackIndia Nexus.**
