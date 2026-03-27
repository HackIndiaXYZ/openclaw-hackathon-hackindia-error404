import { Zap, Star, ShieldCheck, Building2 } from 'lucide-react'

export const DASHBOARD_STATS = [
  { icon: Zap, label: 'Active Swaps', value: '12', sub: '3 Inter-Campus', color: 'indigo' },
  { icon: Star, label: 'Karma Balance', value: '1,240', sub: 'Global Rank: #42', color: 'amber' },
  { icon: ShieldCheck, label: 'Verified Work', value: '25', sub: 'Admin Certified', color: 'emerald' },
  { icon: Building2, label: 'Partner MOUs', value: '05', sub: 'Active Nexus', color: 'purple' },
];

export const NEXUS_ACTIVITY = [
  { user: "Sneha (IIT Delhi)", action: "Requested Skill Swap", time: "2m ago", badge: "Cross-Campus" },
  { user: "Admin (IIT Jammu)", action: "Verified CS101 Notes", time: "1h ago", badge: "Auth" },
  { user: "Aryan (IIT Bombay)", action: "Joined Engineering Nexus", time: "3h ago", badge: "Network" },
];

export const MOCK_SKILLS = [
  { id: 1, title: 'React.js Advanced Patterns', mentor: 'Felix Miller', rating: 4.9, swaps: 42, karma: 150, campus: 'IIT Jammu', tag: 'Web Dev' },
  { id: 2, title: 'Neural Networks from Scratch', mentor: 'Sarah Chen', rating: 5.0, swaps: 89, karma: 300, campus: 'IIT Delhi', tag: 'AI/ML' },
  { id: 3, title: 'Strategic Product Management', mentor: 'Alex Rivers', rating: 4.8, swaps: 15, karma: 200, campus: 'IIT Bombay', tag: 'Business' },
  { id: 4, title: 'Quant Finance Basics', mentor: 'David Wang', rating: 4.7, swaps: 28, karma: 250, campus: 'BITS Pilani', tag: 'Finance' }
];

export const MOCK_RESOURCES = [
  { id: 1, name: "CS101 Cheat Sheet", type: "PDF", downloads: 1.2, cost: 10, subject: "Computer Science", campus: "IIT Jammu", verified: true, level: "Sem 1", rating: 4.8 },
  { id: 2, name: "Advanced Robotics Lab", type: "Docs", downloads: 0.5, cost: 25, subject: "Mechanical", campus: "IIT Bombay", nexus: true, verified: true, level: "Sem 6", rating: 5.0 },
  { id: 3, name: "Discrete Math Notes", type: "Docs", downloads: 0.8, cost: 15, subject: "Mathematics", campus: "IIT Jammu", verified: false, level: "Sem 3", rating: 4.5 },
  { id: 4, name: "VLSI Design Handbook", type: "PDF", downloads: 2.1, cost: 40, subject: "Electronics", campus: "IIT Delhi", nexus: true, verified: true, level: "Sem 5", rating: 4.9 },
  { id: 5, name: "Deep Learning Specialization Notes", type: "PDF", downloads: 0.84, cost: 50, subject: "Computer Science", campus: "Stanford (Nexus)", verified: true, level: "Graduate", rating: 5.0 },
  { id: 6, name: "System Design Interview Guide", type: "Doc", downloads: 1.2, cost: 30, subject: "Computer Science", campus: "IIT Delhi", verified: true, level: "Final Year", rating: 4.9 },
];

export const MOCK_REPORTS = [
  { id: '#431', reporter: 'Sneha (IITD)', target: 'Resource #12', reason: 'Copyright Violation', status: 'Pending' },
  { id: '#432', reporter: 'System (Nexus)', target: 'Chat Interaction #89', reason: 'NLP Policy Alert', status: 'In Review' }
];

export const MOCK_CHATS = [
  { id: 1, text: "Hey! 👋 My Prof at IIT Delhi approved the MOU exchange credits! I've uploaded the VLSI CMOS layout workbook to the vault for you. Available for a session soon?", sender: 'Sneha', time: '10:00 AM' },
  { id: 2, text: "Perfect! I just saw the notification. I've prepped the React architecture session for you in return. Wednesday 3PM works for me! 🚀", sender: 'me', time: '10:05 AM' }
];

export const MOCK_CONVERSATIONS = [
  { id: 'sneha', name: 'Sneha (IIT Delhi)', status: 'Nexus Link Active', online: true, active: true },
  { id: 'aryan', name: 'Aryan K. (IIT Jammu)', status: 'Local Peer', online: true },
  { id: 'vikram', name: 'Dr. Vikram (IITD)', status: 'Nexus Admin Node', online: false },
];
