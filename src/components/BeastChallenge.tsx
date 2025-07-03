import React from 'react';
import type { Beast } from '../config/beasts';
import { Swords, Zap } from 'lucide-react';
import { energyUtils } from './EnergySystem';

interface BeastChallengeProps {
    beast: Beast;
    currentEnergy: number;
    isPremium: boolean;
    onConfrontBeast: (beast: Beast) => Promise<void>;
    isProcessing?: boolean;
}

/**
 * BeastChallenge Component
 * 
 * Displays a fantasy beast challenge card with the ability to confront the beast.
 * Confronting a beast costs 40 energy and is only available when the beast is active
 * and the user has sufficient energy (or is premium).
 */
export const BeastChallenge: React.FC<BeastChallengeProps> = ({
    beast,
    currentEnergy,
    isPremium,
    onConfrontBeast,
    isProcessing = false
}) => {
    // Determine if the "Confront Beast" button should be enabled
    const canConfrontBeast = beast.status === 'active' &&
        (isPremium || energyUtils.canPerformAction(currentEnergy, 40, isPremium));

    const handleConfrontBeast = async () => {
        if (!canConfrontBeast || isProcessing) return;

        try {
            await onConfrontBeast(beast);
        } catch (error) {
            console.error('Error confronting beast:', error);
        }
    };

    return (
        <div className="parchment p-6 rounded-lg shadow-lg border border-yellow-700/50 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-yellow-100">{beast.name}</h3>
                {beast.status === 'active' && (
                    <span className="px-3 py-1 text-sm font-semibold text-white bg-red-600/80 rounded-full border border-red-400 flex items-center gap-2">
                        <Zap className="w-4 h-4 animate-pulse" />
                        Active Threat
                    </span>
                )}
                {beast.status === 'defeated' && (
                    <span className="px-3 py-1 text-sm font-semibold text-gray-800 bg-green-500/80 rounded-full border border-green-300">
                        Defeated
                    </span>
                )}
            </div>

            <p className="text-sm text-yellow-300 italic mb-4">{beast.metaphor}</p>

            <div className="space-y-4 text-gray-300">
                <div>
                    <h4 className="font-semibold text-yellow-100 mb-1">Description</h4>
                    <p className="text-sm">{beast.description}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-yellow-100 mb-1">Gameplay Mechanic</h4>
                    <p className="text-sm whitespace-pre-line">{beast.gameplayMechanic}</p>
                </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
                {/* Energy cost indicator */}
                <div className="flex items-center text-sm text-gray-400">
                    <Zap className="w-4 h-4 mr-1" />
                    <span>Costs 40 Energy</span>
                </div>

                <button
                    onClick={handleConfrontBeast}
                    disabled={!canConfrontBeast || isProcessing}
                    className={`px-6 py-2 font-bold rounded-lg transition-all flex items-center gap-2 shadow-md border ${canConfrontBeast && !isProcessing
                        ? 'bg-gradient-to-r from-red-700 to-red-900 text-white hover:from-red-600 hover:to-red-800 border-red-500 hover:scale-105'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50 border-gray-600'
                        }`}
                    title={
                        beast.status !== 'active'
                            ? 'Beast is not currently active'
                            : !canConfrontBeast
                                ? 'Insufficient energy (40 required)'
                                : 'Confront this beast'
                    }
                >
                    <Swords className="w-5 h-5" />
                    {isProcessing ? 'Confronting...' : 'Confront Beast'}
                </button>
            </div>
        </div>
    );
};