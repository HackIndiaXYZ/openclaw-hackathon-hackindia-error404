# EduSync: Market-Ready Full-Stack Platform Walkthrough 🚀

This guide provides an end-to-end walkthrough of the **EduSync Full-Stack Platform**. The system is built for institutional-grade multi-campus collaboration, featuring a **Distributed Node Architecture** and real-time **Guardian AI Moderation**.

---

## 🏗️ Phase 1: Federated Onboarding (S03)
**Objective**: Connect to the local campus node and verify institutional identity.

1.  **Auth Broker Login**: Users authenticate via the **Federated Auth Proxy** (`/api/auth/login`).
2.  **Campus Node Selection**: Select your primary university (e.g., IIT Jammu). This initializes your session with specific MOU permissions.
3.  **Identity Verification**: Verified `.edu` credentials unlock the **Nexus Mode** for inter-campus interaction.

## 🏢 Phase 2: The Nexus Activity Hub (S01-S04)
**Objective**: Real-time governance and ecosystem monitoring.

*   **Live Backend Sync**: The dashboard consumes the `/api/health` endpoint to monitor the **Nexus Network Status**.
*   **Ecosystem Counters**: Real-time tracking of "Active Swaps", "Karma Balance", and "MOU Partners".
*   **Guardian AI Advisory**: A high-visibility badge confirms that **Autonomous NLP Models** (Guardian AI) are active and monitoring for policy compliance.

## 🌊 Phase 3: Cross-Campus Skill Discovery (S05-S10)
**Objective**: Breaking geographic barriers via the Nexus Mode.

*   **Integrated Discovery**: The **Nexus Explorer** fetches results from the `/api/skills/explore` endpoint.
*   **Nexus Mode Toggle**: When enabled, the system queries the **Federated Skill Ledger**, revealing mentors from partnered institutions (e.g., IIT Delhi) tagged with **"NexusPartner"** badges.
*   **Skill-Swap Proposals**: One-click CTAs to send swap requests logged in the **MDB SkillSwaps Collection**.

## 🤝 Phase 4: Secured Peer-to-Sync (S16-S20)
**Objective**: Real-time, moderated execution of knowledge transfers.

*   **Socket.io Rooms**: Peers collaborate in dedicated session rooms (e.g., `room_iitj_iitd_001`).
*   **Guardian AI Integration**: The chat pipeline passes through a **Moderation Hook**. If a policy violation is detected (e.g., academic dishonesty), the platform triggers a real-time **Administrative Warning Alert** to both peers.
*   **End-to-End Encryption**: All messages are routed through the secure Nexus Bridge.

## ⚖️ Phase 5: Institutional Oversight (S21-S28)
**Objective**: Full administrative control for University Admins.

*   **System Health Matrix**: Detailed latency and throughput metrics for all connected campus nodes (IIT Jammu, IIT Delhi, MOU Cloud Broker).
*   **Moderation Queue**: Admins review flagged interactions and content across the network.
*   **MOU Governance**: Ledger-style visibility into campus-to-campus utilization rates and compliance scores.

---

## 💎 Technical Foundation (Stack)
*   **Frontend**: React 19, Framer Motion, Tailwind CSS v4, Lucide React.
*   **Backend**: Node.js, Express, Socket.io (Nexus Bridge).
*   **Databases**: MongoDB (Knowledge Base) & PostgreSQL (Karma/MOU Ledger).
*   **DevOps**: Docker, Vercel Edge Functions, JWT Federated Auth.

---

**Designed for HackIndia 2026: The Future of Collaborative Education**
