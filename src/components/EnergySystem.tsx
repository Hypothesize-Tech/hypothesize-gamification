import React from 'react';
import {
    doc,
    updateDoc,
    serverTimestamp,
    increment,
    arrayUnion,
} from 'firebase/firestore';
import { Zap, AlertTriangle } from 'lucide-react';
import Modal from '../components/Modal';
import { db } from '../config/config';
import { ENERGY_CONFIG, ENERGY_COSTS } from '../config/energy';

// Energy Management Functions
export const energyUtils = {
    // Check if user needs daily energy reset
    needsEnergyReset: (lastEnergyReset: Date | null): boolean => {
        if (!lastEnergyReset) return true;

        const now = new Date();
        const resetTime = new Date(lastEnergyReset);

        // Check if it's a new day (considering reset hour)
        const currentResetTime = new Date(now);
        currentResetTime.setHours(ENERGY_CONFIG.RESET_HOUR, 0, 0, 0);

        const lastResetTime = new Date(resetTime);
        lastResetTime.setHours(ENERGY_CONFIG.RESET_HOUR, 0, 0, 0);

        return currentResetTime.getTime() > lastResetTime.getTime();
    },

    // Calculate time until next energy reset
    getTimeUntilReset: (): { hours: number; minutes: number } => {
        const now = new Date();
        const nextReset = new Date(now);
        nextReset.setHours(ENERGY_CONFIG.RESET_HOUR, 0, 0, 0);

        // If reset time has passed today, set to tomorrow
        if (nextReset <= now) {
            nextReset.setDate(nextReset.getDate() + 1);
        }

        const diffMs = nextReset.getTime() - now.getTime();
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        return { hours, minutes };
    },

    // Check if user has enough energy for action
    canPerformAction: (
        currentEnergy: number,
        energyCost: number,
        isPremium: boolean = false
    ): boolean => {
        if (isPremium) return true;
        return currentEnergy >= energyCost;
    },

    // Calculate energy cost for action
    getEnergyCost: (action: keyof typeof ENERGY_COSTS): number => {
        return ENERGY_COSTS[action];
    }
};

interface GuildMember {
    uid: string;
    name: string;
    email: string;
    role: string;
    founderRole?: string;
    joinedAt: string;
    permissionRole?: 'leader' | 'knight' | 'scout';
}

// Updated Guild Data Interface
export interface GuildDataWithEnergy {
    guildId: string;
    guildName: string;
    vision: string;
    xp: number;
    level: number;
    achievements: string[];
    questProgress: Record<string, any>;
    onboardingData: Record<string, any>;
    coreAttribute: string;
    avatar: any;
    ceoAvatarId: string;
    lastCheckIn: any;
    checkInStreak: number;
    dailyStreak: number;
    lastDailyBonus: any;
    members: GuildMember[];
    inventory: any[];
    equippedGear: any[];
    treasures: any[];
    activeEffects: any[];
    createdAt: any;

    // New properties for onboarding flows
    role?: string;
    attributes?: Record<string, number>;
    isFounder?: boolean;
    founderId?: string;
    invitesSent?: string[];
    permissionRole?: 'leader' | 'knight' | 'scout';

    // Energy System Fields
    currentEnergy: number;
    maxEnergy: number;
    lastEnergyReset: any;

    // Premium System
    isPremium: boolean;
    premiumExpiryDate: any;

    // Gold System
    gold: number;
    guildLevel: number;

    // Energy Purchase History (optional)
    energyPurchaseHistory?: Array<{
        amount: number;
        goldSpent: number;
        timestamp: any;
    }>;
    joinRequestStatus?: 'pending' | 'approved' | 'rejected';
}

// Energy Management Hook (for React)
export const useEnergyManagement = (
    guildData: GuildDataWithEnergy | null,
    userId: string,
    setGuildData: React.Dispatch<React.SetStateAction<GuildDataWithEnergy | null>>
) => {
    const [showEnergyPurchase, setShowEnergyPurchase] = React.useState(false);
    const [purchasingEnergy, setPurchasingEnergy] = React.useState(false);

    // Check and perform daily energy reset
    const checkEnergyReset = async () => {
        if (!guildData || !userId) return;

        const { lastEnergyReset } = guildData;

        if (!lastEnergyReset || typeof lastEnergyReset.toDate !== 'function') {
            return;
        }

        const needsReset = energyUtils.needsEnergyReset(
            lastEnergyReset.toDate()
        );

        if (needsReset) {
            await updateDoc(doc(db, 'guilds', userId), {
                currentEnergy: ENERGY_CONFIG.MAX_DAILY_ENERGY,
                lastEnergyReset: serverTimestamp()
            });
        }
    };

    // Consume energy for action
    const consumeEnergy = async (
        action: keyof typeof ENERGY_COSTS,
        onEnergyConsumed?: () => void
    ): Promise<boolean> => {
        if (!guildData || !userId) return false;

        // Premium users have unlimited energy
        if (guildData.isPremium) {
            onEnergyConsumed?.();
            return true;
        }

        const energyCost = energyUtils.getEnergyCost(action);

        if (!energyUtils.canPerformAction(guildData.currentEnergy, energyCost)) {
            setShowEnergyPurchase(true);
            return false;
        }

        // Deduct energy
        await updateDoc(doc(db, 'guilds', userId), {
            currentEnergy: increment(-energyCost)
        });

        // Manually update local state to reflect energy change immediately
        setGuildData(prevData => {
            if (!prevData) return null;
            return {
                ...prevData,
                currentEnergy: prevData.currentEnergy - energyCost
            };
        });

        onEnergyConsumed?.();
        return true;
    };

    // Purchase energy with gold
    const purchaseEnergy = async (energyAmount: number): Promise<boolean> => {
        if (!guildData || !userId) return false;

        const goldCost = energyAmount * ENERGY_CONFIG.GOLD_TO_ENERGY_RATE;

        if (guildData.gold < goldCost) {
            alert('Not enough gold!');
            return false;
        }

        setPurchasingEnergy(true);

        try {
            await updateDoc(doc(db, 'guilds', userId), {
                currentEnergy: increment(energyAmount),
                gold: increment(-goldCost),
                energyPurchaseHistory: arrayUnion({
                    amount: energyAmount,
                    goldSpent: goldCost,
                    timestamp: new Date()
                })
            });

            // Manually update local state
            setGuildData(prevData => {
                if (!prevData) return null;
                return {
                    ...prevData,
                    currentEnergy: prevData.currentEnergy + energyAmount,
                    gold: prevData.gold - goldCost,
                };
            });

            setShowEnergyPurchase(false);
            return true;
        } catch (error) {
            console.error('Error purchasing energy:', error);
            return false;
        } finally {
            setPurchasingEnergy(false);
        }
    };

    return {
        showEnergyPurchase,
        setShowEnergyPurchase,
        purchasingEnergy,
        checkEnergyReset,
        consumeEnergy,
        purchaseEnergy
    };
};

// Energy Bar Component
export const EnergyBar: React.FC<{
    currentEnergy: number;
    maxEnergy: number;
    isPremium: boolean;
    onPurchaseClick: () => void;
}> = ({ currentEnergy, maxEnergy, isPremium, onPurchaseClick }) => {
    const percentage = ((currentEnergy ?? 0) / (maxEnergy ?? 100)) * 100;
    const timeUntilReset = energyUtils.getTimeUntilReset();

    if (isPremium) {
        return (
            <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-yellow-400">∞ UNLIMITED</span>
                </div>
                <div className="px-2 py-1 bg-yellow-900/30 rounded text-xs text-yellow-400">
                    PREMIUM
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium">{currentEnergy ?? '...'}/{maxEnergy ?? '...'}</span>
            </div>

            <div className="w-24 bg-gray-700 rounded-full h-2">
                <div
                    className={`h-2 rounded-full transition-all ${percentage > 50 ? 'bg-blue-500' :
                        percentage > 25 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {currentEnergy < maxEnergy && (
                <button
                    onClick={onPurchaseClick}
                    className="text-xs px-2 py-1 bg-purple-600 rounded hover:bg-purple-700"
                >
                    Buy Energy
                </button>
            )}

            <div className="text-xs text-gray-400">
                Reset: {timeUntilReset.hours}h {timeUntilReset.minutes}m
            </div>
        </div>
    );
};

// Energy Purchase Modal Component
export const EnergyPurchaseModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    currentGold: number;
    onPurchase: (amount: number) => Promise<boolean>;
    purchasing: boolean;
}> = ({ isOpen, onClose, currentGold, onPurchase, purchasing }) => {
    const [selectedAmount, setSelectedAmount] = React.useState(10);

    const energyPackages = [
        { amount: 10, gold: 10, popular: false },
        { amount: 25, gold: 25, popular: true },
        { amount: 50, gold: 50, popular: false },
        { amount: 100, gold: 100, popular: false },
    ];

    const handlePurchase = async () => {
        const success = await onPurchase(selectedAmount);
        if (success) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <Modal open={isOpen} size='xl' onClose={onClose}>
            <div className="p-6 w-full">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold">Purchase Energy</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">×</button>
                </div>

                <div className="mb-4 p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <Zap className="w-5 h-5 text-blue-400" />
                        <p className="text-sm">
                            <span className="font-medium">Your Gold:</span> {currentGold}
                        </p>
                    </div>
                </div>

                <div className="space-y-3 mb-6">
                    {energyPackages.map((pkg) => {
                        const canAfford = currentGold >= pkg.gold;
                        const isSelected = selectedAmount === pkg.amount;

                        return (
                            <button
                                key={pkg.amount}
                                onClick={() => setSelectedAmount(pkg.amount)}
                                disabled={!canAfford}
                                className={`w-full p-3 rounded-lg border transition-all ${isSelected
                                    ? 'border-purple-500 bg-purple-900/30'
                                    : 'border-gray-600 bg-gray-700'
                                    } ${!canAfford ? 'opacity-50 cursor-not-allowed' : 'hover:border-purple-400'}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Zap className="w-4 h-4 text-blue-400" />
                                        <span className="font-medium">{pkg.amount} Energy</span>
                                        {pkg.popular && (
                                            <span className="px-2 py-1 bg-purple-600 text-xs rounded">POPULAR</span>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <span className="text-yellow-400">{pkg.gold}</span>
                                        <span className="text-xs text-gray-400">gold</span>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handlePurchase}
                        disabled={purchasing || currentGold < selectedAmount}
                        className="flex-1 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {purchasing ? 'Purchasing...' : (currentGold < selectedAmount ? 'Not enough gold!' : `Buy ${selectedAmount} Energy`)}
                    </button>
                </div>

                <div className="mt-4 text-center">
                    <p className="text-xs text-gray-400">
                        Energy resets daily at midnight UTC
                    </p>
                </div>
            </div>
        </Modal>
    );
};

// Energy Warning Component
export const EnergyWarning: React.FC<{
    action: string;
    energyCost: number;
    currentEnergy: number;
    onPurchaseClick: () => void;
}> = ({ action, energyCost, currentEnergy, onPurchaseClick }) => {
    const timeUntilReset = energyUtils.getTimeUntilReset();

    return (
        <div className="bg-orange-900/30 border border-orange-700 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                <div className="flex-1">
                    <p className="font-medium text-orange-400">Not Enough Energy!</p>
                    <p className="text-sm text-gray-300 mt-1">
                        {action} requires {energyCost} energy, but you only have {currentEnergy}.
                    </p>
                    <div className="flex items-center justify-between mt-3">
                        <p className="text-xs text-gray-400">
                            Energy resets in {timeUntilReset.hours}h {timeUntilReset.minutes}m
                        </p>
                        <button
                            onClick={onPurchaseClick}
                            className="px-3 py-1 bg-purple-600 rounded text-sm hover:bg-purple-700"
                        >
                            Buy Energy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}; 