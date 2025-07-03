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

interface GuildProgressIndicatorProps {
    level: number;
    className?: string;
    showLabel?: boolean;
    showDescription?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

/**
 * GuildProgressIndicator Component
 * 
 * Displays a visual representation of the guild's current level.
 * For level 1, displays a campfire with animated sparks.
 * For other levels, displays the corresponding icon.
 */
export const GuildProgressIndicator: React.FC<GuildProgressIndicatorProps> = ({
    level,
    className = '',
    showLabel = true,
    showDescription = false,
    size = 'md'
}) => {
    // Map level to icon
    const getIconForLevel = (level: number) => {
        switch (level) {
            case 1: return icon1; // Campfire
            case 2: return icon2;
            case 3: return icon3;
            case 4: return icon4;
            case 5: return icon5;
            case 6: return icon6;
            case 7: return icon7;
            default: return icon1;
        }
    };

    // Get guild level info from constants
    const guildLevel = GUILD_LEVELS[level as keyof typeof GUILD_LEVELS] || GUILD_LEVELS[1];
    const icon = getIconForLevel(level);

    // Determine size class
    const sizeClass = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16'
    }[size];

    // Special effects for level 1 (campfire)
    const renderCampfireEffects = () => {
        if (level !== 1) return null;

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

    return (
        <div className={`flex items-center ${className}`}>
            <div className="relative">
                <img
                    src={icon}
                    alt={`Level ${level} - ${guildLevel.name}`}
                    className={`${sizeClass} object-contain filter drop-shadow-lg`}
                    title={guildLevel.description}
                />
                {renderCampfireEffects()}
            </div>

            {showLabel && (
                <div className="ml-3">
                    <p className="text-yellow-100 font-bold">{guildLevel.name}</p>
                    {showDescription && (
                        <p className="text-xs text-gray-300">{guildLevel.description}</p>
                    )}
                </div>
            )}
        </div>
    );
};

// Add animation keyframes to the global style
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
    @keyframes float {
      0% { transform: translateY(0); opacity: 0.8; }
      50% { transform: translateY(-5px); opacity: 0.5; }
      100% { transform: translateY(-10px); opacity: 0; }
    }
    .animate-float {
      animation: float 2s infinite;
    }
  `;
    document.head.appendChild(style);
}

export default GuildProgressIndicator;
