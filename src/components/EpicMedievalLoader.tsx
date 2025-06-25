import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { Sword3D } from "./Sword3D";
import EpicMedievalLoaderStyles from "../utils/medievalStyles";

export const EpicMedievalLoader = () => {
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
                {/* CSS Animations */}
                <EpicMedievalLoaderStyles />
            </div>
        </div>
    );
};