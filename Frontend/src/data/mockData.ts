/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile, Post, NetworkConnection, SystemNotification } from '../types';

// Let's create beautiful gradient avatars with SVG details inside
export const getAvatarSvg = (name: string, seed: number) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
  
  const gradients = [
    { start: '#06B6D4', end: '#3B82F6' }, // Cyan - Blue
    { start: '#6366F1', end: '#EC4899' }, // Indigo - Pink
    { start: '#10B981', end: '#06B6D4' }, // Emerald - Cyan
    { start: '#8B5CF6', end: '#6366F1' }, // Purple - Indigo
    { start: '#F59E0B', end: '#EF4444' }, // Amber - Red
  ];
  const { start, end } = gradients[seed % gradients.length];

  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <defs>
      <linearGradient id="grad-${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${start};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${end};stop-opacity:1" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(%23grad-${seed})" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
    <circle cx="50" cy="50" r="40" fill="rgba(9,13,22,0.6)" />
    <text x="50" y="58" font-family="'Outfit', 'Inter', sans-serif" font-weight="700" font-size="30" fill="%23F8FAFC" text-anchor="middle" letter-spacing="0.5">${initials}</text>
    <circle cx="50" cy="50" r="44" fill="none" stroke="${start}" stroke-width="1.5" stroke-dasharray="2 4" opacity="0.6" />
  </svg>`;
};

export const INITIAL_PROFILE: UserProfile = {
  id: 'user_alex_mercer',
  name: 'Alex Mercer',
  headline: 'Lead AI Solutions Architect at Cognitive Systems',
  bio: 'pioneering the synthesis of robust neural networks and sleek cloud infrastructure. Obsessed with high-performance glassmorphic UI, real-time distributed pipelines, and developer experience. Leading team of 14 core engineers designing next-gen LLM orchestration engines.',
  location: 'San Francisco, CA',
  avatar: getAvatarSvg('Alex Mercer', 1),
  banner: 'linear-gradient(135deg, #090D16 0%, #1E1B4B 40%, #06B6D4 100%)',
  connectionsCount: 842,
  skills: [
    'AI Systems Architecture',
    'TypeScript & React SPA',
    'LLM Orchestration',
    'Cloud-Native Kubernetes',
    'Tailwind Engine Tuning',
    'High-Concurrency Go',
    'Vector Database Design',
    'Distributed Graph GraphQL'
  ],
  experience: [
    {
      id: 'exp1',
      role: 'Lead AI Solutions Architect',
      company: 'Cognitive Systems',
      startDate: 'Oct 2023',
      endDate: 'Present',
      description: [
        'Orchestrated the architectural migration of our core NLP reasoning middleware to a multi-agent vector execution model.',
        'Spearheaded development of high-fidelity client telemetry dashboards styled with advanced Tailwind gradients, lifting DAU by 34%.',
        'Directly managed team of 14 backend and frontend engineers, deploying robust CI/CD pipelines scaling to 1.2M concurrent requests.'
      ]
    },
    {
      id: 'exp2',
      role: 'Senior Cloud Infrastructure Engineer',
      company: 'Nexus Analytics Corp',
      startDate: 'Mar 2021',
      endDate: 'Sep 2023',
      description: [
        'Built real-time data visualizers over WebSockets integrating Google Cloud Spanner databases and custom micro-queues.',
        'Reduced cloud storage operating costs by 41% through aggressive algorithmic cache layers and CDN optimizations.'
      ]
    },
    {
      id: 'exp3',
      role: 'Full-Stack Software Engineer',
      company: 'Aether Labs',
      startDate: 'Jun 2019',
      endDate: 'Feb 2021',
      description: [
        'Shipped modern micro-services using Next.js and Go, reducing server-side payload sizes by 50%.',
        'Contributed to core UI/UX component libraries utilizing high-performance keyframe animation suites.'
      ]
    }
  ]
};

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_1',
    authorName: 'Dr. Elena Rostova',
    authorHeadline: 'VP of AI Research at NeuralSentry',
    authorAvatar: getAvatarSvg('Elena Rostova', 2),
    timestamp: '2 hours ago',
    content: 'Thrilled to publish our latest deep-dive paper on neural-circuit structural pruning! We achieved a breathtaking 70% decrease in model footprint with less than 0.4% degradation in conceptual retrieval precision. Visualized the dynamic network synapse weights inside a custom WebGL topology canvas — glassmorphism fits high-tech mathematical nodes perfectly.',
    likesCount: 142,
    hasLiked: false,
    comments: [
      {
        id: 'c1',
        authorName: 'Marcus Vance',
        authorHeadline: 'Staff UX Advocate',
        authorAvatar: getAvatarSvg('Marcus Vance', 3),
        content: 'This is remarkable work Elena! The pruning results are extremely promising for client-side edge deployment models.',
        timestamp: '1 hour ago'
      },
      {
        id: 'c2',
        authorName: 'Sophia Lin',
        authorHeadline: 'Platform Specialist at CloudVane',
        authorAvatar: getAvatarSvg('Sophia Lin', 4),
        content: 'Is the WebGL visualizer open source? That graph rendering belongs in standard dashboard telemetry monitors.',
        timestamp: '45 mins ago'
      }
    ]
  },
  {
    id: 'post_2',
    authorName: 'Kai Hoshino',
    authorHeadline: 'Founder & Principal Designer at Chronos Design',
    authorAvatar: getAvatarSvg('Kai Hoshino', 12),
    timestamp: '5 hours ago',
    content: 'Why does UI craft matter? Because developers interact with interfaces hours every single day. We built our new Career-Link UI utilizing a tight visual hierarchy: deep Obsidian spaces, rich neon Aurora borders, and a beautiful sub-system of micro-transitions. It reduces cognitive stress and turns boring data navigation into a true desktop application experience. ✨ Let me know what you think!',
    likesCount: 96,
    hasLiked: true,
    comments: [
      {
        id: 'c3',
        authorName: 'Alex Mercer',
        authorHeadline: 'Lead AI Solutions Architect at Cognitive Systems',
        authorAvatar: getAvatarSvg('Alex Mercer', 1),
        content: 'The motion transitions feel exceptionally crisp. It feels more like an immersive OS than a typical web dashboard. Absolutely loving the color layout!',
        timestamp: '3 hours ago'
      }
    ]
  },
  {
    id: 'post_3',
    authorName: 'Sarah Jenkins',
    authorHeadline: 'Director of Talent at MetaStream',
    authorAvatar: getAvatarSvg('Sarah Jenkins', 6),
    timestamp: '1 day ago',
    content: 'We are officially looking to hire 3 Talented Full Stack Engineers specializing in TypeScript, Vite, and tailwind. Super passionate about individuals who treat web development with artistic craftsmanship. Our teams operate with high autonomy, designing tools that reach 20 million developers. If you design with pixel perfection and write clean modular code, hit Connect and drop a DM!',
    likesCount: 218,
    hasLiked: false,
    comments: []
  }
];

export const INITIAL_NETWORK_SUGGESTIONS: NetworkConnection[] = [
  {
    id: 'suggest_1',
    name: 'Devon Chen',
    headline: 'Senior Rust Developer & Core Optimizer',
    avatar: getAvatarSvg('Devon Chen', 7),
    mutualCount: 18,
    status: 'none'
  },
  {
    id: 'suggest_2',
    name: 'Leah Sterling',
    headline: 'VP of Customer Growth at SyncBase',
    avatar: getAvatarSvg('Leah Sterling', 8),
    mutualCount: 4,
    status: 'none'
  },
  {
    id: 'suggest_3',
    name: 'Aron Foster',
    headline: 'Kubernetes Operator & Cloud Architect',
    avatar: getAvatarSvg('Aron Foster', 9),
    mutualCount: 32,
    status: 'none'
  },
  {
    id: 'suggest_4',
    name: 'Naomi Vance',
    headline: 'Senior UI/UX Researcher & Design Thinker',
    avatar: getAvatarSvg('Naomi Vance', 10),
    mutualCount: 11,
    status: 'none'
  }
];

export const INITIAL_PENDING_INVITATIONS: NetworkConnection[] = [
  {
    id: 'invite_1',
    name: 'Gavin Sterling',
    headline: 'Staff ML Researcher at VisionScale',
    avatar: getAvatarSvg('Gavin Sterling', 11),
    mutualCount: 22,
    status: 'pending'
  },
  {
    id: 'invite_2',
    name: 'Clara Oswald',
    headline: 'Technical Product Manager at QuantumSoft',
    avatar: getAvatarSvg('Clara Oswald', 5),
    mutualCount: 8,
    status: 'pending'
  }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif_1',
    type: 'connection_request',
    title: 'New Connection Request',
    description: 'Gavin Sterling wants to join your professional network.',
    timestamp: '10 minutes ago',
    unread: true,
    sender: {
      name: 'Gavin Sterling',
      avatar: getAvatarSvg('Gavin Sterling', 11),
      headline: 'Staff ML Researcher at VisionScale'
    }
  },
  {
    id: 'notif_2',
    type: 'like',
    title: 'Post Liked',
    description: 'Kai Hoshino and 4 others liked your comment on Chronos Design launch.',
    timestamp: '1 hour ago',
    unread: true,
    sender: {
      name: 'Kai Hoshino',
      avatar: getAvatarSvg('Kai Hoshino', 12),
      headline: 'Founder & Principal Designer at Chronos Design'
    }
  },
  {
    id: 'notif_3',
    type: 'comment',
    title: 'New Comment on your Post',
    description: 'Marcus Vance commented on your AI Infrastructure Architecture diagram.',
    timestamp: '4 hours ago',
    unread: false,
    sender: {
      name: 'Marcus Vance',
      avatar: getAvatarSvg('Marcus Vance', 3),
      headline: 'Staff UX Advocate'
    }
  },
  {
    id: 'notif_4',
    type: 'system',
    title: 'Weekly Professional Digest',
    description: 'Your profile popped up in search results 142 times this week. Nice work!',
    timestamp: '2 days ago',
    unread: false
  }
];

export const TRENDING_TOPICS = [
  { id: 't1', topic: '#GenerativeDesign', count: '14.2k posts' },
  { id: 't2', topic: '#Kubernetes1_32', count: '8.9k posts' },
  { id: 't3', topic: '#GlassmorphismUI', count: '12.4k posts' },
  { id: 't4', topic: '#RemoteTechJobs', count: '5.1k posts' },
  { id: 't5', topic: '#TypeScriptFullStack', count: '10.5k posts' }
];

export const TRENDING_JOBS = [
  { id: 'j1', role: 'Solutions Engineer (AI Platforms)', company: 'Cognitive Systems', location: 'San Francisco (Hybrid)' },
  { id: 'j2', role: 'Lead Design Engineer', company: 'Linear-Scale', location: 'Remote (US/Canada)' },
  { id: 'j3', role: 'Distributed Core Developer', company: 'AtheroDB', location: 'Remote (Europe/Global)' }
];
