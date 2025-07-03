import React from 'react';

// Import the level icons
import icon1 from '../assets/icon_1.png'; // Campfire for level 1
import icon2 from '../assets/icon_2.png';
import icon3 from '../assets/icon_3.png';
import icon4 from '../assets/icon_4.png';
import icon5 from '../assets/icon_5.png';
import icon6 from '../assets/icon_6.png';
import icon7 from '../assets/icon_7.png';

// Guild level descriptions from constants
import { GUILD_LEVELS } from '../utils/constant';
import { determineGuildLevel, getGuildLevelName } from '../utils/helper';

interface GuildProgressIndicatorProps {
    level?: number; // Level can now be optional
    guildData?: any; // Added to determine level based on quest progress
    className?: string;
    showLabel?: boolean;
    showDescription?: boolean;
    showRequirements?: boolean; // Added to show unlock requirements
    size?: 'sm' | 'md' | 'lg';
}

/**
 * GuildProgressIndicator Component
 * 
 * Displays a visual representation of the guild's current level.
 * For level 1, displays a campfire with animated sparks.
 * For other levels, displays the corresponding icon.
 * Can determine level automatically from guildData or use a provided level.
 */
export const GuildProgressIndicator: React.FC<GuildProgressIndicatorProps> = ({
    level,
    guildData,
    className = '',
    showLabel = true,
    showDescription = false,
    showRequirements = false,
    size = 'md'
}) => {
    // Use determineGuildLevel if guildData is provided, otherwise use the level prop
    const guildLevel = guildData
        ? determineGuildLevel(guildData)
        : { level: level || 1, ...GUILD_LEVELS[level || 1] };

    // Extract the determined level number
    const currentLevel = guildLevel.level || 1;

    // Map level to icon
    const getIconForLevel = (level: number) => {
        switch (level) {
            case 1: return icon1; // Campfire
            case 2: return icon2; // Outpost
            case 3: return icon3; // Hovel
            case 4: return icon4; // Manor
            case 5: return icon5; // Tower
            case 6: return icon6; // Castle
            case 7: return icon7; // Stronghold
            default: return icon1;
        }
    };

    // Get the icon for the current level
    const icon = getIconForLevel(currentLevel);

    // Determine size class
    const sizeClass = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16'
    }[size];

    // Special effects for level 1 (campfire)
    const renderCampfireEffects = () => {
        if (currentLevel !== 1) return null;

        return (
            <>
                {/* Animated flames */}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                    <div className="flex space-x-1">
                        <span className="text-orange-500 text-xs animate-pulse">✨</span>
                        <span className="text-amber-500 text-xs animate-bounce delay-75">✨</span>
                        <span className="text-orange-500 text-xs animate-pulse delay-150">✨</span>
                    </div>
                </div>

                {/* Smoke effect */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 opacity-40">
                    <div className="flex space-x-1">
                        <span className="text-gray-400 text-xs animate-float">~</span>
                        <span className="text-gray-400 text-xs animate-float delay-300">~</span>
                        <span className="text-gray-400 text-xs animate-float delay-600">~</span>
                    </div>
                </div>
            </>
        );
    };

    // Display unlock requirements for the next level
    const renderNextLevelRequirements = () => {
        if (!showRequirements) return null;

        const nextLevel = currentLevel + 1;
        if (nextLevel > 7) return null; // No higher levels

        const nextLevelData = GUILD_LEVELS[nextLevel];
        if (!nextLevelData) return null;

        return (
            <div className="text-sm text-gray-600 mt-2 p-2 bg-gray-100 rounded-md">
                <h4 className="font-medium">Next Level: {nextLevelData.name}</h4>
                <p className="text-xs">
                    {nextLevelData.unlockCriteria.type === 'quests'
                        ? `Complete all "${nextLevelData.unlockCriteria.category}" quests to unlock`
                        : nextLevelData.unlockCriteria.requirement}
                </p>
            </div>
        );
    };

    return (
        <div className={`flex flex-col ${className}`}>
            <div className="flex items-center">
                <div className="relative">
                    <img
                        src={icon}
                        alt={`Level ${currentLevel} - ${guildLevel.name}`}
                        className={`${sizeClass} object-contain filter drop-shadow-lg`}
                        title={guildLevel.description}
                    />
                    {renderCampfireEffects()}
                </div>

                {showLabel && (
                    <div className="ml-2 flex flex-col">
                        <span className="font-medium">{guildLevel.name}</span>
                        <span className="text-xs text-gray-500">Level {currentLevel}</span>

                        {showDescription && (
                            <p className="text-sm text-gray-600 mt-1">{guildLevel.description}</p>
                        )}
                    </div>
                )}
            </div>

            {renderNextLevelRequirements()}
        </div>
    );
};

// Add animation keyframes to the global style
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% { transform: translateY(0); opacity: 0.7; }
            50% { transform: translateY(-5px); opacity: 0.5; }
            100% { transform: translateY(-10px); opacity: 0; }
        }
        .animate-float {
            animation: float 2s infinite;
        }
    `;
    document.head.appendChild(style);
}
