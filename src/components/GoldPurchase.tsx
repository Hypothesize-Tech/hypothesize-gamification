import { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {
    Coins,
    Crown,
    Timer,
    MapPin,
    Zap,
    Gift,
    Lock,
    Unlock,
    Sparkles,
    X,
    Shield,
    Trophy,
} from 'lucide-react';
import * as THREE from 'three';
import { updateDoc, doc, increment, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/config';

// 3D Gold Coin Component
function GoldCoin3D({ position = [0, 0, 0], scale = [1, 1, 1] }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.02;
        }
    });

    const safePosition: [number, number, number] = Array.isArray(position) && position.length === 3
        ? [position[0], position[1], position[2]]
        : [0, 0, 0];
    const safeScale: [number, number, number] = Array.isArray(scale) && scale.length === 3
        ? [scale[0], scale[1], scale[2]]
        : [1, 1, 1];

    return (
        <mesh ref={meshRef} position={safePosition} scale={safeScale}>
            <cylinderGeometry args={[1, 1, 0.2, 32]} />
            <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
    );
}

// 3D Treasure Chest Component
function TreasureChest3D({ isOpen = false }) {
    const groupRef = useRef<THREE.Group>(null);
    const lidRef = useRef<THREE.Mesh>(null);

    useEffect(() => {
        if (lidRef.current) {
            lidRef.current.rotation.x = isOpen ? -Math.PI / 4 : 0;
        }
    }, [isOpen]);

    return (
        <group ref={groupRef} scale={[0.5, 0.5, 0.5]}>
            {/* Chest Base */}
            <mesh position={[0, -0.5, 0]}>
                <boxGeometry args={[2, 1, 1.5]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>

            {/* Chest Lid */}
            <mesh ref={lidRef} position={[0, 0, -0.75]}>
                <mesh position={[0, 0, 0.75]}>
                    <cylinderGeometry args={[1, 1, 1.5, 8, 1, false, 0, Math.PI]} />
                    <meshStandardMaterial color="#A0522D" />
                </mesh>
            </mesh>

            {/* Gold inside */}
            {isOpen && (
                <>
                    <mesh position={[0, -0.3, 0]}>
                        <sphereGeometry args={[0.4, 16, 16]} />
                        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
                    </mesh>
                    <mesh position={[-0.3, -0.2, 0.2]}>
                        <sphereGeometry args={[0.3, 16, 16]} />
                        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
                    </mesh>
                    <mesh position={[0.3, -0.2, -0.2]}>
                        <sphereGeometry args={[0.3, 16, 16]} />
                        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
                    </mesh>
                </>
            )}
        </group>
    );
}

// Currency mapping
const CURRENCIES = {
    US: { code: 'USD', symbol: '$', rate: 1 },
    IN: { code: 'INR', symbol: '₹', rate: 83 },
    GB: { code: 'GBP', symbol: '£', rate: 0.79 },
    EU: { code: 'EUR', symbol: '€', rate: 0.92 },
    CA: { code: 'CAD', symbol: 'C$', rate: 1.36 },
    AU: { code: 'AUD', symbol: 'A$', rate: 1.52 },
    JP: { code: 'JPY', symbol: '¥', rate: 149 },
    DEFAULT: { code: 'USD', symbol: '$', rate: 1 }
};

// Pricing plans
const BASE_PLANS = [
    { id: 'starter', coins: 200, price: 5, bonus: 0, icon: '⚡', color: 'from-yellow-600 to-yellow-500' },
    { id: 'warrior', coins: 500, price: 10, bonus: 0, icon: '⚔️', color: 'from-orange-600 to-orange-500' },
    { id: 'knight', coins: 1500, price: 20, bonus: 10, icon: '🛡️', color: 'from-purple-600 to-purple-500' },
    { id: 'legend', coins: 5000, price: 50, bonus: 20, icon: '👑', color: 'from-blue-600 to-indigo-600' }
];

interface GoldPurchaseProps {
    user: any;
    guildData: any;
    onClose: () => void;
    soundManager: any;
    onPurchaseSuccess: (newGold: number, purchaseData: any) => void;
}

export function GoldPurchase({ user, guildData, onClose, soundManager, onPurchaseSuccess }: GoldPurchaseProps) {
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [currency, setCurrency] = useState(CURRENCIES.DEFAULT);
    const [countdownTime, setCountdownTime] = useState(3600); // 1 hour in seconds
    const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [locationPermission, setLocationPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
    const [show3D, setShow3D] = useState(true);
    const canvasRef = useRef<HTMLDivElement>(null);
    const [purchaseError, setPurchaseError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'stripe'>('paypal');

    const totalSpent = guildData?.purchaseHistory?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0;
    const isVIP = totalSpent >= 50;
    const vipDiscount = isVIP ? 0.05 : 0;

    // Special offers
    const weekendOffer = new Date().getDay() === 0 || new Date().getDay() === 6;
    const limitedOffer = {
        id: 'limited',
        coins: 5000,
        price: 25,
        bonus: 100,
        icon: '🔥',
        color: 'from-red-600 to-pink-600',
        originalPrice: 50
    };

    // Get user location and set currency
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const response = await fetch(
                            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
                        );
                        const data = await response.json();
                        const countryCode = data.countryCode;
                        setCurrency(CURRENCIES[countryCode as keyof typeof CURRENCIES] || CURRENCIES.DEFAULT);
                        setLocationPermission('granted');
                    } catch (error) {
                        console.error('Error getting location:', error);
                        setCurrency(CURRENCIES.DEFAULT);
                    }
                },
                (error) => {
                    console.error('Location error:', error);
                    setCurrency(CURRENCIES.DEFAULT);
                    setLocationPermission('denied');
                }
            );
        }
    }, []);

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdownTime(prev => {
                if (prev <= 0) return 3600; // Reset to 1 hour
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatPrice = (price: number) => {
        const localPrice = price * currency.rate;
        const discountedPrice = localPrice * (1 - vipDiscount);
        return {
            original: `${currency.symbol}${localPrice.toFixed(2)}`,
            discounted: `${currency.symbol}${discountedPrice.toFixed(2)}`,
            hasDiscount: vipDiscount > 0
        };
    };

    const handlePurchase = async (plan: any, orderId: string) => {
        try {
            const purchaseData = {
                orderId,
                planId: plan.id,
                coins: plan.coins + (plan.bonus || 0),
                amount: plan.price * (1 - vipDiscount),
                currency: currency.code,
                timestamp: new Date().toISOString(),
                type: plan.id === 'limited' ? 'limited_offer' : 'regular'
            };

            await updateDoc(doc(db, 'guilds', user.uid), {
                gold: increment(purchaseData.coins),
                purchaseHistory: arrayUnion(purchaseData),
                totalSpent: increment(purchaseData.amount),
                lastPurchase: serverTimestamp()
            });

            soundManager.play('levelUp');
            soundManager.play('coinCollect');
            setShowConfetti(true);

            // Call the callback to update App state
            onPurchaseSuccess((guildData.gold || 0) + purchaseData.coins, purchaseData);

            setTimeout(() => {
                alert(`🎉 Your balance increased by ${purchaseData.coins} gold coins!`);
                onClose();
            }, 1000);
        } catch (error) {
            console.error('Purchase error:', error);
            soundManager.play('error');
            alert('Purchase failed. Please try again.');
        }
    };

    const paypalOptions = {
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "test",
        currency: currency.code,
        intent: "capture"
    };

    // Cleanup WebGL contexts when component unmounts
    useEffect(() => {
        return () => {
            setShow3D(false);
            // Force cleanup of WebGL contexts
            if (canvasRef.current) {
                const canvases = canvasRef.current.querySelectorAll('canvas');
                canvases.forEach(canvas => {
                    const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
                    if (gl && gl.getExtension('WEBGL_lose_context')) {
                        gl.getExtension('WEBGL_lose_context')?.loseContext();
                    }
                });
            }
        };
    }, []);


    const trackPurchaseSuccess = (plan: any, orderId: string) => {
        // Replace with real analytics call
        console.log('Purchase success:', {
            planId: plan.id,
            orderId: orderId,
            revenue: plan.price * (1 - vipDiscount)
        });
    };

    const trackPurchaseCancel = (plan: any) => {
        // Replace with real analytics call
        console.log('Purchase cancelled:', {
            planId: plan.id,
            currency: currency.code
        });
    };
    // --- Retry logic ---
    const retryPurchase = async (selectedPlan: any, orderId: string, retries = 3) => {
        for (let i = 0; i < retries; i++) {
            try {
                await handlePurchase(selectedPlan, orderId);
                break;
            } catch (error) {
                if (i === retries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div ref={canvasRef} className="parchment rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto relative">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-yellow-900 to-amber-900 p-6 rounded-t-lg border-b-4 border-yellow-700 z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {show3D ? (
                                <div className="w-20 h-20">
                                    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                                        <ambientLight intensity={0.5} />
                                        <pointLight position={[10, 10, 10]} />
                                        <Suspense fallback={null}>
                                            <GoldCoin3D scale={[1.5, 1.5, 1.5]} />
                                        </Suspense>
                                    </Canvas>
                                </div>
                            ) : (
                                <div className="w-20 h-20 flex items-center justify-center text-5xl">
                                    💰
                                </div>
                            )}
                            <div>
                                <h2 className="text-3xl font-bold text-yellow-100 flex items-center">
                                    Gold Purchase
                                    {isVIP && (
                                        <Crown className="w-6 h-6 ml-2 text-yellow-400" />
                                    )}
                                </h2>
                                <p className="text-yellow-200">Add more gold coins</p>
                            </div>
                        </div>
                        <button
                            onClick={() => { onClose(); soundManager.play('swordDraw'); }}
                            className="text-yellow-200 hover:text-white text-2xl"
                        >
                            <X className="w-8 h-8" />
                        </button>
                    </div>

                    {/* Currency & Location */}
                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-yellow-200">
                            <MapPin className="w-4 h-4" />
                            <span>Currency: {currency.code}</span>
                            {locationPermission === 'denied' && (
                                <span className="text-xs text-orange-400">(Location denied, using USD)</span>
                            )}
                        </div>
                        {isVIP && (
                            <div className="flex items-center space-x-2 px-3 py-1 bg-purple-800/50 rounded-lg">
                                <Shield className="w-4 h-4 text-purple-400" />
                                <span className="text-purple-200 text-sm">VIP Member - 5% Discount Applied</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Special Offers Section */}
                <div className="p-6 space-y-6">
                    {/* Limited Time Offer */}
                    <div className="bg-gradient-to-r from-red-900/50 to-pink-900/50 rounded-lg p-6 border-2 border-red-600 relative overflow-hidden">
                        <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                            LIMITED TIME
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-yellow-100 mb-2 flex items-center">
                                    <Zap className="w-6 h-6 mr-2 text-yellow-400" />
                                    Flash Sale
                                </h3>
                                <p className="text-gray-300 mb-4">
                                    Massive 50% discount! Get 5000 gold coins for the price of 2500!
                                </p>
                                <div className="flex items-center space-x-4">
                                    <div className="text-3xl font-bold text-yellow-100">
                                        {formatPrice(limitedOffer.price).hasDiscount ? (
                                            <>
                                                <span className="line-through text-gray-500 text-xl mr-2">
                                                    {formatPrice(limitedOffer.originalPrice).original}
                                                </span>
                                                {formatPrice(limitedOffer.price).discounted}
                                            </>
                                        ) : formatPrice(limitedOffer.price).original}
                                    </div>
                                    <div className="flex items-center space-x-2 text-red-400">
                                        <Timer className="w-5 h-5" />
                                        <span className="font-mono text-lg">{formatTime(countdownTime)}</span>
                                    </div>
                                </div>
                            </div>
                            {show3D ? (
                                <div className="w-32 h-32">
                                    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                                        <ambientLight intensity={0.5} />
                                        <pointLight position={[10, 10, 10]} />
                                        <Suspense fallback={null}>
                                            <TreasureChest3D isOpen={true} />
                                        </Suspense>
                                    </Canvas>
                                </div>
                            ) : (
                                <div className="w-32 h-32 flex items-center justify-center text-6xl">
                                    💎
                                </div>
                            )}
                            <button
                                onClick={() => setSelectedPlan(limitedOffer)}
                                className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-red-500 hover:to-pink-500 transition-all transform hover:scale-105 magic-border"
                            >
                                Claim Now
                            </button>
                        </div>
                    </div>

                    {/* Weekend Special */}
                    {weekendOffer && (
                        <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-lg p-4 border-2 border-purple-600">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Gift className="w-6 h-6 text-purple-400" />
                                    <h4 className="text-lg font-bold text-yellow-100">Weekend Warriors Special</h4>
                                    <span className="text-purple-300">+25% bonus coins on all purchases!</span>
                                </div>
                                <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
                            </div>
                        </div>
                    )}

                    {/* Regular Plans */}
                    <div>
                        <h3 className="text-xl font-bold text-yellow-100 mb-4 flex items-center">
                            <Coins className="w-6 h-6 mr-2 text-yellow-400" />
                            Treasury Packages
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {BASE_PLANS.map((plan) => {
                                const bonusCoins = weekendOffer ? Math.floor(plan.coins * 0.25) : 0;
                                const totalCoins = plan.coins + (plan.bonus || 0) + bonusCoins;
                                const price = formatPrice(plan.price);

                                return (
                                    <div
                                        key={plan.id}
                                        className={`parchment rounded-lg p-6 relative transform transition-all hover:scale-105 cursor-pointer ${hoveredPlan === plan.id ? 'magic-border' : ''
                                            }`}
                                        onMouseEnter={() => {
                                            setHoveredPlan(plan.id);
                                            soundManager.play('swordDraw');
                                        }}
                                        onMouseLeave={() => setHoveredPlan(null)}
                                        onClick={() => setSelectedPlan(plan)}
                                    >
                                        {plan.bonus > 0 && (
                                            <div className="absolute -top-2 -right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                                                +{plan.bonus}% Bonus
                                            </div>
                                        )}

                                        <div className={`text-5xl mb-3 text-center`}>{plan.icon}</div>
                                        <h4 className="text-lg font-bold text-yellow-100 mb-2 text-center capitalize">
                                            {plan.id} Pack
                                        </h4>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-center space-x-2">
                                                <Coins className="w-5 h-5 text-yellow-500" />
                                                <span className="text-2xl font-bold text-yellow-100">{totalCoins}</span>
                                            </div>

                                            {bonusCoins > 0 && (
                                                <p className="text-xs text-green-400 text-center">
                                                    +{bonusCoins} weekend bonus!
                                                </p>
                                            )}

                                            <div className="text-center">
                                                {price.hasDiscount ? (
                                                    <>
                                                        <p className="line-through text-gray-500 text-sm">{price.original}</p>
                                                        <p className="text-xl font-bold text-yellow-100">{price.discounted}</p>
                                                    </>
                                                ) : (
                                                    <p className="text-xl font-bold text-yellow-100">{price.original}</p>
                                                )}
                                            </div>
                                        </div>

                                        <button className={`w-full mt-4 px-4 py-2 bg-gradient-to-r ${plan.color} text-white rounded-lg hover:opacity-90 transition-all`}>
                                            Select
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* VIP Benefits */}
                    <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-6 border border-purple-600">
                        <h3 className="text-xl font-bold text-yellow-100 mb-4 flex items-center">
                            <Trophy className="w-6 h-6 mr-2 text-purple-400" />
                            VIP Loyalty Chamber
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-bold text-purple-300 mb-2">Current Status</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-300">Total Invested:</span>
                                        <span className="text-yellow-100 font-bold">${totalSpent.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-300">Status:</span>
                                        <span className={`font-bold ${isVIP ? 'text-purple-400' : 'text-gray-400'}`}>
                                            {isVIP ? 'VIP Member' : 'Regular Member'}
                                        </span>
                                    </div>
                                    {!isVIP && (
                                        <div>
                                            <p className="text-xs text-gray-400 mt-2">
                                                Invest ${(50 - totalSpent).toFixed(2)} more to unlock VIP status
                                            </p>
                                            <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                                                <div
                                                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all"
                                                    style={{ width: `${(totalSpent / 50) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-purple-300 mb-2">VIP Benefits</h4>
                                <ul className="space-y-1 text-sm">
                                    <li className={`flex items-center space-x-2 ${isVIP ? 'text-purple-300' : 'text-gray-500'}`}>
                                        {isVIP ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                        <span>5% discount on all purchases</span>
                                    </li>
                                    <li className={`flex items-center space-x-2 ${isVIP ? 'text-purple-300' : 'text-gray-500'}`}>
                                        {isVIP ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                        <span>Exclusive VIP badge</span>
                                    </li>
                                    <li className={`flex items-center space-x-2 ${isVIP ? 'text-purple-300' : 'text-gray-500'}`}>
                                        {isVIP ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                        <span>Priority support</span>
                                    </li>
                                    <li className={`flex items-center space-x-2 ${isVIP ? 'text-purple-300' : 'text-gray-500'}`}>
                                        {isVIP ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                        <span>Early access to new features</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* PayPal Integration */}
                    {selectedPlan && (
                        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                            <div className="parchment rounded-lg p-6 max-w-md w-full">
                                <h3 className="text-xl font-bold text-yellow-100 mb-4">Complete Purchase</h3>
                                <div className="mb-4 text-center">
                                    <p className="text-3xl mb-2">{selectedPlan.icon}</p>
                                    <p className="text-lg text-yellow-100">
                                        {selectedPlan.coins + (selectedPlan.bonus || 0)} Gold Coins
                                    </p>
                                    <p className="text-2xl font-bold text-yellow-100 mt-2">
                                        {formatPrice(selectedPlan.price).discounted}
                                    </p>
                                </div>
                                {/* Payment Method Switcher */}
                                <div className="flex space-x-2 mb-4">
                                    <button
                                        onClick={() => setPaymentMethod('paypal')}
                                        className={`px-4 py-2 rounded ${paymentMethod === 'paypal' ? 'bg-blue-600' : 'bg-gray-600'} text-white`}
                                        disabled={isProcessing}
                                    >
                                        PayPal
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('stripe')}
                                        className={`px-4 py-2 rounded ${paymentMethod === 'stripe' ? 'bg-purple-600' : 'bg-gray-600'} text-white`}
                                        disabled
                                    >
                                        Credit Card
                                    </button>
                                </div>
                                {/* Error Message */}
                                {purchaseError && (
                                    <div className="bg-red-900/50 border border-red-600 rounded-lg p-3 mt-4">
                                        <p className="text-red-300 text-sm">{purchaseError}</p>
                                    </div>
                                )}
                                {/* Loading State */}
                                {isProcessing && (
                                    <div className="flex items-center justify-center my-4">
                                        <span className="text-yellow-200 animate-pulse">Processing payment...</span>
                                    </div>
                                )}
                                {/* PayPal Buttons */}
                                {paymentMethod === 'paypal' && (
                                    <PayPalScriptProvider options={paypalOptions}>
                                        <PayPalButtons
                                            createOrder={(_, actions) => {
                                                const itemPrice = (selectedPlan.price * currency.rate * (1 - vipDiscount)).toFixed(2);
                                                return actions.order.create({
                                                    intent: "CAPTURE",
                                                    purchase_units: [{
                                                        amount: {
                                                            value: itemPrice,
                                                            currency_code: currency.code,
                                                            breakdown: {
                                                                item_total: {
                                                                    currency_code: currency.code,
                                                                    value: itemPrice
                                                                }
                                                            }
                                                        },
                                                        description: `${selectedPlan.coins} Gold Coins - Digital Currency`,
                                                        soft_descriptor: "HYPOTHESIZE",
                                                        items: [{
                                                            name: `${selectedPlan.coins} Gold Coins`,
                                                            unit_amount: {
                                                                currency_code: currency.code,
                                                                value: itemPrice,
                                                            },
                                                            quantity: "1",
                                                            category: "DIGITAL_GOODS"
                                                        }],
                                                    }],
                                                    application_context: {
                                                        shipping_preference: "NO_SHIPPING"
                                                    }
                                                });
                                            }}
                                            onApprove={async (_, actions) => {
                                                setIsProcessing(true);
                                                setPurchaseError(null);
                                                try {
                                                    if (actions.order) {
                                                        const order = await actions.order.capture();
                                                        if (order?.id) {
                                                            await retryPurchase(selectedPlan, order.id);
                                                            trackPurchaseSuccess(selectedPlan, order.id);
                                                        } else {
                                                            throw new Error('Order capture failed');
                                                        }
                                                    }
                                                } catch (error) {
                                                    console.error('Payment processing error:', error);
                                                    soundManager.play('error');
                                                    setPurchaseError('Payment processing failed. Please contact support if the issue persists.');
                                                } finally {
                                                    setIsProcessing(false);
                                                }
                                            }}
                                            onError={(err) => {
                                                console.error('PayPal error:', err);
                                                soundManager.play('error');
                                                setPurchaseError('Payment failed. Please try again or contact support.');
                                            }}
                                            onCancel={() => {
                                                trackPurchaseCancel(selectedPlan);
                                            }}
                                            disabled={isProcessing}
                                            style={{
                                                layout: "vertical",
                                                shape: "rect",
                                                label: "paypal"
                                            }}
                                        />
                                    </PayPalScriptProvider>
                                )}
                                {/* Stripe (disabled placeholder) */}
                                {paymentMethod === 'stripe' && (
                                    <div className="my-4 text-center text-gray-400">Credit Card payments coming soon!</div>
                                )}
                                <button
                                    onClick={() => setSelectedPlan(null)}
                                    className="w-full mt-4 text-gray-400 hover:text-white"
                                    disabled={isProcessing}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Confetti Effect */}
                {showConfetti && (
                    <div className="fixed inset-0 pointer-events-none z-50">
                        {[...Array(50)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-fall"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 2}s`,
                                    animationDuration: `${2 + Math.random() * 2}s`
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}