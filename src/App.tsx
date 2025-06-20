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
  Trophy,
  AlertCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Modal from './components/Modal';

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
    // Multiple tabs open, persistence can only be enabled in one tab at a time.
    console.log('Persistence failed: Multiple tabs open');
  } else if (err.code === 'unimplemented') {
    // The current browser doesn't support persistence
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

// Onboarding Questions
const ONBOARDING_QUESTIONS = [
  {
    id: 'industry',
    question: 'What industry is your startup in?',
    type: 'select',
    options: ['Tech', 'Healthcare', 'Fintech', 'E-commerce', 'SaaS', 'Consumer Goods', 'Education', 'Real Estate', 'Other'],
    icon: Briefcase,
    category: 'business'
  },
  {
    id: 'stage',
    question: 'What stage is your startup at?',
    type: 'select',
    options: ['Idea Stage', 'Building MVP', 'Launched MVP', 'Getting First Customers', 'Scaling', 'Series A+'],
    icon: TrendingUp,
    category: 'business'
  },
  {
    id: 'fundingStatus',
    question: 'What\'s your current funding situation?',
    type: 'select',
    options: ['Bootstrapping', 'Friends & Family', 'Angel Investment', 'Seed Round', 'Series A', 'Series B+'],
    icon: DollarSign,
    category: 'business'
  },
  {
    id: 'teamSize',
    question: 'How many people are on your team?',
    type: 'select',
    options: ['Just me', '2-5', '6-10', '11-25', '26-50', '50+'],
    icon: Users,
    category: 'business'
  },
  {
    id: 'technicalBackground',
    question: 'Rate your technical/coding skills (1-10)',
    type: 'slider',
    min: 1,
    max: 10,
    icon: Code,
    category: 'personal'
  },
  {
    id: 'businessBackground',
    question: 'Rate your business/sales experience (1-10)',
    type: 'slider',
    min: 1,
    max: 10,
    icon: Briefcase,
    category: 'personal'
  },
  {
    id: 'previousStartup',
    question: 'Have you founded a startup before?',
    type: 'select',
    options: ['No, first time', 'Yes, 1 previous', 'Yes, 2-3 previous', 'Yes, 4+ previous'],
    icon: Star,
    category: 'personal'
  },
  {
    id: 'biggestChallenge',
    question: 'What\'s your biggest challenge right now?',
    type: 'select',
    options: ['Finding Product-Market Fit', 'Getting Customers', 'Raising Funding', 'Building Team', 'Technical Development', 'Marketing & Sales'],
    icon: Target,
    category: 'challenges'
  },
  {
    id: 'timeCommitment',
    question: 'How much time can you dedicate weekly?',
    type: 'select',
    options: ['Part-time (<20 hrs)', 'Half-time (20-40 hrs)', 'Full-time (40-60 hrs)', 'All-in (60+ hrs)'],
    icon: Calendar,
    category: 'personal'
  },
  {
    id: 'motivation',
    question: 'What drives you as a founder?',
    type: 'multiselect',
    options: ['Solving Problems', 'Financial Freedom', 'Making Impact', 'Building Cool Tech', 'Being My Own Boss', 'Creating Jobs'],
    icon: Heart,
    category: 'personal'
  },
  {
    id: 'riskTolerance',
    question: 'Rate your risk tolerance (1-10)',
    type: 'slider',
    min: 1,
    max: 10,
    icon: Shield,
    category: 'personal'
  },
  {
    id: 'learningStyle',
    question: 'How do you prefer to learn?',
    type: 'select',
    options: ['Reading Articles', 'Video Tutorials', 'Hands-on Practice', 'Mentorship', 'Peer Learning'],
    icon: Brain,
    category: 'personal'
  },
  {
    id: 'networkStrength',
    question: 'How would you rate your professional network?',
    type: 'slider',
    min: 1,
    max: 10,
    icon: Users,
    category: 'resources'
  },
  {
    id: 'location',
    question: 'Where are you building your startup?',
    type: 'text',
    placeholder: 'City, Country',
    icon: MapPin,
    category: 'business'
  },
  {
    id: 'targetMarket',
    question: 'Who is your primary target customer?',
    type: 'select',
    options: ['B2C - Consumers', 'B2B - Small Business', 'B2B - Enterprise', 'B2B2C', 'B2G - Government', 'Mixed'],
    icon: Target,
    category: 'business'
  },
  {
    id: 'revenue',
    question: 'What\'s your current monthly revenue?',
    type: 'select',
    options: ['$0', '$1-1k', '$1k-10k', '$10k-50k', '$50k-100k', '$100k+'],
    icon: DollarSign,
    category: 'business'
  },
  {
    id: 'runway',
    question: 'How many months of runway do you have?',
    type: 'select',
    options: ['<3 months', '3-6 months', '6-12 months', '12-18 months', '18+ months', 'Profitable'],
    icon: Calendar,
    category: 'resources'
  },
  {
    id: 'mentorAccess',
    question: 'Do you have access to mentors/advisors?',
    type: 'select',
    options: ['No mentors yet', '1-2 informal advisors', '3-5 advisors', 'Formal advisory board', 'Accelerator/Incubator'],
    icon: Users,
    category: 'resources'
  },
  {
    id: 'workStyle',
    question: 'How do you prefer to work?',
    type: 'select',
    options: ['Solo Focus', 'Small Team Collaboration', 'Large Team Energy', 'Remote Async', 'In-Person Office'],
    icon: Briefcase,
    category: 'personal'
  },
  {
    id: 'exitGoal',
    question: 'What\'s your long-term goal?',
    type: 'select',
    options: ['Build & Sell (Exit)', 'IPO', 'Lifestyle Business', 'Impact First', 'Not Sure Yet'],
    icon: Rocket,
    category: 'business'
  }
];

// Achievement Badges
const ACHIEVEMENTS = [
  { id: 'first_quest', name: 'First Steps', icon: '👣', description: 'Complete your first quest', xpRequired: 100 },
  { id: 'onboarding_complete', name: 'Well Prepared', icon: '📋', description: 'Complete detailed onboarding', xpRequired: 50 },
  { id: 'ceo_matched', name: 'Found Your Guide', icon: '🧭', description: 'Get matched with a CEO avatar', xpRequired: 75 },
  { id: 'first_sage_chat', name: 'Wisdom Seeker', icon: '🔮', description: 'Have your first AI Sage consultation', xpRequired: 150 },
  { id: 'mvp_launched', name: 'MVP Champion', icon: '🚀', description: 'Launch your MVP', xpRequired: 1000 },
  { id: 'first_customers', name: 'People\'s Choice', icon: '👥', description: 'Get your first 10 customers', xpRequired: 1500 },
  { id: 'document_master', name: 'Scroll Keeper', icon: '📜', description: 'Generate 5 AI documents', xpRequired: 500 },
  { id: 'conversation_pro', name: 'Sage Confidant', icon: '💬', description: 'Have 20 AI consultations', xpRequired: 800 },
  { id: 'funded', name: 'Treasure Secured', icon: '💰', description: 'Secure funding', xpRequired: 3000 },
  { id: 'scaling', name: 'Empire Builder', icon: '🏰', description: 'Start scaling operations', xpRequired: 5000 },
  { id: 'roadmap_created', name: 'Path Finder', icon: '🗺️', description: 'Generate your personalized roadmap', xpRequired: 100 },
  { id: 'week_streak', name: 'Consistent Warrior', icon: '🔥', description: 'Check in for 7 days straight', xpRequired: 200 }
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

// Resource Recommendations
const RESOURCE_RECOMMENDATIONS = {
  'Finding Product-Market Fit': [
    { title: 'The Mom Test', type: 'book', icon: '📚', link: '#' },
    { title: 'Y Combinator PMF Guide', type: 'article', icon: '📄', link: '#' },
    { title: 'Customer Discovery Workshop', type: 'course', icon: '🎓', link: '#' }
  ],
  'Getting Customers': [
    { title: 'Traction by Gabriel Weinberg', type: 'book', icon: '📚', link: '#' },
    { title: '19 Channels for Customer Acquisition', type: 'article', icon: '📄', link: '#' },
    { title: 'Growth Hacking Course', type: 'course', icon: '🎓', link: '#' }
  ],
  'Raising Funding': [
    { title: 'Venture Deals', type: 'book', icon: '📚', link: '#' },
    { title: 'How to Build a Pitch Deck', type: 'article', icon: '📄', link: '#' },
    { title: 'Fundraising Bootcamp', type: 'course', icon: '🎓', link: '#' }
  ]
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
  const scores = CEO_AVATARS.map(ceo => {
    let score = 0;
    let factors = 0;

    // Industry match
    if (ceo.industries.some(ind =>
      userData.onboardingData?.industry?.toLowerCase().includes(ind)
    )) {
      score += 20;
      factors++;
    }

    // Trait matching based on user responses
    if (userData.onboardingData?.riskTolerance >= 7 && ceo.traits.includes('risk-taker')) {
      score += 15;
      factors++;
    }
    if (userData.onboardingData?.technicalBackground >= 7 && ceo.traits.includes('technical')) {
      score += 15;
      factors++;
    }
    if (userData.onboardingData?.motivation?.includes('Making Impact') && ceo.traits.includes('mission-driven')) {
      score += 15;
      factors++;
    }

    return { ceo, score: factors > 0 ? score / factors : 0 };
  });

  // Sort by score and return best match
  scores.sort((a, b) => b.score - a.score);
  return scores[0].ceo.id;
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

// Generate AI Document
const generateAIDocument = async (template: any, userData: any) => {
  const context = `
    Startup Vision: ${userData.vision}
    Industry: ${userData.onboardingData?.industry}
    Stage: ${userData.onboardingData?.stage}
    Team Size: ${userData.onboardingData?.teamSize}
    Target Market: ${userData.onboardingData?.targetMarket}
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

// Generate Personalized Roadmap
const generatePersonalizedRoadmap = async (userData: any) => {
  const context = `
    Vision: ${userData.vision}
    Industry: ${userData.onboardingData?.industry}
    Stage: ${userData.onboardingData?.stage}
    Biggest Challenge: ${userData.onboardingData?.biggestChallenge}
    Team Size: ${userData.onboardingData?.teamSize}
    Funding: ${userData.onboardingData?.fundingStatus}
  `;

  const roadmapPrompt = `Based on this startup profile, create a personalized 90-day roadmap with specific milestones, tasks, and success metrics. Format it as a structured plan with weeks and key objectives.`;

  return consultAISage(context, roadmapPrompt, userData);
};

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
  const [sageResponse, setSageResponse] = useState('');
  const [questChat, setQuestChat] = useState('');
  const [conversations, setConversations] = useState<any[]>([]);
  const [savedDocuments, setSavedDocuments] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [generatingDoc, setGeneratingDoc] = useState(false);
  const [ceoAvatar, setCeoAvatar] = useState<any | null>(null);
  const [showCEOProfile, setShowCEOProfile] = useState(false);
  const [sageLoading, setSageLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [roadmapContent, setRoadmapContent] = useState('');
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [completingQuest, setCompletingQuest] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [guildDataError, setGuildDataError] = useState<string | null>(null);

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
      setGuildDataError(null); // Reset error before loading
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

      // If offline error, set error state and do not retry infinitely
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

    // Check if online
    if (!navigator.onLine) {
      alert('You are offline. Please check your internet connection to complete onboarding.');
      return;
    }

    setLoading(true);

    // Calculate CEO match
    const ceoMatch = calculateCEOMatch({ onboardingData: onboardingAnswers });
    const matchedCEO = CEO_AVATARS.find(ceo => ceo.id === ceoMatch);
    setCeoAvatar(matchedCEO);

    // Get AI customization
    const sageAdvice = await consultAISage(
      "New founder starting their journey",
      `My startup vision is: ${vision}. Based on my profile, what are the key challenges I should focus on first?`,
      { ceoAvatar: matchedCEO, onboardingData: onboardingAnswers }
    );

    setSageResponse(sageAdvice);

    // Create initial guild data
    const initialGuildData = {
      guildId: user.uid,
      guildName: `${user.displayName}'s Guild`,
      vision: vision,
      xp: 125, // Bonus XP for completing onboarding + CEO match
      level: 1,
      achievements: ['onboarding_complete', 'ceo_matched'],
      questProgress: {},
      onboardingData: onboardingAnswers,
      ceoAvatarId: ceoMatch,
      lastCheckIn: serverTimestamp(),
      checkInStreak: 1,
      members: [{
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        role: 'leader',
        joinedAt: new Date().toISOString()
      }],
      createdAt: serverTimestamp()
    };

    try {
      await setDoc(doc(db, 'guilds', user.uid), initialGuildData);
      setGuildData(initialGuildData);
      setShowOnboarding(false);
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

  // Complete Quest - FIXED VERSION
  const completeQuest = async () => {
    if (!user || !guildData || !selectedQuest || completingQuest) return;

    // Check if online
    if (!navigator.onLine) {
      alert('You are offline. Please check your internet connection and try again.');
      return;
    }

    setCompletingQuest(true);

    try {
      const questKey = `${selectedQuest.stageId}_${selectedQuest.id}`;
      const newXP = (guildData.xp || 0) + selectedQuest.xp;

      // Save AI response if exists
      if (sageResponse && questChat) {
        await saveConversation(selectedQuest, questChat, sageResponse);
      }

      // Update quest progress in database
      const updatedProgress = {
        ...guildData.questProgress,
        [questKey]: {
          completed: true,
          completedAt: new Date().toISOString(),
          sageResponse: sageResponse || null
        }
      };

      // Check for new achievements
      const newAchievements = ACHIEVEMENTS.filter(
        achievement => newXP >= achievement.xpRequired &&
          !guildData.achievements?.includes(achievement.id)
      ).map(a => a.id);

      // Update database
      await updateDoc(doc(db, 'guilds', user.uid), {
        xp: newXP,
        [`questProgress.${questKey}`]: {
          completed: true,
          completedAt: new Date().toISOString(),
          sageResponse: sageResponse || null
        },
        ...(newAchievements.length > 0 ? { achievements: arrayUnion(...newAchievements) } : {})
      });

      // Update local state immediately
      setGuildData({
        ...guildData,
        xp: newXP,
        questProgress: updatedProgress,
        achievements: [...(guildData.achievements || []), ...newAchievements]
      });

      // Show success notification
      alert(`Quest completed! +${selectedQuest.xp} XP earned!`);

      // Close modal
      setSelectedQuest(null);
      setSageResponse('');
      setQuestChat('');

    } catch (error: any) {
      console.error('Error completing quest:', error);
      if (error?.code === 'unavailable' || error?.message?.includes('offline')) {
        alert('Unable to save progress. Please check your internet connection.');
      } else {
        alert('Error completing quest. Please try again.');
      }
    } finally {
      setCompletingQuest(false);
    }
  };

  // Consult Sage for Quest
  const consultSageForQuest = async () => {
    if (!questChat || !selectedQuest) return;
    setSageLoading(true);

    const response = await consultAISage(
      `Working on quest: ${selectedQuest.name} - ${selectedQuest.description}`,
      questChat,
      { ...guildData, ceoAvatar }
    );

    setSageResponse(response);
    setSageLoading(false);

    // First sage chat achievement
    if (!guildData?.achievements?.includes('first_sage_chat')) {
      await updateDoc(doc(db, 'guilds', user.uid), {
        achievements: arrayUnion('first_sage_chat'),
        xp: increment(50)
      });
    }
  };

  // Generate Document
  const handleGenerateDocument = async (template: any) => {
    setGeneratingDoc(true);
    const content = await generateAIDocument(template, { ...guildData, ceoAvatar });
    await saveDocument(template, content);
    setGeneratingDoc(false);
  };

  // Generate Roadmap
  const handleGenerateRoadmap = async () => {
    setGeneratingRoadmap(true);
    const roadmap = await generatePersonalizedRoadmap({ ...guildData, ceoAvatar });
    setRoadmapContent(roadmap);
    setGeneratingRoadmap(false);
    setShowRoadmap(true);

    // Add roadmap achievement
    if (!guildData?.achievements?.includes('roadmap_created')) {
      await updateDoc(doc(db, 'guilds', user.uid), {
        achievements: arrayUnion('roadmap_created'),
        xp: increment(100)
      });
    }
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

    const totalQuests = 20; // Total quests across all stages
    const completedQuests = Object.keys(guildData.questProgress || {}).filter(
      key => guildData.questProgress[key].completed
    ).length;
    const completionRate = Math.round((completedQuests / totalQuests) * 100);

    return { totalQuests, completedQuests, completionRate };
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
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl text-center max-w-md">
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

  // Onboarding Screen
  if (showOnboarding) {
    const currentQuestion = onboardingStep === 0 ? null : ONBOARDING_QUESTIONS[onboardingStep - 1];
    const QuestionIcon = currentQuestion?.icon || Brain;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-2xl w-full">
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
                <h3 className="text-2xl font-bold text-white">Know Thyself</h3>
                <span className="text-gray-400">
                  {onboardingStep} of {ONBOARDING_QUESTIONS.length}
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <QuestionIcon className="w-6 h-6 text-purple-400 mr-3" />
                  <p className="text-lg text-white">{currentQuestion?.question}</p>
                </div>

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

                {currentQuestion?.type === 'multiselect' && (
                  <div className="grid grid-cols-2 gap-3">
                    {currentQuestion.options?.map((option: string) => {
                      const selected = onboardingAnswers[currentQuestion.id] || [];
                      const isSelected = selected.includes(option);

                      return (
                        <button
                          key={option}
                          onClick={() => {
                            if (isSelected) {
                              handleOnboardingAnswer(
                                currentQuestion.id,
                                selected.filter((o: string) => o !== option)
                              );
                            } else {
                              handleOnboardingAnswer(
                                currentQuestion.id,
                                [...selected, option]
                              );
                            }
                          }}
                          className={`p-3 rounded-lg transition-all ${isSelected
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                )}

                {currentQuestion?.type === 'slider' && (
                  <div className="mt-4">
                    <input
                      type="range"
                      min={currentQuestion.min}
                      max={currentQuestion.max}
                      value={onboardingAnswers[currentQuestion.id] || currentQuestion.min}
                      onChange={(e) => handleOnboardingAnswer(currentQuestion.id, parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-gray-400 mt-2">
                      <span>{currentQuestion.min}</span>
                      <span className="text-purple-400 font-bold">
                        {onboardingAnswers[currentQuestion.id] || currentQuestion.min}
                      </span>
                      <span>{currentQuestion.max}</span>
                    </div>
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
              <h3 className="text-2xl font-bold text-white mb-4">Finding Your CEO Guide...</h3>
              <div className="animate-pulse text-6xl mb-4">🔮</div>
              {sageResponse && (
                <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                  <p className="text-sm text-purple-400 mb-2">The AI Sage speaks:</p>
                  <ReactMarkdown>
                    {sageResponse}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  const levelInfo = calculateLevel(guildData?.xp || 0);
  const stats = calculateStats();

  // Quest Stages
  const QUEST_STAGES = {
    FUNDAMENTALS: {
      id: 'fundamentals',
      name: 'Training Grounds',
      description: 'Master the basics of your startup journey',
      icon: Shield,
      color: 'bg-green-500',
      quests: [
        { id: 'vision', name: 'Define Your Vision', xp: 100, description: 'Crystallize your startup idea' },
        { id: 'problem', name: 'Identify the Problem', xp: 150, description: 'Validate the problem' },
        { id: 'solution', name: 'Craft Your Solution', xp: 150, description: 'Design your approach' },
        { id: 'market', name: 'Scout the Territory', xp: 200, description: 'Research your market' },
        { id: 'legal', name: 'Forge the Legal Shield', xp: 100, description: 'Set up foundations' }
      ]
    },
    KICKOFF: {
      id: 'kickoff',
      name: 'Kickoff City',
      description: 'Launch your startup into the world',
      icon: Rocket,
      color: 'bg-blue-500',
      quests: [
        { id: 'mvp', name: 'Build Your MVP', xp: 300, description: 'Create your MVP' },
        { id: 'team', name: 'Assemble Your Guild', xp: 200, description: 'Recruit team members' },
        { id: 'pitch', name: 'Craft Battle Cry', xp: 150, description: 'Perfect your pitch' },
        { id: 'firstusers', name: 'First Adventurers', xp: 250, description: 'Get first 10 users' },
        { id: 'feedback', name: 'Listen to the Realm', xp: 200, description: 'Gather feedback' }
      ]
    },
    GTM: {
      id: 'gtm',
      name: 'Go-to-Market Plains',
      description: 'Conquer the market with your strategy',
      icon: Target,
      color: 'bg-purple-500',
      quests: [
        { id: 'marketing', name: 'Marketing Magic', xp: 250, description: 'Develop marketing' },
        { id: 'sales', name: 'Sales Swordplay', xp: 250, description: 'Build sales process' },
        { id: 'channels', name: 'Distribution Paths', xp: 200, description: 'Establish channels' },
        { id: 'pricing', name: 'Value Alchemy', xp: 150, description: 'Perfect pricing' },
        { id: 'metrics', name: 'Crystal Ball KPIs', xp: 200, description: 'Set up metrics' }
      ]
    },
    GROWTH: {
      id: 'growth',
      name: 'Growth Mountains',
      description: 'Scale your empire to new heights',
      icon: TrendingUp,
      color: 'bg-orange-500',
      quests: [
        { id: 'funding', name: 'Treasure Hunt', xp: 400, description: 'Secure funding' },
        { id: 'scaling', name: 'Empire Expansion', xp: 350, description: 'Scale operations' },
        { id: 'culture', name: 'Kingdom Culture', xp: 200, description: 'Build culture' },
        { id: 'partnerships', name: 'Form Alliances', xp: 300, description: 'Strategic partnerships' },
        { id: 'exit', name: 'The Grand Victory', xp: 500, description: 'Plan exit strategy' }
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
            <Users className="w-5 h-5 text-blue-400" />
            <span>{guildData?.guildName}</span>
            <span className="text-sm text-gray-400">Vision: {guildData?.vision}</span>
          </div>
          <div className="flex items-center space-x-2">
            {guildData?.achievements?.map((achievementId: string) => {
              const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
              return achievement ? (
                <span key={achievementId} className="text-2xl" title={achievement.name}>
                  {achievement.icon}
                </span>
              ) : null;
            })}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-gray-800/30 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-medium">Quick Actions</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleGenerateRoadmap}
                disabled={generatingRoadmap}
                className="px-3 py-1 bg-purple-700 rounded-lg text-sm hover:bg-purple-600 transition-all disabled:opacity-50 flex items-center space-x-1"
              >
                <MapIcon className="w-4 h-4" />
                <span>Generate Roadmap</span>
              </button>
              <button
                onClick={() => setShowResources(true)}
                className="px-3 py-1 bg-blue-700 rounded-lg text-sm hover:bg-blue-600 transition-all flex items-center space-x-1"
              >
                <BookOpen className="w-4 h-4" />
                <span>Resources</span>
              </button>
            </div>
          </div>
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
            return (
              <div key={stage.id} className="bg-gray-800 rounded-lg p-6 shadow-xl">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${stage.color} bg-opacity-20 mr-4`}>
                    <StageIcon className={`w-8 h-8 ${stage.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{stage.name}</h3>
                    <p className="text-sm text-gray-400">{stage.description}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {stage.quests.map((quest) => {
                    const questKey = `${stage.id}_${quest.id}`;
                    const isCompleted = guildData?.questProgress?.[questKey]?.completed;

                    return (
                      <div
                        key={quest.id}
                        onClick={() => {
                          setSelectedQuest({ ...quest, stageId: stage.id });
                          setSageResponse('');
                          setQuestChat('');
                        }}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${isCompleted
                          ? 'bg-green-900/30 border border-green-700'
                          : 'bg-gray-700 hover:bg-gray-600'
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
                              <p className="text-sm text-gray-400">{quest.xp} XP</p>
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

        {/* Quest Detail Modal */}
        <Modal open={!!selectedQuest} onClose={() => { setSelectedQuest(null); setSageResponse(''); setQuestChat(''); }}>
          {/* Modal content (copy from previous inner div) */}
          <div className="p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">{selectedQuest.name}</h3>
              <button
                onClick={() => {
                  setSelectedQuest(null);
                  setSageResponse('');
                  setQuestChat('');
                }}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <p className="text-gray-400 mb-4">{selectedQuest.description}</p>

            {/* Show if quest is completed */}
            {guildData?.questProgress?.[`${selectedQuest.stageId}_${selectedQuest.id}`]?.completed && (
              <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <p className="font-medium text-green-400">Quest Completed!</p>
                </div>
                {guildData.questProgress[`${selectedQuest.stageId}_${selectedQuest.id}`].sageResponse && (
                  <div className="mt-3 p-3 bg-gray-700/50 rounded">
                    <p className="text-sm text-gray-400 mb-1">Your saved wisdom:</p>
                    <ReactMarkdown>
                      {guildData.questProgress[`${selectedQuest.stageId}_${selectedQuest.id}`].sageResponse}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            )}

            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-2">
                <Sparkles className="w-5 h-5 text-purple-400 mr-2" />
                <p className="font-medium">Quest Rewards</p>
              </div>
              <p className="text-sm text-gray-400">{selectedQuest.xp} Experience Points</p>
            </div>

            {/* AI Sage Consultation */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <MessageCircle className="w-5 h-5 text-blue-400 mr-2" />
                <p className="font-medium">Consult the AI Sage</p>
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={questChat}
                  onChange={(e) => setQuestChat(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && consultSageForQuest()}
                  placeholder="Ask for guidance..."
                  className="flex-1 p-2 bg-gray-700 rounded-lg text-white"
                />
                <button
                  onClick={consultSageForQuest}
                  disabled={sageLoading}
                  className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  Ask
                </button>
              </div>
              {sageLoading ? (
                <div className="mt-3 p-3 bg-gray-700 rounded-lg text-purple-400 animate-pulse text-center">
                  The Sage is meditating and preparing your wisdom...
                </div>
              ) : (
                sageResponse && (
                  <div className="mt-3 p-3 bg-gray-700 rounded-lg">
                    <ReactMarkdown>
                      {sageResponse}
                    </ReactMarkdown>
                  </div>
                )
              )}
            </div>

            {/* CEO Avatar Advice */}
            {ceoAvatar && (
              <div className={`mb-4 p-3 rounded-lg bg-gradient-to-r ${ceoAvatar.color} bg-opacity-20`}>
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">{ceoAvatar.avatar}</span>
                  <p className="font-medium">{ceoAvatar.name}'s Wisdom</p>
                </div>
                <p className="text-sm italic">"{ceoAvatar.advice}"</p>
              </div>
            )}

            {/* Complete Quest Button */}
            {!guildData?.questProgress?.[`${selectedQuest.stageId}_${selectedQuest.id}`]?.completed && (
              <button
                onClick={completeQuest}
                disabled={completingQuest}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {completingQuest ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Completing Quest...</span>
                  </>
                ) : (
                  <>
                    <Trophy className="w-5 h-5" />
                    <span>Complete Quest (+{selectedQuest.xp} XP)</span>
                  </>
                )}
              </button>
            )}
          </div>
        </Modal>

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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Total XP</p>
                <p className="text-2xl font-bold text-purple-400">{guildData?.xp || 0}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Quests Completed</p>
                <p className="text-2xl font-bold text-green-400">{stats.completedQuests}/{stats.totalQuests}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Completion Rate</p>
                <p className="text-2xl font-bold text-blue-400">{stats.completionRate}%</p>
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
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-3">Recent Achievements</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {guildData?.achievements?.slice(-8).map((achievementId: string) => {
                  const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
                  return achievement ? (
                    <div key={achievementId} className="bg-gray-700 rounded-lg p-3 text-center">
                      <div className="text-3xl mb-1">{achievement.icon}</div>
                      <p className="text-xs font-medium">{achievement.name}</p>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </Modal>

        {/* Roadmap Modal */}
        <Modal open={showRoadmap && !!roadmapContent} onClose={() => setShowRoadmap(false)}>
          <div className="p-6 max-w-4xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">Your Personalized 90-Day Roadmap</h3>
              <button
                onClick={() => setShowRoadmap(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <ReactMarkdown >
                {roadmapContent}
              </ReactMarkdown>
            </div>

            <div className="mt-4 flex space-x-3">
              <button
                onClick={() => saveDocument({ id: 'roadmap', name: 'Personal Roadmap', xp: 50 }, roadmapContent)}
                className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
              >
                <span>Save Roadmap</span>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(roadmapContent);
                  alert('Roadmap copied to clipboard!');
                }}
                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 flex items-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </button>
            </div>
          </div>
        </Modal>

        {/* Resources Modal */}
        <Modal open={showResources} onClose={() => setShowResources(false)}>
          <div className="p-6 max-w-4xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">Recommended Resources</h3>
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
                  <p className="font-medium text-yellow-400">Based on your challenge:</p>
                  <p className="text-sm text-gray-300">{guildData?.onboardingData?.biggestChallenge}</p>
                </div>
              </div>
            </div>

            {Object.entries(RESOURCE_RECOMMENDATIONS).map(([challenge, resources]) => (
              guildData?.onboardingData?.biggestChallenge === challenge && (
                <div key={challenge} className="space-y-3">
                  {resources.map((resource, idx) => (
                    <div key={idx} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-all cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{resource.icon}</span>
                          <div>
                            <p className="font-medium">{resource.title}</p>
                            <p className="text-sm text-gray-400">{resource.type}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )
            ))}
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

            <div className={`text-center mb-6 p-6 rounded-lg bg-gradient-to-r ${ceoAvatar.color} bg-opacity-20`}>
              <div className="text-6xl mb-2">{ceoAvatar.avatar}</div>
              <h4 className="text-xl font-bold">{ceoAvatar.name}</h4>
              <p className="text-sm text-gray-300">{ceoAvatar.title}</p>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400 mb-1">Industries</p>
                <div className="flex flex-wrap gap-2">
                  {ceoAvatar.industries.map((ind: string) => (
                    <span key={ind} className="px-2 py-1 bg-gray-700 rounded text-sm">
                      {ind}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">Key Traits</p>
                <div className="flex flex-wrap gap-2">
                  {ceoAvatar.traits.map((trait: string) => (
                    <span key={trait} className="px-2 py-1 bg-gray-700 rounded text-sm">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-700">
                <p className="text-sm text-gray-400 mb-1">Guiding Philosophy</p>
                <p className="italic">"{ceoAvatar.advice}"</p>
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
                  <div key={conv.id} className="bg-gray-700 rounded-lg p-4">
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
                        <ReactMarkdown>
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
                    <div key={doc.id} className="bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600"
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
              <h3 className="text-2xl font-bold">{selectedDocument.templateName}</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedDocument.content);
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
                {selectedDocument.content}
              </ReactMarkdown>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
}