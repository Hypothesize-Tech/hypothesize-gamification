import { User, Shield, Star, Award, X } from 'lucide-react';
import { CORE_ATTRIBUTES, ARMORY_ITEMS } from '../utils/constant';
import { calculateLevel } from '../utils/helper';
import './UserProfile.css';

// Mock role tiers for demonstration
const ROLE_TIERS: Record<string, Record<number, string>> = {
    'Quartermaster': {
        1: 'Logistics Apprentice',
        10: 'Logistics Coordinator',
        20: 'Logistics Expert',
    },
    'default': {
        1: 'Recruit',
        10: 'Veteran',
        20: 'Champion'
    }
};

const getRoleTier = (role: string, level: number) => {
    const tiers = ROLE_TIERS[role] || ROLE_TIERS.default;
    let currentTier = tiers[1];
    for (const levelKey in tiers) {
        if (level >= parseInt(levelKey)) {
            currentTier = tiers[parseInt(levelKey)];
        }
    }
    return currentTier;
};

const LEVEL_TITLES: Record<number, string> = {
    1: 'Fledgling',
    5: 'Apprentice',
    10: 'Journeyman',
    20: 'Expert',
    30: 'Master',
    40: 'Grandmaster',
    50: 'Legendary Founder'
};

const getLevelTitle = (level: number): string => {
    let currentTitle = 'Recruit';
    const sortedLevels = Object.keys(LEVEL_TITLES).map(Number).sort((a, b) => a - b);
    for (const levelKey of sortedLevels) {
        if (level >= levelKey) {
            currentTitle = LEVEL_TITLES[levelKey];
        }
    }
    return currentTitle;
};

export const UserProfile = ({ guildData, ceoAvatar, onClose, user }: { guildData: any, ceoAvatar: any, onClose: () => void, user: any }) => {
    if (!guildData) {
        return (
            <div className="user-profile-backdrop">
                <div className="user-profile-container parchment">
                    Loading...
                </div>
            </div>
        );
    }

    const levelInfo = calculateLevel(guildData.xp || 0);
    const userRole = guildData.role || 'Quartermaster'; // Default role
    const roleTier = getRoleTier(userRole, levelInfo.level);
    const levelTitle = getLevelTitle(levelInfo.level);

    const activeTreasures = [
        ...(guildData.inventory || []),
        ...(guildData.equippedGear || []),
        ...(guildData.treasures || [])
    ]
        .map(itemId => {
            const allItems = [...ARMORY_ITEMS.items, ...ARMORY_ITEMS.supplies, ...ARMORY_ITEMS.specials];
            return allItems.find(item => item.id === itemId);
        })
        .filter(item => item);


    return (
        <div className="user-profile-backdrop" onClick={onClose}>
            <div className="user-profile-container parchment" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="close-button">
                    <X className="w-6 h-6" />
                </button>

                {/* Profile Header */}
                <div className="profile-header">
                    <div className="avatar-container">
                        <span className="avatar-icon">{ceoAvatar?.avatar || '👤'}</span>
                    </div>
                    <div className="user-info">
                        <h2 className="user-name">{user?.displayName || 'Adventurer'}</h2>
                        <p className="user-level">Level {levelInfo.level} - {levelTitle}</p>
                        <p className="user-role">{userRole} - <span className="role-tier">{roleTier}</span></p>
                    </div>
                </div>

                {/* Attributes Section */}
                <div className="profile-section">
                    <h3 className="section-title"><Shield className="inline-block mr-2" /> Core Attributes</h3>
                    <div className="attributes-grid">
                        {Object.entries(CORE_ATTRIBUTES).map(([key, attr]) => {
                            const attributeLevel = guildData.attributes?.[key] || 0;
                            return (
                                <div key={key} className="attribute-item">
                                    <div className="attribute-icon">{attr.icon}</div>
                                    <div className="attribute-info">
                                        <p className="attribute-name">{attr.name}</p>
                                        <p className="attribute-level">Level {attributeLevel}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Active Treasures Section */}
                <div className="profile-section">
                    <h3 className="section-title"><Award className="inline-block mr-2" /> Active Treasures</h3>
                    <div className="treasures-list">
                        {activeTreasures.length > 0 ? activeTreasures.map((treasure: any) => (
                            <div key={treasure.id} className="treasure-item">
                                <div className="treasure-icon">{treasure.icon}</div>
                                <div className="treasure-info">
                                    <p className="treasure-name">{treasure.name}</p>
                                    <p className="treasure-description">{treasure.description}</p>
                                    {treasure.stats && (
                                        <div className="treasure-effects">
                                            {treasure.stats.xpBonus && <span>+{treasure.stats.xpBonus}% XP </span>}
                                            {treasure.stats.goldBonus && <span>+{treasure.stats.goldBonus}% Gold</span>}
                                        </div>
                                    )}
                                    {treasure.effect && typeof treasure.effect === 'object' && (
                                        <div className="treasure-effects">
                                            <span>{treasure.effect.attribute} Quests: +{treasure.effect.bonus}%</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )) : (
                            <p className="no-treasures">No active treasures found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}; 