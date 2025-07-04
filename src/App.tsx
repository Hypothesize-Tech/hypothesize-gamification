import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import {
  createGuild,
  joinGuild,
  resetGuild,
  getConversations,
  saveConversation as saveConversationApi,
  getDocuments,
  generateDocument as generateDocumentApi,
  saveDocument as saveDocumentApi,
  updateGold as updateGoldApi,
  claimDailyBonus as claimDailyBonusApi,
  completeQuest as completeQuestApi,
  savePersonalizedQuestDetails as savePersonalizedQuestDetailsApi,
  purchaseArmoryItem as purchaseArmoryItemApi,
  assignQuest as assignQuestApi,
  checkEnergyReset as checkEnergyResetApi,
  consumeEnergy as consumeEnergyApi,
  purchaseEnergy as purchaseEnergyApi,
} from './services/api';

import backgroundImage from './assets/wallpaper_7.png';
import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime';

import {
  Crown,
  ChevronRight,
  LogOut,
  Target,
  User,
  Copy,
  BookOpen,
  AlertCircle,
  Coins,
  Volume2,
  VolumeX,
  Scroll,
  Swords,
  Castle,
  Trophy,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Modal from './components/Modal';
import DocumentRAG from './components/DocumentRAG';
import BusinessModelCanvas from './components/BusinessModelCanvas';
import SwordIcon from './components/DiamondSword3D';
import GuildActivityLog from './components/GuildActivityLog';
import { medievalStyles } from './utils/medievalStyles';
import { goldPurchaseStyles } from './utils/goldPurchaseStyles';
import {
  ACHIEVEMENTS,
  CEO_AVATARS,
  DOCUMENT_TEMPLATES,
  GUILD_LEVELS,
  CORE_ATTRIBUTES
} from './utils/constant';
import {
  QUEST_STAGES,
  triggerConfetti,
  calculateLevel,
  checkAndAwardAchievements,
} from './utils/helper';
import { ArmoryInterface } from './components/ArmoryInterface';
import { FourPanelQuestInterface } from './components/FourPanelQuestInterface';
import { GuildManagement } from './components/GuildManagement';
import { DailyBonus } from './components/DailyBonus';
import { EpicMedievalLoader } from './components/EpicMedievalLoader';
import { GoldPurchase } from './components/GoldPurchase';
import { GuildProgressIndicator } from './components/GuildProgressIndicator';
import type { GuildDataWithEnergy } from './components/EnergySystem';
import {
  EnergyPurchaseModal,
  useEnergyManagement,
  EnergyBar,
} from './components/EnergySystem';
import { ENERGY_CONFIG, ENERGY_COSTS } from './config/energy';

// IMPORT THE ONBOARDING FLOWS
import { FounderOnboarding, MemberOnboarding } from './components/OnboardingFlows';
import AchievementPopup from './components/AchievementPopup';
import { UserProfile } from './components/UserProfile';
import { useNavigate, useLocation } from 'react-router-dom';
import { Beastiary } from './components/Beastiary';
import { useAuth } from './context/AuthContext';

// SoundManager class (same as before)
class SoundManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private enabled: boolean = true;

  constructor() {
    this.sounds = {
      swordDraw: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp9y9Dn'),
      swordHit: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp9y9Dn'),
      coinCollect: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp9y9Dn'),
      purchase: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp9y9Dn'),
      levelUp: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp9y9Dn'),
      questComplete: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmewhBSp9y9Dn'),
      magicCast: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp9y9Dn'),
      error: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp9y9Dn')
    };

    Object.values(this.sounds).forEach(sound => {
      sound.volume = 0.3;
    });
  }

  play(soundName: keyof typeof this.sounds) {
    if (this.enabled && this.sounds[soundName]) {
      if (soundName === 'swordDraw') {
        this.sounds[soundName].volume = 0.2;
      }
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

let userInteracted = false;
function setUserInteracted() { userInteracted = true; }
if (typeof window !== 'undefined') {
  window.addEventListener('click', setUserInteracted, { once: true });
  window.addEventListener('keydown', setUserInteracted, { once: true });
  window.addEventListener('touchstart', setUserInteracted, { once: true });
}

const bedrockClient = new BedrockRuntimeClient({
  region: import.meta.env.VITE_AWS_REGION || 'us-west-1',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    sessionToken: import.meta.env.VITE_AWS_SESSION_TOKEN
  }
});

// Helper function to check if content is a Business Model Canvas JSON object
const isBusinessModelCanvas = (content: string): boolean => {
  try {
    // Check if the content contains a JSON object structure
    const jsonMatch = content.match(/{[\s\S]*}/);
    if (!jsonMatch) return false;

    const jsonString = jsonMatch[0];
    const parsed = JSON.parse(jsonString);

    // Validate that the parsed object is a Business Model Canvas
    return !!(
      parsed &&
      typeof parsed === 'object' &&
      'keyPartners' in parsed &&
      'keyActivities' in parsed &&
      'valuePropositions' in parsed &&
      'customerRelationships' in parsed &&
      'customerSegments' in parsed &&
      'keyResources' in parsed &&
      'channels' in parsed &&
      'costStructure' in parsed &&
      'revenueStreams' in parsed
    );
  } catch (e) {
    return false;
  }
};

// Helper function to parse Business Model Canvas data from content
const parseBusinessModelCanvas = (content: string) => {
  try {
    const jsonMatch = content.match(/{[\s\S]*}/);
    if (!jsonMatch) return null;

    const jsonString = jsonMatch[0];
    return JSON.parse(jsonString);
  } catch (e) {
    console.error('Error parsing Business Model Canvas data:', e);
    return null;
  }
};

export default function App() {
  const { user, guildData, loading, signIn, signOut, refetch, setGuildData } = useAuth();
  const [selectedQuest, setSelectedQuest] = useState<any | null>(null);

  // ONBOARDING STATE
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingType, setOnboardingType] = useState<'founder' | 'member'>('founder');
  const [inviteData, setInviteData] = useState<any | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  // OTHER STATES (same as before)
  const [conversations, setConversations] = useState<any[]>([]);
  const [savedDocuments, setSavedDocuments] = useState<any[]>([]);
  const [showDocuments, setShowDocuments] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [generatingDoc, setGeneratingDoc] = useState(false);
  const [generatedDocForReview, setGeneratedDocForReview] = useState<{ template: any; content: string } | null>(null);
  const [ceoAvatar, setCeoAvatar] = useState<any | null>(null);
  const [showDashboard, setShowDashboard] = useState(true);
  const [guildDataError, setGuildDataError] = useState<string | null>(null);
  const [showArmory, setShowArmory] = useState(false);
  const [showGuildManagement, setShowGuildManagement] = useState(false);
  const [showBeastiary, setShowBeastiary] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showGoldPurchase, setShowGoldPurchase] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; message: string } | null>(null);
  const [assignmentModal, setAssignmentModal] = useState<{ quest: any; questKey: string } | null>(null);
  const [newlyAwardedAchievements, setNewlyAwardedAchievements] = useState<any[]>([]);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [hasCheckedEnergy, setHasCheckedEnergy] = useState(false);

  const fundamentalsQuests = QUEST_STAGES.FUNDAMENTALS.quests.map(q => `fundamentals_${q.id}`);
  const allFundamentalsCompleted = fundamentalsQuests.every(questKey => guildData?.questProgress?.[questKey]?.completed);

  const energyManagement = useEnergyManagement(
    guildData as GuildDataWithEnergy,
    user?._id || '',
    () => refetch(), // Simplification: just refetch all data on change
    consumeEnergyApi,
    purchaseEnergyApi
  );

  const navigate = useNavigate();
  const location = useLocation();
  const handleResetGuild = async () => {
    if (!guildData) return;
    try {
      await resetGuild(guildData._id);
      refetch(); // Refetch data to get the updated guild state
    } catch (error) {
      console.error('Failed to reset guild', error);
      // Optionally, show an error message to the user
    }
  };

  // CHECK FOR INVITE TOKEN ON APP LOAD
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const inviteToken = urlParams.get('invite');
    if (inviteToken) {
      const guildId = urlParams.get('guildId');
      const founderName = urlParams.get('founderName');
      const guildName = urlParams.get('guildName');
      const ventureIdea = urlParams.get('ventureIdea');
      const founderRole = urlParams.get('founderRole');
      const currentStage = urlParams.get('currentStage');
      const currentTask = urlParams.get('currentTask');

      setOnboardingType('member');
      setInviteData({
        inviteToken,
        guildId,
        founderName: decodeURIComponent(founderName || ''),
        guildName: decodeURIComponent(guildName || ''),
        ventureIdea: decodeURIComponent(ventureIdea || ''),
        founderRole: decodeURIComponent(founderRole || ''),
        currentStage: decodeURIComponent(currentStage || 'Fundamentals'),
        currentTask: decodeURIComponent(currentTask || 'Getting Started')
      });
    } else {
      setOnboardingType('founder');
    }
  }, []);

  useEffect(() => {
    // Create and append medieval styles
    const styleEl = document.createElement('style');
    styleEl.textContent = medievalStyles;
    document.head.appendChild(styleEl);

    // Create and append gold purchase styles if needed
    if (typeof goldPurchaseStyles !== 'undefined') {
      const goldStyleEl = document.createElement('style');
      goldStyleEl.textContent = goldPurchaseStyles;
      document.head.appendChild(goldStyleEl);
    }

    // Create magical particles
    if (typeof window !== 'undefined' && (window as any).createMagicalParticles) {
      (window as any).createMagicalParticles();
    }


    // Sound initialization
    const playAmbient = () => {
      if (userInteracted) soundManager.play('swordDraw');
      document.removeEventListener('click', playAmbient);
    };
    document.addEventListener('click', playAmbient);

    // Cleanup function
    return () => {
      const styleElements = document.head.querySelectorAll('style');
      styleElements.forEach(el => {
        if (el.textContent?.includes('MedievalSharp') || el.textContent?.includes('gold-shine')) {
          el.remove();
        }
      });
      document.removeEventListener('click', playAmbient);
    };
  }, []);

  useEffect(() => {
    if (loading) return;

    if (user && !guildData) {
      setShowOnboarding(true);
    } else {
      setShowOnboarding(false);
    }

    if (guildData?.ceoAvatarId) {
      const avatar = CEO_AVATARS.find(
        (ceo) => ceo.id === guildData.ceoAvatarId
      );
      setCeoAvatar(avatar);
    } else {
      setCeoAvatar(null);
    }
  }, [user, guildData, loading]);

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      try {
        const { data } = await getConversations();
        setConversations(data);
      } catch (error) {
        console.error('Error fetching conversations', error);
      }
    };

    fetchConversations();
  }, [user, fetchTrigger]);

  useEffect(() => {
    if (!user) return;

    const fetchDocuments = async () => {
      try {
        const { data } = await getDocuments();
        setSavedDocuments(data);
      } catch (error) {
        console.error('Error fetching documents', error);
      }
    };

    fetchDocuments();
  }, [user, fetchTrigger]);

  useEffect(() => {
    if (user && guildData && !hasCheckedEnergy) {
      const checkReset = async () => {
        try {
          await checkEnergyResetApi();
          setHasCheckedEnergy(true);
          await refetch();
        } catch (error) {
          console.error("Failed to check energy reset", error);
        }
      }
      checkReset();
    }
  }, [user, guildData, hasCheckedEnergy, refetch]);

  // Listen for and process guild join requests from the subcollection
  // This logic is now handled by the backend. A user's guildId will be updated upon approval.
  // The frontend will then fetch the correct guild data.
  // We might need a notification system in the future to inform the founder about join requests.
  useEffect(() => {
    if (location.pathname === '/' && !localStorage.getItem('hasVisited')) {
      localStorage.setItem('hasVisited', 'true');
      navigate('/landing-page', { replace: true });
    }
  }, []);

  const handleSignIn = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse: any) => {
      try {
        await signIn(codeResponse.code);
        if (userInteracted) soundManager.play('levelUp');
      } catch (error) {
        console.error('Sign in error:', error);
        if (userInteracted) soundManager.play('error');
      }
    },
    onError: () => {
      console.error('Login Failed');
      setModalContent({
        title: "Login Failed",
        message: "Google login failed. Please try again."
      });
      if (userInteracted) soundManager.play('error');
    }
  });

  const handleSignOut = async () => {
    try {
      signOut();
      setCeoAvatar(null);
      setShowOnboarding(false);
      setHasCheckedEnergy(false);
      if (userInteracted) soundManager.play('swordDraw');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // FOUNDER ONBOARDING COMPLETION
  const handleFounderOnboardingComplete = async (data: any) => {
    try {
      const newGuild = await createGuild(data.vision, data);
      setGuildData(newGuild);
      setShowOnboarding(false);
      setModalContent({
        title: "Your Quest Begins!",
        message: "Your guild has been founded! You've received 50 gold to start your journey. Don't forget to collect your first daily bonus!"
      });
      if (userInteracted) soundManager.play('questComplete');
    } catch (error) {
      console.error('Failed to create guild:', error);
      setModalContent({
        title: "Error",
        message: "Failed to create your guild. Please try again."
      });
      if (userInteracted) soundManager.play('error');
    }
  };

  // MEMBER ONBOARDING COMPLETION
  const handleMemberOnboardingComplete = async (data: any) => {
    try {
      if (!inviteData?.guildId) throw new Error("No guild ID found for invite.");

      await joinGuild(inviteData.guildId, data.role);
      await refetch();
      setShowOnboarding(false);
      setModalContent({
        title: "Welcome to the Guild!",
        message: "You have successfully joined the guild. The guild has been awarded 50 gold! Any available daily bonuses have also been collected."
      });
      if (userInteracted) soundManager.play('questComplete');
    } catch (error) {
      console.error('Failed to join guild:', error);
      setModalContent({
        title: "Error",
        message: "Failed to join the guild. Please try again."
      });
      if (userInteracted) soundManager.play('error');
    }
  };

  // MEMBER ONBOARDING DECLINE
  const handleMemberOnboardingDecline = () => {
    // Redirect away or show alternative action
    window.location.href = '/';
  };

  const saveConversation = async (quest: any, question: string, response: string) => {
    if (!user) return;

    try {
      await saveConversationApi({
        questId: quest?.id || 'general',
        questName: quest?.name || 'General Conversation',
        question: question,
        response: response,
      });

      setFetchTrigger(t => t + 1); // Refetch conversations

      if (conversations.length + 1 >= 20 && !guildData?.achievements?.includes('conversation_pro')) {
        await refetch();
        if (userInteracted) soundManager.play('levelUp');
      }
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  };

  const saveDocument = async (template: any, content: string) => {
    if (!user || !guildData) return;

    try {
      await saveDocumentApi({
        template,
        content,
      });

      setFetchTrigger(t => t + 1); // Refetch guild data and documents

      if (userInteracted) soundManager.play('questComplete');

      if (savedDocuments.length + 1 >= 5 && !guildData.achievements?.includes('document_master')) {
        await refetch();
        if (userInteracted) soundManager.play('levelUp');
      }
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };

  const updateGold = async (amount: number) => {
    if (!user || !guildData) return;
    try {
      const { data: updatedGuild } = await updateGoldApi(amount);
      if (updatedGuild.gold >= 10000 && !updatedGuild.achievements?.includes('gold_hoarder')) {
        await refetch();
        if (userInteracted) soundManager.play('levelUp');
      } else {
        await refetch();
      }
    } catch (error) {
      console.error('Error updating gold:', error);
    }
  };

  const claimDailyBonus = async () => {
    if (!user || !guildData) return;

    // --- Optimistic Update ---
    const optimisticGuildData = {
      ...guildData,
      gold: (guildData.gold || 0) + ENERGY_CONFIG.DAILY_BONUS_GOLD,
      dailyStreak: (guildData.dailyStreak || 0) + 1,
      lastDailyBonus: new Date().toISOString(),
    };
    setGuildData(optimisticGuildData);
    if (userInteracted) soundManager.play('coinCollect');
    triggerConfetti({
      particleCount: 30,
      spread: 45,
      origin: { y: 0.3 }
    });
    // --- End Optimistic Update ---

    try {
      await claimDailyBonusApi();
      await refetch();
    } catch (error) {
      console.error('Error claiming daily bonus:', error);
      await refetch(); // Revert on error by refetching
      const err = error as any;
      setModalContent({ title: "Already Claimed", message: err.response?.data?.message || "You have already claimed your daily bonus today. Come back tomorrow!" });
    }
  };

  const completeQuest = async (questData: any) => {
    if (!user || !guildData) return;

    soundManager.play('questComplete');
    triggerConfetti();

    const questKey = `${selectedQuest.stageId}_${selectedQuest.id}`;

    // --- Achievement Logic ---
    const updatedQuestProgress = {
      ...guildData.questProgress,
      [questKey]: { completed: true }
    };

    const tempGuildDataForAchievements = {
      ...guildData,
      questProgress: updatedQuestProgress,
    };

    const newAchievements = checkAndAwardAchievements(tempGuildDataForAchievements);

    if (newAchievements.length > 0) {
      setNewlyAwardedAchievements(newAchievements);
    }
    // --- End Achievement Logic ---

    try {
      await completeQuestApi({
        questKey,
        ...questData,
        achievements: newAchievements,
      });
      setSelectedQuest(null);
      await refetch();
    } catch (error) {
      console.error('Error completing quest:', error);
      alert('There was an error completing the quest. Please try again.');
    }
  };

  const savePersonalizedQuestDetails = async (questKey: string, personalizedData: any) => {
    if (!user || !guildData) return;
    try {
      await savePersonalizedQuestDetailsApi({ questKey, personalizedData });
      await refetch();
    } catch (error) {
      console.error('Error saving personalized quest details:', error);
    }
  };

  const handleArmoryPurchase = async (item: any, category: string) => {
    if (!user || !guildData) return;

    if (guildData.gold < item.price) {
      setModalContent({ title: "Not Enough Gold", message: "You do not have enough gold coins for this purchase." });
      if (userInteracted) soundManager.play('error');
      return;
    }

    try {
      const { data: updatedGuild } = await purchaseArmoryItemApi({ item, category });
      if (userInteracted) soundManager.play('purchase');

      const totalPurchases = (updatedGuild.inventory?.weapons.length || 0) +
        (updatedGuild.inventory?.items.length || 0) +
        (updatedGuild.treasures?.length || 0);

      if (totalPurchases >= 5 && !updatedGuild.achievements?.includes('gear_collector')) {
        await refetch();
      } else {
        await refetch();
      }

      setModalContent({ title: "Purchase Successful", message: `You have purchased ${item.name} for ${item.price} gold coins.` });
    } catch (error) {
      console.error('Error purchasing item:', error);
      if (userInteracted) soundManager.play('error');
      setModalContent({ title: "Error", message: "Purchase failed. Please try again." });
    }
  };

  const handleSaveReviewedDocument = async () => {
    if (!generatedDocForReview) return;

    await saveDocument(generatedDocForReview.template, generatedDocForReview.content);
    setGeneratedDocForReview(null); // Close modal after saving
    soundManager.play('questComplete');
    setModalContent({ title: "Scroll Archived", message: `Your document '${generatedDocForReview.template.name}' has been saved to the archives.` });
  };

  const handleGenerateDocument = async (template: any) => {
    setGeneratingDoc(true);
    soundManager.play('magicCast');

    if (!allFundamentalsCompleted) {
      setModalContent({
        title: 'Complete Fundamentals Quests',
        message: 'You must complete all quests in the \'Fundamentals\' stage before you can generate documents.',
      });
      setGeneratingDoc(false);
      return;
    }

    const hasEnergy = await energyManagement.consumeEnergy('DOCUMENT_GENERATION');
    if (!hasEnergy) {
      setGeneratingDoc(false);
      return;
    }

    try {
      const { data } = await generateDocumentApi(template.prompt || template.name);
      setGeneratedDocForReview({ template, content: data.content });
      setGeneratingDoc(false);
    } catch (error) {
      console.error('Error generating document:', error);
      setGeneratingDoc(false);
      setModalContent({
        title: 'Generation Failed',
        message: 'The AI Advisor was unable to generate the document. Please try again.'
      });
    }
  };

  const calculateStats = () => {
    if (!guildData) return { totalQuests: 0, completedQuests: 0, completionRate: 0 };

    const totalQuests = 20;
    const completedQuests = Object.keys(guildData.questProgress || {}).filter(
      key => guildData.questProgress[key].completed
    ).length;
    const completionRate = Math.round((completedQuests / totalQuests) * 100);

    return { totalQuests, completedQuests, completionRate };
  };

  const toggleSound = () => {
    const newState = soundManager.toggle();
    setSoundEnabled(newState);
  };

  const handleAssignQuest = async (questKey: string, member: any) => {
    if (!user || !guildData || !guildData.isFounder) return;

    try {
      await assignQuestApi({ questKey, member });
      setAssignmentModal(null);
      await refetch();
    } catch (error) {
      console.error('Error assigning quest:', error);
      alert('Failed to assign quest.');
    }
  };

  const handleShowDashboard = () => {
    setSelectedQuest(null);
    setShowArmory(false);
    setShowGuildManagement(false);
    setShowBeastiary(false);
    setShowDashboard(true);
    soundManager.play('swordDraw');
  };

  const handleShowArmory = () => {
    setSelectedQuest(null);
    setShowGuildManagement(false);
    setShowBeastiary(false);
    setShowDashboard(false);
    setShowArmory(true);
    soundManager.play('swordDraw');
  };

  const handleShowGuildManagement = () => {
    setSelectedQuest(null);
    setShowArmory(false);
    setShowBeastiary(false);
    setShowDashboard(false);
    setShowGuildManagement(true);
    soundManager.play('swordDraw');
  };

  const handleShowBeastiary = () => {
    setSelectedQuest(null);
    setShowArmory(false);
    setShowGuildManagement(false);
    setShowDashboard(false);
    setShowBeastiary(true);
    soundManager.play('swordDraw');
  };

  const handleOpenQuest = (quest: any) => {
    setSelectedQuest(quest);
    soundManager.play('swordDraw');
  };

  const showModal = (title: string, message: string) => {
    setModalContent({ title, message });
  };

  if (loading) {
    return <EpicMedievalLoader />;
  }

  if (guildDataError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="parchment p-8 rounded-lg shadow-2xl text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-yellow-100">Guild Not Found</h1>
          <p className="text-gray-300 mb-6">{guildDataError}</p>
          <button
            onClick={() => {
              setGuildDataError(null);
              setFetchTrigger((t) => t + 1);
            }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all magic-border"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="parchment p-8 rounded-lg shadow-2xl text-center max-w-md hero-3d">
          <div className="w-full h-80 mx-auto mb-6 flex items-center justify-center">
            <SwordIcon width={300} height={300} />
          </div>
          <h1 className="text-3xl font-bold text-yellow-100 mb-2">The Startup Quest</h1>
          <p className="text-gray-300 mb-6">Start your journey to building your company</p>
          <button
            onClick={() => handleSignIn()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105 magic-border"
          >
            <span className="flex items-center space-x-3">
              <Swords className="w-5 h-5" />
              <span>Sign in with Google</span>
              <Swords className="w-5 h-5 transform scale-x-[-1]" />
            </span>
          </button>
        </div>
      </div>
    );
  }

  // SHOW ONBOARDING FLOWS
  if (showOnboarding) {
    if (onboardingType === 'founder') {
      return (
        <FounderOnboarding
          onComplete={handleFounderOnboardingComplete}
          user={user}
        />
      );
    } else {
      return (
        <MemberOnboarding
          onComplete={handleMemberOnboardingComplete}
          onDecline={handleMemberOnboardingDecline}
          inviteData={inviteData}
          user={user}
        />
      );
    }
  }

  if (guildData && guildData.joinRequestStatus === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="parchment p-8 rounded-lg shadow-2xl text-center max-w-md">
          <h1 className="text-2xl font-bold text-yellow-100">Awaiting Approval</h1>
          <p className="text-gray-300 my-4">Your request to join "{guildData.guildName}" has been sent.</p>
          <p className="text-gray-300 mb-6">You will be able to access the guild once the founder approves your request.</p>
          <EpicMedievalLoader />
        </div>
      </div>
    );
  }

  const levelInfo = calculateLevel(guildData?.xp || 0);
  const stats = calculateStats();
  const guildLevel = GUILD_LEVELS[guildData?.guildLevel as keyof typeof GUILD_LEVELS] || GUILD_LEVELS[1];
  const currentUserRole = guildData?.members?.find((m: any) => m.uid === user._id)?.permissionRole;
  const allQuests = Object.values(QUEST_STAGES).flatMap(stage =>
    stage.quests.map(quest => ({ ...quest, stageId: stage.id }))
  );

  return (
    <div key={user?._id} className="flex h-screen bg-gray-900 text-white font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 flex flex-col p-4 border-r border-yellow-700/50">
        <div className="flex items-center space-x-3 mb-8">
          <Crown className="w-8 h-8 text-yellow-500" />
          <h1 className="text-xl font-bold text-yellow-100">The Startup Quest</h1>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-2">
          {/* Navigation Buttons */}
          <button
            onClick={handleShowDashboard}
            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all text-left ${showDashboard && !selectedQuest ? 'bg-yellow-400/20 text-yellow-200 border-l-4 border-yellow-400' : 'text-gray-400 hover:bg-gray-700/50'
              }`}
          >
            <Trophy className="w-5 h-5" />
            <span>Quests</span>
          </button>

          <button
            onClick={handleShowArmory}
            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all text-left ${showArmory ? 'bg-yellow-400/20 text-yellow-200 border-l-4 border-yellow-400' : 'text-gray-400 hover:bg-gray-700/50'
              }`}
          >
            <Swords className="w-5 h-5" />
            <span>Armory</span>
          </button>

          <button
            onClick={handleShowGuildManagement}
            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all text-left ${showGuildManagement ? 'bg-yellow-400/20 text-yellow-200 border-l-4 border-yellow-400' : 'text-gray-400 hover:bg-gray-700/50'
              }`}
          >
            <Castle className="w-5 h-5" />
            <span>Guild Hall</span>
          </button>

          <button
            onClick={handleShowBeastiary}
            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all text-left ${showBeastiary ? 'bg-yellow-400/20 text-yellow-200 border-l-4 border-yellow-400' : 'text-gray-400 hover:bg-gray-700/50'
              }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>Side Quests</span>
          </button>

        </div>

        <div className="mt-auto p-2 space-y-2">
          {/* User Profile & Logout */}
          <button
            onClick={() => setShowUserProfile(true)}
            className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all text-left text-gray-400 hover:bg-gray-700/50"
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </button>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all text-left text-gray-400 hover:bg-gray-700/50"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden" style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}>
        {/* Background overlay for opacity */}
        <div className="absolute inset-0 bg-black/70" style={{ backdropFilter: 'blur(2px)' }}></div>

        {/* Top Header Bar */}
        <header className="parchment shadow-md px-6 py-3 border-b-2 border-yellow-700 flex-shrink-0 relative z-10">
          <div className="flex items-center justify-between">
            {/* Left side: Guild Info */}
            <div className="flex items-center space-x-4">
              <span className="text-yellow-100 font-bold text-lg">{guildData?.guildName}</span>
              <span className="text-sm text-gray-300 hidden md:block">Level {levelInfo.level} - {guildLevel.name}</span>
            </div>

            {/* Right side: Stats and Actions */}
            <div className="flex items-center space-x-4">
              {guildData && (
                <EnergyBar
                  currentEnergy={guildData.currentEnergy}
                  maxEnergy={guildData.maxEnergy}
                  isPremium={guildData.isPremium}
                  onPurchaseClick={() => energyManagement.setShowEnergyPurchase(true)}
                />
              )}
              <div className="flex items-center space-x-2">
                <Coins className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-yellow-100">{guildData?.gold || 0}</span>
                <button
                  onClick={() => { setShowGoldPurchase(true); if (userInteracted) soundManager.play('coinCollect'); }}
                  className="px-2 py-1 bg-gradient-to-r from-yellow-600 to-amber-600 rounded text-xs hover:from-yellow-500 hover:to-amber-500"
                  title="Purchase Gold"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => { setShowDocuments(true); if (userInteracted) soundManager.play('swordDraw'); }}
                className="text-gray-400 hover:text-white"
                title="Documents (RAG)"
              >
                <Scroll className="w-5 h-5" />
              </button>
              <button
                onClick={toggleSound}
                className="text-gray-400 hover:text-white"
                title={soundEnabled ? "Mute sounds" : "Enable sounds"}
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>


        <div className="flex-1 overflow-y-auto relative z-10">
          {selectedQuest ? (
            <FourPanelQuestInterface
              quest={selectedQuest}
              guildData={guildData}
              ceoAvatar={ceoAvatar}
              onComplete={completeQuest}
              onClose={() => setSelectedQuest(null)}
              saveConversation={saveConversation}
              updateGold={updateGold}
              soundManager={soundManager}
              bedrockClient={bedrockClient}
              consumeEnergy={energyManagement.consumeEnergy}
              setGuildData={() => refetch()}
              vision={guildData?.vision}
              savePersonalizedQuestDetails={savePersonalizedQuestDetails}
              currentUserRole={currentUserRole}
              user={user}
            />
          ) : showArmory ? (
            <ArmoryInterface
              guildData={guildData}
              onPurchase={handleArmoryPurchase}
              onClose={() => { setShowArmory(false); if (userInteracted) soundManager.play('swordDraw'); }}
              soundManager={soundManager}
            />
          ) : showGuildManagement ? (
            <GuildManagement
              guildData={guildData}
              onClose={() => setShowGuildManagement(false)}
              onResetGuild={handleResetGuild} // Pass down the handler
              setGuildData={() => refetch()}
              showModal={showModal}
            />
          ) : showBeastiary ? (
            <Beastiary />
          ) : (
            /* Main Dashboard */
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden h-full">
              <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 overflow-y-auto">
                {/* Header inside Dashboard */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-yellow-100">Quests</h2>
                    <p className="text-gray-400">Your startup journey unfolds here.</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <GuildProgressIndicator
                      level={guildData?.guildLevel || 1}
                      showDescription={true}
                      className="parchment p-2 rounded-lg shadow-md"
                    />
                    <DailyBonus guildData={guildData} onClaim={claimDailyBonus} soundManager={soundManager} />
                  </div>
                </div>

                {/* Main Quest Map */}
                <div className="relative flex flex-col items-center space-y-8">
                  {Object.values(QUEST_STAGES).map((stage, index, stages) => {
                    const firstQuestOfStage = stage.quests[0];
                    const firstQuestIndex = allQuests.findIndex(q => q.id === firstQuestOfStage.id && q.stageId === stage.id);
                    const isFirstQuestOfAll = firstQuestIndex === 0;
                    const prevQuestForStage = isFirstQuestOfAll ? null : allQuests[firstQuestIndex - 1];
                    const prevQuestKeyForStage = prevQuestForStage ? `${prevQuestForStage.stageId}_${prevQuestForStage.id}` : null;
                    const prevQuestCompletedForStage = prevQuestKeyForStage ? guildData?.questProgress?.[prevQuestKeyForStage]?.completed : true;
                    const isStageLocked = !isFirstQuestOfAll && !prevQuestCompletedForStage;

                    const StageIcon = stage.icon;

                    return (
                      <React.Fragment key={stage.id}>
                        <div
                          className={`w-full max-w-4xl parchment rounded-lg p-6 shadow-xl transition-all duration-500 ${isStageLocked ? 'opacity-50 grayscale' : 'hover:shadow-2xl'
                            } hero-3d`}
                        >
                          <div className="flex items-center mb-4">
                            <div className={`p-3 rounded-lg ${stage.color} bg-opacity-20 mr-4`}>
                              {typeof StageIcon === 'string' ? (
                                <span className={`w-8 h-8 ${stage.color.replace('bg-', 'text-')}`} style={{ fontSize: '2rem' }}>{StageIcon}</span>
                              ) : null}
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-yellow-100">{stage.name}</h3>
                              <p className="text-sm text-gray-300">{stage.description}</p>
                              {isStageLocked && (
                                <p className="text-xs text-orange-400 mt-1">⚠️ Complete previous quests to unlock</p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-3">
                            {stage.quests.map((quest) => {
                              const questKey = `${stage.id}_${quest.id}`;
                              const questProgress = guildData?.questProgress?.[questKey];
                              const isCompleted = questProgress?.completed;
                              const xpEarned = questProgress?.xpReward;
                              const assignedTo = questProgress?.assignedTo;

                              const questIndex = allQuests.findIndex(q => q.id === quest.id && q.stageId === stage.id);
                              const isFirstQuest = questIndex === 0;
                              const previousQuest = isFirstQuest ? null : allQuests[questIndex - 1];
                              const previousQuestKey = previousQuest ? `${previousQuest.stageId}_${previousQuest.id}` : null;
                              const previousQuestCompleted = previousQuestKey ? guildData?.questProgress?.[previousQuestKey]?.completed : true;

                              const isQuestLocked = !isFirstQuest && !previousQuestCompleted;

                              return (
                                <div
                                  key={quest.id}
                                  onClick={() => {
                                    if (!isQuestLocked) {
                                      handleOpenQuest({ ...quest, stageId: stage.id });
                                    }
                                  }}
                                  onMouseEnter={() => { if (!isQuestLocked && userInteracted) soundManager.play('swordDraw'); }}
                                  className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${isQuestLocked
                                    ? 'bg-gray-700/50 cursor-not-allowed'
                                    : isCompleted
                                      ? 'parchment border-2 border-green-700 bg-green-900/30 relative hover:transform hover:scale-102 hover:shadow-lg'
                                      : 'parchment hover:transform hover:scale-102 hover:shadow-lg'
                                    }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                      {isCompleted ? (
                                        <Trophy className="w-6 h-6 text-green-400" />
                                      ) : (
                                        <Target className="w-6 h-6 text-gray-400" />
                                      )}
                                      <div>
                                        <p className="font-semibold text-yellow-100 flex items-center">
                                          {quest.name}
                                          {isCompleted && (
                                            <span className="ml-3 px-2 py-0.5 bg-green-700/80 text-xs text-green-100 rounded-full font-semibold">Completed</span>
                                          )}
                                        </p>
                                        <div className="flex items-center space-x-3 text-sm mt-1">
                                          <span className="text-gray-300">{quest.xp} XP</span>
                                          <span className="text-gray-500">•</span>
                                          <span className={CORE_ATTRIBUTES[quest.attribute as keyof typeof CORE_ATTRIBUTES]?.color || 'text-gray-400'}>
                                            {CORE_ATTRIBUTES[quest.attribute as keyof typeof CORE_ATTRIBUTES]?.name || 'General'}
                                          </span>
                                          {assignedTo && (
                                            <>
                                              <span className="text-gray-500">•</span>
                                              <span className="text-sm text-cyan-300">Assigned to: {assignedTo.name}</span>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      {isCompleted && xpEarned && (
                                        <span className="px-2 py-0.5 bg-gradient-to-r from-green-600 to-emerald-600 text-xs text-white rounded-full font-semibold border border-green-400">
                                          +{xpEarned} XP
                                        </span>
                                      )}
                                      <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        {index < stages.length - 1 && (
                          <div className="h-16 w-1 bg-gradient-to-b from-yellow-700/50 via-yellow-600/30 to-yellow-700/50 border-l border-r border-dashed border-yellow-800/80"></div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Right sidebar for stats/info inside dashboard */}
              <div className="w-full md:w-80 lg:w-96 bg-gray-800/50 p-6 border-l border-yellow-700/30 overflow-y-auto">
                <h3 className="text-xl font-bold text-yellow-100 mb-4">Guild Stats</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="parchment rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-300 mb-1">Total XP</p>
                    <p className="text-xl font-bold text-purple-400">{guildData?.xp || 0}</p>
                  </div>
                  <div className="parchment rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-300 mb-1">Gold Coins</p>
                    <p className="text-xl font-bold text-yellow-400">{guildData?.gold || 0}</p>
                  </div>
                  <div className="parchment rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-300 mb-1">Level</p>
                    <p className="text-xl font-bold text-blue-400">{levelInfo.level}</p>
                  </div>
                  <div className="parchment rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-300 mb-1">Quests Done</p>
                    <p className="text-xl font-bold text-green-400">{stats.completedQuests}</p>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-yellow-100 mb-4">Achievements</h3>
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {ACHIEVEMENTS.slice(0, 8).map((achievement) => {
                    const earned = guildData?.achievements?.includes(achievement.id);
                    return (
                      <div
                        key={achievement.id}
                        className={`parchment rounded-lg p-2 text-center transition-all ${earned ? 'magic-border' : 'opacity-40 grayscale'}`}
                        title={`${achievement.name}: ${achievement.description}${!earned ? ' (Locked)' : ''}`}
                      >
                        <div className="text-3xl mb-1">{typeof achievement.icon === 'string' ? achievement.icon : null}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Guild Activity Log Section */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-yellow-100 mb-4">Guild Activity</h3>
                  {guildData && (
                    <GuildActivityLog
                      guildId={guildData._id}
                      className="max-h-80 overflow-y-auto"
                    />
                  )}
                </div>

                <h3 className="text-xl font-bold text-yellow-100 mb-4">Document Creation</h3>
                <div className="flex flex-col space-y-2">
                  {DOCUMENT_TEMPLATES.map(template => (
                    <button
                      key={template.id}
                      onClick={() => handleGenerateDocument(template)}
                      disabled={generatingDoc}
                      className="px-3 py-2 parchment rounded-lg text-sm hover:transform hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
                      title={`Create ${template.name} (+${template.xp} XP, ${ENERGY_COSTS.DOCUMENT_GENERATION} energy)`}
                      onMouseEnter={() => { if (userInteracted) soundManager.play('swordDraw'); }}
                    >
                      {typeof template.icon === 'string' ? <span>{template.icon}</span> : null} {template.name}
                    </button>
                  ))}
                </div>
                {generatingDoc && (
                  <div className="mt-2 text-center text-sm text-purple-400 animate-pulse">
                    Generating document...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>


        {/* Modals will float over the main content */}
        {assignmentModal && (
          <Modal open={!!assignmentModal} onClose={() => setAssignmentModal(null)}>
            <div className="p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-yellow-100 mb-4">Assign Quest: {assignmentModal.quest.name}</h3>
              <div className="space-y-2">
                {guildData.members?.map((member: any) => (
                  <button
                    key={member.uid}
                    onClick={() => handleAssignQuest(assignmentModal.questKey, member)}
                    className="w-full text-left parchment p-3 hover:bg-gray-700/50"
                  >
                    <p className="font-medium text-yellow-100">{member.name}</p>
                    <p className="text-sm text-gray-300">{member.email}</p>
                  </button>
                ))}
              </div>
            </div>
          </Modal>
        )}

        {/* All the Modals (same as before) */}
        {/* 4-Panel Quest Interface, Guild Management, Armory, etc. */}
        {selectedQuest && (
          <FourPanelQuestInterface
            quest={selectedQuest}
            guildData={guildData}
            ceoAvatar={ceoAvatar}
            onComplete={completeQuest}
            onClose={() => setSelectedQuest(null)}
            saveConversation={saveConversation}
            updateGold={updateGold}
            soundManager={soundManager}
            bedrockClient={bedrockClient}
            consumeEnergy={energyManagement.consumeEnergy}
            setGuildData={() => refetch()}
            vision={guildData?.vision}
            savePersonalizedQuestDetails={savePersonalizedQuestDetails}
            currentUserRole={currentUserRole}
          />
        )}
        {showGuildManagement && (
          <GuildManagement
            guildData={guildData}
            onClose={() => setShowGuildManagement(false)}
            onResetGuild={handleResetGuild} // Pass down the handler
            setGuildData={() => refetch()}
            showModal={showModal}
          />
        )}
        {showArmory && (
          <ArmoryInterface
            guildData={guildData}
            onPurchase={handleArmoryPurchase}
            onClose={() => { setShowArmory(false); if (userInteracted) soundManager.play('swordDraw'); }}
            soundManager={soundManager}
          />
        )}
        {generatedDocForReview && (
          <Modal open={!!generatedDocForReview} onClose={() => setGeneratedDocForReview(null)} size={isBusinessModelCanvas(generatedDocForReview.content) ? "full" : "lg"}>
            <div className="p-6 parchment-container">
              <div className="paper-texture"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold old-paper-text mb-4">{generatedDocForReview.template.name}</h3>
                <div className="my-4 p-4 parchment-inner rounded-lg max-h-[calc(100vh-200px)] overflow-y-auto bg-white/5 prose prose-sm max-w-none old-paper-text">
                  {isBusinessModelCanvas(generatedDocForReview.content) ? (
                    <BusinessModelCanvas data={parseBusinessModelCanvas(generatedDocForReview.content)} />
                  ) : (
                    <ReactMarkdown>{generatedDocForReview.content}</ReactMarkdown>
                  )}
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    onClick={() => setGeneratedDocForReview(null)}
                    className="px-4 py-2 parchment rounded-lg hover:bg-gray-700/50 transition-all"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleSaveReviewedDocument}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-500 hover:to-teal-500 transition-all magic-border"
                  >
                    Save to Archives
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        )}
        {showDocuments && (
          <Modal size="full" open={showDocuments} onClose={() => { setShowDocuments(false); if (userInteracted) soundManager.play('swordDraw'); }}>
            <div className="flex flex-col h-full w-full">
              <div className="flex items-center justify-between p-6 border-b border-yellow-700 bg-gradient-to-r from-purple-900 to-indigo-900">
                <h3 className="text-2xl font-bold text-yellow-100">Documents</h3>
                <button
                  onClick={() => { setShowDocuments(false); if (userInteracted) soundManager.play('swordDraw'); }}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="flex-1 overflow-auto">
                <DocumentRAG
                  userId={user._id}
                  guildData={guildData}
                  updateGold={updateGold}
                  ceoAvatar={ceoAvatar}
                />
              </div>
            </div>
          </Modal>
        )}
        {selectedDocument && (
          <Modal open={!!selectedDocument} onClose={() => { setSelectedDocument(null); if (userInteracted) soundManager.play('swordDraw'); }}>
            <div className="p-6 max-w-4xl w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-yellow-100">{selectedDocument?.templateName}</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedDocument?.content || '');
                      setModalContent({ title: "Copied!", message: "Document content copied to clipboard." });
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => { setSelectedDocument(null); if (userInteracted) soundManager.play('swordDraw'); }}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="parchment rounded-lg p-6">
                <ReactMarkdown >
                  {selectedDocument?.content}
                </ReactMarkdown>
              </div>
            </div>
          </Modal>
        )}
        {showGoldPurchase && (
          <GoldPurchase
            user={user}
            guildData={guildData}
            onClose={() => { setShowGoldPurchase(false); if (userInteracted) soundManager.play('swordDraw'); }}
            soundManager={soundManager}
            onPurchaseSuccess={() => {
              refetch();
            }}
          />
        )}

        {/* Energy Purchase Modal */}
        {guildData && (
          <EnergyPurchaseModal
            currentEnergy={guildData?.energy ?? 0}
            maxEnergy={guildData?.maxEnergy ?? 0}
            isOpen={energyManagement.showEnergyPurchase}
            onClose={() => energyManagement.setShowEnergyPurchase(false)}
            currentGold={guildData?.gold ?? 0}
            onPurchase={async (amount) => {
              await purchaseEnergyApi(amount);
              await refetch();
            }}
            purchasing={energyManagement.purchasingEnergy}
          />
        )}

        {/* Generic Info Modal */}
        {modalContent && (
          <Modal
            open={!!modalContent}
            size="lg"
            onClose={() => setModalContent(null)}
            className="no-scrollbar"
          >
            <div className="p-6 w-full text-center parchment">
              <h3 className="text-2xl font-bold text-yellow-100 mb-4">{modalContent.title}</h3>
              <p className="text-gray-300 my-4 whitespace-pre-wrap">{modalContent.message}</p>
              <button
                onClick={() => setModalContent(null)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all magic-border"
              >
                Close
              </button>
            </div>
            <style>
              {`
                .no-scrollbar::-webkit-scrollbar {
                  display: none !important;
                }
                .no-scrollbar {
                  -ms-overflow-style: none !important;
                  scrollbar-width: none !important;
                  overflow: hidden !important;
                }
              `}
            </style>
          </Modal>
        )}
      </main>

      <button className="fixed bottom-4 right-4 bg-yellow-600 text-white p-3 rounded-full shadow-lg z-20" onClick={toggleSound}>
        {soundEnabled ? <Volume2 /> : <VolumeX />}
      </button>

      {newlyAwardedAchievements.length > 0 && (
        <AchievementPopup
          achievements={newlyAwardedAchievements}
          onClose={() => setNewlyAwardedAchievements([])}
          soundManager={soundManager}
        />
      )}

      {showUserProfile && (
        <UserProfile
          guildData={guildData}
          ceoAvatar={ceoAvatar}
          onClose={() => setShowUserProfile(false)}
        />
      )}
    </div>
  );
}