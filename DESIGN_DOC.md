# EduSync: Complete Market-Ready System Design Document

## The Definitive Architecture, Workflow, Navigation & Roadmap

---

## PART 1: PROBLEM STATEMENT & VISION

The Indian higher education landscape suffers from a critical structural problem: MOUs between institutions exist on paper, but the actual student-to-student collaboration they promise never reaches the last student on the last bench. A college group running 20 campuses across India has thousands of students who could help each other — an IIT Jammu student struggling with VLSI Design could learn from an IIT Delhi peer — but there is no formal, verified, moderated ecosystem to make this happen. WhatsApp groups are chaotic, unmonitored, and die within weeks. Email chains get lost. Administration has zero visibility into whether their MOU investments produce real outcomes.

EduSync solves this by building a **federated, multi-campus collaboration platform** where every student in a college network (and across partnered college networks) can discover, connect, learn from, and teach peers — with full administrative oversight, moderation, and analytics that turn paper MOUs into measurable, living ecosystems.

---

## PART 2: SYSTEM ARCHITECTURE (Production-Grade)

### 2.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT TIER                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  Web App      │  │  Mobile PWA  │  │  Admin Panel │              │
│  │  (Next.js 15) │  │  (React      │  │  (Next.js    │              │
│  │  App Router)  │  │   Native)    │  │   Dashboard) │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
│         │                  │                  │                       │
│         └──────────────────┼──────────────────┘                      │
│                            │                                          │
│                    ┌───────▼────────┐                                 │
│                    │  API Gateway   │                                 │
│                    │  (Kong / AWS   │                                 │
│                    │   API Gateway) │                                 │
│                    └───────┬────────┘                                 │
└────────────────────────────┼─────────────────────────────────────────┘
                             │
┌────────────────────────────┼─────────────────────────────────────────┐
│                    APPLICATION TIER                                    │
│                             │                                          │
│    ┌────────────────────────┼────────────────────────────┐           │
│    │                        │                             │           │
│    ▼                        ▼                             ▼           │
│ ┌──────────┐  ┌──────────────────┐  ┌──────────────────────┐        │
│ │ AUTH      │  │ CORE SERVICES    │  │ NEXUS SERVICES       │        │
│ │ SERVICE   │  │                  │  │ (Cross-Campus)       │        │
│ │          │  │ • Profile Svc    │  │                      │        │
│ │ • Fed.   │  │ • Skill Svc      │  │ • Campus Registry    │        │
│ │   Auth   │  │ • Matching Svc   │  │ • Cross-Campus       │        │
│ │ • SAML   │  │ • Resource Svc   │  │   Discovery          │        │
│ │ • OAuth  │  │ • Karma Svc      │  │ • MOU Analytics      │        │
│ │ • OIDC   │  │ • Review Svc     │  │ • Nexus Credit Svc   │        │
│ │          │  │                  │  │ • Admin Oversight    │        │
│ └────┬─────┘  └────────┬─────────┘  └──────────┬───────────┘        │
│      │                 │                        │                     │
│      │    ┌────────────┼────────────────────────┘                    │
│      │    │            │                                              │
│      ▼    ▼            ▼                                              │
│ ┌──────────────────────────────────┐                                 │
│ │     REAL-TIME ENGINE             │                                 │
│ │     (Socket.io on Redis Adapter) │                                 │
│ │                                  │                                 │
│ │  • Chat Rooms (1:1, Group)       │                                 │
│ │  • Live Notifications            │                                 │
│ │  • Presence (Online/Offline)     │                                 │
│ │  • Collab Whiteboard Sync        │                                 │
│ └──────────────┬───────────────────┘                                 │
│                │                                                      │
│ ┌──────────────▼───────────────────┐                                 │
│ │     MODERATION & AI LAYER        │                                 │
│ │                                  │                                 │
│ │  • Content Moderation (NLP)      │                                 │
│ │  • Spam/Scam Detection           │                                 │
│ │  • Academic Dishonesty Flags     │                                 │
│ │  • Sentiment Analysis            │                                 │
│ └──────────────┬───────────────────┘                                 │
└────────────────┼─────────────────────────────────────────────────────┘
                 │
┌────────────────┼─────────────────────────────────────────────────────┐
│            DATA & INFRASTRUCTURE TIER                                 │
│                │                                                      │
│    ┌───────────┼───────────────────────────────────┐                 │
│    │           │                                    │                 │
│    ▼           ▼                                    ▼                 │
│ ┌──────┐  ┌──────────┐  ┌────────┐  ┌───────┐  ┌────────────┐      │
│ │Mongo │  │PostgreSQL│  │ Redis  │  │  S3/  │  │Meilisearch │      │
│ │ DB   │  │(Relation │  │(Cache, │  │Cloud- │  │ (Full-text  │      │
│ │(Flex │  │  al Data,│  │Session,│  │inary  │  │  Search)    │      │
│ │Docs) │  │  MOU     │  │PubSub) │  │(Files)│  │             │      │
│ │      │  │  Ledger) │  │        │  │       │  │             │      │
│ └──────┘  └──────────┘  └────────┘  └───────┘  └────────────┘      │
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────┐      │
│ │  OBSERVABILITY: Prometheus + Grafana + ELK Stack            │      │
│ │  CI/CD: GitHub Actions → Docker → AWS ECS / Kubernetes      │      │
│ └─────────────────────────────────────────────────────────────┘      │
└───────────────────────────────────────────────────────────────────────┘
```

### 2.2 Why This Architecture

The system uses a **hybrid microservices** approach rather than a pure monolith or pure microservices pattern. Core services (Profile, Skill, Resource, Karma) are logically separated but deployed as a modular monolith initially, then split into independent services as traffic justifies it. The Nexus layer (cross-campus services) is separate from day one because different college groups may deploy their own instances. The real-time engine runs on a dedicated Node.js process with a Redis adapter so it can scale horizontally across multiple servers without losing WebSocket connections. The moderation layer is decoupled as a pipeline — every piece of user-generated content (listings, messages, uploaded files) passes through it asynchronously via a message queue (Bull/BullMQ on Redis) before being published.

### 2.3 Federated Authentication Architecture

This is the single most important technical decision in EduSync. Since the platform spans 20+ colleges under one group and then bridges to other college groups, authentication must handle multiple identity providers without forcing students to create yet another username/password.

**Strategy: Identity Broker Model with OIDC as the Primary Protocol**

```
Student at IIT Jammu                    Student at IIT Delhi
       │                                        │
       ▼                                        ▼
┌──────────────┐                      ┌──────────────┐
│ IIT Jammu    │                      │ IIT Delhi    │
│ Google       │                      │ Microsoft    │
│ Workspace    │                      │ Azure AD     │
│ (IdP)        │                      │ (IdP)        │
└──────┬───────┘                      └──────┬───────┘
       │                                      │
       │          ┌──────────────────┐        │
       └─────────►│  EduSync Auth    │◄───────┘
                  │  Broker          │
                  │  (Keycloak /     │
                  │   Auth0)         │
                  │                  │
                  │  • Maps IdP      │
                  │    identities    │
                  │  • Issues        │
                  │    EduSync JWT   │
                  │  • Enforces      │
                  │    campus domain │
                  │    verification  │
                  │  • Manages roles │
                  │    (Student,     │
                  │    Admin, TA)    │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │  EduSync App     │
                  │  (Unified JWT    │
                  │   Session)       │
                  └──────────────────┘
```

### 2.4 Database Schema Design
(See DESIGN_DOC.md for full details)

---

## PART 3: COMPLETE FEATURE SPECIFICATION

(See DESIGN_DOC.md for full details)

---

## PART 4: COMPLETE SCREEN-BY-SCREEN NAVIGATION MAP

(See DESIGN_DOC.md for full details)

---

## PART 5: END-TO-END USER FLOWS (Complete Journeys)

(See DESIGN_DOC.md for full details)

---

## PART 6: TECHNICAL IMPLEMENTATION ROADMAP

(See DESIGN_DOC.md for full details)
