import React, { useState, useEffect } from 'react';
import { Zap, AlertTriangle, Coins } from 'lucide-react';
import Modal from '../components/Modal';
import { ENERGY_CONFIG, ENERGY_COSTS } from '../config/energy';

type EnergyAction = keyof typeof ENERGY_COSTS;

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
    setGuildData: (data?: any) => void,
    consumeEnergyApi: (action: EnergyAction) => Promise<any>,
    purchaseEnergyApi: (amount: number, goldCost: number) => Promise<any>
) => {
    const [showEnergyPurchase, setShowEnergyPurchase] = useState(false);
    const [purchasingEnergy, setPurchasingEnergy] = useState(false);

    // Consume energy for action
    const consumeEnergy = async (
        action: EnergyAction,
        onEnergyConsumed?: () => void
    ): Promise<boolean> => {
        if (!guildData || !userId) return false;

        if (action === 'SUBMIT_QUEST') {
            onEnergyConsumed?.();
            return true;
        }

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

        try {
            const { data: updatedGuild } = await consumeEnergyApi(action);
            setGuildData(updatedGuild);
            onEnergyConsumed?.();
            return true;
        } catch (error) {
            console.error('Failed to consume energy', error);
            setShowEnergyPurchase(true);
            return false;
        }
    };

    // Purchase energy with gold
    const purchaseEnergy = async (energyAmount: number): Promise<boolean> => {
        if (!guildData || !userId) return false;

        const availableSpace = guildData.maxEnergy - guildData.currentEnergy;
        if (energyAmount > availableSpace) {
            console.warn(`Attempted to purchase ${energyAmount} energy, but only ${availableSpace} space is available. Capping at ${availableSpace}.`);
            energyAmount = availableSpace;
        }

        if (energyAmount <= 0) {
            // This can happen if the user's energy is already full or near full.
            // We can consider this a "successful" operation in the sense that no purchase is needed.
            setShowEnergyPurchase(false);
            return true;
        }
        const goldCost = energyAmount * ENERGY_CONFIG.GOLD_TO_ENERGY_RATE;

        if (guildData.gold < goldCost) {
            alert('Not enough gold!');
            return false;
        }

        setPurchasingEnergy(true);

        try {
            const { data: updatedGuild } = await purchaseEnergyApi(energyAmount, goldCost);
            setGuildData(updatedGuild);
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
    onPurchase: (amount: number) => Promise<void>;
    purchasing: boolean;
    currentEnergy: number;
    maxEnergy: number;
}> = ({ isOpen, onClose, currentGold, onPurchase, purchasing, currentEnergy, maxEnergy }) => {
    const minPurchaseAmount = 5;
    const maxPurchaseableAmount = Math.max(0, maxEnergy - currentEnergy);

    const [energyAmount, setEnergyAmount] = useState(minPurchaseAmount);

    useEffect(() => {
        if (isOpen) {
            const maxValidAmount = Math.floor(maxPurchaseableAmount / minPurchaseAmount) * minPurchaseAmount;
            const initialAmount = Math.min(25, maxValidAmount);
            setEnergyAmount(initialAmount);
        }
    }, [isOpen, maxPurchaseableAmount]);

    const goldCost = energyAmount * ENERGY_CONFIG.GOLD_TO_ENERGY_RATE;
    const maxValidPurchase = Math.floor(maxPurchaseableAmount / minPurchaseAmount) * minPurchaseAmount;

    if (!isOpen) return null;

    if (maxPurchaseableAmount < minPurchaseAmount) {
        return (
            <Modal open={isOpen} size='md' onClose={onClose}>
                <div className="parchment p-6 w-full overflow-hidden">
                    <h3 className="text-xl font-bold text-yellow-100 mb-4">Energy Nearing Full</h3>
                    <p className="text-sm text-gray-300 mb-4">
                        {maxPurchaseableAmount === 0
                            ? "Your energy is already at maximum capacity!"
                            : `You can't purchase less than ${minPurchaseAmount} energy.`}
                    </p>
                    <button onClick={onClose} className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition-all mt-4">
                        Close
                    </button>
                </div>
            </Modal>
        );
    }

    return (
        <Modal open={isOpen} size='md' onClose={onClose}>
            <div className="parchment p-6  w-full overflow-hidden">
                <h3 className="text-xl font-bold text-yellow-100 mb-4">Refill Energy</h3>
                <p className="text-sm text-gray-300 mb-4">
                    Your energy is low. Refill it with your gold coins to continue your quests.
                </p>

                <div className="my-6">
                    <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="energy-slider">
                        Energy to purchase: <span className="text-yellow-200 font-bold">{energyAmount}</span>
                    </label>
                    <input
                        id="energy-slider"
                        type="range"
                        min={minPurchaseAmount}
                        max={maxValidPurchase}
                        step={minPurchaseAmount}
                        value={energyAmount}
                        onChange={(e) => setEnergyAmount(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        disabled={maxPurchaseableAmount < minPurchaseAmount}
                    />
                </div>

                <div className="flex items-center justify-between parchment p-3 mb-6">
                    <span className="text-gray-300">Cost:</span>
                    <div className="flex items-center space-x-2">
                        <Coins className="w-5 h-5 text-yellow-500" />
                        <span className="font-bold text-yellow-100">{goldCost}</span>
                    </div>
                </div>

                <button
                    onClick={() => { onPurchase(energyAmount); onClose() }}
                    disabled={purchasing || currentGold < goldCost || energyAmount === 0}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all magic-border disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {purchasing ? 'Purchasing...' : 'Purchase Energy'}
                </button>
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