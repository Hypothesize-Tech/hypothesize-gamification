import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  increment,
  enableIndexedDbPersistence
} from 'firebase/firestore';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import {
  Shield,
  Crown,
  Users,
  Sparkles,
  ChevronRight,
  MessageCircle,
  LogOut,
  Target,
  TrendingUp,
  Rocket,
  User,
  History,
  Brain,
  Briefcase,
  DollarSign,
  MapPin,
  Calendar,
  Code,
  Heart,
  Star,
  FileText,
  Copy,
  Trash2,
  CheckCircle,
  BarChart3,
  Lightbulb,
  BookOpen,
  Map as MapIcon,
  AlertCircle,
  Send,
  Save,
  Library,
  Edit3,
  ExternalLink,
  Video,
  FileQuestion,
  X,
  Coins,
  ShoppingBag,
  Sword,
  Loader2,
  RefreshCw,
  Zap,
  Gem,
  UserPlus,
  Mail,
  Gift,
  Volume2,
  VolumeX
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Modal from './components/Modal';
import confetti from 'canvas-confetti';

// Firebase Configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDm4e1WgzAqEeoadjoxogBt4ULKKp1nvvA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "hypothesize-game.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "hypothesize-game",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "hypothesize-game.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "923641051396",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:923641051396:web:505f31ed8a76bee4883851",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-63MK7DR11P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.log('Persistence failed: Multiple tabs open');
  } else if (err.code === 'unimplemented') {
    console.log('Persistence not supported by browser');
  }
});

// AWS Bedrock Configuration
const awsRegion = import.meta.env.VITE_AWS_REGION;
const awsAccessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
const awsSecretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
const awsModelId = import.meta.env.VITE_NOVA_INFERENCE_PROFILE_ARN || "anthropic.claude-3-sonnet-20240229-v1:0";

const bedrockClient = new BedrockRuntimeClient({
  region: awsRegion || 'us-west-2',
  ...(awsAccessKeyId && awsSecretAccessKey
    ? {
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey
      }
    }
    : {})
});

// Email Configuration
const emailConfig = {
  smtpHost: import.meta.env.VITE_SMTP_HOST,
  smtpPort: import.meta.env.VITE_SMTP_PORT,
  smtpUser: import.meta.env.VITE_SMTP_USER,
  smtpPass: import.meta.env.VITE_SMTP_PASS,
  fromEmail: import.meta.env.VITE_FROM_EMAIL || 'noreply@startupquest.com'
};

// Sound Manager
class SoundManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private enabled: boolean = true;

  constructor() {
    // Free sound effects from various sources
    this.sounds = {
      purchase: new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3'),
      levelUp: new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-01.mp3'),
      questComplete: new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-04.mp3'),
      coinCollect: new Audio('https://www.soundjay.com/misc/sounds/coin-drop-4.mp3'),
      error: new Audio('https://www.soundjay.com/misc/sounds/fail-buzzer-02.mp3')
    };

    // Set volume for all sounds
    Object.values(this.sounds).forEach(sound => {
      sound.volume = 0.3;
    });
  }

  play(soundName: keyof typeof this.sounds) {
    if (this.enabled && this.sounds[soundName]) {
      this.sounds[soundName].currentTime = 0;
      this.sounds[soundName].play().catch(e => console.log('Sound play failed:', e));
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }
}

const soundManager = new SoundManager();

// Animation Helper
const triggerConfetti = (options = {}) => {
  const defaults = {
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  };
  confetti({ ...defaults, ...options });
};

// Avatar Templates
const AVATAR_TEMPLATES = [
  { id: 'tech-founder', name: 'Tech Visionary', icon: '👨‍💻', outfit: 'Hoodie & Jeans' },
  { id: 'business-exec', name: 'Business Executive', icon: '👔', outfit: 'Suit & Tie' },
  { id: 'creative-mind', name: 'Creative Mind', icon: '🎨', outfit: 'Casual Creative' },
  { id: 'serial-entrepreneur', name: 'Serial Entrepreneur', icon: '🚀', outfit: 'Smart Casual' },
  { id: 'innovator', name: 'Innovator', icon: '💡', outfit: 'Lab Coat' },
  { id: 'social-impact', name: 'Social Impact', icon: '🌍', outfit: 'Eco-Friendly' }
];

// Missing icon components
const Settings = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v6m0 6v6m11-11h-6m-6 0H1"></path><path d="m20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
const Megaphone = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></svg>;

// Core Attributes System
const CORE_ATTRIBUTES = {
  tech: { name: 'Tech', icon: Code, color: 'text-blue-500' },
  finance: { name: 'Finance', icon: DollarSign, color: 'text-green-500' },
  marketing: { name: 'Marketing', icon: Megaphone, color: 'text-purple-500' },
  sales: { name: 'Sales', icon: TrendingUp, color: 'text-orange-500' },
  legal: { name: 'Legal', icon: Shield, color: 'text-red-500' },
  operations: { name: 'Operations', icon: Settings, color: 'text-gray-500' }
};

// Guild Roles
const GUILD_ROLES = {
  engineer: { name: 'Engineer', attribute: 'tech', icon: '⚙️', description: 'Masters of technology and product development' },
  treasurer: { name: 'Treasurer', attribute: 'finance', icon: '💰', description: 'Guardians of financial strategy and planning' },
  herald: { name: 'Herald', attribute: 'marketing', icon: '📣', description: 'Champions of brand and market presence' },
  vanguard: { name: 'Vanguard', attribute: 'sales', icon: '⚔️', description: 'Leaders of revenue generation' },
  loremaster: { name: 'Loremaster', attribute: 'legal', icon: '📜', description: 'Keepers of legal wisdom and compliance' },
  quartermaster: { name: 'Quartermaster', attribute: 'operations', icon: '📦', description: 'Orchestrators of efficient operations' }
};

// Armory Items
const ARMORY_ITEMS = {
  gear: [
    {
      id: 'militia_set',
      name: 'Militia Set',
      price: 500,
      levelRequired: 10,
      icon: '🛡️',
      description: 'Basic armor for the aspiring founder',
      stats: { xpBonus: 5, goldBonus: 5 }
    },
    {
      id: 'man_at_arms_set',
      name: 'Man-at-Arms Set',
      price: 1500,
      levelRequired: 20,
      icon: '⚔️',
      description: 'Professional gear for serious entrepreneurs',
      stats: { xpBonus: 10, goldBonus: 10 }
    },
    {
      id: 'long_swordsman_set',
      name: 'Long Swordsman Set',
      price: 3000,
      levelRequired: 30,
      icon: '🗡️',
      description: 'Elite equipment for market warriors',
      stats: { xpBonus: 15, goldBonus: 15 }
    },
    {
      id: 'two_handed_set',
      name: 'Two-Handed Swordsman Set',
      price: 5000,
      levelRequired: 40,
      icon: '⚔️',
      description: 'Legendary gear for scaling champions',
      stats: { xpBonus: 20, goldBonus: 20 }
    },
    {
      id: 'champion_set',
      name: 'Champion Set',
      price: 10000,
      levelRequired: 50,
      icon: '👑',
      description: 'Ultimate armor for startup legends',
      stats: { xpBonus: 30, goldBonus: 30 }
    }
  ],
  consumables: [
    {
      id: 'xp_boost',
      name: 'XP Boost Potion',
      price: 100,
      levelRequired: 1,
      icon: '🧪',
      description: 'Double XP for next quest',
      effect: 'doubleXP'
    },
    {
      id: 'gold_boost',
      name: 'Gold Rush Elixir',
      price: 150,
      levelRequired: 1,
      icon: '💎',
      description: 'Double gold for next quest',
      effect: 'doubleGold'
    },
    {
      id: 'wisdom_scroll',
      name: 'Scroll of Wisdom',
      price: 200,
      levelRequired: 5,
      icon: '📜',
      description: 'Instant AI rating boost (+1 star)',
      effect: 'ratingBoost'
    }
  ],
  treasures: [
    {
      id: 'heralds_horn',
      name: "Herald's Horn",
      price: 5000,
      requirement: 'Earn 5000 Marketing XP',
      icon: '📯',
      description: 'All marketing quests give +50% XP permanently',
      effect: { attribute: 'marketing', bonus: 50 }
    },
    {
      id: 'alchemists_coin',
      name: "Alchemist's Coin",
      price: 5000,
      requirement: 'Earn 5000 Finance XP',
      icon: '🪙',
      description: 'All finance quests give +50% gold permanently',
      effect: { attribute: 'finance', bonus: 50 }
    },
    {
      id: 'engineers_blueprint',
      name: "Engineer's Blueprint",
      price: 5000,
      requirement: 'Earn 5000 Tech XP',
      icon: '📐',
      description: 'All tech quests give +50% XP permanently',
      effect: { attribute: 'tech', bonus: 50 }
    },
    {
      id: 'vanguards_blade',
      name: "Vanguard's Blade",
      price: 5000,
      requirement: 'Earn 5000 Sales XP',
      icon: '⚔️',
      description: 'All sales quests give +50% gold permanently',
      effect: { attribute: 'sales', bonus: 50 }
    }
  ]
};

// CEO Avatars Database
const CEO_AVATARS = [
  {
    id: 'elon-musk',
    name: 'Elon Musk',
    title: 'The Visionary Disruptor',
    industries: ['tech', 'automotive', 'aerospace', 'energy'],
    traits: ['ambitious', 'risk-taker', 'innovative', 'technical'],
    avatar: '🚀',
    color: 'from-blue-600 to-purple-600',
    advice: 'Think 10x bigger and work backwards from the impossible.',
    matchCriteria: {
      ambition: 8,
      technical: 7,
      riskTolerance: 9
    }
  },
  {
    id: 'satya-nadella',
    name: 'Satya Nadella',
    title: 'The Empathetic Leader',
    industries: ['tech', 'enterprise', 'cloud', 'ai'],
    traits: ['empathetic', 'strategic', 'collaborative', 'growth-minded'],
    avatar: '☁️',
    color: 'from-blue-500 to-cyan-500',
    advice: 'Lead with empathy and build a growth mindset culture.',
    matchCriteria: {
      empathy: 9,
      strategic: 8,
      collaboration: 9
    }
  },
  {
    id: 'sara-blakely',
    name: 'Sara Blakely',
    title: 'The Bootstrapper',
    industries: ['retail', 'fashion', 'consumer-goods', 'ecommerce'],
    traits: ['resourceful', 'persistent', 'creative', 'customer-focused'],
    avatar: '💡',
    color: 'from-pink-500 to-red-500',
    advice: 'Start with $5,000 and turn every obstacle into an opportunity.',
    matchCriteria: {
      resourcefulness: 9,
      persistence: 9,
      customerFocus: 8
    }
  },
  {
    id: 'jeff-bezos',
    name: 'Jeff Bezos',
    title: 'The Customer Obsessed',
    industries: ['ecommerce', 'cloud', 'logistics', 'tech'],
    traits: ['customer-obsessed', 'long-term', 'data-driven', 'experimental'],
    avatar: '📦',
    color: 'from-orange-500 to-yellow-500',
    advice: 'Be stubborn on vision, flexible on details. Always Day 1.',
    matchCriteria: {
      customerFocus: 10,
      longTermThinking: 9,
      dataOrientation: 8
    }
  },
  {
    id: 'whitney-wolfe',
    name: 'Whitney Wolfe Herd',
    title: 'The Game Changer',
    industries: ['social', 'dating', 'tech', 'consumer'],
    traits: ['bold', 'empowering', 'innovative', 'mission-driven'],
    avatar: '🐝',
    color: 'from-yellow-400 to-orange-400',
    advice: 'Challenge the status quo and build with purpose.',
    matchCriteria: {
      boldness: 9,
      missionDriven: 9,
      innovation: 8
    }
  },
  {
    id: 'brian-chesky',
    name: 'Brian Chesky',
    title: 'The Experience Designer',
    industries: ['hospitality', 'sharing-economy', 'tech', 'travel'],
    traits: ['design-focused', 'community-driven', 'creative', 'resilient'],
    avatar: '🏠',
    color: 'from-red-500 to-pink-500',
    advice: 'Design experiences, not just products. Build community.',
    matchCriteria: {
      designThinking: 9,
      communityFocus: 9,
      creativity: 8
    }
  },
  {
    id: 'jensen-huang',
    name: 'Jensen Huang',
    title: 'The AI Pioneer',
    industries: ['semiconductors', 'ai', 'gaming', 'tech'],
    traits: ['visionary', 'technical', 'persistent', 'pioneering'],
    avatar: '🎮',
    color: 'from-green-500 to-emerald-500',
    advice: 'The more you suffer, the more you succeed. Build for the future.',
    matchCriteria: {
      technical: 9,
      visionary: 9,
      persistence: 10
    }
  },
  {
    id: 'anne-wojcicki',
    name: 'Anne Wojcicki',
    title: 'The Science Revolutionary',
    industries: ['biotech', 'healthtech', 'genetics', 'consumer-health'],
    traits: ['scientific', 'democratizing', 'persistent', 'data-driven'],
    avatar: '🧬',
    color: 'from-purple-500 to-indigo-500',
    advice: 'Democratize access to information and empower individuals.',
    matchCriteria: {
      scientific: 9,
      missionDriven: 8,
      dataOrientation: 9
    }
  }
];

// Dynamic Resource Fetcher
const fetchDynamicResources = async (questTopic: string, questDescription: string) => {
  try {
    const searchPrompt = `Find the best online resources for a startup founder working on: ${questTopic}. Context: ${questDescription}. 
    
    Return a JSON array with exactly 5 resources in this format:
    [
      {
        "title": "Resource Title",
        "type": "article|video|tool|course|book|template",
        "description": "Brief description",
        "url": "https://...",
        "icon": "appropriate emoji",
        "difficulty": "beginner|intermediate|advanced",
        "timeToComplete": "e.g., 10 min read, 2 hour course"
      }
    ]
    
    Focus on high-quality, actionable resources from reputable sources like Y Combinator, First Round Review, Harvard Business Review, TechCrunch, Stripe Atlas, etc.`;

    const command = new InvokeModelCommand({
      modelId: awsModelId,
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: [
              {
                text: searchPrompt
              }
            ]
          }
        ],
      }),
      contentType: "application/json",
      accept: "application/json"
    });

    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const content = responseBody.output?.message?.content?.[0]?.text || "[]";

    // Parse the JSON response
    try {
      const resources = JSON.parse(content);
      return resources;
    } catch (e) {
      // Fallback to default resources if parsing fails
      return getDefaultResources(questTopic);
    }
  } catch (error) {
    console.error('Error fetching dynamic resources:', error);
    return getDefaultResources(questTopic);
  }
};

// Default resources fallback
const getDefaultResources = (questTopic: string) => {
  const defaults: Record<string, any[]> = {
    vision: [
      { title: 'The Lean Startup', type: 'book', icon: '📚', url: 'https://theleanstartup.com/', description: 'Essential reading for founders', difficulty: 'beginner', timeToComplete: '8 hour read' },
      { title: 'Simon Sinek: Start with Why', type: 'video', icon: '🎥', url: 'https://www.ted.com/talks/simon_sinek_how_great_leaders_inspire_action', description: 'Inspiring TED talk on vision', difficulty: 'beginner', timeToComplete: '18 min video' },
      { title: 'Vision Statement Guide', type: 'article', icon: '📄', url: 'https://blog.hubspot.com/marketing/mission-statement', description: 'How to craft your vision', difficulty: 'intermediate', timeToComplete: '15 min read' },
      { title: 'Y Combinator Startup School', type: 'course', icon: '🎓', url: 'https://www.startupschool.org/', description: 'Free startup course', difficulty: 'intermediate', timeToComplete: '10 week course' },
      { title: 'Notion Vision Template', type: 'template', icon: '📋', url: 'https://www.notion.so/templates', description: 'Ready-to-use vision template', difficulty: 'beginner', timeToComplete: '30 min setup' }
    ],
    problem: [
      { title: 'The Mom Test', type: 'book', icon: '📚', url: 'http://momtestbook.com/', description: 'Customer validation guide', difficulty: 'beginner', timeToComplete: '4 hour read' },
      { title: 'Problem Validation Guide', type: 'article', icon: '📄', url: 'https://www.ycombinator.com/library/5z-how-to-validate-your-startup-idea', description: 'YC validation framework', difficulty: 'intermediate', timeToComplete: '20 min read' },
      { title: 'Customer Interview Script', type: 'template', icon: '📋', url: 'https://customerdevlabs.com/2013/11/05/how-i-interview-customers/', description: 'Interview template', difficulty: 'beginner', timeToComplete: '15 min setup' },
      { title: 'Jobs to be Done', type: 'video', icon: '🎥', url: 'https://www.youtube.com/watch?v=sfGtw2C95Ms', description: 'Clayton Christensen framework', difficulty: 'advanced', timeToComplete: '1 hour video' },
      { title: 'Typeform Survey Tool', type: 'tool', icon: '🔧', url: 'https://www.typeform.com/', description: 'Create beautiful surveys', difficulty: 'beginner', timeToComplete: 'Free trial' }
    ]
  };

  return defaults[questTopic] || defaults.vision;
};

// Quest Input Templates
const QUEST_INPUT_TEMPLATES = {
  vision: {
    title: 'Define Your Vision',
    fields: [
      { name: 'mission', label: 'Mission Statement', type: 'textarea', placeholder: 'What is your company\'s mission?' },
      { name: 'vision', label: 'Vision Statement', type: 'textarea', placeholder: 'Where do you see your company in 5-10 years?' },
      { name: 'values', label: 'Core Values', type: 'textarea', placeholder: 'List 3-5 core values that guide your company' },
      { name: 'why', label: 'Your Why', type: 'textarea', placeholder: 'Why are you building this company?' }
    ]
  },
  problem: {
    title: 'Identify the Problem',
    fields: [
      { name: 'problem', label: 'Problem Statement', type: 'textarea', placeholder: 'What problem are you solving?' },
      { name: 'target', label: 'Target Audience', type: 'text', placeholder: 'Who experiences this problem?' },
      { name: 'pain', label: 'Pain Points', type: 'textarea', placeholder: 'List the main pain points' },
      { name: 'current', label: 'Current Solutions', type: 'textarea', placeholder: 'How is this problem currently solved?' }
    ]
  },
  solution: {
    title: 'Craft Your Solution',
    fields: [
      { name: 'solution', label: 'Solution Description', type: 'textarea', placeholder: 'Describe your solution' },
      { name: 'features', label: 'Key Features', type: 'textarea', placeholder: 'List the main features' },
      { name: 'differentiator', label: 'Unique Value Proposition', type: 'textarea', placeholder: 'What makes your solution unique?' },
      { name: 'benefits', label: 'Key Benefits', type: 'textarea', placeholder: 'What benefits does your solution provide?' }
    ]
  },
  market: {
    title: 'Market Research',
    fields: [
      { name: 'tam', label: 'Total Addressable Market (TAM)', type: 'text', placeholder: 'e.g., $50B' },
      { name: 'sam', label: 'Serviceable Addressable Market (SAM)', type: 'text', placeholder: 'e.g., $5B' },
      { name: 'som', label: 'Serviceable Obtainable Market (SOM)', type: 'text', placeholder: 'e.g., $500M' },
      { name: 'competitors', label: 'Main Competitors', type: 'textarea', placeholder: 'List your main competitors' },
      { name: 'trends', label: 'Market Trends', type: 'textarea', placeholder: 'Key trends in your market' }
    ]
  },
  legal: {
    title: 'Legal Foundation',
    fields: [
      { name: 'entity', label: 'Entity Type', type: 'select', options: ['LLC', 'C-Corp', 'S-Corp', 'Partnership'] },
      { name: 'state', label: 'State of Incorporation', type: 'text', placeholder: 'e.g., Delaware' },
      { name: 'ip', label: 'Intellectual Property', type: 'textarea', placeholder: 'List any IP, trademarks, patents' },
      { name: 'agreements', label: 'Key Agreements Needed', type: 'textarea', placeholder: 'e.g., Founder agreements, NDAs' }
    ]
  }
};

// Simplified Onboarding Questions - Only 3 as requested
const ONBOARDING_QUESTIONS = [
  {
    id: 'avatar',
    question: 'Choose Your Founder Avatar',
    type: 'avatar',
    icon: User,
    category: 'identity'
  },
  {
    id: 'coreAttribute',
    question: 'What\'s your primary strength as a founder?',
    type: 'select',
    options: ['Tech', 'Finance', 'Marketing', 'Sales', 'Legal', 'Operations'],
    icon: Star,
    category: 'attributes'
  },
  {
    id: 'guildName',
    question: 'Name Your Guild (Company)',
    type: 'text',
    placeholder: 'Enter your company name',
    icon: Crown,
    category: 'guild'
  }
];

// Achievement Badges
const ACHIEVEMENTS = [
  { id: 'first_quest', name: 'First Steps', icon: '👣', description: 'Complete your first quest', xpRequired: 100 },
  { id: 'onboarding_complete', name: 'Well Prepared', icon: '📋', description: 'Complete onboarding', xpRequired: 50 },
  { id: 'first_sage_chat', name: 'Wisdom Seeker', icon: '🔮', description: 'Have your first AI Sage consultation', xpRequired: 150 },
  { id: 'mvp_launched', name: 'MVP Champion', icon: '🚀', description: 'Launch your MVP', xpRequired: 1000 },
  { id: 'first_customers', name: 'People\'s Choice', icon: '👥', description: 'Get your first 10 customers', xpRequired: 1500 },
  { id: 'document_master', name: 'Scroll Keeper', icon: '📜', description: 'Generate 5 AI documents', xpRequired: 500 },
  { id: 'conversation_pro', name: 'Sage Confidant', icon: '💬', description: 'Have 20 AI consultations', xpRequired: 800 },
  { id: 'funded', name: 'Treasure Secured', icon: '💰', description: 'Secure funding', xpRequired: 3000 },
  { id: 'scaling', name: 'Empire Builder', icon: '🏰', description: 'Start scaling operations', xpRequired: 5000 },
  { id: 'week_streak', name: 'Consistent Warrior', icon: '🔥', description: 'Check in for 7 days straight', xpRequired: 200 },
  { id: 'gold_hoarder', name: 'Gold Hoarder', icon: '🏆', description: 'Accumulate 10,000 gold', goldRequired: 10000 },
  { id: 'gear_collector', name: 'Gear Collector', icon: '🛡️', description: 'Purchase 5 items from the Armory', purchases: 5 },
  { id: 'guild_master', name: 'Guild Master', icon: '👑', description: 'Have all 6 guild roles filled', special: 'fullGuild' },
  { id: 'attribute_master', name: 'Attribute Master', icon: '🌟', description: 'Earn 5000 XP in any single attribute', special: 'attributeMastery' },
  { id: 'daily_champion', name: 'Daily Champion', icon: '☀️', description: 'Claim daily bonus for 30 days', dailyStreak: 30 },
  { id: 'stage_complete_fundamentals', name: 'Training Complete', icon: '🎯', description: 'Complete Training Grounds', special: 'stage' },
  { id: 'stage_complete_kickoff', name: 'Launched', icon: '🚀', description: 'Complete Kickoff City', special: 'stage' },
  { id: 'stage_complete_gtm', name: 'Market Conqueror', icon: '⚔️', description: 'Complete Go-to-Market Plains', special: 'stage' },
  { id: 'stage_complete_growth', name: 'Empire Builder', icon: '🏯', description: 'Complete Growth Mountains', special: 'stage' }
];

// Document Templates
const DOCUMENT_TEMPLATES = [
  { id: 'elevator_pitch', name: '30-Second Battle Cry', icon: '📢', xp: 100 },
  { id: 'lean_canvas', name: 'Kingdom Blueprint', icon: '🏗️', xp: 150 },
  { id: 'user_survey', name: 'Scouting Questions', icon: '🔍', xp: 100 },
  { id: 'investor_deck', name: 'Treasure Map', icon: '💎', xp: 200 },
  { id: 'marketing_plan', name: 'Conquest Strategy', icon: '⚔️', xp: 150 },
  { id: 'product_roadmap', name: 'Quest Timeline', icon: '🗺️', xp: 150 }
];

// Guild Level Structure
const GUILD_LEVELS = {
  1: { name: 'Campfire', icon: '🔥', description: 'Just getting started', dailyGold: 0 },
  2: { name: 'Outpost', icon: '🏕️', description: 'Fundamentals complete', dailyGold: 0 },
  3: { name: 'Hovel', icon: '🏚️', description: 'Kickoff complete', dailyGold: 0 },
  4: { name: 'Manor', icon: '🏘️', description: 'Go-to-Market complete', dailyGold: 50 },
  5: { name: 'Tower', icon: '🏰', description: 'Growth complete', dailyGold: 100 },
  6: { name: 'Castle', icon: '🏯', description: 'Prestige unlocked', dailyGold: 200 },
  7: { name: 'Stronghold', icon: '⛩️', description: 'Ultimate achievement', dailyGold: 500 }
};

// Level Calculation
const calculateLevel = (xp: number) => {
  const baseXP = 100;
  const level = Math.floor(Math.sqrt(xp / baseXP)) + 1;
  const currentLevelXP = Math.pow(level - 1, 2) * baseXP;
  const nextLevelXP = Math.pow(level, 2) * baseXP;
  const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return { level, progress, currentLevelXP, nextLevelXP };
};

// Helper to calculate CEO match
const calculateCEOMatch = (userData: any): string => {
  const coreAttribute = userData.onboardingData?.coreAttribute?.toLowerCase();

  // Match based on core attribute
  if (coreAttribute === 'tech') {
    return ['elon-musk', 'jensen-huang', 'satya-nadella'][Math.floor(Math.random() * 3)];
  } else if (coreAttribute === 'finance') {
    return 'jeff-bezos';
  } else if (coreAttribute === 'marketing') {
    return ['whitney-wolfe', 'brian-chesky'][Math.floor(Math.random() * 2)];
  } else if (coreAttribute === 'sales') {
    return 'jeff-bezos';
  } else if (coreAttribute === 'legal') {
    return 'anne-wojcicki';
  } else {
    return 'sara-blakely';
  }
};

// Calculate XP with bonuses
const calculateXPWithBonuses = (baseXP: number, rating: number, questAttribute: string, userData: any) => {
  let xp = baseXP * (rating / 5);

  // Core competency bonus
  if (userData.coreAttribute?.toLowerCase() === questAttribute) {
    xp *= 1.5; // +50% bonus
  }

  // Full guild bonus (check if all 6 roles are filled)
  const filledRoles = new Set(userData.members?.map((m: any) => m.role) || []);
  if (filledRoles.size >= 6) {
    xp *= 1.3; // +30% bonus
  }

  // Active consumable effects
  if (userData.activeEffects?.includes('doubleXP')) {
    xp *= 2;
  }

  // Gear bonuses
  const equippedGear = userData.equippedGear || [];
  equippedGear.forEach((itemId: string) => {
    const item = ARMORY_ITEMS.gear.find(g => g.id === itemId);
    if (item?.stats.xpBonus) {
      xp *= (1 + item.stats.xpBonus / 100);
    }
  });

  // Treasure bonuses
  const treasures = userData.treasures || [];
  treasures.forEach((treasureId: string) => {
    const treasure = ARMORY_ITEMS.treasures.find(t => t.id === treasureId);
    if (treasure?.effect.attribute === questAttribute) {
      xp *= (1 + treasure.effect.bonus / 100);
    }
  });

  return Math.round(xp);
};

// Calculate Gold rewards
const calculateGoldReward = (baseGold: number, rating: number, userData: any) => {
  let gold = baseGold * (rating / 5);

  // Active consumable effects
  if (userData.activeEffects?.includes('doubleGold')) {
    gold *= 2;
  }

  // Gear bonuses
  const equippedGear = userData.equippedGear || [];
  equippedGear.forEach((itemId: string) => {
    const item = ARMORY_ITEMS.gear.find(g => g.id === itemId);
    if (item?.stats.goldBonus) {
      gold *= (1 + item.stats.goldBonus / 100);
    }
  });

  return Math.round(gold);
};

// AI Sage Integration
const consultAISage = async (context: string, question: string, userData?: any) => {
  try {
    const ceoContext = userData?.ceoAvatar ?
      `You should occasionally reference ${userData.ceoAvatar.name}'s approach and mindset when relevant.` : '';

    const command = new InvokeModelCommand({
      modelId: awsModelId,
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: [
              {
                text: `You are the AI Sage, a wise guide helping founders on their startup journey. 
                ${ceoContext}
                Provide actionable, specific advice in a mystical yet practical tone. 
                Keep responses concise but insightful.`
              },
              { text: `Context: ${context}` },
              { text: `Question: ${question}` }
            ]
          }
        ],
      }),
      contentType: "application/json",
      accept: "application/json"
    });

    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    return responseBody.output?.message?.content?.[0]?.text || "The AI Sage is currently meditating. Please try again later.";
  } catch (error) {
    console.error('AI Sage error:', error);
    return "The AI Sage is currently meditating. Please try again later.";
  }
};

// Rate Quest Submission
const rateQuestSubmission = async (questData: any, userData: any) => {
  try {
    const ratingPrompt = `Rate this startup quest submission on a scale of 1-5 stars based on completeness, quality, and strategic thinking.

Quest: ${questData.questName}
User Inputs: ${JSON.stringify(questData.inputs)}

Provide your rating as a JSON object:
{
  "rating": [1-5],
  "feedback": "Brief explanation of rating",
  "suggestions": ["Improvement suggestion 1", "Improvement suggestion 2"]
}`;

    const command = new InvokeModelCommand({
      modelId: awsModelId,
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: [{ text: ratingPrompt }]
          }
        ],
      }),
      contentType: "application/json",
      accept: "application/json"
    });

    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const content = responseBody.output?.message?.content?.[0]?.text || "{}";

    try {
      const rating = JSON.parse(content);
      // Apply wisdom scroll effect if active
      if (userData.activeEffects?.includes('ratingBoost')) {
        rating.rating = Math.min(5, rating.rating + 1);
      }
      return rating;
    } catch (e) {
      return { rating: 3, feedback: "Good effort!", suggestions: [] };
    }
  } catch (error) {
    console.error('Rating error:', error);
    return { rating: 3, feedback: "Good effort!", suggestions: [] };
  }
};

// Generate AI Document
const generateAIDocument = async (template: any, userData: any) => {
  const context = `
    Startup Vision: ${userData.vision}
    Industry: ${userData.onboardingData?.industry || 'General'}
    Stage: ${userData.onboardingData?.stage || 'Early'}
    Core Attribute: ${userData.coreAttribute}
  `;

  const prompts: Record<string, string> = {
    elevator_pitch: "Create a compelling 30-second elevator pitch",
    lean_canvas: "Create a lean business model canvas",
    user_survey: "Create a user research survey with 10 key questions",
    investor_deck: "Create an outline for an investor pitch deck",
    marketing_plan: "Create a go-to-market strategy outline",
    product_roadmap: "Create a 6-month product roadmap"
  };

  return consultAISage(context, prompts[template.id] || "Create a startup document", userData);
};

// Send Guild Invitation Email
const sendGuildInvitation = async (email: string, role: string, inviterName: string, guildName: string) => {
  try {
    // In a real app, you would use a backend service to send emails
    // For now, we'll just log and show a success message
    console.log('Sending email to:', email);
    console.log('Role:', role);
    console.log('From:', inviterName);
    console.log('Guild:', guildName);

    // Email template
    const emailTemplate = `
      Subject: You're invited to join ${guildName} on AI Startup Quest!
      
      Hi there,
      
      ${inviterName} has invited you to join their guild "${guildName}" as a ${GUILD_ROLES[role as keyof typeof GUILD_ROLES].name}.
      
      AI Startup Quest is a gamified platform that transforms the startup journey into an epic adventure. Complete quests, earn XP and gold, and level up your founder skills!
      
      Your role: ${GUILD_ROLES[role as keyof typeof GUILD_ROLES].name}
      ${GUILD_ROLES[role as keyof typeof GUILD_ROLES].description}
      
      Click here to join: [Link would go here]
      
      See you in the game!
      The AI Startup Quest Team
    `;

    console.log('Email template:', emailTemplate);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Daily Bonus Component
const DailyBonus = ({
  guildData,
  onClaim
}: {
  guildData: any;
  onClaim: () => void
}) => {
  // Handle null or undefined guildData
  if (!guildData) {
    return (
      <div className="bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg p-4 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Gift className="w-8 h-8 text-white" />
            <div>
              <h3 className="font-bold text-white">Daily Bonus</h3>
              <p className="text-sm text-white/80">Loading...</p>
            </div>
          </div>
          <button
            disabled
            className="px-4 py-2 rounded-lg font-semibold bg-gray-800 text-gray-400 cursor-not-allowed"
          >
            Claim
          </button>
        </div>
      </div>
    );
  }

  const [canClaim, setCanClaim] = useState(false);
  const [timeUntilNext, setTimeUntilNext] = useState('');

  useEffect(() => {
    const checkDailyBonus = () => {
      const lastClaim = guildData.lastDailyBonus;
      const now = new Date();
      const lastClaimDate = lastClaim ? new Date(lastClaim) : null;

      if (!lastClaimDate ||
        now.toDateString() !== lastClaimDate.toDateString()) {
        setCanClaim(true);
        setTimeUntilNext('');
      } else {
        setCanClaim(false);
        // Calculate time until next claim (midnight)
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const diff = tomorrow.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeUntilNext(`${hours}h ${minutes}m`);
      }
    };

    checkDailyBonus();
    const interval = setInterval(checkDailyBonus, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [guildData.lastDailyBonus]);

  return (
    <div className={`bg-gradient-to-r ${canClaim ? 'from-yellow-600 to-orange-600' : 'from-gray-600 to-gray-700'} rounded-lg p-4 transition-all`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Gift className="w-8 h-8 text-white" />
          <div>
            <h3 className="font-bold text-white">Daily Bonus</h3>
            <p className="text-sm text-white/80">
              {canClaim ? 'Claim your 5 gold coins!' : `Next bonus in ${timeUntilNext}`}
            </p>
          </div>
        </div>
        <button
          onClick={onClaim}
          disabled={!canClaim}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${canClaim
            ? 'bg-white text-orange-600 hover:bg-gray-100 transform hover:scale-105'
            : 'bg-gray-800 text-gray-400 cursor-not-allowed'
            }`}
        >
          {canClaim ? 'Claim +5' : 'Claimed'}
        </button>
      </div>
      {guildData.dailyStreak > 1 && (
        <div className="mt-2 text-sm text-white/80">
          🔥 {guildData.dailyStreak} day streak!
        </div>
      )}
    </div>
  );
};

// Guild Management Component
const GuildManagement = ({
  guildData,
  onInviteMember,
  onClose
}: {
  guildData: any;
  onInviteMember: (email: string, role: string) => void;
  onAssignRole: (memberId: string, role: string) => void;
  onClose: () => void;
}) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [sending, setSending] = useState(false);

  const handleInvite = async () => {
    if (!inviteEmail || !selectedRole) return;
    setSending(true);
    await onInviteMember(inviteEmail, selectedRole);
    setSending(false);
    setInviteEmail('');
    setSelectedRole('');
  };

  const filledRoles = new Set(guildData.members?.map((m: any) => m.role) || []);
  const availableRoles = Object.entries(GUILD_ROLES).filter(([key]) => !filledRoles.has(key) || key === 'member');

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold">Guild Management</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Guild Roles Status */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Guild Roles Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(GUILD_ROLES).map(([key, role]) => {
                const member = guildData.members?.find((m: any) => m.role === key);
                const RoleIcon = CORE_ATTRIBUTES[role.attribute as keyof typeof CORE_ATTRIBUTES].icon;

                return (
                  <div
                    key={key}
                    className={`bg-gray-700 rounded-lg p-4 ${member ? 'border-2 border-green-500' : 'opacity-50'}`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">{role.icon}</span>
                      <div>
                        <p className="font-bold">{role.name}</p>
                        <p className="text-xs text-gray-400">{role.description}</p>
                      </div>
                    </div>
                    {member ? (
                      <div className="mt-2">
                        <p className="text-sm text-green-400">{member.name}</p>
                        <p className="text-xs text-gray-400">{member.email}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 mt-2">Position Open</p>
                    )}
                  </div>
                );
              })}
            </div>
            {filledRoles.size >= 6 && (
              <div className="mt-4 bg-green-900/30 border border-green-700 rounded-lg p-3">
                <p className="text-green-400 font-medium">🎉 Full Guild Bonus Active! +30% XP on all quests</p>
              </div>
            )}
          </div>

          {/* Current Members */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Current Members</h3>
            <div className="space-y-2">
              {guildData.members?.map((member: any) => (
                <div key={member.uid} className="bg-gray-700 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-400">{member.email}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{GUILD_ROLES[member.role as keyof typeof GUILD_ROLES]?.icon}</span>
                    <span className="text-sm text-gray-400">
                      {GUILD_ROLES[member.role as keyof typeof GUILD_ROLES]?.name || 'Guild Member'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invite New Member */}
          <div>
            <h3 className="text-lg font-bold mb-4">Invite New Member</h3>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="teammate@example.com"
                    className="w-full p-3 bg-gray-600 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Assign Role</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full p-3 bg-gray-600 rounded-lg text-white"
                  >
                    <option value="">Select a role</option>
                    {availableRoles.map(([key, role]) => (
                      <option key={key} value={key}>
                        {role.icon} {role.name} - {role.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={handleInvite}
                disabled={!inviteEmail || !selectedRole || sending}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-all flex items-center justify-center space-x-2"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending Invite...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    <span>Send Invitation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4-Panel Quest Interface Component with Gold Cost for AI Sage
const FourPanelQuestInterface = ({
  quest,
  guildData,
  ceoAvatar,
  onComplete,
  onClose,
  saveConversation,
  updateGold
}: {
  quest: any;
  guildData: any;
  ceoAvatar: any;
  onComplete: (questData: any) => void;
  onClose: () => void;
  saveConversation: (quest: any, question: string, response: string) => Promise<void>;
  updateGold: (amount: number) => Promise<void>;
}) => {
  const [sageMessages, setSageMessages] = useState<Array<{ type: 'user' | 'sage', content: string }>>([]);
  const [sageInput, setSageInput] = useState('');
  const [sageLoading, setSageLoading] = useState(false);
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [dynamicResources, setDynamicResources] = useState<any[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [rating, setRating] = useState<any>(null);

  // Fetch dynamic resources when quest opens
  useEffect(() => {
    const loadResources = async () => {
      setResourcesLoading(true);
      const resources = await fetchDynamicResources(quest.name, quest.description);
      setDynamicResources(resources);
      setResourcesLoading(false);
    };
    loadResources();
  }, [quest]);

  // Get input template for this quest
  const inputTemplate = QUEST_INPUT_TEMPLATES[quest.id as keyof typeof QUEST_INPUT_TEMPLATES];

  // Handle sage conversation with gold cost
  const handleSageChat = async () => {
    if (!sageInput.trim()) return;

    // Check if user has enough gold
    if (guildData.gold < 20) {
      alert('Not enough gold! You need 20 gold coins to consult the AI Sage.');
      return;
    }

    const userMessage = sageInput;
    setSageInput('');
    setSageMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setSageLoading(true);

    try {
      // Deduct 20 gold
      await updateGold(-20);
      soundManager.play('coinCollect');

      const response = await consultAISage(
        `Quest: ${quest.name} - ${quest.description}. User inputs so far: ${JSON.stringify(userInputs)}`,
        userMessage,
        { ...guildData, ceoAvatar }
      );

      setSageMessages(prev => [...prev, { type: 'sage', content: response }]);
      await saveConversation(quest, userMessage, response);
    } catch (error) {
      setSageMessages(prev => [...prev, {
        type: 'sage',
        content: 'The AI Sage encountered an error. Your gold has been refunded.'
      }]);
      // Refund gold on error
      await updateGold(20);
    } finally {
      setSageLoading(false);
    }
  };

  // Handle input field changes
  const handleInputChange = (fieldName: string, value: string) => {
    setUserInputs(prev => ({ ...prev, [fieldName]: value }));
  };

  // Handle quest completion with rating
  const handleCompleteQuest = async () => {
    setIsSaving(true);

    // Get AI rating
    const questRating = await rateQuestSubmission({
      questName: quest.name,
      inputs: userInputs
    }, guildData);

    setRating(questRating);

    const questData = {
      inputs: userInputs,
      sageConversation: sageMessages,
      completedAt: new Date().toISOString(),
      rating: questRating.rating,
      feedback: questRating.feedback
    };

    // Calculate rewards
    const xpReward = calculateXPWithBonuses(quest.xp, questRating.rating, quest.attribute || 'general', guildData);
    const goldReward = calculateGoldReward(quest.xp / 2, questRating.rating, guildData);

    await onComplete({ ...questData, xpReward, goldReward });
    soundManager.play('questComplete');
    triggerConfetti();
    setIsSaving(false);
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'book': return <BookOpen className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'article': return <FileText className="w-4 h-4" />;
      case 'template': return <FileQuestion className="w-4 h-4" />;
      case 'course': return <Lightbulb className="w-4 h-4" />;
      case 'tool': return <Star className="w-4 h-4" />;
      default: return <ExternalLink className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col animate-fadeIn">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Target className="w-6 h-6 text-purple-500" />
            <div>
              <h2 className="text-2xl font-bold">{quest.name}</h2>
              <p className="text-sm text-gray-400">{quest.description} • {quest.xp} XP</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* 4-Panel Grid */}
      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4 p-6 overflow-hidden">
        {/* Top Left - Quest Details */}
        <div className="bg-gray-800 rounded-lg p-6 flex flex-col overflow-hidden">
          <div className="flex items-center mb-4 flex-shrink-0">
            <Target className="w-5 h-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-bold">Quest Details</h3>
          </div>

          <div className="space-y-4 overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Objective</h4>
              <p className="text-gray-300">{quest.description}</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Success Criteria</h4>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Complete all required input fields</li>
                <li>Consult with the AI Sage for guidance (20 gold per consultation)</li>
                <li>Review relevant resources</li>
                <li>Document your approach and decisions</li>
              </ul>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Rewards</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    <span>Base: {quest.xp} XP</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400">Final XP based on AI rating (1-5 stars)</p>
                <p className="text-xs text-yellow-400 mt-1">Complete all quests in this stage to earn 500 gold coins!</p>
              </div>
            </div>

            {rating && (
              <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-4 animate-slideUp">
                <h4 className="font-semibold mb-2 flex items-center">
                  AI Rating: {'⭐'.repeat(rating.rating)}
                </h4>
                <p className="text-sm text-gray-300 mb-2">{rating.feedback}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-green-400">+{calculateXPWithBonuses(quest.xp, rating.rating, quest.attribute || 'general', guildData)} XP</span>
                </div>
                <p className="text-xs text-yellow-400 mt-2">Complete all quests in this stage to earn 500 gold coins!</p>
              </div>
            )}

            {ceoAvatar && (
              <div className={`p-4 rounded-lg bg-gradient-to-r ${ceoAvatar.color} bg-opacity-20`}>
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">{ceoAvatar.avatar}</span>
                  <p className="font-semibold">{ceoAvatar.name}'s Tip</p>
                </div>
                <p className="text-sm italic">"{ceoAvatar.advice}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Right - Dynamic Resources Library (Grimoire) */}
        <div className="bg-gray-800 rounded-lg p-6 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <div className="flex items-center">
              <Library className="w-5 h-5 text-green-500 mr-2" />
              <h3 className="text-lg font-bold">Grimoire</h3>
            </div>
            {!resourcesLoading && (
              <button
                onClick={async () => {
                  setResourcesLoading(true);
                  const resources = await fetchDynamicResources(quest.name, quest.description);
                  setDynamicResources(resources);
                  setResourcesLoading(false);
                }}
                className="text-gray-400 hover:text-white transition-colors"
                title="Refresh resources"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="space-y-3 overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {resourcesLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-500" />
                <p className="text-gray-400">Finding the best resources for you...</p>
              </div>
            ) : dynamicResources.length > 0 ? (
              <>
                {dynamicResources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-all hover:transform hover:scale-105"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl mt-1">{resource.icon}</span>
                        <div className="flex-1">
                          <p className="font-medium">{resource.title}</p>
                          <p className="text-xs text-gray-400 mt-1">{resource.description}</p>
                          <div className="flex items-center space-x-3 mt-2 text-xs">
                            <span className="text-purple-400">{resource.type}</span>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-400">{resource.timeToComplete}</span>
                            <span className="text-gray-500">•</span>
                            <span className={`${resource.difficulty === 'beginner' ? 'text-green-400' :
                              resource.difficulty === 'intermediate' ? 'text-yellow-400' :
                                'text-red-400'
                              }`}>
                              {resource.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>
                  </a>
                ))}

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400 mb-2">Need more help?</p>
                  <div className="space-y-2">
                    <a
                      href="https://www.ycombinator.com/library"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 text-sm flex items-center space-x-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>YC Startup Library</span>
                    </a>
                    <a
                      href="https://firstround.com/review/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 text-sm flex items-center space-x-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>First Round Review</span>
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No resources found. Try refreshing.</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Left - Input Section */}
        <div className="bg-gray-800 rounded-lg p-6 flex flex-col overflow-hidden">
          <div className="flex items-center mb-4 flex-shrink-0">
            <Edit3 className="w-5 h-5 text-yellow-500 mr-2" />
            <h3 className="text-lg font-bold">
              {inputTemplate?.title || 'Quest Input'}
            </h3>
          </div>

          <div className="space-y-4 overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {inputTemplate ? (
              inputTemplate.fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium mb-2">
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={userInputs[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full p-3 bg-gray-700 rounded-lg text-white resize-none h-24"
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={userInputs[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full p-3 bg-gray-700 rounded-lg text-white"
                    >
                      <option value="">Select an option</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={userInputs[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full p-3 bg-gray-700 rounded-lg text-white"
                    />
                  )}
                </div>
              ))
            ) : (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Work
                </label>
                <textarea
                  value={userInputs.general || ''}
                  onChange={(e) => handleInputChange('general', e.target.value)}
                  placeholder="Document your work for this quest..."
                  className="w-full p-3 bg-gray-700 rounded-lg text-white resize-none h-48"
                />
              </div>
            )}

            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => {
                  // Save draft functionality
                  alert('Draft saved!');
                }}
                className="flex-1 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Draft</span>
              </button>
              <button
                onClick={handleCompleteQuest}
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Complete Quest</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Right - AI Sage Chat */}
        <div className="bg-gray-800 rounded-lg p-6 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <div className="flex items-center">
              <Sparkles className="w-5 h-5 text-purple-500 mr-2" />
              <h3 className="text-lg font-bold">AI Sage Consultation</h3>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Coins className="w-4 h-4 text-yellow-500" />
              <span className="font-medium">20 gold per question</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {sageMessages.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Ask the AI Sage for guidance</p>
                <p className="text-sm mt-2">Each consultation costs 20 gold coins</p>
                <p className="text-sm italic mt-2">"How should I approach this quest?"</p>
                <p className="text-sm italic">"What are the key considerations?"</p>
              </div>
            ) : (
              sageMessages.map((message, index) => (
                <div
                  key={index}
                  className={`${message.type === 'user' ? 'text-right' : 'text-left'
                    } animate-slideUp`}
                >
                  <div
                    className={`inline-block max-w-[80%] p-3 rounded-lg ${message.type === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-100'
                      }`}
                  >
                    {message.type === 'sage' ? (
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>
                </div>
              ))
            )}
            {sageLoading && (
              <div className="text-left animate-slideUp">
                <div className="inline-block bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                    <span className="text-sm">The Sage is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-2 flex-shrink-0">
            <input
              type="text"
              value={sageInput}
              onChange={(e) => setSageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSageChat()}
              placeholder="Ask the AI Sage for guidance..."
              className="flex-1 p-3 bg-gray-700 rounded-lg text-white"
              disabled={sageLoading}
            />
            <button
              onClick={handleSageChat}
              disabled={sageLoading || !sageInput.trim() || guildData.gold < 20}
              className="px-4 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              title={guildData.gold < 20 ? 'Not enough gold' : ''}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Armory Component with animations
const ArmoryInterface = ({
  guildData,
  onPurchase,
  onClose
}: {
  guildData: any;
  onPurchase: (item: any, category: string) => void;
  onClose: () => void;
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'gear' | 'consumables' | 'treasures'>('gear');
  const userLevel = calculateLevel(guildData.xp || 0).level;

  const canAfford = (price: number) => (guildData.gold || 0) >= price;
  const canEquip = (levelRequired: number) => userLevel >= levelRequired;
  const isOwned = (itemId: string) => {
    return guildData.inventory?.includes(itemId) ||
      guildData.equippedGear?.includes(itemId) ||
      guildData.treasures?.includes(itemId);
  };

  const handlePurchase = async (item: any, category: string) => {
    if (!canAfford(item.price) || isOwned(item.id)) return;

    await onPurchase(item, category);
    soundManager.play('purchase');
    triggerConfetti({
      particleCount: 50,
      spread: 45,
      origin: { y: 0.8 }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold">The Armory</h2>
            <div className="flex items-center space-x-2 ml-6">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="font-bold">{guildData.gold || 0}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="bg-gray-900/50 px-6 py-3 flex space-x-4 border-b border-gray-700">
          <button
            onClick={() => setSelectedCategory('gear')}
            className={`px-4 py-2 rounded-lg transition-all ${selectedCategory === 'gear'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
          >
            <div className="flex items-center space-x-2">
              <Sword className="w-4 h-4" />
              <span>Gear</span>
            </div>
          </button>
          <button
            onClick={() => setSelectedCategory('consumables')}
            className={`px-4 py-2 rounded-lg transition-all ${selectedCategory === 'consumables'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
          >
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Consumables</span>
            </div>
          </button>
          <button
            onClick={() => setSelectedCategory('treasures')}
            className={`px-4 py-2 rounded-lg transition-all ${selectedCategory === 'treasures'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
          >
            <div className="flex items-center space-x-2">
              <Gem className="w-4 h-4" />
              <span>Treasures</span>
            </div>
          </button>
        </div>

        {/* Items Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ARMORY_ITEMS[selectedCategory].map((item: any) => {
              const owned = isOwned(item.id);
              const affordable = canAfford(item.price);
              const levelMet = canEquip(item.levelRequired || 1);
              const canPurchase = !owned && affordable && levelMet;

              return (
                <div
                  key={item.id}
                  className={`bg-gray-700 rounded-lg p-4 border-2 transition-all ${owned ? 'border-green-500' :
                    canPurchase ? 'border-gray-600 hover:border-purple-500 hover:transform hover:scale-105' :
                      'border-gray-700 opacity-50'
                    }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{item.icon}</span>
                      <div>
                        <h4 className="font-bold">{item.name}</h4>
                        <p className="text-xs text-gray-400">
                          Level {item.levelRequired || 1} Required
                        </p>
                      </div>
                    </div>
                    {owned && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded animate-pulse">
                        Owned
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-300 mb-3">{item.description}</p>

                  {item.stats && (
                    <div className="mb-3 space-y-1">
                      {item.stats.xpBonus && (
                        <p className="text-xs text-purple-400">
                          +{item.stats.xpBonus}% XP Bonus
                        </p>
                      )}
                      {item.stats.goldBonus && (
                        <p className="text-xs text-yellow-400">
                          +{item.stats.goldBonus}% Gold Bonus
                        </p>
                      )}
                    </div>
                  )}

                  {item.requirement && (
                    <p className="text-xs text-orange-400 mb-3">
                      Requires: {item.requirement}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Coins className="w-4 h-4 text-yellow-500" />
                      <span className={affordable || owned ? '' : 'text-red-400'}>
                        {item.price}
                      </span>
                    </div>
                    <button
                      onClick={() => handlePurchase(item, selectedCategory)}
                      disabled={!canPurchase}
                      className={`px-3 py-1 rounded text-sm transition-all ${owned ? 'bg-gray-600 text-gray-400 cursor-not-allowed' :
                        canPurchase
                          ? 'bg-purple-600 hover:bg-purple-700 text-white transform hover:scale-110'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                      {owned ? 'Owned' :
                        !levelMet ? `Level ${item.levelRequired}` :
                          !affordable ? 'Not Enough Gold' :
                            'Purchase'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add custom CSS for animations
const customStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes bounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }

  .animate-slideUp {
    animation: slideUp 0.3s ease-out;
  }

  .animate-bounce {
    animation: bounce 0.5s ease-in-out;
  }
`;

// Main App Component
export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [guildData, setGuildData] = useState<any | null>(null);
  const [selectedQuest, setSelectedQuest] = useState<any | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingAnswers, setOnboardingAnswers] = useState<any>({});
  const [vision, setVision] = useState('');
  const [conversations, setConversations] = useState<any[]>([]);
  const [savedDocuments, setSavedDocuments] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [generatingDoc, setGeneratingDoc] = useState(false);
  const [ceoAvatar, setCeoAvatar] = useState<any | null>(null);
  const [showCEOProfile, setShowCEOProfile] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [guildDataError, setGuildDataError] = useState<string | null>(null);
  const [showArmory, setShowArmory] = useState(false);
  const [showGuildManagement, setShowGuildManagement] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Add custom styles to document
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = customStyles;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auth State Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const hasProfile = await loadGuildData(user.uid);
        if (!hasProfile && navigator.onLine) {
          setShowOnboarding(true);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Load Conversations
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'conversations'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setConversations(convs);
    });

    return unsubscribe;
  }, [user]);

  // Load Saved Documents
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'documents'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSavedDocuments(docs);
    });

    return unsubscribe;
  }, [user]);

  // Load Guild Data
  const loadGuildData = async (userId: string): Promise<boolean> => {
    try {
      setGuildDataError(null);
      const guildRef = doc(db, 'guilds', userId);
      const guildSnap = await getDoc(guildRef);

      if (!guildSnap.exists()) {
        return false;
      } else {
        const data = guildSnap.data();
        setGuildData(data);

        // Set CEO Avatar if exists
        if (data.ceoAvatarId) {
          const avatar = CEO_AVATARS.find(ceo => ceo.id === data.ceoAvatarId);
          setCeoAvatar(avatar);
        }
        return true;
      }
    } catch (error: any) {
      console.error('Error loading guild data:', error);

      if (error?.code === 'unavailable' || error?.message?.includes('offline')) {
        setGuildDataError('You are offline. Unable to load your profile. Please check your internet connection and try again.');
        return false;
      }

      setGuildDataError('An unexpected error occurred while loading your profile. Please try again.');
      return false;
    }
  };

  // Sign In
  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  // Sign Out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setGuildData(null);
      setCeoAvatar(null);
      setShowOnboarding(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Handle Onboarding Answer
  const handleOnboardingAnswer = (questionId: string, answer: any) => {
    setOnboardingAnswers({ ...onboardingAnswers, [questionId]: answer });
  };

  // Complete Onboarding
  const completeOnboarding = async () => {
    if (!user || !vision) return;

    if (!navigator.onLine) {
      alert('You are offline. Please check your internet connection to complete onboarding.');
      return;
    }

    setLoading(true);

    // Calculate CEO match
    const ceoMatch = calculateCEOMatch({ onboardingData: onboardingAnswers });
    const matchedCEO = CEO_AVATARS.find(ceo => ceo.id === ceoMatch);
    setCeoAvatar(matchedCEO);

    // Create initial guild data
    const initialGuildData = {
      guildId: user.uid,
      guildName: onboardingAnswers.guildName || `${user.displayName}'s Guild`,
      vision: vision,
      xp: 50,
      gold: 500, // Starting gold
      level: 1,
      guildLevel: 1,
      achievements: ['onboarding_complete'],
      questProgress: {},
      onboardingData: onboardingAnswers,
      coreAttribute: onboardingAnswers.coreAttribute?.toLowerCase() || 'general',
      avatar: onboardingAnswers.avatar || AVATAR_TEMPLATES[0],
      ceoAvatarId: ceoMatch,
      lastCheckIn: serverTimestamp(),
      checkInStreak: 1,
      dailyStreak: 0,
      lastDailyBonus: null,
      members: [{
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        role: 'leader',
        joinedAt: new Date().toISOString()
      }],
      inventory: [],
      equippedGear: [],
      treasures: [],
      activeEffects: [],
      createdAt: serverTimestamp()
    };

    try {
      await setDoc(doc(db, 'guilds', user.uid), initialGuildData);
      setGuildData(initialGuildData);
      setShowOnboarding(false);
      soundManager.play('levelUp');
      triggerConfetti();
    } catch (error: any) {
      console.error('Error creating guild:', error);
      if (error?.code === 'unavailable' || error?.message?.includes('offline')) {
        alert('Unable to save your profile. Please check your internet connection.');
      } else {
        alert('Error creating profile. Please try again.');
      }
    }

    setLoading(false);
  };

  // Save Conversation
  const saveConversation = async (quest: any, question: string, response: string) => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'conversations'), {
        userId: user.uid,
        questId: quest?.id || 'general',
        questName: quest?.name || 'General Consultation',
        question: question,
        response: response,
        createdAt: serverTimestamp()
      });

      // Check for conversation achievement
      if (conversations.length + 1 >= 20 && !guildData?.achievements?.includes('conversation_pro')) {
        await updateDoc(doc(db, 'guilds', user.uid), {
          achievements: arrayUnion('conversation_pro'),
          xp: increment(50)
        });
      }
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  };

  // Save Document
  const saveDocument = async (template: any, content: string) => {
    if (!user || !guildData) return;

    try {
      await addDoc(collection(db, 'documents'), {
        userId: user.uid,
        templateId: template.id,
        templateName: template.name,
        content: content,
        version: 1,
        createdAt: serverTimestamp()
      });

      // Update XP in database
      await updateDoc(doc(db, 'guilds', user.uid), {
        xp: increment(template.xp)
      });

      // Update local state
      const newXP = (guildData.xp || 0) + template.xp;
      setGuildData({ ...guildData, xp: newXP });

      // Check for document achievement
      if (savedDocuments.length + 1 >= 5 && !guildData.achievements?.includes('document_master')) {
        await updateDoc(doc(db, 'guilds', user.uid), {
          achievements: arrayUnion('document_master'),
          xp: increment(50)
        });
      }
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };

  // Update Gold
  const updateGold = async (amount: number) => {
    if (!user || !guildData) return;

    const newGold = Math.max(0, (guildData.gold || 0) + amount);

    try {
      await updateDoc(doc(db, 'guilds', user.uid), {
        gold: newGold
      });

      setGuildData({ ...guildData, gold: newGold });

      // Check gold hoarder achievement
      if (newGold >= 10000 && !guildData.achievements?.includes('gold_hoarder')) {
        await updateDoc(doc(db, 'guilds', user.uid), {
          achievements: arrayUnion('gold_hoarder'),
          xp: increment(100)
        });
      }
    } catch (error) {
      console.error('Error updating gold:', error);
    }
  };

  // Claim Daily Bonus
  const claimDailyBonus = async () => {
    if (!user || !guildData) return;

    const now = new Date();
    const lastClaim = guildData.lastDailyBonus;
    const lastClaimDate = lastClaim ? new Date(lastClaim) : null;

    if (lastClaimDate && now.toDateString() === lastClaimDate.toDateString()) {
      return; // Already claimed today
    }

    // Calculate streak
    let newStreak = 1;
    if (lastClaimDate) {
      const daysDiff = Math.floor((now.getTime() - lastClaimDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff === 1) {
        newStreak = (guildData.dailyStreak || 0) + 1;
      }
    }

    try {
      await updateDoc(doc(db, 'guilds', user.uid), {
        gold: increment(5),
        lastDailyBonus: now.toISOString(),
        dailyStreak: newStreak
      });

      setGuildData({
        ...guildData,
        gold: (guildData.gold || 0) + 5,
        lastDailyBonus: now.toISOString(),
        dailyStreak: newStreak
      });

      soundManager.play('coinCollect');
      triggerConfetti({
        particleCount: 30,
        spread: 45,
        origin: { y: 0.3 }
      });

      // Check daily champion achievement
      if (newStreak >= 30 && !guildData.achievements?.includes('daily_champion')) {
        await updateDoc(doc(db, 'guilds', user.uid), {
          achievements: arrayUnion('daily_champion'),
          xp: increment(200)
        });
      }
    } catch (error) {
      console.error('Error claiming daily bonus:', error);
    }
  };

  // Complete Quest - Updated with stage completion bonuses
  const completeQuest = async (questData: any) => {
    if (!user || !guildData || !selectedQuest) return;

    if (!navigator.onLine) {
      alert('You are offline. Please check your internet connection and try again.');
      return;
    }

    try {
      const questKey = `${selectedQuest.stageId}_${selectedQuest.id}`;
      const newXP = (guildData.xp || 0) + questData.xpReward;
      // Remove per-quest gold reward
      const newGold = guildData.gold || 0;

      // Save quest data
      const updatedProgress = {
        ...guildData.questProgress,
        [questKey]: {
          completed: true,
          completedAt: questData.completedAt,
          inputs: questData.inputs,
          sageConversation: questData.sageConversation,
          rating: questData.rating,
          feedback: questData.feedback
        }
      };

      // Check for new achievements
      const newAchievements = ACHIEVEMENTS.filter(achievement => {
        if (achievement.xpRequired && newXP >= achievement.xpRequired) {
          return !guildData.achievements?.includes(achievement.id);
        }
        if (achievement.goldRequired && newGold >= achievement.goldRequired) {
          return !guildData.achievements?.includes(achievement.id);
        }
        return false;
      }).map(a => a.id);

      // Check stage completion
      const stage = QUEST_STAGES[selectedQuest.stageId.toUpperCase() as keyof typeof QUEST_STAGES];
      const stageQuests = stage.quests;
      const completedStageQuests = stageQuests.filter(q =>
        updatedProgress[`${selectedQuest.stageId}_${q.id}`]?.completed
      ).length;

      let stageBonus = 0;
      let newGuildLevel = guildData.guildLevel || 1;
      let stageCompleted = false;

      if (completedStageQuests === stageQuests.length) {
        // Stage completed! Award 500 gold bonus
        stageBonus = 500;
        stageCompleted = true;
        soundManager.play('levelUp');
        triggerConfetti({ particleCount: 200, spread: 100 });

        // Add stage completion achievement
        const stageAchievement = `stage_complete_${selectedQuest.stageId}`;
        if (!guildData.achievements?.includes(stageAchievement)) {
          newAchievements.push(stageAchievement);
        }

        // Update guild level
        if (selectedQuest.stageId === 'fundamentals') newGuildLevel = 2;
        else if (selectedQuest.stageId === 'kickoff') newGuildLevel = 3;
        else if (selectedQuest.stageId === 'gtm') newGuildLevel = 4;
        else if (selectedQuest.stageId === 'growth') newGuildLevel = 5;
      }

      // Update database
      await updateDoc(doc(db, 'guilds', user.uid), {
        xp: newXP,
        gold: newGold + stageBonus,
        guildLevel: newGuildLevel,
        [`questProgress.${questKey}`]: updatedProgress[questKey],
        ...(newAchievements.length > 0 ? { achievements: arrayUnion(...newAchievements) } : {})
      });

      // Update local state
      setGuildData({
        ...guildData,
        xp: newXP,
        gold: newGold + stageBonus,
        guildLevel: newGuildLevel,
        questProgress: updatedProgress,
        achievements: [...(guildData.achievements || []), ...newAchievements]
      });

      // Show success notification
      let message = `Quest completed! +${questData.xpReward} XP (${questData.rating}/5 stars)`;
      if (stageBonus > 0) {
        message += `\n\n🎉 Stage Complete! +${stageBonus} Gold bonus!`;
      }
      alert(message);

      // Close modal
      setSelectedQuest(null);

    } catch (error: any) {
      console.error('Error completing quest:', error);
      alert('Error completing quest. Please try again.');
    }
  };

  // Purchase from Armory
  const handleArmoryPurchase = async (item: any, category: string) => {
    if (!user || !guildData) return;

    const newGold = (guildData.gold || 0) - item.price;

    if (newGold < 0) {
      alert('Not enough gold!');
      soundManager.play('error');
      return;
    }

    try {
      const updateData: any = {
        gold: newGold
      };

      // Add to appropriate inventory
      if (category === 'gear') {
        updateData.inventory = arrayUnion(item.id);
        updateData.equippedGear = arrayUnion(item.id); // Auto-equip gear
      } else if (category === 'consumables') {
        updateData.inventory = arrayUnion(item.id);
      } else if (category === 'treasures') {
        updateData.treasures = arrayUnion(item.id);
      }

      // Check gear collector achievement
      const totalPurchases = (guildData.inventory?.length || 0) +
        (guildData.equippedGear?.length || 0) +
        (guildData.treasures?.length || 0) + 1;

      if (totalPurchases >= 5 && !guildData.achievements?.includes('gear_collector')) {
        updateData.achievements = arrayUnion('gear_collector');
        updateData.xp = increment(100);
      }

      await updateDoc(doc(db, 'guilds', user.uid), updateData);

      // Update local state
      setGuildData({
        ...guildData,
        gold: newGold,
        inventory: [...(guildData.inventory || []), item.id],
        ...(category === 'gear' ? { equippedGear: [...(guildData.equippedGear || []), item.id] } : {}),
        ...(category === 'treasures' ? { treasures: [...(guildData.treasures || []), item.id] } : {})
      });

      alert(`Purchased ${item.name} for ${item.price} gold!`);
    } catch (error) {
      console.error('Error purchasing item:', error);
      alert('Error completing purchase. Please try again.');
    }
  };

  // Invite Guild Member
  const handleInviteMember = async (email: string, role: string) => {
    if (!user || !guildData) return;

    try {
      // Send email invitation
      const emailSent = await sendGuildInvitation(
        email,
        role,
        user.displayName || 'A fellow founder',
        guildData.guildName
      );

      if (emailSent) {
        alert(`Invitation sent to ${email} for the ${GUILD_ROLES[role as keyof typeof GUILD_ROLES].name} role!`);
      }

      // Check full guild achievement
      const filledRoles = new Set(guildData.members?.map((m: any) => m.role) || []);
      filledRoles.add(role);

      if (filledRoles.size >= 6 && !guildData.achievements?.includes('guild_master')) {
        await updateDoc(doc(db, 'guilds', user.uid), {
          achievements: arrayUnion('guild_master'),
          xp: increment(200)
        });
      }
    } catch (error) {
      console.error('Error inviting member:', error);
      alert('Error sending invitation. Please try again.');
    }
  };

  // Assign Role to Member
  const handleAssignRole = async (memberId: string, role: string) => {
    if (!user || !guildData) return;

    try {
      const updatedMembers = guildData.members.map((m: any) =>
        m.uid === memberId ? { ...m, role } : m
      );

      await updateDoc(doc(db, 'guilds', user.uid), {
        members: updatedMembers
      });

      setGuildData({ ...guildData, members: updatedMembers });
    } catch (error) {
      console.error('Error assigning role:', error);
      alert('Error assigning role. Please try again.');
    }
  };

  // Generate Document
  const handleGenerateDocument = async (template: any) => {
    setGeneratingDoc(true);
    const content = await generateAIDocument(template, { ...guildData, ceoAvatar });
    await saveDocument(template, content);
    setGeneratingDoc(false);
  };

  // Delete Document
  const deleteDocument = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      await deleteDoc(doc(db, 'documents', docId));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  // Calculate Progress Stats
  const calculateStats = () => {
    if (!guildData) return { totalQuests: 0, completedQuests: 0, completionRate: 0 };

    const totalQuests = 20;
    const completedQuests = Object.keys(guildData.questProgress || {}).filter(
      key => guildData.questProgress[key].completed
    ).length;
    const completionRate = Math.round((completedQuests / totalQuests) * 100);

    return { totalQuests, completedQuests, completionRate };
  };

  // Toggle Sound
  const toggleSound = () => {
    const newState = soundManager.toggle();
    setSoundEnabled(newState);
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">Loading your quest...</div>
      </div>
    );
  }

  // Guild Data Error State
  if (guildDataError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Profile Load Error</h1>
          <p className="text-gray-400 mb-6">{guildDataError}</p>
          <button
            onClick={async () => {
              setLoading(true);
              setGuildDataError(null);
              if (user) await loadGuildData(user.uid);
              setLoading(false);
            }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Sign In Screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl text-center max-w-md animate-fadeIn">
          <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">AI Startup Quest</h1>
          <p className="text-gray-400 mb-6">Begin your epic journey to startup success</p>
          <button
            onClick={handleSignIn}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
          >
            Start Your Quest with Google
          </button>
        </div>
      </div>
    );
  }

  // Onboarding Screen - Simplified to 3 questions
  if (showOnboarding) {
    const currentQuestion = onboardingStep === 0 ? null : ONBOARDING_QUESTIONS[onboardingStep - 1];
    const QuestionIcon = currentQuestion?.icon || Brain;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-2xl w-full animate-slideUp">
          {onboardingStep === 0 ? (
            <>
              <h2 className="text-3xl font-bold text-white mb-4">The Call to Adventure</h2>
              <p className="text-gray-400 mb-6">
                Welcome, brave founder! First, share your vision with the AI Sage.
              </p>
              <textarea
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                placeholder="Describe your startup idea in detail..."
                className="w-full p-4 bg-gray-700 text-white rounded-lg mb-4 h-32 resize-none"
              />
              <button
                onClick={() => setOnboardingStep(1)}
                disabled={!vision}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Profile Setup
              </button>
            </>
          ) : onboardingStep <= ONBOARDING_QUESTIONS.length ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Forge Your Persona</h3>
                <span className="text-gray-400">
                  {onboardingStep} of {ONBOARDING_QUESTIONS.length}
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <QuestionIcon className="w-6 h-6 text-purple-400 mr-3" />
                  <p className="text-lg text-white">{currentQuestion?.question}</p>
                </div>

                {currentQuestion?.type === 'avatar' && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {AVATAR_TEMPLATES.map((avatar) => (
                      <button
                        key={avatar.id}
                        onClick={() => handleOnboardingAnswer(currentQuestion.id, avatar)}
                        className={`p-4 rounded-lg transition-all ${onboardingAnswers[currentQuestion.id]?.id === avatar.id
                          ? 'bg-purple-600 text-white transform scale-105'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                      >
                        <div className="text-3xl mb-2">{avatar.icon}</div>
                        <p className="font-medium">{avatar.name}</p>
                        <p className="text-xs opacity-75">{avatar.outfit}</p>
                      </button>
                    ))}
                  </div>
                )}

                {currentQuestion?.type === 'select' && (
                  <div className="grid grid-cols-2 gap-3">
                    {currentQuestion.options?.map((option: string) => (
                      <button
                        key={option}
                        onClick={() => handleOnboardingAnswer(currentQuestion.id, option)}
                        className={`p-3 rounded-lg transition-all ${onboardingAnswers[currentQuestion.id] === option
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                {currentQuestion?.type === 'text' && (
                  <input
                    type="text"
                    value={onboardingAnswers[currentQuestion.id] || ''}
                    onChange={(e) => handleOnboardingAnswer(currentQuestion.id, e.target.value)}
                    placeholder={currentQuestion.placeholder}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg"
                  />
                )}
              </div>

              <div className="flex space-x-4">
                {onboardingStep > 1 && (
                  <button
                    onClick={() => setOnboardingStep(onboardingStep - 1)}
                    className="flex-1 bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all"
                  >
                    Previous
                  </button>
                )}
                <button
                  onClick={() => {
                    if (onboardingStep < ONBOARDING_QUESTIONS.length) {
                      setOnboardingStep(onboardingStep + 1);
                    } else {
                      completeOnboarding();
                    }
                  }}
                  disabled={!onboardingAnswers[currentQuestion?.id || '']}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {onboardingStep < ONBOARDING_QUESTIONS.length ? 'Next' : 'Complete Profile'}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Creating Your Guild...</h3>
              <div className="animate-pulse text-6xl mb-4">🔮</div>
              <p className="text-gray-400">The AI Sage is preparing your journey...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const levelInfo = calculateLevel(guildData?.xp || 0);
  const stats = calculateStats();
  const guildLevel = GUILD_LEVELS[guildData?.guildLevel as keyof typeof GUILD_LEVELS] || GUILD_LEVELS[1];

  // Quest Stages with attributes
  const QUEST_STAGES = {
    FUNDAMENTALS: {
      id: 'fundamentals',
      name: 'Training Grounds',
      description: 'Master the basics of your startup journey',
      icon: Shield,
      color: 'bg-green-500',
      quests: [
        { id: 'vision', name: 'Define Your Vision', xp: 100, description: 'Crystallize your startup idea', attribute: 'marketing' },
        { id: 'problem', name: 'Identify the Problem', xp: 150, description: 'Validate the problem', attribute: 'marketing' },
        { id: 'solution', name: 'Craft Your Solution', xp: 150, description: 'Design your approach', attribute: 'tech' },
        { id: 'market', name: 'Scout the Territory', xp: 200, description: 'Research your market', attribute: 'marketing' },
        { id: 'legal', name: 'Forge the Legal Shield', xp: 100, description: 'Set up foundations', attribute: 'legal' }
      ]
    },
    KICKOFF: {
      id: 'kickoff',
      name: 'Kickoff City',
      description: 'Launch your startup into the world',
      icon: Rocket,
      color: 'bg-blue-500',
      quests: [
        { id: 'mvp', name: 'Build Your MVP', xp: 300, description: 'Create your MVP', attribute: 'tech' },
        { id: 'team', name: 'Assemble Your Guild', xp: 200, description: 'Recruit team members', attribute: 'operations' },
        { id: 'pitch', name: 'Craft Battle Cry', xp: 150, description: 'Perfect your pitch', attribute: 'sales' },
        { id: 'firstusers', name: 'First Adventurers', xp: 250, description: 'Get first 10 users', attribute: 'marketing' },
        { id: 'feedback', name: 'Listen to the Realm', xp: 200, description: 'Gather feedback', attribute: 'marketing' }
      ]
    },
    GTM: {
      id: 'gtm',
      name: 'Go-to-Market Plains',
      description: 'Conquer the market with your strategy',
      icon: Target,
      color: 'bg-purple-500',
      quests: [
        { id: 'marketing', name: 'Marketing Magic', xp: 250, description: 'Develop marketing', attribute: 'marketing' },
        { id: 'sales', name: 'Sales Swordplay', xp: 250, description: 'Build sales process', attribute: 'sales' },
        { id: 'channels', name: 'Distribution Paths', xp: 200, description: 'Establish channels', attribute: 'operations' },
        { id: 'pricing', name: 'Value Alchemy', xp: 150, description: 'Perfect pricing', attribute: 'finance' },
        { id: 'metrics', name: 'Crystal Ball KPIs', xp: 200, description: 'Set up metrics', attribute: 'finance' }
      ]
    },
    GROWTH: {
      id: 'growth',
      name: 'Growth Mountains',
      description: 'Scale your empire to new heights',
      icon: TrendingUp,
      color: 'bg-orange-500',
      quests: [
        { id: 'funding', name: 'Treasure Hunt', xp: 400, description: 'Secure funding', attribute: 'finance' },
        { id: 'scaling', name: 'Empire Expansion', xp: 350, description: 'Scale operations', attribute: 'operations' },
        { id: 'culture', name: 'Kingdom Culture', xp: 200, description: 'Build culture', attribute: 'operations' },
        { id: 'partnerships', name: 'Form Alliances', xp: 300, description: 'Strategic partnerships', attribute: 'sales' },
        { id: 'exit', name: 'The Grand Victory', xp: 500, description: 'Plan exit strategy', attribute: 'finance' }
      ]
    }
  };

  // Main Quest Map
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Crown className="w-8 h-8 text-yellow-500" />
            <h1 className="text-2xl font-bold">AI Startup Quest</h1>
            {!isOnline && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-orange-900/50 rounded-lg text-orange-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Offline</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-6">
            {/* CEO Avatar Display */}
            {ceoAvatar && (
              <button
                onClick={() => setShowCEOProfile(true)}
                className={`flex items-center space-x-2 px-3 py-1 rounded-lg bg-gradient-to-r ${ceoAvatar.color} opacity-80 hover:opacity-100 transition-all`}
              >
                <span className="text-2xl">{ceoAvatar.avatar}</span>
                <span className="text-sm font-medium">{ceoAvatar.name}</span>
              </button>
            )}

            <div className="text-right">
              <p className="text-sm text-gray-400">Level {levelInfo.level} Founder</p>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                    style={{ width: `${levelInfo.progress}%` }}
                  />
                </div>
                <span className="text-sm">{guildData?.xp || 0} XP</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleSound}
                className="text-gray-400 hover:text-white"
                title={soundEnabled ? "Mute sounds" : "Unmute sounds"}
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setShowDashboard(true)}
                className="text-gray-400 hover:text-white"
                title="Progress Dashboard"
              >
                <BarChart3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowHistory(true)}
                className="text-gray-400 hover:text-white"
                title="Conversation History"
              >
                <History className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowDocuments(true)}
                className="text-gray-400 hover:text-white"
                title="Saved Documents"
              >
                <FileText className="w-5 h-5" />
              </button>
              <button
                onClick={handleSignOut}
                className="text-gray-400 hover:text-white"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Guild Info Bar */}
      <div className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {guildData?.avatar && (
              <span className="text-3xl">{guildData.avatar.icon}</span>
            )}
            <Users className="w-5 h-5 text-blue-400" />
            <span>{guildData?.guildName}</span>
            <span className="text-sm text-gray-400">Vision: {guildData?.vision}</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowGuildManagement(true)}
              className="flex items-center space-x-2 px-3 py-1 bg-blue-700 rounded-lg text-sm hover:bg-blue-600 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Guild Members</span>
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{guildLevel.icon}</span>
              <span className="text-sm font-medium">{guildLevel.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="font-bold">{guildData?.gold || 0}</span>
              <button
                onClick={() => setShowArmory(true)}
                className="px-3 py-1 bg-yellow-700 rounded-lg text-sm hover:bg-yellow-600 transition-all ml-2"
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              {guildData?.achievements?.slice(0, 5).map((achievementId: string) => {
                const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
                return achievement ? (
                  <span key={achievementId} className="text-2xl" title={achievement.name}>
                    {achievement.icon}
                  </span>
                ) : null;
              })}
              {guildData?.achievements?.length > 5 && (
                <span className="text-sm text-gray-400">+{guildData.achievements.length - 5}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Bonus Bar */}
      <div className="bg-gray-800/30 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <DailyBonus guildData={guildData} onClaim={claimDailyBonus} />
        </div>
      </div>

      {/* Document Generation Bar */}
      <div className="bg-gray-800/30 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium">AI Document Generation</span>
            </div>
            <div className="flex items-center space-x-2 flex-wrap">
              {DOCUMENT_TEMPLATES.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleGenerateDocument(template)}
                  disabled={generatingDoc}
                  className="px-3 py-1 bg-gray-700 rounded-lg text-sm hover:bg-gray-600 transition-all disabled:opacity-50"
                  title={`Generate ${template.name} (+${template.xp} XP)`}
                >
                  {template.icon} {template.name}
                </button>
              ))}
            </div>
          </div>
          {generatingDoc && (
            <div className="mt-2 text-center text-sm text-purple-400 animate-pulse">
              Generating document...
            </div>
          )}
        </div>
      </div>

      {/* Quest Map */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {Object.values(QUEST_STAGES).map((stage) => {
            const StageIcon = stage.icon;
            const isLocked = stage.id !== 'fundamentals' && guildData?.guildLevel <
              (stage.id === 'kickoff' ? 2 : stage.id === 'gtm' ? 3 : stage.id === 'growth' ? 4 : 5);

            return (
              <div
                key={stage.id}
                className={`bg-gray-800 rounded-lg p-6 shadow-xl ${isLocked ? 'opacity-50' : ''} animate-fadeIn`}
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${stage.color} bg-opacity-20 mr-4`}>
                    <StageIcon className={`w-8 h-8 ${stage.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{stage.name}</h3>
                    <p className="text-sm text-gray-400">{stage.description}</p>
                    {isLocked && (
                      <p className="text-xs text-orange-400 mt-1">Unlock by completing previous stages</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {stage.quests.map((quest) => {
                    const questKey = `${stage.id}_${quest.id}`;
                    const isCompleted = guildData?.questProgress?.[questKey]?.completed;

                    return (
                      <div
                        key={quest.id}
                        onClick={() => !isLocked && setSelectedQuest({ ...quest, stageId: stage.id })}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${isLocked
                          ? 'bg-gray-700/50 cursor-not-allowed'
                          : isCompleted
                            ? 'bg-green-900/30 border border-green-700 hover:bg-green-900/40'
                            : 'bg-gray-700 hover:bg-gray-600 hover:transform hover:scale-105'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <Target className="w-5 h-5 text-gray-400" />
                            )}
                            <div>
                              <p className="font-medium">{quest.name}</p>
                              <div className="flex items-center space-x-3 text-sm">
                                <span className="text-gray-400">{quest.xp} XP</span>
                                <span className="text-gray-500">•</span>
                                <span className={CORE_ATTRIBUTES[quest.attribute as keyof typeof CORE_ATTRIBUTES]?.color || 'text-gray-400'}>
                                  {CORE_ATTRIBUTES[quest.attribute as keyof typeof CORE_ATTRIBUTES]?.name || 'General'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* 4-Panel Quest Interface */}
        {selectedQuest && (
          <FourPanelQuestInterface
            quest={selectedQuest}
            guildData={guildData}
            ceoAvatar={ceoAvatar}
            onComplete={completeQuest}
            onClose={() => setSelectedQuest(null)}
            saveConversation={saveConversation}
            updateGold={updateGold}
          />
        )}

        {/* Guild Management */}
        {showGuildManagement && (
          <GuildManagement
            guildData={guildData}
            onInviteMember={handleInviteMember}
            onAssignRole={handleAssignRole}
            onClose={() => setShowGuildManagement(false)}
          />
        )}

        {/* Armory Interface */}
        {showArmory && (
          <ArmoryInterface
            guildData={guildData}
            onPurchase={handleArmoryPurchase}
            onClose={() => setShowArmory(false)}
          />
        )}

        {/* Progress Dashboard Modal */}
        <Modal open={showDashboard} onClose={() => setShowDashboard(false)}>
          <div className="p-6 max-w-4xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">Progress Dashboard</h3>
              <button
                onClick={() => setShowDashboard(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Total XP</p>
                <p className="text-2xl font-bold text-purple-400">{guildData?.xp || 0}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Gold</p>
                <p className="text-2xl font-bold text-yellow-400">{guildData?.gold || 0}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Quests Completed</p>
                <p className="text-2xl font-bold text-green-400">{stats.completedQuests}/{stats.totalQuests}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Guild Level</p>
                <p className="text-2xl font-bold text-blue-400">{guildLevel.name}</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-bold mb-3">Your Journey Stats</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Documents Generated</p>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${Math.min(savedDocuments.length * 20, 100)}%` }}></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">AI Consultations</p>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(conversations.length * 5, 100)}%` }}></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Daily Streak</p>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${Math.min((guildData?.dailyStreak || 0) * 3.33, 100)}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{guildData?.dailyStreak || 0} days</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-bold mb-3">Attribute Progress</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(CORE_ATTRIBUTES).map(([key, attr]) => {
                  const AttributeIcon = attr.icon;
                  const attrXP = Object.entries(guildData?.questProgress || {})
                    .filter(([_, data]: any) => data.completed)
                    .reduce((sum, [questKey]: any) => {
                      const quest = Object.values(QUEST_STAGES)
                        .flatMap(stage => stage.quests)
                        .find(q => questKey.includes(q.id));
                      return quest?.attribute === key ? sum + quest.xp : sum;
                    }, 0);

                  return (
                    <div key={key} className="bg-gray-700 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <AttributeIcon className={`w-4 h-4 ${attr.color}`} />
                        <span className="text-sm font-medium">{attr.name}</span>
                      </div>
                      <p className="text-lg font-bold">{attrXP} XP</p>
                      {guildData?.coreAttribute === key && (
                        <span className="text-xs text-purple-400">Core Attribute (+50% XP)</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-3">All Achievements</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {ACHIEVEMENTS.map((achievement) => {
                  const earned = guildData?.achievements?.includes(achievement.id);
                  return (
                    <div
                      key={achievement.id}
                      className={`bg-gray-700 rounded-lg p-3 text-center ${earned ? 'ring-2 ring-yellow-500' : 'opacity-50'
                        }`}
                    >
                      <div className="text-3xl mb-1">{achievement.icon}</div>
                      <p className="text-xs font-medium">{achievement.name}</p>
                      <p className="text-xs text-gray-400 mt-1">{achievement.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Modal>

        {/* Resources Modal */}
        <Modal open={showResources} onClose={() => setShowResources(false)}>
          <div className="p-6 max-w-4xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">Startup Resources Hub</h3>
              <button
                onClick={() => setShowResources(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-400">Based on your profile:</p>
                  <p className="text-sm text-gray-300">
                    Core Strength: {guildData?.coreAttribute} •
                    Level: {levelInfo.level}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-3 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                  Essential Reading
                </h4>
                <div className="space-y-2">
                  <a href="https://www.ycombinator.com/library" target="_blank" rel="noopener noreferrer"
                    className="block bg-gray-700 rounded p-3 hover:bg-gray-600 transition-all">
                    <p className="font-medium">YC Startup Library</p>
                    <p className="text-xs text-gray-400">Curated startup knowledge</p>
                  </a>
                  <a href="https://firstround.com/review/" target="_blank" rel="noopener noreferrer"
                    className="block bg-gray-700 rounded p-3 hover:bg-gray-600 transition-all">
                    <p className="font-medium">First Round Review</p>
                    <p className="text-xs text-gray-400">Insights from top founders</p>
                  </a>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-3 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                  Tools & Templates
                </h4>
                <div className="space-y-2">
                  <a href="https://stripe.com/atlas" target="_blank" rel="noopener noreferrer"
                    className="block bg-gray-700 rounded p-3 hover:bg-gray-600 transition-all">
                    <p className="font-medium">Stripe Atlas</p>
                    <p className="text-xs text-gray-400">Start your company</p>
                  </a>
                  <a href="https://www.notion.so/templates" target="_blank" rel="noopener noreferrer"
                    className="block bg-gray-700 rounded p-3 hover:bg-gray-600 transition-all">
                    <p className="font-medium">Notion Templates</p>
                    <p className="text-xs text-gray-400">Startup documents</p>
                  </a>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-3 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-500" />
                  Communities
                </h4>
                <div className="space-y-2">
                  <a href="https://www.indiehackers.com/" target="_blank" rel="noopener noreferrer"
                    className="block bg-gray-700 rounded p-3 hover:bg-gray-600 transition-all">
                    <p className="font-medium">Indie Hackers</p>
                    <p className="text-xs text-gray-400">Founder community</p>
                  </a>
                  <a href="https://news.ycombinator.com/" target="_blank" rel="noopener noreferrer"
                    className="block bg-gray-700 rounded p-3 hover:bg-gray-600 transition-all">
                    <p className="font-medium">Hacker News</p>
                    <p className="text-xs text-gray-400">Tech & startup news</p>
                  </a>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-3 flex items-center">
                  <Video className="w-5 h-5 mr-2 text-purple-500" />
                  Learning
                </h4>
                <div className="space-y-2">
                  <a href="https://www.startupschool.org/" target="_blank" rel="noopener noreferrer"
                    className="block bg-gray-700 rounded p-3 hover:bg-gray-600 transition-all">
                    <p className="font-medium">Startup School</p>
                    <p className="text-xs text-gray-400">Free YC course</p>
                  </a>
                  <a href="https://www.coursera.org/browse/business/entrepreneurship" target="_blank" rel="noopener noreferrer"
                    className="block bg-gray-700 rounded p-3 hover:bg-gray-600 transition-all">
                    <p className="font-medium">Coursera</p>
                    <p className="text-xs text-gray-400">Entrepreneurship courses</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Modal>

        {/* CEO Profile Modal */}
        <Modal open={showCEOProfile && ceoAvatar} onClose={() => setShowCEOProfile(false)}>
          <div className="p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">Your CEO Guide</h3>
              <button
                onClick={() => setShowCEOProfile(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className={`text-center mb-6 p-6 rounded-lg bg-gradient-to-r ${ceoAvatar?.color} bg-opacity-20`}>
              <div className="text-6xl mb-2">{ceoAvatar?.avatar}</div>
              <h4 className="text-xl font-bold">{ceoAvatar?.name}</h4>
              <p className="text-sm text-gray-300">{ceoAvatar?.title}</p>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400 mb-1">Industries</p>
                <div className="flex flex-wrap gap-2">
                  {ceoAvatar?.industries.map((ind: string) => (
                    <span key={ind} className="px-2 py-1 bg-gray-700 rounded text-sm">
                      {ind}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">Key Traits</p>
                <div className="flex flex-wrap gap-2">
                  {ceoAvatar?.traits.map((trait: string) => (
                    <span key={trait} className="px-2 py-1 bg-gray-700 rounded text-sm">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-700">
                <p className="text-sm text-gray-400 mb-1">Guiding Philosophy</p>
                <p className="italic">"{ceoAvatar?.advice}"</p>
              </div>
            </div>
          </div>
        </Modal>

        {/* Conversation History Modal */}
        <Modal open={showHistory} onClose={() => setShowHistory(false)}>
          <div className="p-6 max-w-4xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">Conversation History</h3>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {conversations.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No conversations yet</p>
            ) : (
              <div className="space-y-4">
                {conversations.map((conv) => (
                  <div key={conv.id} className="bg-gray-700 rounded-lg p-4 animate-fadeIn">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-purple-400">{conv.questName}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(conv.createdAt?.toDate()).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <User className="w-4 h-4 text-blue-400 mt-1" />
                        <p className="text-sm">{conv.question}</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Sparkles className="w-4 h-4 text-purple-400 mt-1" />
                        <ReactMarkdown className="text-sm">
                          {conv.response}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>

        {/* Documents Modal */}
        <Modal open={showDocuments} onClose={() => setShowDocuments(false)}>
          <div className="p-6 max-w-4xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">Saved Documents</h3>
              <button
                onClick={() => setShowDocuments(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {savedDocuments.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No documents yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedDocuments.map((doc) => {
                  const template = DOCUMENT_TEMPLATES.find(t => t.id === doc.templateId);
                  return (
                    <div key={doc.id} className="bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 animate-fadeIn"
                      onClick={() => setSelectedDocument(doc)}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{template?.icon || '📄'}</span>
                          <p className="font-medium">{doc.templateName}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteDocument(doc.id);
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-400">
                        Version {doc.version} • {new Date(doc.createdAt?.toDate()).toLocaleDateString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Modal>

        {/* Document View Modal */}
        <Modal open={!!selectedDocument} onClose={() => setSelectedDocument(null)}>
          <div className="p-6 max-w-4xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">{selectedDocument?.templateName}</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedDocument?.content || '');
                    alert('Copied to clipboard!');
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <ReactMarkdown>
                {selectedDocument?.content}
              </ReactMarkdown>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
}