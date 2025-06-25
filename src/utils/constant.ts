// Centralized constants for the app
// Modularized for easy import and maintainability

// Avatar Templates - Medieval themed
export const AVATAR_TEMPLATES = [
    { id: 'knight', name: 'Noble Knight', icon: '⚔️', outfit: 'Plate Armor' },
    { id: 'wizard', name: 'Arcane Wizard', icon: '🧙', outfit: 'Mystical Robes' },
    { id: 'ranger', name: 'Forest Ranger', icon: '🏹', outfit: 'Leather Armor' },
    { id: 'paladin', name: 'Holy Paladin', icon: '🛡️', outfit: 'Blessed Armor' },
    { id: 'rogue', name: 'Shadow Rogue', icon: '🗡️', outfit: 'Dark Cloak' },
    { id: 'merchant', name: 'Wealthy Merchant', icon: '💰', outfit: 'Fine Garments' }
];

// Core Attributes System - Medieval themed
export const CORE_ATTRIBUTES = {
    tech: { name: 'Artifice', icon: 'Gem', color: 'text-blue-500' },
    finance: { name: 'Treasury', icon: 'Coins', color: 'text-yellow-500' },
    marketing: { name: 'Heraldry', icon: 'Scroll', color: 'text-purple-500' },
    sales: { name: 'Mercantile', icon: 'ShoppingBag', color: 'text-orange-500' },
    legal: { name: 'Law', icon: 'Shield', color: 'text-red-500' },
    operations: { name: 'Logistics', icon: 'Castle', color: 'text-gray-500' }
};

// Guild Roles - Medieval themed
export const GUILD_ROLES = {
    engineer: { name: 'Artificer', attribute: 'tech', icon: '⚙️', description: 'Masters of mystical technology' },
    treasurer: { name: 'Treasurer', attribute: 'finance', icon: '💰', description: 'Keepers of the guild vault' },
    herald: { name: 'Herald', attribute: 'marketing', icon: '📯', description: 'Spreaders of renown' },
    vanguard: { name: 'Merchant Prince', attribute: 'sales', icon: '⚔️', description: 'Leaders of commerce' },
    loremaster: { name: 'Lawkeeper', attribute: 'legal', icon: '📜', description: 'Guardians of order' },
    quartermaster: { name: 'Castellan', attribute: 'operations', icon: '🏰', description: 'Masters of resources' }
};

// Armory Items - Enhanced with medieval theme
export const ARMORY_ITEMS = {
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
export const CEO_AVATARS = [
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

// Onboarding Questions
export const ONBOARDING_QUESTIONS = [
    {
        id: 'avatar',
        question: 'Choose Your Hero Avatar',
        type: 'avatar',
        icon: 'User',
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
        icon: 'Star',
        category: 'attributes'
    },
    {
        id: 'guildName',
        question: 'Name Your Team',
        type: 'text',
        placeholder: 'Enter your team\'s name',
        icon: 'Crown',
        category: 'guild'
    }
];

// Achievement Badges
export const ACHIEVEMENTS = [
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
export const DOCUMENT_TEMPLATES = [
    { id: 'elevator_pitch', name: 'Battle Cry', icon: '📯', xp: 100 },
    { id: 'lean_canvas', name: 'Kingdom Blueprint', icon: '🏗️', xp: 150 },
    { id: 'user_survey', name: 'Scouting Report', icon: '🔍', xp: 100 },
    { id: 'investor_deck', name: 'Dragon\'s Map', icon: '🗺️', xp: 200 },
    { id: 'marketing_plan', name: 'Conquest Plan', icon: '⚔️', xp: 150 },
    { id: 'product_roadmap', name: 'Quest Chronicle', icon: '📖', xp: 150 }
];

// Guild Level Structure
export const GUILD_LEVELS = {
    1: { name: 'Wanderer\'s Camp', icon: '🏕️', description: 'Humble beginnings', dailyGold: 0 },
    2: { name: 'Wooden Fort', icon: '🛖', description: 'First defenses raised', dailyGold: 0 },
    3: { name: 'Stone Keep', icon: '🏰', description: 'A proper stronghold', dailyGold: 0 },
    4: { name: 'Fortified Castle', icon: '🏯', description: 'Walls that inspire awe', dailyGold: 50 },
    5: { name: 'Grand Citadel', icon: '⛩️', description: 'A beacon of power', dailyGold: 100 },
    6: { name: 'Imperial Palace', icon: '🏛️', description: 'Seat of an empire', dailyGold: 200 },
    7: { name: 'Legendary Fortress', icon: '⚔️', description: 'Immortal in song and story', dailyGold: 500 }
};

export const QUEST_INPUT_TEMPLATES = {
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
