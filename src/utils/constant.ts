// Avatar Templates - Standard business themed
export const AVATAR_TEMPLATES = [
    { id: 'executive', name: 'Executive', icon: '👔', outfit: 'Business Suit' },
    { id: 'developer', name: 'Developer', icon: '💻', outfit: 'Casual Wear' },
    { id: 'designer', name: 'Designer', icon: '🎨', outfit: 'Creative Attire' },
    { id: 'manager', name: 'Manager', icon: '📋', outfit: 'Formal Attire' },
    { id: 'analyst', name: 'Analyst', icon: '📊', outfit: 'Smart Casual' },
    { id: 'marketer', name: 'Marketer', icon: '📢', outfit: 'Trendy Outfit' }
];

// Core Attributes System - Standard business themed
export const CORE_ATTRIBUTES = {
    tech: { name: 'Technology', icon: '💻', color: 'text-blue-500' },
    finance: { name: 'Finance', icon: '💰', color: 'text-yellow-500' },
    marketing: { name: 'Marketing', icon: '📢', color: 'text-purple-500' },
    sales: { name: 'Sales', icon: '🛒', color: 'text-orange-500' },
    legal: { name: 'Legal', icon: '⚖️', color: 'text-red-500' },
    operations: { name: 'Operations', icon: '🏢', color: 'text-gray-500' }
};

// Guild Roles - Standard business themed
export const GUILD_ROLES = {
    engineer: { name: 'Engineer', attribute: 'tech', icon: '💻', description: 'Technology specialist' },
    treasurer: { name: 'Finance Lead', attribute: 'finance', icon: '💰', description: 'Manages the finances' },
    herald: { name: 'Marketing Lead', attribute: 'marketing', icon: '📢', description: 'Handles marketing and communications' },
    vanguard: { name: 'Sales Lead', attribute: 'sales', icon: '🛒', description: 'Leads sales efforts' },
    loremaster: { name: 'Legal Advisor', attribute: 'legal', icon: '⚖️', description: 'Ensures legal compliance' },
    quartermaster: { name: 'Operations Manager', attribute: 'operations', icon: '🏢', description: 'Oversees operations' }
};

// Armory Items - Standard business themed
export const ARMORY_ITEMS = {
    items: [
        {
            id: 'starter_kit',
            name: 'Starter Kit',
            price: 500,
            levelRequired: 10,
            icon: '📦',
            description: 'Basic resources for new teams',
            stats: { xpBonus: 5, goldBonus: 5 }
        },
        {
            id: 'business_suite',
            name: 'Business Suite',
            price: 1500,
            levelRequired: 20,
            icon: '🖥️',
            description: 'Professional tools for productivity',
            stats: { xpBonus: 10, goldBonus: 10 }
        },
        {
            id: 'premium_tools',
            name: 'Premium Tools',
            price: 3000,
            levelRequired: 30,
            icon: '🛠️',
            description: 'Advanced tools for high performance',
            stats: { xpBonus: 15, goldBonus: 15 }
        },
        {
            id: 'executive_package',
            name: 'Executive Package',
            price: 5000,
            levelRequired: 40,
            icon: '🏆',
            description: 'Exclusive resources for executives',
            stats: { xpBonus: 20, goldBonus: 20 }
        },
        {
            id: 'leadership_award',
            name: 'Leadership Award',
            price: 10000,
            levelRequired: 50,
            icon: '🏅',
            description: 'Awarded for outstanding leadership',
            stats: { xpBonus: 30, goldBonus: 30 }
        }
    ],
    supplies: [
        {
            id: 'training_pass',
            name: 'Training Pass',
            price: 100,
            levelRequired: 1,
            icon: '🎫',
            description: 'Double XP for your next Quest',
            effect: 'doubleXP'
        },
        {
            id: 'bonus_coupon',
            name: 'Bonus Coupon',
            price: 150,
            levelRequired: 1,
            icon: '🎟️',
            description: 'Earn double gold coins for your next Quest',
            effect: 'doubleGold'
        },
        {
            id: 'recognition_certificate',
            name: 'Recognition Certificate',
            price: 200,
            levelRequired: 5,
            icon: '📄',
            description: 'Gain extra recognition (+1 star)',
            effect: 'ratingBoost'
        }
    ],
    specials: [
        {
            id: 'marketing_award',
            name: "Marketing Excellence Award",
            price: 5000,
            requirement: 'Master of Marketing (5000 XP)',
            icon: '🏆',
            description: 'All marketing Quests grant +50% experience',
            effect: { attribute: 'marketing', bonus: 50 }
        },
        {
            id: 'finance_award',
            name: "Finance Excellence Award",
            price: 5000,
            requirement: 'Master of Finance (5000 XP)',
            icon: '💳',
            description: 'All finance Quests yield +50% gold coins',
            effect: { attribute: 'finance', bonus: 50 }
        },
        {
            id: 'tech_award',
            name: "Technology Excellence Award",
            price: 5000,
            requirement: 'Master of Technology (5000 XP)',
            icon: '💻',
            description: 'All technology Quests grant +50% experience',
            effect: { attribute: 'tech', bonus: 50 }
        },
        {
            id: 'sales_award',
            name: "Sales Excellence Award",
            price: 5000,
            requirement: 'Master of Sales (5000 XP)',
            icon: '🛒',
            description: 'All sales Quests yield +50% gold coins',
            effect: { attribute: 'sales', bonus: 50 }
        }
    ]
};

// CEO Avatars Database - Standard business themed
export const CEO_AVATARS = [
    {
        id: 'elon-musk',
        name: 'Elon Musk',
        title: 'Innovator',
        industries: ['technology', 'aerospace', 'automotive', 'energy'],
        traits: ['ambitious', 'risk-taker', 'innovative', 'technical'],
        avatar: '🚀',
        color: 'from-blue-600 to-purple-600',
        advice: 'Pursue the impossible and make it real.',
        matchCriteria: {
            ambition: 8,
            technical: 7,
            riskTolerance: 9
        }
    },
    {
        id: 'satya-nadella',
        name: 'Satya Nadella',
        title: 'Visionary Leader',
        industries: ['technology', 'enterprise', 'cloud', 'software'],
        traits: ['empathetic', 'strategic', 'collaborative', 'growth-minded'],
        avatar: '🧑‍💼',
        color: 'from-blue-500 to-cyan-500',
        advice: 'Lead with empathy and enable growth.',
        matchCriteria: {
            empathy: 9,
            strategic: 8,
            collaboration: 9
        }
    },
    {
        id: 'sara-blakely',
        name: 'Sara Blakely',
        title: 'Entrepreneur',
        industries: ['retail', 'fashion', 'consumer goods', 'e-commerce'],
        traits: ['resourceful', 'persistent', 'creative', 'customer-focused'],
        avatar: '👜',
        color: 'from-pink-500 to-red-500',
        advice: 'Start small, think big, and persevere.',
        matchCriteria: {
            resourcefulness: 9,
            persistence: 9,
            customerFocus: 8
        }
    },
    {
        id: 'jeff-bezos',
        name: 'Jeff Bezos',
        title: 'Business Magnate',
        industries: ['e-commerce', 'cloud', 'logistics', 'technology'],
        traits: ['customer-obsessed', 'long-term', 'data-driven', 'experimental'],
        avatar: '💼',
        color: 'from-orange-500 to-yellow-500',
        advice: 'Focus on the customer and think long-term.',
        matchCriteria: {
            customerFocus: 10,
            longTermThinking: 9,
            dataOrientation: 8
        }
    },
    {
        id: 'whitney-wolfe',
        name: 'Whitney Wolfe Herd',
        title: 'Founder',
        industries: ['social', 'technology', 'networking', 'community'],
        traits: ['bold', 'empowering', 'innovative', 'mission-driven'],
        avatar: '🌟',
        color: 'from-yellow-400 to-orange-400',
        advice: 'Challenge the status quo and empower others.',
        matchCriteria: {
            boldness: 9,
            missionDriven: 9,
            innovation: 8
        }
    },
    {
        id: 'brian-chesky',
        name: 'Brian Chesky',
        title: 'Hospitality Leader',
        industries: ['hospitality', 'travel', 'technology', 'community'],
        traits: ['design-focused', 'community-driven', 'creative', 'resilient'],
        avatar: '🏨',
        color: 'from-red-500 to-pink-500',
        advice: 'Design experiences that people love.',
        matchCriteria: {
            designThinking: 9,
            communityFocus: 9,
            creativity: 8
        }
    },
    {
        id: 'jensen-huang',
        name: 'Jensen Huang',
        title: 'Tech Pioneer',
        industries: ['semiconductors', 'AI', 'gaming', 'technology'],
        traits: ['visionary', 'technical', 'persistent', 'pioneering'],
        avatar: '💡',
        color: 'from-green-500 to-emerald-500',
        advice: 'Innovate and persist through challenges.',
        matchCriteria: {
            technical: 9,
            visionary: 9,
            persistence: 10
        }
    },
    {
        id: 'anne-wojcicki',
        name: 'Anne Wojcicki',
        title: 'Biotech Entrepreneur',
        industries: ['biotech', 'health', 'genomics', 'science'],
        traits: ['scientific', 'democratizing', 'persistent', 'data-driven'],
        avatar: '🧬',
        color: 'from-purple-500 to-indigo-500',
        advice: 'Make knowledge accessible to everyone.',
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
        question: 'Choose Your Profile Avatar',
        type: 'avatar',
        icon: 'User',
        category: 'identity'
    },
    {
        id: 'coreAttribute',
        question: 'What is your greatest strength as a professional?',
        type: 'select',
        options: [
            'Technology',
            'Finance',
            'Marketing',
            'Sales',
            'Legal',
            'Operations'
        ],
        icon: 'Star',
        category: 'attributes'
    },
    {
        id: 'guildName',
        question: 'Name Your Guild',
        type: 'text',
        placeholder: 'Enter your Guild name',
        icon: 'Crown',
        category: 'guild'
    }
];

// Achievement Badges - Standard business themed
export const ACHIEVEMENTS = [
    { id: 'first_quest', name: 'First Quest', icon: '🗂️', description: 'Complete your first Quest', xpRequired: 100 },
    { id: 'onboarding_complete', name: 'Onboarding Complete', icon: '✅', description: 'Complete onboarding', xpRequired: 50 },
    { id: 'first_sage_chat', name: 'First Consultation', icon: '💬', description: 'Consult the AI Assistant', xpRequired: 150 },
    { id: 'mvp_launched', name: 'Product Launch', icon: '🚀', description: 'Launch your first product', xpRequired: 1000 },
    { id: 'first_customers', name: 'First Customers', icon: '👥', description: 'Acquire your first 10 customers', xpRequired: 1500 },
    { id: 'document_master', name: 'Document Master', icon: '📄', description: 'Create 5 key documents', xpRequired: 500 },
    { id: 'conversation_pro', name: 'Consultation Pro', icon: '💬', description: 'Hold 20 consultations', xpRequired: 800 },
    { id: 'funded', name: 'Funded', icon: '💰', description: 'Secure funding', xpRequired: 3000 },
    { id: 'scaling', name: 'Scaling Up', icon: '📈', description: 'Grow your business', xpRequired: 5000 },
    { id: 'week_streak', name: 'Consistent Performer', icon: '🔥', description: 'Log in for 7 days', xpRequired: 200 },
    { id: 'gold_hoarder', name: 'Gold Collector', icon: '👑', description: 'Amass 10,000 gold coins', goldRequired: 10000 },
    { id: 'gear_collector', name: 'Resource Collector', icon: '🛠️', description: 'Acquire 5 premium items', purchases: 5 },
    { id: 'guild_master', name: 'Guild Leader', icon: '🏢', description: 'Fill all Guild positions', special: 'fullGuild' },
    { id: 'attribute_master', name: 'Skill Master', icon: '⭐', description: 'Master any single skill (5000 XP)', special: 'attributeMastery' },
    { id: 'daily_champion', name: 'Daily Achiever', icon: '☀️', description: 'Claim rewards for 30 days', dailyStreak: 30 },
    { id: 'stage_complete_fundamentals', name: 'Fundamentals Complete', icon: '🎯', description: 'Complete Fundamentals', special: 'stage' },
    { id: 'stage_complete_kickoff', name: 'Kickoff Complete', icon: '🚀', description: 'Complete Kickoff', special: 'stage' },
    { id: 'stage_complete_gtm', name: 'Go-To-Market Complete', icon: '📢', description: 'Complete Go-To-Market', special: 'stage' },
    { id: 'stage_complete_growth', name: 'Growth Complete', icon: '📈', description: 'Complete Growth Stage', special: 'stage' }
];

// Document Templates - Standard business themed
export const DOCUMENT_TEMPLATES = [
    { id: 'elevator_pitch', name: 'Elevator Pitch', icon: '🗣️', xp: 100 },
    { id: 'lean_canvas', name: 'Business Model Canvas', icon: '📊', xp: 150 },
    { id: 'user_survey', name: 'User Survey', icon: '📝', xp: 100 },
    { id: 'investor_deck', name: 'Investor Deck', icon: '📈', xp: 200 },
    { id: 'marketing_plan', name: 'Marketing Plan', icon: '📢', xp: 150 },
    { id: 'product_roadmap', name: 'Product Roadmap', icon: '🗺️', xp: 150 }
];

// Guild Level Structure - Standard business themed
export const GUILD_LEVELS = {
    1: { name: 'Startup', icon: '🚀', description: 'Getting started', dailyGold: 0 },
    2: { name: 'Small Business', icon: '🏢', description: 'Building the foundation', dailyGold: 0 },
    3: { name: 'Growing Company', icon: '🏬', description: 'Expanding operations', dailyGold: 0 },
    4: { name: 'Established Firm', icon: '🏦', description: 'Recognized in the market', dailyGold: 50 },
    5: { name: 'Industry Leader', icon: '🏆', description: 'Leading the industry', dailyGold: 100 },
    6: { name: 'Enterprise', icon: '🏛️', description: 'Major market presence', dailyGold: 200 },
    7: { name: 'Global Corporation', icon: '🌍', description: 'Global influence', dailyGold: 500 }
};

export const QUEST_INPUT_TEMPLATES = {
    vision: {
        title: 'Define Your Vision',
        fields: [
            { name: 'mission', label: 'Mission Statement', type: 'textarea', placeholder: "What is your organization's mission?" },
            { name: 'vision', label: 'Vision Statement', type: 'textarea', placeholder: 'What is your long-term vision (5-10 years)?' },
            { name: 'values', label: 'Core Values', type: 'textarea', placeholder: 'List 3-5 values that guide your organization' },
            { name: 'why', label: 'Purpose', type: 'textarea', placeholder: 'Why are you pursuing this goal?' }
        ]
    },
    problem: {
        title: 'Identify the Problem',
        fields: [
            { name: 'problem', label: 'Problem Statement', type: 'textarea', placeholder: 'What problem are you solving?' },
            { name: 'target', label: 'Target Audience', type: 'text', placeholder: 'Who is affected by this problem?' },
            { name: 'pain', label: 'Pain Points', type: 'textarea', placeholder: 'List the main pain points' },
            { name: 'current', label: 'Current Solutions', type: 'textarea', placeholder: 'How is this problem currently addressed?' }
        ]
    },
    solution: {
        title: 'Describe Your Solution',
        fields: [
            { name: 'solution', label: 'Solution Overview', type: 'textarea', placeholder: 'Describe your solution' },
            { name: 'features', label: 'Key Features', type: 'textarea', placeholder: 'List the main features' },
            { name: 'differentiator', label: 'Unique Value Proposition', type: 'textarea', placeholder: 'What makes your solution unique?' },
            { name: 'benefits', label: 'Benefits', type: 'textarea', placeholder: 'What benefits does your solution provide?' }
        ]
    },
    market: {
        title: 'Market Analysis',
        fields: [
            { name: 'tam', label: 'Total Addressable Market (TAM)', type: 'text', placeholder: 'e.g., 50,000 gold coins' },
            { name: 'sam', label: 'Serviceable Available Market (SAM)', type: 'text', placeholder: 'e.g., 5,000 gold coins' },
            { name: 'som', label: 'Serviceable Obtainable Market (SOM)', type: 'text', placeholder: 'e.g., 500 gold coins' },
            { name: 'competitors', label: 'Competitors', type: 'textarea', placeholder: 'List your main competitors' },
            { name: 'trends', label: 'Market Trends', type: 'textarea', placeholder: 'What trends are affecting the market?' }
        ]
    },
    legal: {
        title: 'Legal Structure',
        fields: [
            { name: 'entity', label: 'Business Entity Type', type: 'select', options: ['Corporation', 'LLC', 'Partnership', 'Sole Proprietorship'] },
            { name: 'state', label: 'State of Registration', type: 'text', placeholder: 'e.g., Delaware' },
            { name: 'ip', label: 'Intellectual Property', type: 'textarea', placeholder: 'List your patents, trademarks, copyrights' },
            { name: 'agreements', label: 'Required Agreements', type: 'textarea', placeholder: 'e.g., Founders agreement, NDAs' }
        ]
    }
};
