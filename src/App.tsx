import React, { useState, useEffect, Suspense } from 'react';
import {
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  increment,
  deleteDoc,
} from 'firebase/firestore';
import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime';
import {
  Crown,
  Users,
  Sparkles,
  ChevronRight,
  LogOut,
  Target,
  User,
  History,
  Copy,
  BarChart3,
  Lightbulb,
  BookOpen,
  AlertCircle,
  Video,
  Coins,
  ShoppingBag,
  Zap,
  UserPlus,
  Volume2,
  VolumeX,
  Scroll,
  Swords,
  Castle,
  Trophy,
  AlertTriangle,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Modal from './components/Modal';
import DocumentRAG from './components/DocumentRAG';
import * as THREE from 'three';
import { Canvas, } from '@react-three/fiber';
import DiamondSword3D from './components/DiamondSword3D';
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
  generateAIDocument,
  QUEST_STAGES,
  triggerConfetti,
  calculateLevel,
  checkAndAwardAchievements,
} from './utils/helper';
import { ArmoryInterface } from './components/ArmoryInterface';
import { FourPanelQuestInterface } from './components/FourPanelQuestInterface';
import { GuildManagement } from './components/GuildManagement';
import { DailyBonus } from './components/DailyBonus';
import { auth, db, googleProvider } from './config/config';
import { EpicMedievalLoader } from './components/EpicMedievalLoader';
import { GoldPurchase } from './components/GoldPurchase';
import type { GuildDataWithEnergy } from './components/EnergySystem';
import {
  EnergyPurchaseModal,
  useEnergyManagement,
  EnergyBar,
} from './components/EnergySystem';
import { ENERGY_CONFIG, ENERGY_COSTS } from './config/energy';
import { v4 as uuidv4 } from 'uuid';
import { createInviteLink, generateGuildInviteEmail, sendEmail } from './utils/email';

// IMPORT THE ONBOARDING FLOWS
import { FounderOnboarding, MemberOnboarding } from './components/OnboardingFlows';
import AchievementPopup from './components/AchievementPopup';
import { UserProfile } from './components/UserProfile';
import { useNavigate, useLocation } from 'react-router-dom';
import { Beastiary } from './components/Beastiary';

class Canvas3DErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('3D Canvas error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-yellow-400 mb-2">3D view unavailable</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

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

export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [guildData, setGuildData] = useState<any | null>(null);
  const [selectedQuest, setSelectedQuest] = useState<any | null>(null);

  // ONBOARDING STATE
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingType, setOnboardingType] = useState<'founder' | 'member'>('founder');
  const [inviteData, setInviteData] = useState<any | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  // OTHER STATES (same as before)
  const [conversations, setConversations] = useState<any[]>([]);
  const [savedDocuments, setSavedDocuments] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [generatingDoc, setGeneratingDoc] = useState(false);
  const [ceoAvatar, setCeoAvatar] = useState<any | null>(null);
  const [showCEOProfile, setShowCEOProfile] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  const [showResources, setShowResources] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
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

  const energyManagement = useEnergyManagement(
    guildData as GuildDataWithEnergy,
    user?.uid || '',
    setGuildData
  );

  const navigate = useNavigate();
  const location = useLocation();

  // CHECK FOR INVITE TOKEN ON APP LOAD
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const inviteToken = urlParams.get('invite');
    const guildId = urlParams.get('guildId');
    const founderName = urlParams.get('founderName');
    const guildName = urlParams.get('guildName');
    const ventureIdea = urlParams.get('ventureIdea');
    const founderRole = urlParams.get('founderRole');
    const currentStage = urlParams.get('currentStage');
    const currentTask = urlParams.get('currentTask');

    if (inviteToken && guildId) {
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
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      setGuildData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const userProfileRef = doc(db, 'guilds', user.uid);

    const unsubscribe = onSnapshot(userProfileRef, (userDoc) => {
      if (!userDoc.exists()) {
        if (navigator.onLine) {
          setShowOnboarding(true);
        }
        setLoading(false);
        return;
      }

      setShowOnboarding(false);
      const userProfileData = userDoc.data() as GuildDataWithEnergy;

      if (userProfileData.isFounder) {
        setGuildData(userProfileData);
        if (userProfileData.ceoAvatarId) {
          const avatar = CEO_AVATARS.find(
            (ceo) => ceo.id === userProfileData.ceoAvatarId
          );
          setCeoAvatar(avatar);
        }
        setLoading(false);
      } else {
        // --- MEMBER LOGIC ---
        if (userProfileData.joinRequestStatus === 'pending') {
          setGuildData(userProfileData); // Store their partial profile
          setLoading(false);
          return;
        }
        const mainGuildRef = doc(db, 'guilds', userProfileData.guildId);
        const unsubMainGuild = onSnapshot(mainGuildRef, (mainGuildDoc) => {
          if (mainGuildDoc.exists()) {
            const mainGuildData = mainGuildDoc.data() as GuildDataWithEnergy;
            const mergedData = {
              ...userProfileData,
              members: mainGuildData.members,
              guildLevel: mainGuildData.guildLevel,
              guildName: mainGuildData.guildName,
              vision: mainGuildData.vision,
              ceoAvatarId: mainGuildData.ceoAvatarId,
            };
            setGuildData(mergedData);
            if (mainGuildData.ceoAvatarId) {
              const avatar = CEO_AVATARS.find(
                (ceo) => ceo.id === mainGuildData.ceoAvatarId
              );
              setCeoAvatar(avatar);
            }
          } else {
            setGuildData(userProfileData);
            setGuildDataError(
              "The guild you are a member of could not be found."
            );
          }
          setLoading(false);
        }, (error) => {
          console.error("Error listening to main guild data:", error);
          setGuildDataError("Failed to load your guild's data.");
          setLoading(false);
        });
        return () => unsubMainGuild();
      }
    }, (error) => {
      console.error("Error listening to user profile data:", error);
      setGuildDataError("Failed to load your profile data.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, fetchTrigger]);

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

  useEffect(() => {
    if (user && guildData) {
      energyManagement.checkEnergyReset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, guildData]);

  // Listen for and process guild join requests from the subcollection
  useEffect(() => {
    if (user && guildData?.isFounder) {
      const requestsRef = collection(db, 'guilds', user.uid, 'joinRequests');
      const unsubscribe = onSnapshot(requestsRef, (snapshot) => {
        if (snapshot.empty) {
          return;
        }

        snapshot.docs.forEach(async (requestDoc) => {
          const requestData = requestDoc.data();
          const memberId = requestDoc.id;

          // Use a transaction or careful ordering to ensure atomicity
          try {
            const memberProfileRef = doc(db, 'guilds', memberId);
            const founderGuildRef = doc(db, 'guilds', user.uid);

            // 1. Add member to the founder's guild document
            await updateDoc(founderGuildRef, {
              members: arrayUnion({
                uid: memberId,
                name: requestData.memberName,
                email: requestData.memberEmail,
                role: requestData.memberRole, // Core Role
                permissionRole: 'knight', // Default Permission Role
                joinedAt: new Date().toISOString()
              }),
              gold: increment(50) // Guild gets bonus
            });

            // 2. Update the member's document to mark as approved
            await updateDoc(memberProfileRef, {
              joinRequestStatus: 'approved'
            });

            // 3. Delete the processed join request
            await deleteDoc(requestDoc.ref);

            console.log(`Approved and added member: ${memberId}`);

          } catch (error) {
            console.error(`Failed to approve member ${memberId}:`, error);
          }
        });
      });

      return () => unsubscribe();
    }
  }, [user, guildData?.isFounder]);

  useEffect(() => {
    if (location.pathname === '/' && !localStorage.getItem('hasVisited')) {
      localStorage.setItem('hasVisited', 'true');
      navigate('/landing-page', { replace: true });
    }
  }, []);

  const handleSignIn = async () => {
    try {
      // Add these settings to avoid CORS issues
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      });

      await signInWithPopup(auth, googleProvider);
      if (userInteracted) soundManager.play('levelUp');
    } catch (error: any) {
      console.error('Sign in error:', error);

      // Handle specific auth errors
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('User closed the popup');
      } else if (error.code === 'auth/popup-blocked') {
        setModalContent({
          title: "Popup Blocked",
          message: "Please allow popups for this site to sign in with Google."
        });
      }

      if (userInteracted) soundManager.play('error');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setGuildData(null);
      setCeoAvatar(null);
      setShowOnboarding(false);
      if (userInteracted) soundManager.play('swordDraw');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // FOUNDER ONBOARDING COMPLETION
  const handleFounderOnboardingComplete = async (data: any) => {
    if (!user) return;

    if (!navigator.onLine) {
      setModalContent({
        title: "Offline",
        message: "You are offline. Connect to the internet to create your guild."
      });
      return;
    }

    setLoading(true);

    // Destructure to remove the non-serializable user object from the data
    const { user: _firebaseUser, ...onboardingData } = data;

    try {
      // Get the role from onboarding data
      const selectedRole = onboardingData.role;

      // Create initial guild data based on onboarding
      const initialGuildData: GuildDataWithEnergy = {
        guildId: user.uid,
        guildName: onboardingData.guildName || `${onboardingData.name}'s Guild`,
        vision: onboardingData.vision,
        xp: 150, // Bonus XP for completing onboarding
        gold: 50, // Founder's Grant
        level: 1,
        guildLevel: 1,
        achievements: ['onboarding_complete', 'guild_founded', 'role_chosen'],
        questProgress: {},
        onboardingData: onboardingData,

        // Role and Attributes
        role: selectedRole,
        attributes: {
          Tech: selectedRole === 'engineer' ? 2 : 1,
          Marketing: selectedRole === 'herald' ? 2 : 1,
          Sales: selectedRole === 'vanguard' ? 2 : 1,
          Legal: selectedRole === 'loremaster' ? 2 : 1,
          Operations: selectedRole === 'quartermaster' ? 2 : 1,
          Finance: selectedRole === 'treasurer' ? 2 : 1,
        },
        permissionRole: 'knight', // Default permission role for members

        // Fix for missing properties
        coreAttribute: selectedRole,
        avatar: null,
        ceoAvatarId: '',
        inventory: [],
        equippedGear: [],
        treasures: [],
        activeEffects: [],

        // Energy System
        currentEnergy: ENERGY_CONFIG.MAX_DAILY_ENERGY,
        maxEnergy: ENERGY_CONFIG.MAX_DAILY_ENERGY,
        lastEnergyReset: serverTimestamp(),
        isPremium: false,
        premiumExpiryDate: null,
        energyPurchaseHistory: [],

        // Guild Management
        isFounder: true,
        founderId: user.uid,
        members: [{
          uid: user.uid,
          name: onboardingData.name || user.displayName,
          email: user.email,
          role: selectedRole, // Core Role
          founderRole: selectedRole, //This seems redundant, but leaving for now
          permissionRole: 'leader', // Permission Role
          joinedAt: new Date().toISOString()
        }],

        // Invites sent
        invitesSent: [],

        // Timestamps
        lastCheckIn: serverTimestamp(),
        checkInStreak: 1,
        dailyStreak: 0,
        lastDailyBonus: null,
        createdAt: serverTimestamp()
      };

      // Save to Firestore
      await setDoc(doc(db, 'guilds', user.uid), initialGuildData);
      setGuildData(initialGuildData);
      setShowOnboarding(false);

      if (userInteracted) soundManager.play('levelUp');
      triggerConfetti();

      // Send invites to invited members
      if (onboardingData.invites && onboardingData.invites.length > 0) {
        const guildRef = doc(db, 'guilds', user.uid);
        const newInvites: { email: string; token: string; status: string; sentAt: string; }[] = [];

        for (const email of onboardingData.invites) {
          if (email) {
            try {
              const inviteToken = uuidv4();
              const inviteLink = createInviteLink({ ...initialGuildData, invitesSent: [] }, inviteToken);
              const { subject, body } = generateGuildInviteEmail({
                guildName: initialGuildData.guildName,
                founderName: onboardingData.name || 'the Founder',
                ventureIdea: initialGuildData.vision,
                inviteLink,
              });

              newInvites.push({ email, token: inviteToken, status: 'pending', sentAt: new Date().toISOString() });
              sendEmail(email, subject, body);
            } catch (error) {
              console.error(`Failed to send invite to ${email}:`, error);
            }
          }
        }

        if (newInvites.length > 0) {
          await updateDoc(guildRef, {
            invitesSent: arrayUnion(...newInvites)
          });
          setGuildData((prev: GuildDataWithEnergy | null) => prev ? { ...prev, invitesSent: [...(prev.invitesSent || []), ...newInvites] } : null);
        }

        setModalContent({
          title: "Invitations Sent",
          message: "Invitations have been sent to your team members!"
        });
      }

      // Automatically open the first quest for the user
      const fundamentalsStage = Object.values(QUEST_STAGES).find((s: any) => s.id === 'fundamentals');
      if (fundamentalsStage) {
        const visionQuest = fundamentalsStage.quests.find((q: any) => q.id === 'vision');
        if (visionQuest) {
          setSelectedQuest(visionQuest);
        }
      }

    } catch (error: any) {
      console.error('Error creating guild:', error);
      if (userInteracted) soundManager.play('error');

      if (error?.code === 'unavailable' || error?.message?.includes('offline')) {
        setModalContent({
          title: "Connection Error",
          message: "Unable to create your guild. Check your internet connection."
        });
      } else {
        setModalContent({
          title: "Error",
          message: "Guild creation failed. Please try again."
        });
      }
    }

    setLoading(false);
  };

  // MEMBER ONBOARDING COMPLETION
  const handleMemberOnboardingComplete = async (data: any) => {
    if (!user || !inviteData) return;

    if (!navigator.onLine) {
      setModalContent({
        title: "Offline",
        message: "You are offline. Connect to the internet to join the guild."
      });
      return;
    }

    setLoading(true);

    // Destructure to remove the non-serializable user object from the data
    const { user: _firebaseUser, ...onboardingData } = data;

    try {
      // Get the role from onboarding data
      const selectedRole = onboardingData.role;

      // Create member profile
      const memberData: GuildDataWithEnergy = {
        guildId: inviteData.guildId, // Join the existing guild
        guildName: inviteData.guildName,
        vision: inviteData.ventureIdea,
        isFounder: false,
        founderId: inviteData.guildId, // Reference to founder's ID

        // Member-specific data
        xp: 100, // Starting XP for members
        gold: 0, // Members start with 0 personal gold
        level: 1, // Will be synced with main guild
        guildLevel: 1,
        achievements: ['onboarding_complete', 'role_chosen'],
        questProgress: {},
        onboardingData: {
          ...onboardingData,
          email: user.email,
          name: onboardingData.name || user.displayName,
        },
        joinRequestStatus: 'pending',

        // Role and Attributes
        role: selectedRole,
        attributes: {
          Tech: selectedRole === 'engineer' ? 2 : 1,
          Marketing: selectedRole === 'herald' ? 2 : 1,
          Sales: selectedRole === 'vanguard' ? 2 : 1,
          Legal: selectedRole === 'loremaster' ? 2 : 1,
          Operations: selectedRole === 'quartermaster' ? 2 : 1,
          Finance: selectedRole === 'treasurer' ? 2 : 1,
        },
        permissionRole: 'knight', // Default permission role for members

        // Fix for missing properties
        coreAttribute: selectedRole,
        avatar: null,
        ceoAvatarId: '',
        inventory: [],
        equippedGear: [],
        treasures: [],
        activeEffects: [],

        // Energy System
        currentEnergy: ENERGY_CONFIG.MAX_DAILY_ENERGY,
        maxEnergy: ENERGY_CONFIG.MAX_DAILY_ENERGY,
        lastEnergyReset: serverTimestamp(),
        isPremium: false,
        premiumExpiryDate: null,
        energyPurchaseHistory: [],

        // Member info
        members: [], // Will be populated from main guild

        // Timestamps
        lastCheckIn: serverTimestamp(),
        checkInStreak: 1,
        dailyStreak: 0,
        lastDailyBonus: null,
        createdAt: serverTimestamp()
      };

      // Save member profile
      await setDoc(doc(db, 'guilds', user.uid), memberData);

      // Create a join request in the founder's subcollection
      const joinRequestRef = doc(db, 'guilds', inviteData.guildId, 'joinRequests', user.uid);
      await setDoc(joinRequestRef, {
        memberName: onboardingData.name || user.displayName,
        memberEmail: user.email,
        memberRole: selectedRole,
        requestedAt: serverTimestamp()
      });

      // Remove the direct update to the founder's guild
      setGuildData(memberData);
      setShowOnboarding(false);

      if (userInteracted) soundManager.play('levelUp');
      triggerConfetti();

      setModalContent({
        title: "Request Sent",
        message: "Your request to join the guild has been sent to the founder for approval!"
      });

    } catch (error: any) {
      console.error('Error joining guild:', error);
      if (userInteracted) soundManager.play('error');
      setModalContent({
        title: "Error",
        message: "Error joining guild. Please try again."
      });
    }

    setLoading(false);
  };

  // MEMBER ONBOARDING DECLINE
  const handleMemberOnboardingDecline = () => {
    // Redirect away or show alternative action
    window.location.href = '/';
  };

  const saveConversation = async (quest: any, question: string, response: string) => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'conversations'), {
        userId: user.uid,
        questId: quest?.id || 'general',
        questName: quest?.name || 'General Conversation',
        question: question,
        response: response,
        createdAt: serverTimestamp()
      });

      if (conversations.length + 1 >= 20 && !guildData?.achievements?.includes('conversation_pro')) {
        await updateDoc(doc(db, 'guilds', user.uid), {
          achievements: arrayUnion('conversation_pro'),
          xp: increment(50)
        });
        if (userInteracted) soundManager.play('levelUp');
      }
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  };

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

      await updateDoc(doc(db, 'guilds', user.uid), {
        xp: increment(template.xp)
      });

      const newXP = (guildData.xp || 0) + template.xp;
      setGuildData({ ...guildData, xp: newXP });
      if (userInteracted) soundManager.play('questComplete');

      if (savedDocuments.length + 1 >= 5 && !guildData.achievements?.includes('document_master')) {
        await updateDoc(doc(db, 'guilds', user.uid), {
          achievements: arrayUnion('document_master'),
          xp: increment(50)
        });
        if (userInteracted) soundManager.play('levelUp');
      }
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };

  const updateGold = async (amount: number) => {
    if (!user || !guildData) return;

    const newGold = Math.max(0, (guildData.gold || 0) + amount);

    try {
      await updateDoc(doc(db, 'guilds', user.uid), {
        gold: newGold
      });

      setGuildData({ ...guildData, gold: newGold });

      if (newGold >= 10000 && !guildData.achievements?.includes('gold_hoarder')) {
        await updateDoc(doc(db, 'guilds', user.uid), {
          achievements: arrayUnion('gold_hoarder'),
          xp: increment(100)
        });
        if (userInteracted) soundManager.play('levelUp');
      }
    } catch (error) {
      console.error('Error updating gold:', error);
    }
  };

  const claimDailyBonus = async () => {
    if (!user || !guildData) return;

    const now = new Date();
    const lastClaim = guildData.lastDailyBonus;
    const lastClaimDate = lastClaim ? new Date(lastClaim) : null;

    if (lastClaimDate && now.toDateString() === lastClaimDate.toDateString()) {
      setModalContent({ title: "Already Claimed", message: "You have already claimed your daily bonus today. Come back tomorrow!" });
      return;
    }

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

      if (userInteracted) soundManager.play('coinCollect');
      triggerConfetti({
        particleCount: 30,
        spread: 45,
        origin: { y: 0.3 }
      });

      if (newStreak >= 30 && !guildData.achievements?.includes('daily_champion')) {
        await updateDoc(doc(db, 'guilds', user.uid), {
          achievements: arrayUnion('daily_champion'),
          xp: increment(200)
        });
        if (userInteracted) soundManager.play('levelUp');
      }
    } catch (error) {
      console.error('Error claiming daily bonus:', error);
    }
  };

  const completeQuest = async (questData: any) => {
    if (!user || !guildData) return;

    soundManager.play('questComplete');
    triggerConfetti();

    const questKey = `${selectedQuest.stageId}_${selectedQuest.id}`;
    const guildRef = doc(db, 'guilds', guildData.guildId);

    const updates: { [key: string]: any } = {
      [`questProgress.${questKey}`]: {
        ...questData,
        completed: true,
      },
      xp: increment(questData.xpReward),
      gold: increment(questData.goldReward),
      lastQuestCompletedAt: serverTimestamp(),
    };

    // --- Achievement Logic ---
    const updatedQuestProgress = {
      ...guildData.questProgress,
      [questKey]: { completed: true }
    };

    const currentUserMember = guildData.members.find((m: any) => m.uid === user.uid);
    const currentUserRole = currentUserMember?.role;

    if (currentUserRole) {
      const existingAchievements = guildData.achievements || {};
      const newAchievements = checkAndAwardAchievements(
        currentUserRole,
        updatedQuestProgress,
        existingAchievements
      );

      if (newAchievements.length > 0) {
        setNewlyAwardedAchievements(newAchievements);
        const achievementsUpdate: { [key: string]: any } = {};
        newAchievements.forEach((ach: any) => {
          achievementsUpdate[`achievements.${ach.name}`] = {
            unlockedAt: serverTimestamp(),
            description: ach.description,
            icon: ach.icon
          };
        });
        Object.assign(updates, achievementsUpdate);
      }
    }
    // --- End Achievement Logic ---

    try {
      await updateDoc(guildRef, updates);
      setSelectedQuest(null);
    } catch (error) {
      console.error('Error completing quest:', error);
      alert('There was an error completing the quest. Please try again.');
    }
  };

  const savePersonalizedQuestDetails = async (questKey: string, personalizedData: any) => {
    if (!user || !guildData) return;
    try {
      await updateDoc(doc(db, 'guilds', user.uid), {
        [`questProgress.${questKey}.personalizedData`]: personalizedData
      });
      // Optionally update local state to avoid re-fetch
      setGuildData((prev: any) => ({
        ...prev,
        questProgress: {
          ...prev.questProgress,
          [questKey]: {
            ...prev.questProgress?.[questKey],
            personalizedData
          }
        }
      }));
    } catch (error) {
      console.error('Error saving personalized quest details:', error);
    }
  };

  const handleArmoryPurchase = async (item: any, category: string) => {
    if (!user || !guildData) return;

    const newGold = (guildData.gold || 0) - item.price;

    if (newGold < 0) {
      setModalContent({ title: "Not Enough Gold", message: "You do not have enough gold coins for this purchase." });
      if (userInteracted) soundManager.play('error');
      return;
    }

    try {
      const updateData: any = {
        gold: newGold
      };

      if (category === 'gear') {
        updateData.inventory = arrayUnion(item.id);
        updateData.equippedGear = arrayUnion(item.id);
      } else if (category === 'consumables') {
        updateData.inventory = arrayUnion(item.id);
      } else if (category === 'treasures') {
        updateData.treasures = arrayUnion(item.id);
      }

      const totalPurchases = (guildData.inventory?.length || 0) +
        (guildData.equippedGear?.length || 0) +
        (guildData.treasures?.length || 0) + 1;

      if (totalPurchases >= 5 && !guildData.achievements?.includes('gear_collector')) {
        updateData.achievements = arrayUnion('gear_collector');
        updateData.xp = increment(100);
      }

      await updateDoc(doc(db, 'guilds', user.uid), updateData);

      setGuildData({
        ...guildData,
        gold: newGold,
        inventory: [...(guildData.inventory || []), item.id],
        ...(category === 'gear' ? { equippedGear: [...(guildData.equippedGear || []), item.id] } : {}),
        ...(category === 'treasures' ? { treasures: [...(guildData.treasures || []), item.id] } : {})
      });

      setModalContent({ title: "Purchase Successful", message: `You have purchased ${item.name} for ${item.price} gold coins.` });
    } catch (error) {
      console.error('Error purchasing item:', error);
      if (userInteracted) soundManager.play('error');
      setModalContent({ title: "Error", message: "Purchase failed. Please try again." });
    }
  };

  const handleGenerateDocument = async (template: any) => {
    setGeneratingDoc(true);
    if (userInteracted) soundManager.play('magicCast');

    const hasEnergy = await energyManagement.consumeEnergy('DOCUMENT_GENERATION');
    if (!hasEnergy) {
      setGeneratingDoc(false);
      return;
    }

    const content = await generateAIDocument(template, { ...guildData, ceoAvatar }, bedrockClient);
    await saveDocument(template, content);
    setGeneratingDoc(false);
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
      await updateDoc(doc(db, 'guilds', user.uid), {
        [`questProgress.${questKey}.assignedTo`]: {
          uid: member.uid,
          name: member.name,
        }
      });

      setGuildData((prev: any) => ({
        ...prev,
        questProgress: {
          ...prev.questProgress,
          [questKey]: {
            ...prev.questProgress?.[questKey],
            assignedTo: { uid: member.uid, name: member.name }
          }
        }
      }));
      setAssignmentModal(null);
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
    if (
      !guildData?.guildLevel ||
      (quest.stageId === 'fundamentals' && guildData.guildLevel < 1) ||
      (quest.stageId === 'kickoff' && guildData.guildLevel < 2) ||
      (quest.stageId === 'gtm' && guildData.guildLevel < 3) ||
      (quest.stageId === 'growth' && guildData.guildLevel < 4) ||
      (quest.stageId === 'launch' && guildData.guildLevel < 5)
    ) {
      setModalContent({
        title: "Quest Unlocked",
        message: "You need to complete previous stages to unlock this quest."
      });
      return;
    }
    setSelectedQuest(quest);
    soundManager.play('swordDraw');
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
            <Canvas3DErrorBoundary>
              <Canvas
                camera={{ position: [0, 0, 7], fov: 50 }}
                style={{ width: '100%', height: '100%' }}
                gl={{
                  antialias: true,
                  preserveDrawingBuffer: true,
                  powerPreference: "high-performance"
                }}
              >
                {/* Use the Drei helpers for lights, as ambientLight and pointLight are not valid JSX elements */}
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore */}
                <primitive object={new THREE.AmbientLight(0xffffff, 0.5)} />
                {/* @ts-ignore */}
                <primitive object={new THREE.PointLight(0xffffff, 1)} position={[10, 10, 10]} />
                <Suspense fallback={null}>
                  <DiamondSword3D rotation={[0.3, 0, 0.3]} scale={[2, 2, 2]} standingRotation={{ x: 0, y: 0, z: Math.PI / 2 }} />
                </Suspense>
              </Canvas>
            </Canvas3DErrorBoundary>
          </div>
          <h1 className="text-3xl font-bold text-yellow-100 mb-2">The Startup Quest</h1>
          <p className="text-gray-300 mb-6">Start your journey to building your company</p>
          <button
            onClick={handleSignIn}
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
  const currentUserRole = guildData?.members?.find((m: any) => m.uid === user.uid)?.permissionRole;

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans">
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
            <span>Beastiary</span>
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
      <main className="flex-1 flex flex-col bg-black/50 overflow-hidden">
        {/* Top Header Bar */}
        <header className="parchment shadow-md px-6 py-3 border-b-2 border-yellow-700 flex-shrink-0">
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


        <div className="flex-1 overflow-y-auto">
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
              setGuildData={setGuildData}
              vision={guildData?.vision}
              savePersonalizedQuestDetails={savePersonalizedQuestDetails}
              currentUserRole={currentUserRole}
              user={user}
            />
          ) : showArmory ? (
            <ArmoryInterface
              guildData={guildData}
              onPurchase={handleArmoryPurchase}
              soundManager={soundManager}
              onClose={() => setShowArmory(false)}
            />
          ) : showGuildManagement ? (
            <GuildManagement
              guildData={guildData}
              setGuildData={setGuildData}
              onClose={() => setShowGuildManagement(false)}
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
                  <DailyBonus guildData={guildData} onClaim={claimDailyBonus} soundManager={soundManager} />
                </div>

                {/* Main Quest Map */}
                <div className="relative flex flex-col items-center space-y-8">
                  {Object.values(QUEST_STAGES).map((stage, index, stages) => {
                    const isLocked = stage.id !== 'fundamentals' && guildData?.guildLevel <
                      (stage.id === 'kickoff' ? 2 : stage.id === 'gtm' ? 3 : stage.id === 'growth' ? 4 : 5);
                    const StageIcon = stage.icon;

                    return (
                      <React.Fragment key={stage.id}>
                        <div
                          className={`w-full max-w-4xl parchment rounded-lg p-6 shadow-xl transition-all duration-500 ${isLocked ? 'opacity-50 grayscale' : 'hover:shadow-2xl'
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
                              {isLocked && (
                                <p className="text-xs text-orange-400 mt-1">⚠️ Complete previous stages to unlock</p>
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

                              return (
                                <div
                                  key={quest.id}
                                  onClick={() => {
                                    if (!isLocked) {
                                      handleOpenQuest({ ...quest, stageId: stage.id });
                                    }
                                  }}
                                  onMouseEnter={() => { if (!isLocked && userInteracted) soundManager.play('swordDraw'); }}
                                  className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${isLocked
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
            setGuildData={setGuildData}
            vision={guildData?.vision}
            savePersonalizedQuestDetails={savePersonalizedQuestDetails}
            currentUserRole={currentUserRole}
            user={user}
          />
        )}
        {showGuildManagement && (
          <GuildManagement
            guildData={guildData}
            onClose={() => { setShowGuildManagement(false); if (userInteracted) soundManager.play('swordDraw'); }}
            setGuildData={setGuildData}
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
        <Modal open={showDashboard} size='full' onClose={() => { setShowDashboard(false); if (userInteracted) soundManager.play('swordDraw'); }}>
          <div className="p-6 w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-yellow-100">Progress</h3>
              <button
                onClick={() => { setShowDashboard(false); if (userInteracted) soundManager.play('swordDraw'); }}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="parchment rounded-lg p-4">
                <p className="text-sm text-gray-300 mb-1">Total XP</p>
                <p className="text-2xl font-bold text-purple-400">{guildData?.xp || 0}</p>
              </div>
              <div className="parchment rounded-lg p-4">
                <p className="text-sm text-gray-300 mb-1">Gold Coins</p>
                <p className="text-2xl font-bold text-yellow-400">{guildData?.gold || 0}</p>
              </div>
              <div className="parchment rounded-lg p-4">
                <p className="text-sm text-gray-300 mb-1">Quests Completed</p>
                <p className="text-2xl font-bold text-green-400">{stats.completedQuests}/{stats.totalQuests}</p>
              </div>
              <div className="parchment rounded-lg p-4">
                <p className="text-sm text-gray-300 mb-1">Guild Level</p>
                <p className="text-2xl font-bold text-blue-400">{guildLevel.name}</p>
              </div>
            </div>
            <div className="mb-6">
              <h4 className="text-lg font-bold mb-3 text-yellow-100">Your Progress</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-300 mb-1">Documents Created</p>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${Math.min(savedDocuments.length * 20, 100)}%` }}></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-300 mb-1">Conversations</p>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(conversations.length * 5, 100)}%` }}></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-300 mb-1">Daily Streak</p>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${Math.min((guildData?.dailyStreak || 0) * 3.33, 100)}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{guildData?.dailyStreak || 0} days</p>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h4 className="text-lg font-bold mb-3 text-yellow-100">Skills</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(CORE_ATTRIBUTES).map(([key, attr]) => {
                  const AttributeIcon = attr.icon;
                  const attrXP = Object.entries(guildData?.questProgress || {})
                    .filter(([, data]: any) => data.completed)
                    .reduce((sum, [questKey]: any) => {
                      const quest = Object.values(QUEST_STAGES)
                        .flatMap(stage => stage.quests)
                        .find(q => questKey.includes(q.id));
                      return quest?.attribute === key ? sum + (quest.xp ?? 0) : sum;
                    }, 0);
                  return (
                    <div key={key} className="parchment rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        {typeof AttributeIcon === 'string' ? (
                          <span style={{ fontSize: '1.5rem' }}>{AttributeIcon}</span>
                        ) : null}
                        <span className="text-sm font-medium text-yellow-100">{attr.name}</span>
                      </div>
                      <p className="text-lg font-bold text-yellow-100">{attrXP} XP</p>
                      {guildData?.coreAttribute === key && (
                        <span className="text-xs text-purple-400">Primary Skill (+50% XP)</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-3 text-yellow-100">Achievements</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {ACHIEVEMENTS.map((achievement) => {
                  const earned = guildData?.achievements?.includes(achievement.id);
                  return (
                    <div
                      key={achievement.id}
                      className={`parchment rounded-lg p-3 text-center ${earned ? 'magic-border' : 'opacity-50'
                        }`}
                    >
                      <div className="text-3xl mb-1">{typeof achievement.icon === 'string' ? achievement.icon : null}</div>
                      <p className="text-xs font-medium text-yellow-100">{achievement.name}</p>
                      <p className="text-xs text-gray-400 mt-1">{achievement.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Modal>
        <Modal open={showResources} onClose={() => { setShowResources(false); if (userInteracted) soundManager.play('swordDraw'); }}>
          <div className="p-6 max-w-4xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-yellow-100">Resources</h3>
              <button
                onClick={() => { setShowResources(false); if (userInteracted) soundManager.play('swordDraw'); }}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <div className="parchment p-4 mb-6 magic-border">
              <div className="flex items-start space-x-3">
                <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-400">Based on your profile:</p>
                  <p className="text-sm text-gray-300">
                    Primary Skill: {guildData?.coreAttribute} •
                    Level: {levelInfo.level}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-3 flex items-center text-yellow-100">
                  <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                  Recommended Reading
                </h4>
                <div className="space-y-2">
                  <a href="https://www.ycombinator.com/library" target="_blank" rel="noopener noreferrer"
                    className="block parchment rounded p-3 hover:transform hover:scale-105 transition-all"
                    onMouseEnter={() => { if (userInteracted) soundManager.play('swordDraw'); }}>
                    <p className="font-medium text-yellow-100">YC Library</p>
                    <p className="text-xs text-gray-300">Startup resources</p>
                  </a>
                  <a href="https://firstround.com/review/" target="_blank" rel="noopener noreferrer"
                    className="block parchment rounded p-3 hover:transform hover:scale-105 transition-all"
                    onMouseEnter={() => { if (userInteracted) soundManager.play('swordDraw'); }}>
                    <p className="font-medium text-yellow-100">First Round Review</p>
                    <p className="text-xs text-gray-300">Founder stories</p>
                  </a>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-3 flex items-center text-yellow-100">
                  <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                  Tools
                </h4>
                <div className="space-y-2">
                  <a href="https://stripe.com/atlas" target="_blank" rel="noopener noreferrer"
                    className="block parchment rounded p-3 hover:transform hover:scale-105 transition-all"
                    onMouseEnter={() => { if (userInteracted) soundManager.play('swordDraw'); }}>
                    <p className="font-medium text-yellow-100">Stripe Atlas</p>
                    <p className="text-xs text-gray-300">Company formation</p>
                  </a>
                  <a href="https://www.notion.so/templates" target="_blank" rel="noopener noreferrer"
                    className="block parchment rounded p-3 hover:transform hover:scale-105 transition-all"
                    onMouseEnter={() => { if (userInteracted) soundManager.play('swordDraw'); }}>
                    <p className="font-medium text-yellow-100">Notion Templates</p>
                    <p className="text-xs text-gray-300">Productivity templates</p>
                  </a>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-3 flex items-center text-yellow-100">
                  <Users className="w-5 h-5 mr-2 text-green-500" />
                  Communities
                </h4>
                <div className="space-y-2">
                  <a href="https://www.indiehackers.com/" target="_blank" rel="noopener noreferrer"
                    className="block parchment rounded p-3 hover:transform hover:scale-105 transition-all"
                    onMouseEnter={() => { if (userInteracted) soundManager.play('swordDraw'); }}>
                    <p className="font-medium text-yellow-100">Indie Hackers</p>
                    <p className="text-xs text-gray-300">Founder community</p>
                  </a>
                  <a href="https://news.ycombinator.com/" target="_blank" rel="noopener noreferrer"
                    className="block parchment rounded p-3 hover:transform hover:scale-105 transition-all"
                    onMouseEnter={() => { if (userInteracted) soundManager.play('swordDraw'); }}>
                    <p className="font-medium text-yellow-100">Hacker News</p>
                    <p className="text-xs text-gray-300">Startup news</p>
                  </a>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-3 flex items-center text-yellow-100">
                  <Video className="w-5 h-5 mr-2 text-purple-500" />
                  Learning
                </h4>
                <div className="space-y-2">
                  <a href="https://www.startupschool.org/" target="_blank" rel="noopener noreferrer"
                    className="block parchment rounded p-3 hover:transform hover:scale-105 transition-all"
                    onMouseEnter={() => { if (userInteracted) soundManager.play('swordDraw'); }}>
                    <p className="font-medium text-yellow-100">Startup School</p>
                    <p className="text-xs text-gray-300">Free YC training</p>
                  </a>
                  <a href="https://www.coursera.org/browse/business/entrepreneurship" target="_blank" rel="noopener noreferrer"
                    className="block parchment rounded p-3 hover:transform hover:scale-105 transition-all"
                    onMouseEnter={() => { if (userInteracted) soundManager.play('swordDraw'); }}>
                    <p className="font-medium text-yellow-100">Coursera</p>
                    <p className="text-xs text-gray-300">Entrepreneurship courses</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Modal>
        <Modal open={showCEOProfile && ceoAvatar} onClose={() => { setShowCEOProfile(false); if (userInteracted) soundManager.play('swordDraw'); }}>
          <div className="p-6 w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-yellow-100">Your CEO Guide</h3>
              <button
                onClick={() => { setShowCEOProfile(false); if (userInteracted) soundManager.play('swordDraw'); }}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <div className={`text-center mb-6 p-6 rounded-lg bg-gradient-to-r ${ceoAvatar?.color} bg-opacity-20 parchment`}>
              <div className="text-6xl mb-2">{ceoAvatar?.avatar}</div>
              <h4 className="text-xl font-bold text-yellow-100">{ceoAvatar?.name}</h4>
              <p className="text-sm text-gray-300">{ceoAvatar?.title}</p>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400 mb-1">Industries</p>
                <div className="flex flex-wrap gap-2">
                  {ceoAvatar?.industries.map((ind: string) => (
                    <span key={ind} className="px-2 py-1 parchment rounded text-sm">
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Traits</p>
                <div className="flex flex-wrap gap-2">
                  {ceoAvatar?.traits.map((trait: string) => (
                    <span key={trait} className="px-2 py-1 parchment rounded text-sm">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-3 border-t border-gray-700">
                <p className="text-sm text-gray-400 mb-1">Advice</p>
                <p className="italic text-yellow-100">"{ceoAvatar?.advice}"</p>
              </div>
            </div>
          </div>
        </Modal>
        <Modal open={showHistory} onClose={() => { setShowHistory(false); if (userInteracted) soundManager.play('swordDraw'); }}>
          <div className="p-6 max-w-4xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-yellow-100">Conversations</h3>
              <button
                onClick={() => { setShowHistory(false); if (userInteracted) soundManager.play('swordDraw'); }}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            {conversations.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No conversations recorded yet</p>
            ) : (
              <div className="space-y-4">
                {conversations.map((conv) => (
                  <div key={conv.id} className="parchment rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-purple-400">{conv.questName}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(conv.createdAt?.toDate()).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <User className="w-4 h-4 text-blue-400 mt-1" />
                        <p className="text-sm text-gray-300">{conv.question}</p>
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
              <DocumentRAG userId={user.uid} ceoAvatar={ceoAvatar} />
            </div>
          </div>
        </Modal>
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
        {showGoldPurchase && (
          <GoldPurchase
            user={user}
            guildData={guildData}
            onClose={() => { setShowGoldPurchase(false); if (userInteracted) soundManager.play('swordDraw'); }}
            soundManager={soundManager}
            onPurchaseSuccess={(newGold, purchaseData) => {
              setGuildData((prev: any) => ({
                ...prev,
                gold: newGold,
                purchaseHistory: [...(prev.purchaseHistory || []), purchaseData],
                totalSpent: (prev.totalSpent || 0) + purchaseData.amount,
                lastPurchase: purchaseData.timestamp
              }));
            }}
          />
        )}

        {/* Energy Purchase Modal */}
        {guildData && (
          <EnergyPurchaseModal
            isOpen={energyManagement.showEnergyPurchase}
            onClose={() => energyManagement.setShowEnergyPurchase(false)}
            currentGold={guildData.gold}
            onPurchase={energyManagement.purchaseEnergy}
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
          user={user}
        />
      )}
    </div>
  );
}