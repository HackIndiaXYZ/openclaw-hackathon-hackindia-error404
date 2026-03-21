# 🌌 EduSync: Federated Multi-Campus Collaboration Platform

**Bridging the Institutional Knowledge Gap with Sovereign Data & Trust.**

EduSync is a full-stack, institutional-grade ecosystem designed to turn "MOUs on paper" into "MOUs in action." It enables students from across university chains (like IITs, NITs, and Private Groups) to collaborate, verify skills, and exchange academic assets in a secure, moderated, and incentivized environment.

---

## 🔥 Key Market-Ready Features

### 🏢 Cross-Campus Nexus
- **Federated Discovery**: Toggle **Nexus Mode** to search for experts and skill-swaps across the entire 20+ campus network.
- **Institutional Sovereignty**: Each campus maintains its own local node (MongoDB) and auth policy.
- **Trust Badges**: Visual indicators for "Verified Peer," "Nexus Partner," and "Admin Endorsed."

### 🤝 Peer-to-Sync (Real-time Collaboration)
- **Moderated Collab Rooms**: Secure, Socket.io-driven chatrooms for cross-campus mentoring.
- **Guardian AI**: Adaptive NLP monitoring for academic integrity and institutional compliance.
- **MOU Bridge Link**: Encrypted endpoints specially provisioned for MOU-partner schools.

### 🪙 Karma Economy
- **Academic Ledger**: A dual-ledger system using **PostgreSQL** for immutable Karma transactions.
- **Verified Vault**: A high-trust repository for academic assets (notes, projects, past papers) priced in Karma.
- **Institutional Fairness**: Incentivizes expert students (Knowledge Donors) while supporting learners (Knowledge Recipients).

### ⚖️ University Oversight Hub
- **Administrative Transparency**: Full visibility into campus-to-campus utilization and compliance.
- **Health Matrix**: Real-time observability of all distributed campus nodes.
- **Automated Moderation**: Queue-based system for auditing flagged peer-to-peer interactions.

---

## 🛠️ Technical Stack (Market-Ready)

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Framer Motion, Tailwind CSS v4, Lucide React |
| **Backend** | Node.js, Express, Socket.io (Real-time Nexus Bridge) |
| **Databases** | MongoDB (Primary Store) & PostgreSQL (Karma/Audit Ledger) |
| **Middleware** | JWT Federated Auth Proxy |
| **DevOps** | Docker, Vercel Edge Functions, GH Actions |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB & PostgreSQL (Stubs provided)

### 1. Initialize Backend
```bash
cd server
npm install
npm run dev
```

### 2. Initialize Frontend (New Tab)
```bash
npm install
npm run dev
```

### 3. Open the Nexus
Navigate to `http://localhost:5173`. Select your campus to initialize the institutional handshake.

---

## 🏆 HackIndia 2026 Submission
EduSync aims to build the most credible Student-to-Student ecosystem in India. Join the Nexus. Collaborate without borders.

**Built by Team EduSync | Market-Ready V4.0**
