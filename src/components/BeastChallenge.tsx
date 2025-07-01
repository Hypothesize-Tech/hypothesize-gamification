import React from 'react';
import type { Beast } from '../config/beasts';
import { Swords, Zap } from 'lucide-react';

interface BeastChallengeProps {
    beast: Beast;
    // We can add interaction handlers here later, e.g., onStartQuest
}

export const BeastChallenge: React.FC<BeastChallengeProps> = ({ beast }) => {
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

            <div className="mt-6 flex justify-end">
                <button
                    disabled // Will enable when functionality is ready
                    className="px-6 py-2 bg-gradient-to-r from-red-700 to-red-900 text-white font-bold rounded-lg hover:from-red-600 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md border border-red-500"
                >
                    <Swords className="w-5 h-5" />
                    Confront Beast
                </button>
            </div>
        </div>
    );
}; 