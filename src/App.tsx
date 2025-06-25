import { useState, useEffect, useRef, Suspense } from 'react';
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
  User,
  History,
  Brain,
  Star,
  Copy,
  BarChart3,
  Lightbulb,
  BookOpen,
  AlertCircle,
  Send,
  Save,
  Edit3,
  ExternalLink,
  Video,
  X,
  Coins,
  ShoppingBag,
  Loader2,
  RefreshCw,
  Zap,
  Gem,
  UserPlus,
  Gift,
  Volume2,
  VolumeX,
  Scroll,
  Diamond,
  Swords,
  Castle,
  Trophy,
  PocketIcon,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Modal from './components/Modal';
import confetti from 'canvas-confetti';
import DocumentRAG from './components/DocumentRAG';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import DiamondSword3D from './components/DiamondSword3D';

// Medieval Fantasy Styles with better fonts and enhanced cursor
const medievalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=MedievalSharp&family=Pirata+One&family=Almendra:wght@400;700&family=Uncial+Antiqua&display=swap');

  * {
    cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><defs><filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter><linearGradient id="blade" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23e0f2fe;stop-opacity:1" /><stop offset="50%" style="stop-color:%23fef3c7;stop-opacity:1" /><stop offset="100%" style="stop-color:%23dbeafe;stop-opacity:1" /></linearGradient><linearGradient id="handle" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:%238b4513;stop-opacity:1" /><stop offset="100%" style="stop-color:%23654321;stop-opacity:1" /></linearGradient></defs><g transform="rotate(-45 20 20)"><rect x="18" y="5" width="4" height="20" fill="url(%23blade)" filter="url(%23glow)" opacity="0.9"/><rect x="17" y="23" width="6" height="8" fill="url(%23handle)"/><rect x="15" y="22" width="10" height="2" fill="%23d4af37"/><circle cx="20" cy="23" r="2" fill="%23ffd700" opacity="0.8"/><path d="M20,5 L18,3 L20,1 L22,3 Z" fill="%23e0f2fe" opacity="0.7"/></g><circle cx="20" cy="20" r="15" fill="none" stroke="%23ffd700" stroke-width="0.5" opacity="0.3"><animate attributeName="r" values="15;20;15" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite"/></circle></svg>'), auto !important;
  }

  body {
    background: #0a0a0a;
    position: relative;
    overflow-x: hidden;
  }

  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2084') center/cover;
    filter: brightness(0.2) contrast(1.2);
    z-index: -2;
  }

  body::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 50%, rgba(139, 69, 19, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(218, 165, 32, 0.2) 0%, transparent 50%),
      radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.9) 100%);
    z-index: -1;
  }

  /* Magical particles */
  @keyframes floatParticle {
    0% { transform: translateY(100vh) translateX(0) scale(0) rotate(0deg); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(-100vh) translateX(100px) scale(1) rotate(360deg); opacity: 0; }
  }

  .magic-particle {
    position: fixed;
    width: 6px;
    height: 6px;
    background: radial-gradient(circle, #ffd700 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 100;
    box-shadow: 0 0 15px #ffd700, 0 0 30px #ffa500;
  }

  /* More readable typography */
  h1, h2, h3, h4, h5, h6 {
    font-family: 'MedievalSharp', serif !important;
    text-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 2px 4px rgba(0,0,0,0.8);
    letter-spacing: 1px;
  }

  p, span, div {
    font-family: 'Almendra', serif;
    letter-spacing: 0.5px;
    line-height: 1.6;
  }

  /* Enhanced button style */
  button {
    position: relative;
    background: linear-gradient(135deg, #2d1810 0%, #1a0e08 50%, #2d1810 100%);
    border: 2px solid #d4af37;
    border-radius: 8px;
    padding: 12px 24px;
    color: #fef3c7;
    font-family: 'MedievalSharp', serif;
    font-weight: 600;
    letter-spacing: 1px;
    box-shadow: 
      inset 0 0 20px rgba(212, 175, 55, 0.3),
      0 0 20px rgba(212, 175, 55, 0.4),
      0 4px 15px rgba(0, 0, 0, 0.8);
    transition: all 0.3s ease;
    overflow: hidden;
  }

  button::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%);
    transform: rotate(45deg);
    transition: all 0.5s ease;
    opacity: 0;
  }

  button:hover::before {
    opacity: 1;
    animation: shimmer 0.5s ease;
  }

  @keyframes shimmer {
    0% { transform: rotate(45deg) translateX(-100%); }
    100% { transform: rotate(45deg) translateX(100%); }
  }

  button:hover {
    transform: translateY(-2px);
    box-shadow: 
      inset 0 0 30px rgba(212, 175, 55, 0.5),
      0 0 40px rgba(212, 175, 55, 0.7),
      0 8px 20px rgba(0, 0, 0, 0.9);
    border-color: #ffd700;
  }

  /* Enhanced parchment containers */
  .parchment {
    background: 
      linear-gradient(135deg, rgba(45, 34, 30, 0.95) 0%, rgba(35, 26, 23, 0.95) 100%);
    border: 2px solid #8b6914;
    border-radius: 8px;
    position: relative;
    box-shadow: 
      inset 0 0 50px rgba(0, 0, 0, 0.5),
      0 0 30px rgba(0, 0, 0, 0.8),
      0 0 60px rgba(139, 105, 20, 0.3);
    backdrop-filter: blur(5px);
  }

  .parchment::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><defs><filter id="rough"><feTurbulence baseFrequency="0.02" numOctaves="5" result="noise" seed="5"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2"/></filter></defs><rect width="100" height="100" fill="none" stroke="%238b6914" stroke-width="0.5" opacity="0.3" filter="url(%23rough)"/></svg>');
    border-radius: 8px;
    pointer-events: none;
  }

  /* Glowing borders */
  .magic-border {
    position: relative;
  }

  .magic-border::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(45deg, #ffd700, #ff6b35, #ffd700, #4ecdc4);
    background-size: 400% 400%;
    border-radius: inherit;
    z-index: -1;
    animation: glowingBorder 4s ease infinite;
    opacity: 0.7;
  }

  @keyframes glowingBorder {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  /* 3D effect for important elements */
  .hero-3d {
    transform-style: preserve-3d;
    transform: perspective(1000px) rotateY(0deg);
    transition: transform 0.6s ease;
  }

  .hero-3d:hover {
    transform: perspective(1000px) rotateY(10deg) rotateX(-5deg);
  }

  /* Floating animation for 3D elements */
  @keyframes float3D {
    0%, 100% { transform: translateY(0px) rotateY(0deg); }
    25% { transform: translateY(-10px) rotateY(90deg); }
    50% { transform: translateY(0px) rotateY(180deg); }
    75% { transform: translateY(-10px) rotateY(270deg); }
  }

  .float-3d {
    animation: float3D 6s ease-in-out infinite;
  }

  /* Treasure chest effect */
  .treasure-glow {
    filter: drop-shadow(0 0 20px #ffd700) drop-shadow(0 0 40px #ff6b35);
    animation: treasurePulse 2s ease-in-out infinite;
  }

  @keyframes treasurePulse {
    0%, 100% { 
      filter: drop-shadow(0 0 20px #ffd700) drop-shadow(0 0 40px #ff6b35);
      transform: scale(1);
    }
    50% { 
      filter: drop-shadow(0 0 30px #ffd700) drop-shadow(0 0 60px #ff6b35);
      transform: scale(1.05);
    }
  }

  /* Enhanced input fields */
  input, textarea, select {
    background: rgba(20, 15, 10, 0.9) !important;
    border: 2px solid #8b6914 !important;
    border-radius: 6px !important;
    color: #fef3c7 !important;
    font-family: 'Almendra', serif !important;
    padding: 12px 16px !important;
    letter-spacing: 0.5px !important;
    box-shadow: 
      inset 0 2px 8px rgba(0, 0, 0, 0.6),
      0 0 15px rgba(139, 105, 20, 0.2) !important;
    transition: all 0.3s ease !important;
  }

  input:focus, textarea:focus, select:focus {
    outline: none !important;
    border-color: #d4af37 !important;
    box-shadow: 
      inset 0 2px 8px rgba(0, 0, 0, 0.6),
      0 0 25px rgba(212, 175, 55, 0.5) !important;
    background: rgba(25, 20, 15, 0.95) !important;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 12px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(20, 15, 10, 0.8);
    border: 1px solid #8b6914;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #8b6914, #d4af37);
    border-radius: 6px;
    border: 1px solid #2d1810;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #d4af37, #ffd700);
  }

  /* 3D stage for weapons */
  .weapon-stage {
    width: 100%;
    height: 200px;
    position: relative;
    background: radial-gradient(ellipse at center, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
    border-radius: 8px;
    overflow: hidden;
  }
`;

// 3D Sword Component
// Accepts rotation as a THREE.Euler or [number, number, number]
type Sword3DProps = {
  rotation?: [number, number, number] | THREE.Euler;
};
const Sword3D = ({ rotation = [0, 0, 0] }: Sword3DProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state: any) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group rotation={rotation as [number, number, number]}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        {/* Blade */}
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[0.1, 3, 0.02]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Guard */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.8, 0.1, 0.1]} />
          <meshStandardMaterial color="#8b6914" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Handle */}
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 1]} />
          <meshStandardMaterial color="#4a4a4a" />
        </mesh>
        {/* Pommel */}
        <mesh position={[0, -1, 0]}>
          <sphereGeometry args={[0.1]} />
          <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.3} />
        </mesh>
      </mesh>
    </group>
  );
};


// 3D Treasure Chest Component
const TreasureChest3D = ({ isOpen = false }) => {
  const groupRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
    if (lidRef.current && isOpen) {
      lidRef.current.rotation.x = Math.min(lidRef.current.rotation.x + 0.02, -0.5);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Chest base */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[2, 1, 1.5]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      {/* Chest lid */}
      <mesh ref={lidRef} position={[0, 0, -0.75]} rotation={[0, 0, 0]}>
        <boxGeometry args={[2, 0.5, 1.5]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      {/* Gold coins inside */}
      {isOpen && (
        <group position={[0, -0.3, 0]}>
          {[...Array(10)].map((_, i) => (
            <mesh key={i} position={[
              (Math.random() - 0.5) * 0.8,
              Math.random() * 0.3,
              (Math.random() - 0.5) * 0.6
            ]}>
              <cylinderGeometry args={[0.1, 0.1, 0.02]} />
              <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};

// Enhanced Sound Manager with medieval sounds
class SoundManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private enabled: boolean = true;

  constructor() {
    // Using placeholder URLs - in production, replace with actual medieval sound effects
    this.sounds = {
      swordDraw: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp9y9Dn'),
      swordHit: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp9y9Dn'),
      coinCollect: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp9y9Dn'),
      purchase: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp9y9Dn'),
      levelUp: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp9y9Dn'),
      questComplete: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp9y9Dn'),
      magicCast: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp9y9Dn'),
      error: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp9y9Dn')
    };

    // Set volume for all sounds
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

// Enhanced Animation Helper with magical effects
const triggerConfetti = (options = {}) => {
  const defaults = {
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#ffd700', '#ff6b35', '#fef3c7', '#c084fc', '#9333ea']
  };
  confetti({ ...defaults, ...options });
};

// Create magical particles
const createMagicalParticles = () => {
  const particleCount = 50;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'magic-particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 20 + 's';
    particle.style.animationDuration = (15 + Math.random() * 10) + 's';
    document.body.appendChild(particle);
  }
};

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

// Avatar Templates - Medieval themed
const AVATAR_TEMPLATES = [
  { id: 'knight', name: 'Noble Knight', icon: '⚔️', outfit: 'Plate Armor' },
  { id: 'wizard', name: 'Arcane Wizard', icon: '🧙', outfit: 'Mystical Robes' },
  { id: 'ranger', name: 'Forest Ranger', icon: '🏹', outfit: 'Leather Armor' },
  { id: 'paladin', name: 'Holy Paladin', icon: '🛡️', outfit: 'Blessed Armor' },
  { id: 'rogue', name: 'Shadow Rogue', icon: '🗡️', outfit: 'Dark Cloak' },
  { id: 'merchant', name: 'Wealthy Merchant', icon: '💰', outfit: 'Fine Garments' }
];

// Core Attributes System - Medieval themed
const CORE_ATTRIBUTES = {
  tech: { name: 'Artifice', icon: Gem, color: 'text-blue-500' },
  finance: { name: 'Treasury', icon: Coins, color: 'text-yellow-500' },
  marketing: { name: 'Heraldry', icon: Scroll, color: 'text-purple-500' },
  sales: { name: 'Mercantile', icon: ShoppingBag, color: 'text-orange-500' },
  legal: { name: 'Law', icon: Shield, color: 'text-red-500' },
  operations: { name: 'Logistics', icon: Castle, color: 'text-gray-500' }
};

// Guild Roles - Medieval themed
const GUILD_ROLES = {
  engineer: { name: 'Artificer', attribute: 'tech', icon: '⚙️', description: 'Masters of mystical technology' },
  treasurer: { name: 'Treasurer', attribute: 'finance', icon: '💰', description: 'Keepers of the guild vault' },
  herald: { name: 'Herald', attribute: 'marketing', icon: '📯', description: 'Spreaders of renown' },
  vanguard: { name: 'Merchant Prince', attribute: 'sales', icon: '⚔️', description: 'Leaders of commerce' },
  loremaster: { name: 'Lawkeeper', attribute: 'legal', icon: '📜', description: 'Guardians of order' },
  quartermaster: { name: 'Castellan', attribute: 'operations', icon: '🏰', description: 'Masters of resources' }
};

// Armory Items - Enhanced with medieval theme
const ARMORY_ITEMS = {
  gear: [
    {
      id: 'apprentice_robes',
      name: 'Apprentice Robes',
      price: 500,
      levelRequired: 10,
      icon: '🧥',
      description: 'Humble garments imbued with minor enchantments',
      stats: { xpBonus: 5, goldBonus: 5 }
    },
    {
      id: 'knights_armor',
      name: 'Knight\'s Armor',
      price: 1500,
      levelRequired: 20,
      icon: '🛡️',
      description: 'Blessed plate armor forged in dragon fire',
      stats: { xpBonus: 10, goldBonus: 10 }
    },
    {
      id: 'elven_mail',
      name: 'Elven Chainmail',
      price: 3000,
      levelRequired: 30,
      icon: '⚔️',
      description: 'Lightweight mythril links that sing in battle',
      stats: { xpBonus: 15, goldBonus: 15 }
    },
    {
      id: 'dragon_scale',
      name: 'Dragonscale Armor',
      price: 5000,
      levelRequired: 40,
      icon: '🐉',
      description: 'Scales from ancient wyrms, nearly indestructible',
      stats: { xpBonus: 20, goldBonus: 20 }
    },
    {
      id: 'legendary_crown',
      name: 'Crown of Legends',
      price: 10000,
      levelRequired: 50,
      icon: '👑',
      description: 'The crown of startup kings, radiating power',
      stats: { xpBonus: 30, goldBonus: 30 }
    }
  ],
  consumables: [
    {
      id: 'wisdom_potion',
      name: 'Potion of Wisdom',
      price: 100,
      levelRequired: 1,
      icon: '🧪',
      description: 'Double XP for thy next quest',
      effect: 'doubleXP'
    },
    {
      id: 'midas_elixir',
      name: 'Elixir of Midas',
      price: 150,
      levelRequired: 1,
      icon: '💎',
      description: 'Turn thy efforts to gold',
      effect: 'doubleGold'
    },
    {
      id: 'sage_scroll',
      name: 'Scroll of the Sage',
      price: 200,
      levelRequired: 5,
      icon: '📜',
      description: 'Gain favor with the AI spirits (+1 star)',
      effect: 'ratingBoost'
    }
  ],
  treasures: [
    {
      id: 'heralds_horn',
      name: "Herald's Golden Horn",
      price: 5000,
      requirement: 'Master of Heraldry (5000 XP)',
      icon: '📯',
      description: 'All heraldry quests grant +50% experience',
      effect: { attribute: 'marketing', bonus: 50 }
    },
    {
      id: 'midas_coin',
      name: "Coin of King Midas",
      price: 5000,
      requirement: 'Master of Treasury (5000 XP)',
      icon: '🪙',
      description: 'All treasury quests yield +50% gold',
      effect: { attribute: 'finance', bonus: 50 }
    },
    {
      id: 'merlin_staff',
      name: "Staff of Merlin",
      price: 5000,
      requirement: 'Master of Artifice (5000 XP)',
      icon: '🔮',
      description: 'All artifice quests grant +50% experience',
      effect: { attribute: 'tech', bonus: 50 }
    },
    {
      id: 'excalibur',
      name: "Merchant's Excalibur",
      price: 5000,
      requirement: 'Master of Mercantile (5000 XP)',
      icon: '⚔️',
      description: 'All mercantile quests yield +50% gold',
      effect: { attribute: 'sales', bonus: 50 }
    }
  ]
};

// CEO Avatars Database
const CEO_AVATARS = [
  {
    id: 'elon-musk',
    name: 'Elon the Ambitious',
    title: 'The Dragon Rider',
    industries: ['artifice', 'skyships', 'starforge', 'alchemy'],
    traits: ['ambitious', 'risk-taker', 'innovative', 'technical'],
    avatar: '🐉',
    color: 'from-blue-600 to-purple-600',
    advice: 'Seek ye the impossible, then forge it in dragon fire.',
    matchCriteria: {
      ambition: 8,
      technical: 7,
      riskTolerance: 9
    }
  },
  {
    id: 'satya-nadella',
    name: 'Satya the Wise',
    title: 'The Cloud Sage',
    industries: ['artifice', 'enterprise', 'cloud-magic', 'divination'],
    traits: ['empathetic', 'strategic', 'collaborative', 'growth-minded'],
    avatar: '🧙',
    color: 'from-blue-500 to-cyan-500',
    advice: 'Lead with wisdom and let thy guild flourish.',
    matchCriteria: {
      empathy: 9,
      strategic: 8,
      collaboration: 9
    }
  },
  {
    id: 'sara-blakely',
    name: 'Sara the Resourceful',
    title: 'The Bootstrap Knight',
    industries: ['merchantry', 'garments', 'trade-goods', 'bazaar'],
    traits: ['resourceful', 'persistent', 'creative', 'customer-focused'],
    avatar: '🏰',
    color: 'from-pink-500 to-red-500',
    advice: 'With but five gold coins, build thy empire.',
    matchCriteria: {
      resourcefulness: 9,
      persistence: 9,
      customerFocus: 8
    }
  },
  {
    id: 'jeff-bezos',
    name: 'Bezos the Merchant King',
    title: 'Lord of Commerce',
    industries: ['bazaar', 'cloud-magic', 'caravans', 'artifice'],
    traits: ['customer-obsessed', 'long-term', 'data-driven', 'experimental'],
    avatar: '💰',
    color: 'from-orange-500 to-yellow-500',
    advice: 'The customer is thy liege lord. Serve them well.',
    matchCriteria: {
      customerFocus: 10,
      longTermThinking: 9,
      dataOrientation: 8
    }
  },
  {
    id: 'whitney-wolfe',
    name: 'Whitney the Bold',
    title: 'The Quest Changer',
    industries: ['social-guild', 'matchmaking', 'artifice', 'fellowship'],
    traits: ['bold', 'empowering', 'innovative', 'mission-driven'],
    avatar: '🦅',
    color: 'from-yellow-400 to-orange-400',
    advice: 'Challenge the old ways and forge new paths.',
    matchCriteria: {
      boldness: 9,
      missionDriven: 9,
      innovation: 8
    }
  },
  {
    id: 'brian-chesky',
    name: 'Brian the Hospitable',
    title: 'The Inn Master',
    industries: ['hospitality', 'guild-economy', 'artifice', 'pilgrimage'],
    traits: ['design-focused', 'community-driven', 'creative', 'resilient'],
    avatar: '🏰',
    color: 'from-red-500 to-pink-500',
    advice: 'Craft experiences worthy of legends.',
    matchCriteria: {
      designThinking: 9,
      communityFocus: 9,
      creativity: 8
    }
  },
  {
    id: 'jensen-huang',
    name: 'Jensen the Forgemaster',
    title: 'The Rune Smith',
    industries: ['runestones', 'divination', 'gaming-arena', 'artifice'],
    traits: ['visionary', 'technical', 'persistent', 'pioneering'],
    avatar: '⚡',
    color: 'from-green-500 to-emerald-500',
    advice: 'Through trials and tribulation, forge thy destiny.',
    matchCriteria: {
      technical: 9,
      visionary: 9,
      persistence: 10
    }
  },
  {
    id: 'anne-wojcicki',
    name: 'Anne the Alchemist',
    title: 'The Life Weaver',
    industries: ['alchemy', 'healing', 'bloodlines', 'potions'],
    traits: ['scientific', 'democratizing', 'persistent', 'data-driven'],
    avatar: '🔮',
    color: 'from-purple-500 to-indigo-500',
    advice: 'Share the ancient knowledge with all who seek.',
    matchCriteria: {
      scientific: 9,
      missionDriven: 8,
      dataOrientation: 9
    }
  }
];

// Simplified Onboarding Questions
const ONBOARDING_QUESTIONS = [
  {
    id: 'avatar',
    question: 'Choose Your Hero Avatar',
    type: 'avatar',
    icon: User,
    category: 'identity'
  },
  {
    id: 'coreAttribute',
    question: 'What is your greatest strength as a founder?',
    type: 'select',
    options: [
      'Artifice (Tech)',
      'Treasury (Finance)',
      'Heraldry (Marketing)',
      'Mercantile (Sales)',
      'Law (Legal)',
      'Logistics (Operations)'
    ],
    icon: Star,
    category: 'attributes'
  },
  {
    id: 'guildName',
    question: 'Name Your Team',
    type: 'text',
    placeholder: 'Enter your team\'s name',
    icon: Crown,
    category: 'guild'
  }
];

// Achievement Badges
const ACHIEVEMENTS = [
  { id: 'first_quest', name: 'First Blood', icon: '🗡️', description: 'Complete your first quest', xpRequired: 100 },
  { id: 'onboarding_complete', name: 'Team Charter', icon: '📜', description: 'Establish your team', xpRequired: 50 },
  { id: 'first_sage_chat', name: 'Sage Counsel', icon: '🔮', description: 'Consult the AI Oracle', xpRequired: 150 },
  { id: 'mvp_launched', name: 'First Fortress', icon: '🏰', description: 'Launch your first stronghold', xpRequired: 1000 },
  { id: 'first_customers', name: 'First Supporters', icon: '👥', description: 'Win your first 10 loyal supporters', xpRequired: 1500 },
  { id: 'document_master', name: 'Document Master', icon: '📜', description: 'Create 5 powerful documents', xpRequired: 500 },
  { id: 'conversation_pro', name: 'Oracle\'s Friend', icon: '💬', description: 'Seek 20 consultations', xpRequired: 800 },
  { id: 'funded', name: 'Dragon\'s Hoard', icon: '🐉', description: 'Secure your war chest', xpRequired: 3000 },
  { id: 'scaling', name: 'Empire Builder', icon: '⚔️', description: 'Expand your domain', xpRequired: 5000 },
  { id: 'week_streak', name: 'Vigilant Knight', icon: '🔥', description: 'Log in for 7 days', xpRequired: 200 },
  { id: 'gold_hoarder', name: 'Midas Touch', icon: '👑', description: 'Amass 10,000 gold', goldRequired: 10000 },
  { id: 'gear_collector', name: 'Master of Arms', icon: '🛡️', description: 'Acquire 5 legendary items', purchases: 5 },
  { id: 'guild_master', name: 'Team Leader', icon: '🏰', description: 'Fill all team positions', special: 'fullGuild' },
  { id: 'attribute_master', name: 'Grandmaster', icon: '⭐', description: 'Master any single skill (5000 XP)', special: 'attributeMastery' },
  { id: 'daily_champion', name: 'Dawn Warrior', icon: '☀️', description: 'Claim rewards for 30 days', dailyStreak: 30 },
  { id: 'stage_complete_fundamentals', name: 'Squire', icon: '🎯', description: 'Complete Training Grounds', special: 'stage' },
  { id: 'stage_complete_kickoff', name: 'Knight Errant', icon: '🚀', description: 'Complete Kickoff Citadel', special: 'stage' },
  { id: 'stage_complete_gtm', name: 'Battle Lord', icon: '⚔️', description: 'Conquer Market Plains', special: 'stage' },
  { id: 'stage_complete_growth', name: 'Dragon Slayer', icon: '🐲', description: 'Scale Growth Mountains', special: 'stage' }
];

// Document Templates
const DOCUMENT_TEMPLATES = [
  { id: 'elevator_pitch', name: 'Battle Cry', icon: '📯', xp: 100 },
  { id: 'lean_canvas', name: 'Kingdom Blueprint', icon: '🏗️', xp: 150 },
  { id: 'user_survey', name: 'Scouting Report', icon: '🔍', xp: 100 },
  { id: 'investor_deck', name: 'Dragon\'s Map', icon: '🗺️', xp: 200 },
  { id: 'marketing_plan', name: 'Conquest Plan', icon: '⚔️', xp: 150 },
  { id: 'product_roadmap', name: 'Quest Chronicle', icon: '📖', xp: 150 }
];

// Guild Level Structure
const GUILD_LEVELS = {
  1: { name: 'Wanderer\'s Camp', icon: '🏕️', description: 'Humble beginnings', dailyGold: 0 },
  2: { name: 'Wooden Fort', icon: '🛖', description: 'First defenses raised', dailyGold: 0 },
  3: { name: 'Stone Keep', icon: '🏰', description: 'A proper stronghold', dailyGold: 0 },
  4: { name: 'Fortified Castle', icon: '🏯', description: 'Walls that inspire awe', dailyGold: 50 },
  5: { name: 'Grand Citadel', icon: '⛩️', description: 'A beacon of power', dailyGold: 100 },
  6: { name: 'Imperial Palace', icon: '🏛️', description: 'Seat of an empire', dailyGold: 200 },
  7: { name: 'Legendary Fortress', icon: '⚔️', description: 'Immortal in song and story', dailyGold: 500 }
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

// Helper functions (abbreviated for space)
const calculateCEOMatch = (userData: any): string => {
  const coreAttribute = userData.onboardingData?.coreAttribute?.toLowerCase();
  if (coreAttribute === 'artifice') {
    return ['elon-musk', 'jensen-huang', 'satya-nadella'][Math.floor(Math.random() * 3)];
  } else if (coreAttribute === 'treasury') {
    return 'jeff-bezos';
  } else if (coreAttribute === 'heraldry') {
    return ['whitney-wolfe', 'brian-chesky'][Math.floor(Math.random() * 2)];
  } else if (coreAttribute === 'mercantile') {
    return 'jeff-bezos';
  } else if (coreAttribute === 'law') {
    return 'anne-wojcicki';
  } else {
    return 'sara-blakely';
  }
};

// Calculate XP with bonuses
const calculateXPWithBonuses = (baseXP: number, rating: number, questAttribute: string, userData: any) => {
  let xp = baseXP * (rating / 5);

  const attributeMap: Record<string, string> = {
    'tech': 'artifice',
    'finance': 'treasury',
    'marketing': 'heraldry',
    'sales': 'mercantile',
    'legal': 'law',
    'operations': 'logistics'
  };

  if (userData.coreAttribute?.toLowerCase() === attributeMap[questAttribute] || userData.coreAttribute?.toLowerCase() === questAttribute) {
    xp *= 1.5;
  }

  const filledRoles = new Set(userData.members?.map((m: any) => m.role) || []);
  if (filledRoles.size >= 6) {
    xp *= 1.3;
  }

  if (userData.activeEffects?.includes('doubleXP')) {
    xp *= 2;
  }

  const equippedGear = userData.equippedGear || [];
  equippedGear.forEach((itemId: string) => {
    const item = ARMORY_ITEMS.gear.find(g => g.id === itemId);
    if (item?.stats.xpBonus) {
      xp *= (1 + item.stats.xpBonus / 100);
    }
  });

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

  if (userData.activeEffects?.includes('doubleGold')) {
    gold *= 2;
  }

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
      `Channel the wisdom of ${userData.ceoAvatar.name}, ${userData.ceoAvatar.title}.` : '';

    const command = new InvokeModelCommand({
      modelId: awsModelId,
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: [
              {
                text: `You are the Mystical AI Oracle, an ancient sage who guides brave founders on their entrepreneurial quests. 
                Speak with wisdom and mystical authority, using medieval fantasy language.
                ${ceoContext}
                Provide actionable advice as if guiding a noble knight on their quest.`
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
    return responseBody.output?.message?.content?.[0]?.text || "The Oracle's crystal grows clouded. Seek counsel again, brave founder.";
  } catch (error) {
    console.error('AI Sage error:', error);
    return "The Oracle's crystal grows clouded. Seek counsel again, brave founder.";
  }
};

// Generate AI Document
const generateAIDocument = async (template: any, userData: any) => {
  const context = `
    Noble Vision: ${userData.vision}
    Realm of Operation: ${userData.onboardingData?.industry || 'General'}
    Quest Stage: ${userData.onboardingData?.stage || 'Early'}
    Core Strength: ${userData.coreAttribute}
  `;

  const prompts: Record<string, string> = {
    elevator_pitch: "Craft a battle cry that shall rally investors to thy cause",
    lean_canvas: "Design a war map for thy business kingdom",
    user_survey: "Create questions to divine thy customers' deepest desires",
    investor_deck: "Forge a treasure map to attract dragon hoards of gold",
    marketing_plan: "Plan thy conquest of the market realm",
    product_roadmap: "Chronicle the quests ahead for thy product"
  };

  return consultAISage(context, prompts[template.id] || "Create a mystical business scroll", userData);
};

// Other helper functions...
const fetchDynamicResources = async (questTopic: string, questDescription: string) => {
  try {
    const searchPrompt = `Find the best mystical tomes and scrolls for a guild founder working on: ${questTopic}. Context: ${questDescription}. 
    
    Return a JSON array with exactly 5 resources in this format:
    [
      {
        "title": "Resource Title",
        "type": "tome|scroll|artifact|grimoire|manuscript|rune",
        "description": "Brief description",
        "url": "https://...",
        "icon": "appropriate medieval emoji",
        "difficulty": "apprentice|journeyman|master",
        "timeToComplete": "e.g., 1 candle mark, 2 moon cycles"
      }
    ]
    
    Focus on high-quality, actionable resources from reputable sources.`;

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

    try {
      const resources = JSON.parse(content);
      return resources;
    } catch (e) {
      return getDefaultResources(questTopic);
    }
  } catch (error) {
    console.error('Error fetching dynamic resources:', error);
    return getDefaultResources(questTopic);
  }
};

const getDefaultResources = (questTopic: string) => {
  const defaults: Record<string, any[]> = {
    vision: [
      { title: 'The Lean Grimoire', type: 'tome', icon: '📚', url: 'https://theleanstartup.com/', description: 'Ancient wisdom for founders', difficulty: 'apprentice', timeToComplete: '8 candle marks' },
      { title: 'Simon\'s Prophecy: Start with Why', type: 'scroll', icon: '📜', url: 'https://www.ted.com/talks/simon_sinek_how_great_leaders_inspire_action', description: 'Mystical visions of purpose', difficulty: 'apprentice', timeToComplete: '18 sand grains' },
      { title: 'Vision Rune Guide', type: 'rune', icon: '🔮', url: 'https://blog.hubspot.com/marketing/mission-statement', description: 'Carve thy destiny in stone', difficulty: 'journeyman', timeToComplete: '15 sand grains' },
      { title: 'Y Combinator Academy', type: 'grimoire', icon: '🎓', url: 'https://www.startupschool.org/', description: 'The grand school of entrepreneurship', difficulty: 'journeyman', timeToComplete: '10 moon cycles' },
      { title: 'Notion Vision Artifact', type: 'artifact', icon: '💎', url: 'https://www.notion.so/templates', description: 'Enchanted vision templates', difficulty: 'apprentice', timeToComplete: '30 sand grains' }
    ],
    problem: [
      { title: 'The Mother\'s Test', type: 'tome', icon: '📚', url: 'http://momtestbook.com/', description: 'Divine customer wisdom', difficulty: 'apprentice', timeToComplete: '4 candle marks' },
      { title: 'Problem Divination Guide', type: 'scroll', icon: '📜', url: 'https://www.ycombinator.com/library/5z-how-to-validate-your-startup-idea', description: 'YC oracle framework', difficulty: 'journeyman', timeToComplete: '20 sand grains' },
      { title: 'Customer Interrogation Scroll', type: 'manuscript', icon: '📋', url: 'https://customerdevlabs.com/2013/11/05/how-i-interview-customers/', description: 'Interview incantations', difficulty: 'apprentice', timeToComplete: '15 sand grains' },
      { title: 'Jobs to be Done Prophecy', type: 'scroll', icon: '📜', url: 'https://www.youtube.com/watch?v=sfGtw2C95Ms', description: 'Christensen\'s ancient wisdom', difficulty: 'master', timeToComplete: '1 candle mark' },
      { title: 'Typeform Survey Artifact', type: 'artifact', icon: '🔧', url: 'https://www.typeform.com/', description: 'Magical survey creation', difficulty: 'apprentice', timeToComplete: 'Free enchantment' }
    ]
  };

  return defaults[questTopic] || defaults.vision;
};

const QUEST_INPUT_TEMPLATES = {
  vision: {
    title: 'Inscribe Thy Vision',
    fields: [
      { name: 'mission', label: 'Sacred Mission', type: 'textarea', placeholder: 'What quest does thy guild undertake?' },
      { name: 'vision', label: 'Grand Vision', type: 'textarea', placeholder: 'What glory awaits in 5-10 winters?' },
      { name: 'values', label: 'Noble Values', type: 'textarea', placeholder: 'Name 3-5 virtues that guide thy guild' },
      { name: 'why', label: 'Thy Sacred Why', type: 'textarea', placeholder: 'Why dost thou embark on this quest?' }
    ]
  },
  problem: {
    title: 'Identify the Dragon',
    fields: [
      { name: 'problem', label: 'The Beast\'s Nature', type: 'textarea', placeholder: 'What dragon terrorizes the realm?' },
      { name: 'target', label: 'The Afflicted', type: 'text', placeholder: 'Who suffers from this plague?' },
      { name: 'pain', label: 'Points of Suffering', type: 'textarea', placeholder: 'List the torments endured' },
      { name: 'current', label: 'Current Remedies', type: 'textarea', placeholder: 'How do folk currently cope?' }
    ]
  },
  solution: {
    title: 'Forge Thy Solution',
    fields: [
      { name: 'solution', label: 'The Enchantment', type: 'textarea', placeholder: 'Describe thy magical solution' },
      { name: 'features', label: 'Key Enchantments', type: 'textarea', placeholder: 'List the main spells and features' },
      { name: 'differentiator', label: 'Unique Magic', type: 'textarea', placeholder: 'What makes thy magic unique?' },
      { name: 'benefits', label: 'Blessings Bestowed', type: 'textarea', placeholder: 'What boons does thy solution grant?' }
    ]
  },
  market: {
    title: 'Scout the Realm',
    fields: [
      { name: 'tam', label: 'Total Realm Value (TAM)', type: 'text', placeholder: 'e.g., 50,000 gold dragons' },
      { name: 'sam', label: 'Accessible Territories (SAM)', type: 'text', placeholder: 'e.g., 5,000 gold dragons' },
      { name: 'som', label: 'Conquerable Lands (SOM)', type: 'text', placeholder: 'e.g., 500 gold dragons' },
      { name: 'competitors', label: 'Rival Guilds', type: 'textarea', placeholder: 'Name thy chief rivals' },
      { name: 'trends', label: 'Realm Portents', type: 'textarea', placeholder: 'What changes sweep the land?' }
    ]
  },
  legal: {
    title: 'Establish Thy Charter',
    fields: [
      { name: 'entity', label: 'Guild Structure', type: 'select', options: ['Merchant Guild', 'Knightly Order', 'Mage Circle', 'Free Company'] },
      { name: 'state', label: 'Kingdom of Registry', type: 'text', placeholder: 'e.g., Kingdom of Delaware' },
      { name: 'ip', label: 'Mystical Properties', type: 'textarea', placeholder: 'List thy spells, sigils, and secret arts' },
      { name: 'agreements', label: 'Sacred Pacts Needed', type: 'textarea', placeholder: 'e.g., Founding oaths, Blood pacts' }
    ]
  }
};

const rateQuestSubmission = async (questData: any, userData: any) => {
  try {
    const ratingPrompt = `As the Grand Master of the Founder's Guild, rate this quest submission on a scale of 1-5 stars.

Quest: ${questData.questName}
Submission: ${JSON.stringify(questData.inputs)}

Provide thy judgment as a JSON scroll:
{
  "rating": [1-5],
  "feedback": "Brief words of wisdom",
  "suggestions": ["Path to improvement 1", "Path to improvement 2"]
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
      if (userData.activeEffects?.includes('ratingBoost')) {
        rating.rating = Math.min(5, rating.rating + 1);
      }
      return rating;
    } catch (e) {
      return { rating: 3, feedback: "A valiant effort, young squire!", suggestions: [] };
    }
  } catch (error) {
    console.error('Rating error:', error);
    return { rating: 3, feedback: "A valiant effort, young squire!", suggestions: [] };
  }
};

// Add all the component definitions here (keeping them the same but with updated styles)
// Including: DailyBonus, GuildManagement, FourPanelQuestInterface, ArmoryInterface
// (Components code abbreviated for space)

// Daily Bonus Component
const DailyBonus = ({
  guildData,
  onClaim
}: {
  guildData: any;
  onClaim: () => void
}) => {
  if (!guildData) {
    return (
      <div className="parchment p-4 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Gift className="w-8 h-8 text-yellow-500 treasure-glow" />
            <div>
              <h3 className="font-bold text-yellow-100">Daily Tribute</h3>
              <p className="text-sm text-yellow-200/80">Awaiting thy claim...</p>
            </div>
          </div>
          <button
            disabled
            className="px-4 py-2 rounded-lg font-semibold bg-gray-700 text-gray-400 cursor-not-allowed"
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
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const diff = tomorrow.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeUntilNext(`${hours} candle marks, ${minutes} sand grains`);
      }
    };

    checkDailyBonus();
    const interval = setInterval(checkDailyBonus, 60000);

    return () => clearInterval(interval);
  }, [guildData.lastDailyBonus]);

  return (
    <div className={`parchment p-4 transition-all ${canClaim ? 'magic-border' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Gift className={`w-8 h-8 ${canClaim ? 'text-yellow-500 treasure-glow' : 'text-gray-500'}`} />
          <div>
            <h3 className="font-bold text-yellow-100">Daily Tribute</h3>
            <p className="text-sm text-yellow-200/80">
              {canClaim ? 'The kingdom offers 5 gold coins!' : `Next tribute in ${timeUntilNext}`}
            </p>
          </div>
        </div>
        <button
          onClick={() => { onClaim(); soundManager.play('coinCollect'); }}
          disabled={!canClaim}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${canClaim
            ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white hover:from-yellow-500 hover:to-orange-500 transform hover:scale-105'
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
        >
          {canClaim ? 'Claim +5 ⚡' : 'Claimed'}
        </button>
      </div>
      {guildData.dailyStreak > 1 && (
        <div className="mt-2 text-sm text-yellow-200/80">
          🔥 {guildData.dailyStreak} day crusade!
        </div>
      )}
    </div>
  );
};

// Guild Management Component
const GuildManagement = ({
  guildData,
  onClose
}: {
  guildData: any;
  onClose: () => void;
}) => {
  const filledRoles = new Set(guildData.members?.map((m: any) => m.role) || []);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="parchment rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Castle className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold">Guild Hall</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-yellow-100">Guild Positions</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(GUILD_ROLES).map(([key, role]) => {
                const member = guildData.members?.find((m: any) => m.role === key);

                return (
                  <div
                    key={key}
                    className={`parchment p-4 ${member ? 'magic-border' : 'opacity-50'}`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">{role.icon}</span>
                      <div>
                        <p className="font-bold text-yellow-100">{role.name}</p>
                        <p className="text-xs text-gray-300">{role.description}</p>
                      </div>
                    </div>
                    {member ? (
                      <div className="mt-2">
                        <p className="text-sm text-green-400">{member.name}</p>
                        <p className="text-xs text-gray-400">{member.email}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 mt-2">Seeking Worthy Soul</p>
                    )}
                  </div>
                );
              })}
            </div>
            {filledRoles.size >= 6 && (
              <div className="mt-4 parchment p-3 magic-border">
                <p className="text-green-400 font-medium">⚔️ Full Guild Assembled! +30% XP on all quests</p>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-yellow-100">Current Members</h3>
            <div className="space-y-2">
              {guildData.members?.map((member: any) => (
                <div key={member.uid} className="parchment p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-yellow-100">{member.name}</p>
                    <p className="text-sm text-gray-300">{member.email}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{GUILD_ROLES[member.role as keyof typeof GUILD_ROLES]?.icon}</span>
                    <span className="text-sm text-gray-300">
                      {GUILD_ROLES[member.role as keyof typeof GUILD_ROLES]?.name || 'Guild Member'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4-Panel Quest Interface Component
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
  const questKey = `${quest.stageId}_${quest.id}`;
  const questProgress = guildData?.questProgress?.[questKey];
  const isCompleted = !!questProgress?.completed;

  const [sageMessages, setSageMessages] = useState<Array<{ type: 'user' | 'sage', content: string }>>(isCompleted ? (questProgress?.sageConversation || []) : []);
  const [sageInput, setSageInput] = useState('');
  const [sageLoading, setSageLoading] = useState(false);
  const [userInputs, setUserInputs] = useState<Record<string, string>>(isCompleted ? (questProgress?.inputs || {}) : {});
  const [isSaving, setIsSaving] = useState(false);
  const [dynamicResources, setDynamicResources] = useState<any[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [rating, setRating] = useState<any>(isCompleted ? { rating: questProgress?.rating, feedback: questProgress?.feedback } : null);

  useEffect(() => {
    if (isCompleted) {
      setUserInputs(questProgress?.inputs || {});
      setSageMessages(questProgress?.sageConversation || []);
      setRating({ rating: questProgress?.rating, feedback: questProgress?.feedback });
    }
    // eslint-disable-next-line
  }, [questKey]);

  const inputTemplate = QUEST_INPUT_TEMPLATES[quest.id as keyof typeof QUEST_INPUT_TEMPLATES];

  const handleSageChat = async () => {
    if (isCompleted) return; // Prevent chat if completed
    if (!sageInput.trim()) return;

    if (guildData.gold < 20) {
      soundManager.play('error');
      alert('Not enough gold! Ye need 20 gold coins to consult the Oracle.');
      return;
    }

    const userMessage = sageInput;
    setSageInput('');
    setSageMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setSageLoading(true);

    try {
      await updateGold(-20);
      soundManager.play('magicCast');

      const response = await consultAISage(
        `Quest: ${quest.name} - ${quest.description}. Seeker's progress: ${JSON.stringify(userInputs)}`,
        userMessage,
        { ...guildData, ceoAvatar }
      );

      setSageMessages(prev => [...prev, { type: 'sage', content: response }]);
      await saveConversation(quest, userMessage, response);
    } catch (error) {
      setSageMessages(prev => [...prev, {
        type: 'sage',
        content: 'The Oracle\'s power wanes. Thy gold has been returned.'
      }]);
      await updateGold(20);
    } finally {
      setSageLoading(false);
    }
  };

  const handleInputChange = (fieldName: string, value: string) => {
    if (isCompleted) return; // Prevent editing if completed
    setUserInputs(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleCompleteQuest = async () => {
    if (isCompleted) return; // Prevent re-completion
    setIsSaving(true);

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
      feedback: questRating.feedback,
      xpReward: calculateXPWithBonuses(quest.xp, questRating.rating, quest.attribute || 'general', guildData),
      goldReward: calculateGoldReward(quest.xp / 2, questRating.rating, guildData)
    };

    await onComplete({ ...questData });
    soundManager.play('questComplete');
    triggerConfetti();
    setIsSaving(false);
  };

  const levelInfo = calculateLevel(guildData?.xp || 0);
  const suggestedQuestions = getSuggestedSageQuestions({ quest, guildData, guildLevel: levelInfo });
  const sageInputRef = useRef<HTMLInputElement>(null);

  // New: handle suggested question click
  const handleSuggestedSageQuestion = async (question: string) => {
    if (isCompleted || sageLoading) return;
    setSageLoading(true);
    setSageMessages(prev => [...prev, { type: 'user', content: question }]);
    try {
      await updateGold(-20);
      soundManager.play('magicCast');
      const response = await consultAISage(
        `Quest: ${quest.name} - ${quest.description}. Seeker's progress: ${JSON.stringify(userInputs)}`,
        question,
        { ...guildData, ceoAvatar }
      );
      setSageMessages(prev => [...prev, { type: 'sage', content: response }]);
      await saveConversation(quest, question, response);
    } catch (error) {
      setSageMessages(prev => [...prev, {
        type: 'sage',
        content: 'The Oracle\'s power wanes. Thy gold has been returned.'
      }]);
      await updateGold(20);
    } finally {
      setSageLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
      {/* 3D Weapon Display */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-32 h-32 z-10">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Suspense fallback={null}>
            <DiamondSword3D standingRotation={{ x: 0, y: 0, z: Math.PI / 2 }} />
          </Suspense>
        </Canvas>
      </div>

      {/* Header */}
      <div className="parchment border-b border-yellow-700 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Swords className="w-6 h-6 text-yellow-500" />
            <div>
              <h2 className="text-2xl font-bold text-yellow-100">{quest.name}</h2>
              <p className="text-sm text-gray-300">{quest.description} • {quest.xp} XP</p>
              {isCompleted && (
                <div className="mt-1 flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-green-700/80 text-xs text-green-100 rounded-full font-semibold">Completed</span>
                  <span className="px-2 py-0.5 bg-gradient-to-r from-green-600 to-emerald-600 text-xs text-white rounded-full font-semibold border border-green-400">+{questProgress?.xpReward} XP</span>
                  <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-600 to-orange-600 text-xs text-white rounded-full font-semibold border border-yellow-400">+{questProgress?.goldReward} Gold</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => { onClose(); soundManager.play('swordDraw'); }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* 4-Panel Grid */}
      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4 p-6 overflow-hidden">
        {/* Top Left - Quest Details */}
        <div className="parchment p-6 flex flex-col overflow-hidden">
          <div className="flex items-center mb-4 flex-shrink-0">
            <Scroll className="w-5 h-5 text-yellow-500 mr-2" />
            <h3 className="text-lg font-bold text-yellow-100">Quest Details</h3>
          </div>

          <div className="space-y-4 overflow-y-auto flex-1 pr-2">
            <div className="parchment p-4">
              <h4 className="font-semibold mb-2 text-yellow-100">Your Quest</h4>
              <p className="text-gray-300">{quest.description}</p>
            </div>

            <div className="parchment p-4">
              <h4 className="font-semibold mb-2 text-yellow-100">How to Complete</h4>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Complete all required entries</li>
                <li>Ask the Oracle for advice (20 gold per question)</li>
                <li>Review the resources</li>
                <li>Record your progress</li>
              </ul>
            </div>

            <div className="parchment p-4">
              <h4 className="font-semibold mb-2 text-yellow-100">Rewards</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    <span>Base: {quest.xp} XP</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400">Final reward is based on the Grand Master's judgment (1-5 stars)</p>
                <p className="text-xs text-yellow-400 mt-1">Complete all quests in this stage to earn 500 gold coins!</p>
              </div>
            </div>

            {rating && (
              <div className="parchment p-4 magic-border">
                <h4 className="font-semibold mb-2 flex items-center text-yellow-100">
                  Grand Master's Judgment: {'⭐'.repeat(rating.rating)}
                </h4>
                <p className="text-sm text-gray-300 mb-2">{rating.feedback}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-green-400">+{calculateXPWithBonuses(quest.xp, rating.rating, quest.attribute || 'general', guildData)} XP</span>
                </div>
              </div>
            )}

            {ceoAvatar && (
              <div className={`p-4 rounded-lg bg-gradient-to-r ${ceoAvatar.color} bg-opacity-20 parchment`}>
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">{ceoAvatar.avatar}</span>
                  <p className="font-semibold text-yellow-100">{ceoAvatar.name}'s Wisdom</p>
                </div>
                <p className="text-sm italic text-gray-300">"{ceoAvatar.advice}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Right - Input Section */}
        <div className="parchment p-6 flex flex-col overflow-hidden">
          <div className="flex items-center mb-4 flex-shrink-0">
            <Edit3 className="w-5 h-5 text-yellow-500 mr-2" />
            <h3 className="text-lg font-bold text-yellow-100">
              {inputTemplate?.title || 'Sacred Inscriptions'}
            </h3>
          </div>

          <div className="space-y-4 overflow-y-auto flex-1 pr-2">
            {inputTemplate ? (
              inputTemplate.fields.map((field: any) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium mb-2 text-yellow-100">
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={userInputs[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full p-3 bg-gray-700 rounded-lg text-white resize-none h-24"
                      disabled={isCompleted}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={userInputs[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full p-3 bg-gray-700 rounded-lg text-white"
                      disabled={isCompleted}
                    >
                      <option value="">Choose wisely...</option>
                      {field.options?.map((option: any) => (
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
                      disabled={isCompleted}
                    />
                  )}
                </div>
              ))
            ) : (
              <div>
                <label className="block text-sm font-medium mb-2 text-yellow-100">
                  Thy Quest Journal
                </label>
                <textarea
                  value={userInputs.general || ''}
                  onChange={(e) => handleInputChange('general', e.target.value)}
                  placeholder="Chronicle thy deeds for this quest..."
                  className="w-full p-3 bg-gray-700 rounded-lg text-white resize-none h-48"
                  disabled={isCompleted}
                />
              </div>
            )}

            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => {
                  soundManager.play('swordDraw');
                  alert('Thy progress has been saved to the archives!');
                }}
                className="flex-1 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all flex items-center justify-center space-x-2"
                disabled={isCompleted}
              >
                <Save className="w-4 h-4" />
                <span>Save to Archives</span>
              </button>
              <button
                onClick={handleCompleteQuest}
                disabled={isSaving || isCompleted}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all disabled:opacity-50 flex items-center justify-center space-x-2 magic-border"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Trophy className="w-4 h-4" />
                    <span>{isCompleted ? 'Quest Completed' : 'Complete Quest'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Left - Dynamic Resources Library */}
        <div className="parchment p-6 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <div className="flex items-center">
              <BookOpen className="w-5 h-5 text-green-500 mr-2" />
              <h3 className="text-lg font-bold text-yellow-100">Ancient Grimoire</h3>
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
                title="Summon new tomes"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="space-y-3 overflow-y-auto flex-1 pr-2">
            {resourcesLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-500" />
                <p className="text-gray-400">Summoning ancient knowledge...</p>
              </div>
            ) : dynamicResources.length > 0 ? (
              <>
                {dynamicResources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block parchment p-3 hover:transform hover:scale-105 transition-all"
                    onMouseEnter={() => soundManager.play('swordDraw')}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl mt-1">{resource.icon}</span>
                        <div className="flex-1">
                          <p className="font-medium text-yellow-100">{resource.title}</p>
                          <p className="text-xs text-gray-300 mt-1">{resource.description}</p>
                          <div className="flex items-center space-x-3 mt-2 text-xs">
                            <span className="text-purple-400">{resource.type}</span>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-400">{resource.timeToComplete}</span>
                            <span className="text-gray-500">•</span>
                            <span className={`${resource.difficulty === 'apprentice' ? 'text-green-400' :
                              resource.difficulty === 'journeyman' ? 'text-yellow-400' :
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
              </>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No tomes found. Try summoning again.</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Right - AI Sage Chat */}
        <div className="parchment p-6 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <div className="flex items-center">
              <Sparkles className="w-5 h-5 text-purple-500 mr-2" />
              <h3 className="text-lg font-bold text-yellow-100">Oracle's Chamber</h3>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Coins className="w-4 h-4 text-yellow-500" />
              <span className="font-medium text-yellow-100">20 gold per counsel</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2">
            {sageMessages.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Seek wisdom from the Oracle</p>
                <p className="text-sm mt-2">Each consultation requires 20 gold tribute</p>
              </div>
            ) : (
              sageMessages.map((message, index) => (
                <div
                  key={index}
                  className={`${message.type === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <div
                    className={`inline-block max-w-[80%] p-3 rounded-lg ${message.type === 'user'
                      ? 'bg-purple-800 text-white'
                      : 'parchment text-gray-100'
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
              <div className="text-left">
                <div className="inline-block parchment rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                    <span className="text-sm">The Oracle consults the stars...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggested Questions */}
          {!isCompleted && suggestedQuestions.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {suggestedQuestions.map((q: string, i: number) => (
                <button
                  key={i}
                  type="button"
                  className="px-3 py-1 bg-purple-900/70 text-purple-200 rounded-full text-xs hover:bg-purple-700 hover:text-white transition-all border border-purple-700 disabled:opacity-50"
                  onClick={() => handleSuggestedSageQuestion(q)}
                  disabled={sageLoading}
                >
                  {q}
                </button>
              ))}
            </div>
          )}
          <div className="flex space-x-2 flex-shrink-0">
            <input
              type="text"
              value={sageInput}
              onChange={(e) => setSageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSageChat()}
              placeholder="Seek the Oracle's wisdom..."
              className="flex-1 p-3 bg-gray-700 rounded-lg text-white"
              disabled={sageLoading || isCompleted}
              ref={sageInputRef}
            />
            <button
              onClick={handleSageChat}
              disabled={sageLoading || !sageInput.trim() || guildData.gold < 20 || isCompleted}
              className="px-4 py-3 bg-purple-800 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              title={guildData.gold < 20 ? 'Insufficient gold tribute' : ''}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Armory Interface Component
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
      <div className="parchment rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* 3D Treasure Chest */}
        <div className="absolute top-4 left-4 w-32 h-32 z-10">
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Suspense fallback={null}>
              <TreasureChest3D isOpen={selectedCategory === 'treasures'} />
            </Suspense>
          </Canvas>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-900 to-amber-900 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="w-6 h-6 text-yellow-500 treasure-glow" />
            <h2 className="text-2xl font-bold text-yellow-100">The Royal Armory</h2>
            <div className="flex items-center space-x-2 ml-6">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-yellow-100">{guildData.gold || 0}</span>
            </div>
          </div>
          <button onClick={() => { onClose(); soundManager.play('swordDraw'); }} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 px-6 py-3 flex space-x-4 border-b border-yellow-700">
          <button
            onClick={() => setSelectedCategory('gear')}
            className={`px-4 py-2 rounded-lg transition-all ${selectedCategory === 'gear'
              ? 'bg-purple-800 text-white magic-border'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
          >
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Armor & Gear</span>
            </div>
          </button>
          <button
            onClick={() => setSelectedCategory('consumables')}
            className={`px-4 py-2 rounded-lg transition-all ${selectedCategory === 'consumables'
              ? 'bg-purple-800 text-white magic-border'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
          >
            <div className="flex items-center space-x-2">
              <PocketIcon className="w-4 h-4" />
              <span>Potions & Elixirs</span>
            </div>
          </button>
          <button
            onClick={() => setSelectedCategory('treasures')}
            className={`px-4 py-2 rounded-lg transition-all ${selectedCategory === 'treasures'
              ? 'bg-purple-800 text-white magic-border'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
          >
            <div className="flex items-center space-x-2">
              <Diamond className="w-4 h-4" />
              <span>Legendary Treasures</span>
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
                  className={`parchment p-4 border-2 transition-all ${owned ? 'magic-border' :
                    canPurchase ? 'border-gray-600 hover:border-yellow-500 hover:transform hover:scale-105' :
                      'border-gray-700 opacity-50'
                    } hero-3d`}
                  onMouseEnter={() => canPurchase && soundManager.play('swordDraw')}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl float-3d">{item.icon}</span>
                      <div>
                        <h4 className="font-bold text-yellow-100">{item.name}</h4>
                        <p className="text-xs text-gray-300">
                          Level {item.levelRequired || 1} Required
                        </p>
                      </div>
                    </div>
                    {owned && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                        Equipped
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-300 mb-3">{item.description}</p>

                  {item.stats && (
                    <div className="mb-3 space-y-1">
                      {item.stats.xpBonus && (
                        <p className="text-xs text-purple-400">
                          +{item.stats.xpBonus}% Experience Blessing
                        </p>
                      )}
                      {item.stats.goldBonus && (
                        <p className="text-xs text-yellow-400">
                          +{item.stats.goldBonus}% Gold Fortune
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
                      <span className={`${affordable || owned ? 'text-yellow-100' : 'text-red-400'}`}>
                        {item.price}
                      </span>
                    </div>
                    <button
                      onClick={() => handlePurchase(item, selectedCategory)}
                      disabled={!canPurchase}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${owned ? 'bg-gray-600 text-gray-400 cursor-not-allowed' :
                        canPurchase
                          ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white transform hover:scale-110'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                      {owned ? 'Equipped' :
                        !levelMet ? `Level ${item.levelRequired}` :
                          !affordable ? 'Insufficient Gold' :
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

  // Add medieval styles and effects
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = medievalStyles;
    document.head.appendChild(styleEl);

    // Create magical effects
    createMagicalParticles();

    // Play ambient sound on interaction
    const playAmbient = () => {
      soundManager.play('swordDraw');
      document.removeEventListener('click', playAmbient);
    };
    document.addEventListener('click', playAmbient);

    return () => {
      if (styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl);
      }
      document.removeEventListener('click', playAmbient);
    };
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
        setGuildDataError('Thou art offline. Unable to summon thy profile. Check thy connection and try again.');
        return false;
      }

      setGuildDataError('A mystical error has occurred. Please try thy quest again.');
      return false;
    }
  };

  // Sign In
  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      soundManager.play('levelUp');
    } catch (error) {
      console.error('Sign in error:', error);
      soundManager.play('error');
    }
  };

  // Sign Out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setGuildData(null);
      setCeoAvatar(null);
      setShowOnboarding(false);
      soundManager.play('swordDraw');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Handle Onboarding Answer
  const handleOnboardingAnswer = (questionId: string, answer: any) => {
    setOnboardingAnswers({ ...onboardingAnswers, [questionId]: answer });
    soundManager.play('swordDraw');
  };

  // Complete Onboarding
  const completeOnboarding = async () => {
    if (!user || !vision) return;

    if (!navigator.onLine) {
      alert('Thou art offline. Connect to the mystical network to establish thy guild.');
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
      gold: 500,
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
      soundManager.play('error');
      if (error?.code === 'unavailable' || error?.message?.includes('offline')) {
        alert('Unable to forge thy guild charter. Check thy mystical connection.');
      } else {
        alert('The guild creation spell has failed. Try again, brave founder.');
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
        questName: quest?.name || 'General Oracle Consultation',
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
        soundManager.play('levelUp');
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
      soundManager.play('questComplete');

      // Check for document achievement
      if (savedDocuments.length + 1 >= 5 && !guildData.achievements?.includes('document_master')) {
        await updateDoc(doc(db, 'guilds', user.uid), {
          achievements: arrayUnion('document_master'),
          xp: increment(50)
        });
        soundManager.play('levelUp');
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
        soundManager.play('levelUp');
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
        soundManager.play('levelUp');
      }
    } catch (error) {
      console.error('Error claiming daily bonus:', error);
    }
  };

  // Complete Quest
  const completeQuest = async (questData: any) => {
    if (!user || !guildData || !selectedQuest) return;

    if (!navigator.onLine) {
      alert('Thou art offline. Connect to complete thy quest.');
      return;
    }

    try {
      const questKey = `${selectedQuest.stageId}_${selectedQuest.id}`;
      const newXP = (guildData.xp || 0) + questData.xpReward;
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
          feedback: questData.feedback,
          xpReward: questData.xpReward,
          goldReward: questData.goldReward
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

      if (completedStageQuests === stageQuests.length) {
        stageBonus = 500;
        soundManager.play('levelUp');
        triggerConfetti({ particleCount: 200, spread: 100 });

        const stageAchievement = `stage_complete_${selectedQuest.stageId}`;
        if (!guildData.achievements?.includes(stageAchievement)) {
          newAchievements.push(stageAchievement);
        }

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
        message += `\n\n⚔️ Realm Conquered! +${stageBonus} Gold dragons!`;
      }
      alert(message);

      // Close modal
      setSelectedQuest(null);

    } catch (error: any) {
      console.error('Error completing quest:', error);
      soundManager.play('error');
      alert('The quest completion spell has failed. Try again, brave warrior.');
    }
  };

  // Purchase from Armory
  const handleArmoryPurchase = async (item: any, category: string) => {
    if (!user || !guildData) return;

    const newGold = (guildData.gold || 0) - item.price;

    if (newGold < 0) {
      alert('Thy coffers are too light for this purchase!');
      soundManager.play('error');
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

      alert(`Acquired ${item.name} for ${item.price} gold dragons!`);
    } catch (error) {
      console.error('Error purchasing item:', error);
      soundManager.play('error');
      alert('The merchant\'s spell has failed. Try thy purchase again.');
    }
  };

  // Generate Document
  const handleGenerateDocument = async (template: any) => {
    setGeneratingDoc(true);
    soundManager.play('magicCast');
    const content = await generateAIDocument(template, { ...guildData, ceoAvatar });
    await saveDocument(template, content);
    setGeneratingDoc(false);
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

  // Epic Medieval Game Loader Component
  const EpicMedievalLoader = () => {
    const [loadingPhrase, setLoadingPhrase] = useState(0);
    const [progress, setProgress] = useState(0);

    const loadingPhrases = [
      "Summoning ancient dragons...",
      "Forging legendary weapons...",
      "Gathering the knights of the realm...",
      "Consulting the mystical oracles...",
      "Awakening the startup spirits...",
      "Polishing thy noble armor...",
      "Enchanting magical scrolls...",
      "Rallying thy guild members...",
      "Preparing the quest map...",
      "Loading thy destiny..."
    ];

    useEffect(() => {
      // Cycle through loading phrases
      const phraseInterval = setInterval(() => {
        setLoadingPhrase((prev) => (prev + 1) % loadingPhrases.length);
      }, 2000);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 100;
          return prev + Math.random() * 15;
        });
      }, 300);

      return () => {
        clearInterval(phraseInterval);
        clearInterval(progressInterval);
      };
    }, []);

    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
        {/* Epic medieval background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-black to-black"></div>
          {/* Animated magical particles */}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-float-up"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${100 + Math.random() * 20}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 4}s`,
              }}
            >
              <div className="w-full h-full bg-yellow-400 rounded-full animate-pulse"
                style={{ boxShadow: '0 0 10px #ffd700, 0 0 20px #ffd700, 0 0 30px #ff6b35' }}
              />
            </div>
          ))}
        </div>

        {/* Main loader content */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Magical circle background */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 animate-spin-slow">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffd700" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#ffed4e" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#ffd700" stopOpacity="0.6" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Outer ring */}
                <circle cx="100" cy="100" r="90" fill="none" stroke="url(#goldGradient)"
                  strokeWidth="2" opacity="0.8" filter="url(#glow)" />
                {/* Inner ring */}
                <circle cx="100" cy="100" r="70" fill="none" stroke="url(#goldGradient)"
                  strokeWidth="1.5" opacity="0.6" filter="url(#glow)" />
                {/* Mystical runes */}
                {[...Array(8)].map((_, i) => {
                  const angle = (i * 45 * Math.PI) / 180;
                  const x = 100 + 80 * Math.cos(angle);
                  const y = 100 + 80 * Math.sin(angle);
                  return (
                    <text key={i} x={x} y={y}
                      fill="#ffd700"
                      fontSize="16"
                      fontFamily="MedievalSharp"
                      textAnchor="middle"
                      filter="url(#glow)"
                      className="animate-pulse"
                    >
                      ᚦ
                    </text>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* 3D Sword Animation */}
          <div className="w-64 h-64 mb-8">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
              <ambientLight intensity={0.3} />
              <pointLight position={[10, 10, 10]} intensity={1} color="#ffd700" />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff6b35" />
              <Suspense fallback={null}>
                <group>
                  {/* Floating sword with complex animation */}
                  <mesh rotation={[0, 0, Math.PI / 4]}>
                    <Sword3D rotation={[0, 0, 0]} />
                  </mesh>
                  {/* Magical glow effect */}
                  <mesh>
                    <sphereGeometry args={[3, 32, 32]} />
                    <meshBasicMaterial
                      color="#ffd700"
                      transparent
                      opacity={0.1}
                      wireframe
                    />
                  </mesh>
                </group>
              </Suspense>
              {/* Orbiting magical orbs */}
              {[...Array(3)].map((_, i) => (
                <mesh key={i} position={[
                  Math.cos((i * 120 + Date.now() * 0.001) * Math.PI / 180) * 4,
                  Math.sin((i * 120 + Date.now() * 0.002) * Math.PI / 180) * 2,
                  Math.sin((i * 120 + Date.now() * 0.001) * Math.PI / 180) * 4
                ]}>
                  <sphereGeometry args={[0.2, 16, 16]} />
                  <meshStandardMaterial
                    color={i === 0 ? "#ffd700" : i === 1 ? "#ff6b35" : "#c084fc"}
                    emissive={i === 0 ? "#ffd700" : i === 1 ? "#ff6b35" : "#c084fc"}
                    emissiveIntensity={2}
                  />
                </mesh>
              ))}
            </Canvas>
          </div>

          {/* Loading text with epic glow */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4 animate-glow-pulse"
              style={{
                fontFamily: 'MedievalSharp',
                background: 'linear-gradient(45deg, #ffd700, #ffed4e, #ffd700)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))',
              }}
            >
              The Startup Quest
            </h1>
            <p className="text-2xl text-yellow-200 animate-pulse transition-all duration-1000"
              style={{
                fontFamily: 'Almendra',
                textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
              }}
            >
              {loadingPhrases[loadingPhrase]}
            </p>
          </div>

          {/* Epic progress bar */}
          <div className="w-80 mb-6">
            <div className="h-6 bg-gray-800 rounded-full border-2 border-yellow-600/50 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-yellow-600 via-orange-500 to-yellow-600 transition-all duration-500 relative"
                style={{
                  width: `${Math.min(progress, 100)}%`,
                  boxShadow: 'inset 0 0 10px rgba(255, 215, 0, 0.5)',
                }}
              >
                {/* Animated shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
              {/* Progress particles */}
              <div className="absolute inset-0 flex items-center" style={{ width: `${Math.min(progress, 100)}%` }}>
                <div className="absolute right-0 w-8 h-8 -mr-4">
                  <div className="w-full h-full bg-yellow-400 rounded-full animate-pulse"
                    style={{
                      boxShadow: '0 0 20px #ffd700, 0 0 40px #ff6b35',
                      filter: 'blur(2px)',
                    }}
                  />
                </div>
              </div>
            </div>
            {/* Progress percentage */}
            <div className="text-center mt-2">
              <span className="text-yellow-400 font-bold text-lg"
                style={{ textShadow: '0 0 10px rgba(255, 215, 0, 0.8)' }}
              >
                {Math.floor(Math.min(progress, 100))}%
              </span>
            </div>
          </div>

          {/* Decorative bottom text */}
          <div className="flex items-center space-x-4 text-gray-400 text-sm">
            <span className="animate-pulse">⚔️</span>
            <span style={{ fontFamily: 'Almendra' }}>Forging your destiny</span>
            <span className="animate-pulse">🛡️</span>
          </div>
        </div>

        {/* CSS Animations */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes float-up {
                0% { transform: translateY(0) scale(0); opacity: 0; }
                10% { opacity: 1; transform: scale(1); }
                90% { opacity: 1; }
                100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
              }
              @keyframes spin-slow {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              @keyframes glow-pulse {
                0%, 100% { filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8)); }
                50% { filter: drop-shadow(0 0 40px rgba(255, 215, 0, 1)); }
              }
              @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(200%); }
              }
              .animate-float-up { animation: float-up 10s ease-out infinite; }
              .animate-spin-slow { animation: spin-slow 20s linear infinite; }
              .animate-glow-pulse { animation: glow-pulse 2s ease-in-out infinite; }
              .animate-shimmer { animation: shimmer 2s ease-in-out infinite; }
            `
          }}
        />
      </div>
    );
  };

  // Replace your current loading state with this:
  if (loading) {
    return <EpicMedievalLoader />;
  }

  // Error State
  if (guildDataError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="parchment p-8 rounded-lg shadow-2xl text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-yellow-100 mb-2">Guild Charter Lost</h1>
          <p className="text-gray-300 mb-6">{guildDataError}</p>
          <button
            onClick={async () => {
              setLoading(true);
              setGuildDataError(null);
              if (user) await loadGuildData(user.uid);
              setLoading(false);
            }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all magic-border"
          >
            Retry Quest
          </button>
        </div>
      </div>
    );
  }

  // Sign In Screen
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="parchment p-8 rounded-lg shadow-2xl text-center max-w-md hero-3d">

          <div className="w-full h-80 mx-auto mb-6 flex items-center justify-center">
            <Canvas
              camera={{ position: [0, 0, 7], fov: 50 }}
              style={{ width: '100%', height: '100%' }}
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
          </div>
          <h1 className="text-3xl font-bold text-yellow-100 mb-2">AI Startup Quest</h1>
          <p className="text-gray-300 mb-6">Begin thy epic journey to entrepreneurial glory</p>
          <button
            onClick={handleSignIn}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105 magic-border"
          >
            <span className="flex items-center space-x-3">
              <Swords className="w-5 h-5" />
              <span>Enter the Realm with Google</span>
              <Swords className="w-5 h-5 transform scale-x-[-1]" />
            </span>
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
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="parchment p-8 rounded-lg shadow-2xl max-w-2xl w-full">
          {onboardingStep === 0 ? (
            <>
              <h2 className="text-3xl font-bold text-yellow-100 mb-4">Your Vision</h2>
              <p className="text-gray-300 mb-6">
                Founder, share your vision for your journey.
              </p>
              <textarea
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                placeholder="Describe your mission in detail..."
                className="w-full p-4 bg-gray-700 text-white rounded-lg mb-4 h-32 resize-none"
              />
              <button
                onClick={() => { setOnboardingStep(1); soundManager.play('swordDraw'); }}
                disabled={!vision}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed magic-border"
              >
                Continue to Character Creation
              </button>
            </>
          ) : onboardingStep <= ONBOARDING_QUESTIONS.length ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-yellow-100">Forge Your Destiny</h3>
                <span className="text-gray-300">
                  Step {onboardingStep} of {ONBOARDING_QUESTIONS.length}
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <QuestionIcon className="w-6 h-6 text-purple-400 mr-3" />
                  <p className="text-lg text-yellow-100">{currentQuestion?.question}</p>
                </div>

                {currentQuestion?.type === 'avatar' && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {AVATAR_TEMPLATES.map((avatar) => (
                      <button
                        key={avatar.id}
                        onClick={() => handleOnboardingAnswer(currentQuestion.id, avatar)}
                        className={`parchment p-4 rounded-lg transition-all ${onboardingAnswers[currentQuestion.id]?.id === avatar.id
                          ? 'magic-border transform scale-105'
                          : 'hover:transform hover:scale-105'
                          }`}
                      >
                        <div className="text-3xl mb-2">{avatar.icon}</div>
                        <p className="font-medium text-yellow-100">{avatar.name}</p>
                        <p className="text-xs opacity-75 text-gray-300">{avatar.outfit}</p>
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
                          ? 'bg-purple-800 text-white magic-border'
                          : 'parchment text-gray-300 hover:transform hover:scale-105'
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
                    onClick={() => { setOnboardingStep(onboardingStep - 1); soundManager.play('swordDraw'); }}
                    className="flex-1 bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all"
                  >
                    Previous
                  </button>
                )}
                <button
                  onClick={() => {
                    if (onboardingStep < ONBOARDING_QUESTIONS.length) {
                      setOnboardingStep(onboardingStep + 1);
                      soundManager.play('swordDraw');
                    } else {
                      completeOnboarding();
                    }
                  }}
                  disabled={!onboardingAnswers[currentQuestion?.id || '']}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed magic-border"
                >
                  {onboardingStep < ONBOARDING_QUESTIONS.length ? 'Next' : 'Create Team'}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <h3 className="text-2xl font-bold text-yellow-100 mb-4">Creating Your Team Profile...</h3>
              <div className="w-32 h-32 mx-auto mb-4">
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                  {/* Use the Drei helpers for lights, as ambientLight and pointLight are not valid JSX elements */}
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore */}
                  <primitive object={new THREE.AmbientLight(0xffffff, 0.5)} />
                  {/* @ts-ignore */}
                  <primitive object={new THREE.PointLight(0xffffff, 1)} position={[10, 10, 10]} />
                  <Suspense fallback={null}>
                    <DiamondSword3D standingRotation={{ x: 0, y: 0, z: Math.PI / 2 }} />
                  </Suspense>
                </Canvas>
              </div>
              <p className="text-gray-300">Setting up your adventure...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const levelInfo = calculateLevel(guildData?.xp || 0);
  const stats = calculateStats();
  const guildLevel = GUILD_LEVELS[guildData?.guildLevel as keyof typeof GUILD_LEVELS] || GUILD_LEVELS[1];

  // Quest Stages
  const QUEST_STAGES = {
    FUNDAMENTALS: {
      id: 'fundamentals',
      name: 'Training Grounds',
      description: 'Master the ancient arts of entrepreneurship',
      icon: Shield,
      color: 'bg-green-600',
      quests: [
        { id: 'vision', name: 'Vision Quest', xp: 100, description: 'Divine thy sacred purpose', attribute: 'marketing' },
        { id: 'problem', name: 'Dragon Hunt', xp: 150, description: 'Identify the beast to slay', attribute: 'marketing' },
        { id: 'solution', name: 'Forge the Blade', xp: 150, description: 'Craft thy magical solution', attribute: 'tech' },
        { id: 'market', name: 'Scout the Realm', xp: 200, description: 'Map thy kingdom\'s borders', attribute: 'marketing' },
        { id: 'legal', name: 'Royal Charter', xp: 100, description: 'Establish thy guild\'s law', attribute: 'legal' }
      ]
    },
    KICKOFF: {
      id: 'kickoff',
      name: 'Kickoff Citadel',
      description: 'Launch thy venture into the world',
      icon: Castle,
      color: 'bg-blue-600',
      quests: [
        { id: 'mvp', name: 'First Fortress', xp: 300, description: 'Build thy minimum viable castle', attribute: 'tech' },
        { id: 'team', name: 'Rally the Knights', xp: 200, description: 'Recruit thy fellowship', attribute: 'operations' },
        { id: 'pitch', name: 'War Cry', xp: 150, description: 'Perfect thy battle cry', attribute: 'sales' },
        { id: 'firstusers', name: 'First Subjects', xp: 250, description: 'Win thy first loyal followers', attribute: 'marketing' },
        { id: 'feedback', name: 'Council of Elders', xp: 200, description: 'Hear the wisdom of thy users', attribute: 'marketing' }
      ]
    },
    GTM: {
      id: 'gtm',
      name: 'Market Conquest Plains',
      description: 'Conquer the realm with thy strategy',
      icon: Swords,
      color: 'bg-purple-600',
      quests: [
        { id: 'marketing', name: 'Herald\'s Campaign', xp: 250, description: 'Spread thy legend far and wide', attribute: 'marketing' },
        { id: 'sales', name: 'Merchant\'s Guild', xp: 250, description: 'Master the art of commerce', attribute: 'sales' },
        { id: 'channels', name: 'Trade Routes', xp: 200, description: 'Establish thy distribution paths', attribute: 'operations' },
        { id: 'pricing', name: 'Gold Alchemy', xp: 150, description: 'Perfect thy pricing magic', attribute: 'finance' },
        { id: 'metrics', name: 'Oracle\'s Vision', xp: 200, description: 'Divine thy key measurements', attribute: 'finance' }
      ]
    },
    GROWTH: {
      id: 'growth',
      name: 'Empire Mountains',
      description: 'Scale thy dominion to legendary heights',
      icon: Crown,
      color: 'bg-orange-600',
      quests: [
        { id: 'funding', name: 'Dragon\'s Hoard', xp: 400, description: 'Secure thy war chest', attribute: 'finance' },
        { id: 'scaling', name: 'Empire Expansion', xp: 350, description: 'Grow thy kingdom\'s borders', attribute: 'operations' },
        { id: 'culture', name: 'Code of Honor', xp: 200, description: 'Establish thy guild\'s culture', attribute: 'operations' },
        { id: 'partnerships', name: 'Alliance Pacts', xp: 300, description: 'Forge strategic alliances', attribute: 'sales' },
        { id: 'exit', name: 'Legendary Victory', xp: 500, description: 'Plan thy ultimate triumph', attribute: 'finance' }
      ]
    }
  };

  // Main Quest Map
  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <header className="parchment shadow-lg border-b-4 border-yellow-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Crown className="w-8 h-8 text-yellow-500 treasure-glow" />
            <h1 className="text-2xl font-bold text-yellow-100">AI Startup Quest</h1>
            {!isOnline && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-orange-900/50 rounded-lg text-orange-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Offline</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-6">
            {ceoAvatar && (
              <button
                onClick={() => { setShowCEOProfile(true); soundManager.play('swordDraw'); }}
                className={`flex items-center space-x-2 px-3 py-1 rounded-lg bg-gradient-to-r ${ceoAvatar.color} bg-opacity-80 hover:bg-opacity-100 transition-all`}
              >
                <span className="text-2xl">{ceoAvatar.avatar}</span>
                <span className="text-sm font-medium">{ceoAvatar.name}</span>
              </button>
            )}

            <div className="text-right">
              <p className="text-sm text-gray-300">Level {levelInfo.level} Hero</p>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                    style={{ width: `${levelInfo.progress}%` }}
                  />
                </div>
                <span className="text-sm text-yellow-100">{guildData?.xp || 0} XP</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleSound}
                className="text-gray-400 hover:text-white"
                title={soundEnabled ? "Silence sounds" : "Enable sounds"}
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              <button
                onClick={() => { setShowDashboard(true); soundManager.play('swordDraw'); }}
                className="text-gray-400 hover:text-white"
                title="Quest Journal"
              >
                <BarChart3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => { setShowHistory(true); soundManager.play('swordDraw'); }}
                className="text-gray-400 hover:text-white"
                title="Oracle History"
              >
                <History className="w-5 h-5" />
              </button>
              <button
                onClick={() => { setShowDocuments(true); soundManager.play('swordDraw'); }}
                className="text-gray-400 hover:text-white"
                title="Document Library"
              >
                <Scroll className="w-5 h-5" />
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
      <div className="parchment border-b border-yellow-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {guildData?.avatar && (
              <span className="text-3xl">{guildData.avatar.icon}</span>
            )}
            <Castle className="w-5 h-5 text-blue-400" />
            <span className="text-yellow-100 font-bold">{guildData?.guildName}</span>
            <span className="text-sm text-gray-300">Quest: {guildData?.vision}</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => { setShowGuildManagement(true); soundManager.play('swordDraw'); }}
              className="flex items-center space-x-2 px-3 py-1 bg-blue-800 rounded-lg text-sm hover:bg-blue-700 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Guild Hall</span>
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{guildLevel.icon}</span>
              <span className="text-sm font-medium text-yellow-100">{guildLevel.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-yellow-100">{guildData?.gold || 0}</span>
              <button
                onClick={() => { setShowArmory(true); soundManager.play('swordDraw'); }}
                className="px-3 py-1 bg-yellow-800 rounded-lg text-sm hover:bg-yellow-700 transition-all ml-2"
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
      <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-b border-yellow-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <DailyBonus guildData={guildData} onClaim={claimDailyBonus} />
        </div>
      </div>

      {/* Document Generation Bar */}
      <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-b border-yellow-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center space-x-2">
              <Scroll className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-100">Mystical Scroll Creation</span>
            </div>
            <div className="flex items-center space-x-2 flex-wrap">
              {DOCUMENT_TEMPLATES.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleGenerateDocument(template)}
                  disabled={generatingDoc}
                  className="px-3 py-1 parchment rounded-lg text-sm hover:transform hover:scale-105 transition-all disabled:opacity-50"
                  title={`Summon ${template.name} (+${template.xp} XP)`}
                  onMouseEnter={() => soundManager.play('swordDraw')}
                >
                  {template.icon} {template.name}
                </button>
              ))}
            </div>
          </div>
          {generatingDoc && (
            <div className="mt-2 text-center text-sm text-purple-400 animate-pulse">
              The Oracle inscribes thy scroll...
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
                className={`parchment rounded-lg p-6 shadow-xl ${isLocked ? 'opacity-50' : ''} hero-3d`}
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${stage.color} bg-opacity-20 mr-4`}>
                    <StageIcon className={`w-8 h-8 ${stage.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-yellow-100">{stage.name}</h3>
                    <p className="text-sm text-gray-300">{stage.description}</p>
                    {isLocked && (
                      <p className="text-xs text-orange-400 mt-1">⚠️ Complete previous realms to unlock</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {stage.quests.map((quest) => {
                    const questKey = `${stage.id}_${quest.id}`;
                    const questProgress = guildData?.questProgress?.[questKey];
                    const isCompleted = questProgress?.completed;
                    const xpEarned = questProgress?.xpReward;

                    return (
                      <div
                        key={quest.id}
                        onClick={() => {
                          if (!isLocked) {
                            setSelectedQuest({ ...quest, stageId: stage.id });
                            soundManager.play('swordDraw');
                          }
                        }}
                        onMouseEnter={() => !isLocked && soundManager.play('swordDraw')}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${isLocked
                          ? 'bg-gray-700/50 cursor-not-allowed'
                          : isCompleted
                            ? 'parchment border-2 border-green-700 bg-green-900/20 relative hover:transform hover:scale-105'
                            : 'parchment hover:transform hover:scale-105'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {isCompleted ? (
                              <>
                                <Trophy className="w-5 h-5 text-green-500" />
                                <span className="ml-1 px-2 py-0.5 bg-green-700/80 text-xs text-green-100 rounded-full font-semibold">Completed</span>
                              </>
                            ) : (
                              <Target className="w-5 h-5 text-gray-400" />
                            )}
                            <div>
                              <p className="font-medium text-yellow-100 flex items-center">
                                {quest.name}
                                {isCompleted && xpEarned && (
                                  <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-green-600 to-emerald-600 text-xs text-white rounded-full font-semibold border border-green-400">
                                    +{xpEarned} XP
                                  </span>
                                )}
                              </p>
                              <div className="flex items-center space-x-3 text-sm">
                                <span className="text-gray-300">{quest.xp} XP</span>
                                <span className="text-gray-500">•</span>
                                <span className={CORE_ATTRIBUTES[quest.attribute as keyof typeof CORE_ATTRIBUTES]?.color || 'text-gray-400'}>
                                  {CORE_ATTRIBUTES[quest.attribute as keyof typeof CORE_ATTRIBUTES]?.name || 'General'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                        {isCompleted && (
                          <div className="absolute top-2 right-2 flex items-center space-x-1">
                            <span className="text-green-400 text-xs font-bold">✓</span>
                          </div>
                        )}
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
            onClose={() => { setSelectedQuest(null); soundManager.play('swordDraw'); }}
            saveConversation={saveConversation}
            updateGold={updateGold}
          />
        )}

        {/* Guild Management */}
        {showGuildManagement && (
          <GuildManagement
            guildData={guildData}
            onClose={() => { setShowGuildManagement(false); soundManager.play('swordDraw'); }}
          />
        )}

        {/* Armory Interface */}
        {showArmory && (
          <ArmoryInterface
            guildData={guildData}
            onPurchase={handleArmoryPurchase}
            onClose={() => { setShowArmory(false); soundManager.play('swordDraw'); }}
          />
        )}

        {/* Progress Dashboard Modal */}
        <Modal open={showDashboard} size='lg' onClose={() => { setShowDashboard(false); soundManager.play('swordDraw'); }}>
          <div className="p-6 max-w-4xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-yellow-100">Quest Journal</h3>
              <button
                onClick={() => { setShowDashboard(false); soundManager.play('swordDraw'); }}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="parchment rounded-lg p-4">
                <p className="text-sm text-gray-300 mb-1">Total Experience</p>
                <p className="text-2xl font-bold text-purple-400">{guildData?.xp || 0}</p>
              </div>
              <div className="parchment rounded-lg p-4">
                <p className="text-sm text-gray-300 mb-1">Gold Treasury</p>
                <p className="text-2xl font-bold text-yellow-400">{guildData?.gold || 0}</p>
              </div>
              <div className="parchment rounded-lg p-4">
                <p className="text-sm text-gray-300 mb-1">Quests Vanquished</p>
                <p className="text-2xl font-bold text-green-400">{stats.completedQuests}/{stats.totalQuests}</p>
              </div>
              <div className="parchment rounded-lg p-4">
                <p className="text-sm text-gray-300 mb-1">Guild Rank</p>
                <p className="text-2xl font-bold text-blue-400">{guildLevel.name}</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-bold mb-3 text-yellow-100">Thy Journey Progress</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-300 mb-1">Scrolls Crafted</p>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${Math.min(savedDocuments.length * 20, 100)}%` }}></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-300 mb-1">Oracle Consultations</p>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(conversations.length * 5, 100)}%` }}></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-300 mb-1">Daily Crusade</p>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${Math.min((guildData?.dailyStreak || 0) * 3.33, 100)}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{guildData?.dailyStreak || 0} days of valor</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-bold mb-3 text-yellow-100">Mastery of Arts</h4>
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
                    <div key={key} className="parchment rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <AttributeIcon className={`w-4 h-4 ${attr.color}`} />
                        <span className="text-sm font-medium text-yellow-100">{attr.name}</span>
                      </div>
                      <p className="text-lg font-bold text-yellow-100">{attrXP} XP</p>
                      {guildData?.coreAttribute === key && (
                        <span className="text-xs text-purple-400">Primary Art (+50% XP)</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-3 text-yellow-100">Legendary Achievements</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {ACHIEVEMENTS.map((achievement) => {
                  const earned = guildData?.achievements?.includes(achievement.id);
                  return (
                    <div
                      key={achievement.id}
                      className={`parchment rounded-lg p-3 text-center ${earned ? 'magic-border' : 'opacity-50'
                        }`}
                    >
                      <div className="text-3xl mb-1">{achievement.icon}</div>
                      <p className="text-xs font-medium text-yellow-100">{achievement.name}</p>
                      <p className="text-xs text-gray-400 mt-1">{achievement.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Modal>

        {/* Resources Modal */}
        <Modal open={showResources} onClose={() => { setShowResources(false); soundManager.play('swordDraw'); }}>
          <div className="p-6 max-w-4xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-yellow-100">Ancient Knowledge Repository</h3>
              <button
                onClick={() => { setShowResources(false); soundManager.play('swordDraw'); }}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="parchment p-4 mb-6 magic-border">
              <div className="flex items-start space-x-3">
                <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-400">Based on thy profile:</p>
                  <p className="text-sm text-gray-300">
                    Primary Art: {guildData?.coreAttribute} •
                    Hero Level: {levelInfo.level}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-3 flex items-center text-yellow-100">
                  <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                  Sacred Tomes
                </h4>
                <div className="space-y-2">
                  <a href="https://www.ycombinator.com/library" target="_blank" rel="noopener noreferrer"
                    className="block parchment rounded p-3 hover:transform hover:scale-105 transition-all"
                    onMouseEnter={() => soundManager.play('swordDraw')}>
                    <p className="font-medium text-yellow-100">YC Ancient Library</p>
                    <p className="text-xs text-gray-300">Wisdom of the startup elders</p>
                  </a>
                  <a href="https://firstround.com/review/" target="_blank" rel="noopener noreferrer"
                    className="block parchment rounded p-3 hover:transform hover:scale-105 transition-all"
                    onMouseEnter={() => soundManager.play('swordDraw')}>
                    <p className="font-medium text-yellow-100">First Round Chronicles</p>
                    <p className="text-xs text-gray-300">Tales from legendary founders</p>
                  </a>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-3 flex items-center text-yellow-100">
                  <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                  Magical Artifacts
                </h4>
                <div className="space-y-2">
                  <a href="https://stripe.com/atlas" target="_blank" rel="noopener noreferrer"
                    className="block parchment rounded p-3 hover:transform hover:scale-105 transition-all"
                    onMouseEnter={() => soundManager.play('swordDraw')}>
                    <p className="font-medium text-yellow-100">Stripe Atlas Spell</p>
                    <p className="text-xs text-gray-300">Summon thy company</p>
                  </a>
                  <a href="https://www.notion.so/templates" target="_blank" rel="noopener noreferrer"
                    className="block parchment rounded p-3 hover:transform hover:scale-105 transition-all"
                    onMouseEnter={() => soundManager.play('swordDraw')}>
                    <p className="font-medium text-yellow-100">Notion Grimoire</p>
                    <p className="text-xs text-gray-300">Enchanted templates</p>
                  </a>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-3 flex items-center text-yellow-100">
                  <Users className="w-5 h-5 mr-2 text-green-500" />
                  Guilds & Fellowships
                </h4>
                <div className="space-y-2">
                  <a href="https://www.indiehackers.com/" target="_blank" rel="noopener noreferrer"
                    className="block parchment rounded p-3 hover:transform hover:scale-105 transition-all"
                    onMouseEnter={() => soundManager.play('swordDraw')}>
                    <p className="font-medium text-yellow-100">Indie Hackers Guild</p>
                    <p className="text-xs text-gray-300">Fellowship of founders</p>
                  </a>
                  <a href="https://news.ycombinator.com/" target="_blank" rel="noopener noreferrer"
                    className="block parchment rounded p-3 hover:transform hover:scale-105 transition-all"
                    onMouseEnter={() => soundManager.play('swordDraw')}>
                    <p className="font-medium text-yellow-100">Hacker News Tavern</p>
                    <p className="text-xs text-gray-300">Tales and tidings</p>
                  </a>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-3 flex items-center text-yellow-100">
                  <Video className="w-5 h-5 mr-2 text-purple-500" />
                  Training Grounds
                </h4>
                <div className="space-y-2">
                  <a href="https://www.startupschool.org/" target="_blank" rel="noopener noreferrer"
                    className="block parchment rounded p-3 hover:transform hover:scale-105 transition-all"
                    onMouseEnter={() => soundManager.play('swordDraw')}>
                    <p className="font-medium text-yellow-100">Startup Academy</p>
                    <p className="text-xs text-gray-300">Free YC training</p>
                  </a>
                  <a href="https://www.coursera.org/browse/business/entrepreneurship" target="_blank" rel="noopener noreferrer"
                    className="block parchment rounded p-3 hover:transform hover:scale-105 transition-all"
                    onMouseEnter={() => soundManager.play('swordDraw')}>
                    <p className="font-medium text-yellow-100">Coursera Monastery</p>
                    <p className="text-xs text-gray-300">Entrepreneurship scrolls</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Modal>

        {/* CEO Profile Modal */}
        <Modal open={showCEOProfile && ceoAvatar} onClose={() => { setShowCEOProfile(false); soundManager.play('swordDraw'); }}>
          <div className="p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-yellow-100">Thy Legendary Guide</h3>
              <button
                onClick={() => { setShowCEOProfile(false); soundManager.play('swordDraw'); }}
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
                <p className="text-sm text-gray-400 mb-1">Domains of Power</p>
                <div className="flex flex-wrap gap-2">
                  {ceoAvatar?.industries.map((ind: string) => (
                    <span key={ind} className="px-2 py-1 parchment rounded text-sm">
                      {ind}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">Legendary Traits</p>
                <div className="flex flex-wrap gap-2">
                  {ceoAvatar?.traits.map((trait: string) => (
                    <span key={trait} className="px-2 py-1 parchment rounded text-sm">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-700">
                <p className="text-sm text-gray-400 mb-1">Ancient Wisdom</p>
                <p className="italic text-yellow-100">"{ceoAvatar?.advice}"</p>
              </div>
            </div>
          </div>
        </Modal>

        {/* Conversation History Modal */}
        <Modal open={showHistory} onClose={() => { setShowHistory(false); soundManager.play('swordDraw'); }}>
          <div className="p-6 max-w-4xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-yellow-100">Oracle Chronicles</h3>
              <button
                onClick={() => { setShowHistory(false); soundManager.play('swordDraw'); }}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {conversations.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No consultations recorded yet</p>
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

        {/* Documents Modal */}
        <Modal size="full" open={showDocuments} onClose={() => { setShowDocuments(false); soundManager.play('swordDraw'); }}>
          <div className="flex flex-col h-full w-full">
            <div className="flex items-center justify-between p-6 border-b border-yellow-700 bg-gradient-to-r from-purple-900 to-indigo-900">
              <h3 className="text-2xl font-bold text-yellow-100">Scroll Library</h3>
              <button
                onClick={() => { setShowDocuments(false); soundManager.play('swordDraw'); }}
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

        {/* Document View Modal */}
        <Modal open={!!selectedDocument} onClose={() => { setSelectedDocument(null); soundManager.play('swordDraw'); }}>
          <div className="p-6 max-w-4xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-yellow-100">{selectedDocument?.templateName}</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedDocument?.content || '');
                    alert('Scroll copied to thy clipboard!');
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  onClick={() => { setSelectedDocument(null); soundManager.play('swordDraw'); }}
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
      </main>
    </div>
  );
}

// Helper to generate suggested questions for the AI Sage
function getSuggestedSageQuestions({ quest, guildData, guildLevel }: { quest: any, guildData: any, guildLevel: any }) {
  const base: string[] = [];
  // Quest-specific
  if (quest.id === 'vision') {
    base.push(
      'What makes a compelling vision for a new founder?',
      'How can I inspire my team with our mission?',
      'What are common mistakes in startup vision statements?',
      'How do I align my guild around our vision?'
    );
  } else if (quest.id === 'problem') {
    base.push(
      'How do I validate if this problem is real?',
      'What are the best ways to interview potential users?',
      'How do I find my target audience\'s pain points?',
      'What signals show a problem is worth solving?'
    );
  } else if (quest.id === 'solution') {
    base.push(
      'How do I make my solution stand out?',
      'What features should I prioritize first?',
      'How do I test my solution with real users?',
      'What makes a solution magical for customers?'
    );
  } else if (quest.id === 'market') {
    base.push(
      'How do I estimate the size of my market?',
      'What are the best ways to research competitors?',
      'How do I spot trends in my industry?',
      'What are signs of a good market opportunity?'
    );
  } else if (quest.id === 'legal') {
    base.push(
      'What legal structure is best for my startup?',
      'How do I protect my intellectual property?',
      'What agreements should my team have?',
      'What are common legal mistakes for new founders?'
    );
  } else {
    base.push(
      `What advice do you have for this quest: ${quest.name}?`,
      'What are common pitfalls for founders at this stage?',
      'How can I make progress on this quest?'
    );
  }

  // Guild level context
  if (guildLevel.level >= 4) {
    base.push('What advanced strategies should I consider at my guild level?');
  }
  if ((guildData?.xp || 0) > 1000) {
    base.push('How do experienced founders approach this challenge?');
  }
  if (guildData?.coreAttribute) {
    base.push(`How can I use my strength in ${guildData.coreAttribute} to excel in this quest?`);
  }
  return base;
}