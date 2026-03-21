# EduSync: Complete Market-Ready System Design Document

## The Definitive Architecture, Workflow, Navigation & Roadmap

---

## PART 1: PROBLEM STATEMENT & VISION

The Indian higher education landscape suffers from a critical structural problem: MOUs between institutions exist on paper, but the actual student-to-student collaboration they promise never reaches the last student on the last bench. A college group running 20 campuses across India has thousands of students who could help each other — an IIT Jammu student struggling with VLSI Design could learn from an IIT Delhi peer — but there is no formal, verified, moderated ecosystem to make this happen. WhatsApp groups are chaotic, unmonitored, and die within weeks. Email chains get lost. Administration has zero visibility into whether their MOU investments produce real outcomes.

EduSync solves this by building a **federated, multi-campus collaboration platform** where every student in a college network (and across partnered college networks) can discover, connect, learn from, and teach peers — with full administrative oversight, moderation, and analytics that turn paper MOUs into measurable, living ecosystems.

---

## PART 2: SYSTEM ARCHITECTURE (Production-Grade)

### 2.1 High-Level Architecture Diagram
The system uses a **hybrid microservices** approach. Core services (Profile, Skill, Resource, Karma) are logically separated. The Nexus layer (cross-campus services) is separate to allow different college groups to deploy their own instances.

### 2.2 Federated Authentication
**Strategy: Identity Broker Model with OIDC**
EduSync uses an Auth Broker (Keycloak/Auth0) that maps student identities from individual campus Google Workspaces or Azure ADs into a unified EduSync JWT session. This ensures students use their official college IDs without the platform needing to store sensitive passwords.

---

## PART 3: DATABASE SCHEMA (PostgreSQL + MongoDB)

### 3.1 Relational Schema (PostgreSQL) - Audit & Karma
- **Users**: `id, email, campus_id, role, karma_balance, verification_status`
- **Campuses**: `id, name, group_id, mou_status, admin_node_url`
- **Transactions**: `id, sender_id, receiver_id, amount, resource_id, type (Skill/Vault), timestamp`
- **MOUs**: `id, campus_a_id, campus_b_id, agreement_terms, expiry_date`

### 3.2 Document Schema (MongoDB) - Content & Chat
- **Skills**: `id, mentor_id, title, category, description, campus_id, nexus_enabled`
- **Messages**: `id, thread_id, sender_id, content, timestamp, moderation_flag`
- **VaultResources**: `id, uploader_id, file_metadata, karma_price, status (Draft/Verified/Flagged)`

---

## PART 4: BACKEND API SPECIFICATION (RESTful)

### 4.1 Nexus Discovery
- `GET /api/v1/nexus/explore?campus_id=...&mode=nexus`
- `POST /api/v1/nexus/request-swap`

### 4.2 Karma Economy
- `GET /api/v1/wallet/transactions`
- `POST /api/v1/wallet/transfer` (Internal Ledger only)

### 4.3 Admin Oversight
- `GET /api/v1/admin/moderation-queue`
- `PATCH /api/v1/admin/verify-resource/:id`

---

## PART 5: CORE FEATURE DEVELOPMENT (Implemented)

- **Onboarding Wizard**: Step-by-step identity and interest sync.
- **Unified Dashboard**: Cross-campus activity feeds and personal stats.
- **Skill Discovery**: Location-aware filtering with Nexus-mode toggle.

---

## PART 6: MULTI-CAMPUS "NEXUS" LOGIC

The Nexus mode uses a **Bridge Controller** that routes queries not just to the local database but also to the federated nodes of partner colleges. This allows a user in Jammu to see "VLSI Design" resources from Delhi only when the inter-campus MOU is active.

---

## PART 7: ADMINISTRATIVE OVERSIGHT & GOVERNANCE

Every inter-campus interaction is subject to **Guardian AI** monitoring.
- **Content Moderation**: NLP scans for academic dishonesty or off-platform payment attempts.
- **Dispute Resolution**: Admins can intervene in chat threads if a "Malpractice" flag is raised.
- **MOU Analytics**: Admins see how much their students are actually collaborating with partner institutes.

---

## PART 8: REPUTATION & KARMA ECONOMY (KarmaWallet)

Reputation is gamified through **Karma**:
- **Earning**: Uploading resources, mentoring peers, receiving positive reviews.
- **Spending**: Unlocking vault assets, requesting premium mentoring.
- **Tiers**: Rookie → Scholar → Veteran → Nexus Elite (Unlocks cross-campus research groups).

---

## PART 9: REAL-TIME COMMUNICATION & NOTIFICATIONS

Built on **Socket.io** with a Redis adapter for horizontal scaling.
- **Peer Chat**: 1:1 encrypted-simulated channels.
- **System Alerts**: Notifications for MOU status changes, credit transfers, and moderation flags.

---

## PART 10: SCALABILITY & DEVOPS ROADMAP (Target: Production)

### 10.1 DevOps Strategy
- **Containerization**: Dockerized microservices for consistent environments.
- **CI/CD**: GitHub Actions for automated testing and deployment to Vercel/AWS.
- **Monitoring**: Prometheus for metrics and ELK stack for centralized logging.

### 10.2 Production Roadmap
1. **Beta Testing**: Internal launch at IIT Jammu (1 campus).
2. **Nexus Expansion**: Connect IIT Delhi and IIT Bombay nodes.
3. **MOU Protocol**: Institutional dashboard launch for 20+ group campuses.
4. **Public Bridge**: Opening MOUs to external college groups.

---
*Created for HackIndia 2026 Submission*
