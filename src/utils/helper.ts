import confetti from 'canvas-confetti';
import { ARMORY_ITEMS } from './constant';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { Castle, Crown, Swords } from 'lucide-react';
import { Shield } from 'lucide-react';

export const calculateLevel = (xp: number) => {
    const baseXP = 100;
    const level = Math.floor(Math.sqrt(xp / baseXP)) + 1;
    const currentLevelXP = Math.pow(level - 1, 2) * baseXP;
    const nextLevelXP = Math.pow(level, 2) * baseXP;
    const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
    return { level, progress, currentLevelXP, nextLevelXP };
};

export const calculateCEOMatch = (userData: any): string => {
    const coreAttribute = userData.onboardingData?.coreAttribute?.toLowerCase();
    if (coreAttribute === 'artifice') {
        return ['elon-musk', 'jensen-huang', 'satya-nadella'][Math.floor(Math.random() * 3)];
    } else if (coreAttribute === 'treasury') {
        return 'jeff-bezos';
    } else if (coreAttribute === 'heraldry') {
        return ['whitney-wolfe', 'brian-chesky'][Math.floor(Math.random() * 2)];
    } else if (coreAttribute === 'mercantile') {
        return 'jeff-bezos';
    } else if (coreAttribute === 'law') {
        return 'anne-wojcicki';
    } else {
        return 'sara-blakely';
    }
};

export const calculateXPWithBonuses = (baseXP: number, rating: number, questAttribute: string, userData: any) => {
    let xp = baseXP * (rating / 5);
    const attributeMap: Record<string, string> = {
        'tech': 'artifice',
        'finance': 'treasury',
        'marketing': 'heraldry',
        'sales': 'mercantile',
        'legal': 'law',
        'operations': 'logistics'
    };
    if (userData.coreAttribute?.toLowerCase() === attributeMap[questAttribute] || userData.coreAttribute?.toLowerCase() === questAttribute) {
        xp *= 1.5;
    }
    const filledRoles = new Set(userData.members?.map((m: any) => m.role) || []);
    if (filledRoles.size >= 6) {
        xp *= 1.3;
    }
    if (userData.activeEffects?.includes('doubleXP')) {
        xp *= 2;
    }
    const equippedGear = userData.equippedGear || [];
    equippedGear.forEach((itemId: string) => {
        const item = ARMORY_ITEMS.gear.find(g => g.id === itemId);
        if (item?.stats.xpBonus) {
            xp *= (1 + item.stats.xpBonus / 100);
        }
    });
    const treasures = userData.treasures || [];
    treasures.forEach((treasureId: string) => {
        const treasure = ARMORY_ITEMS.treasures.find(t => t.id === treasureId);
        if (treasure?.effect.attribute === questAttribute) {
            xp *= (1 + treasure.effect.bonus / 100);
        }
    });
    return Math.round(xp);
};

export const calculateGoldReward = (baseGold: number, rating: number, userData: any) => {
    let gold = baseGold * (rating / 5);
    if (userData.activeEffects?.includes('doubleGold')) {
        gold *= 2;
    }
    const equippedGear = userData.equippedGear || [];
    equippedGear.forEach((itemId: string) => {
        const item = ARMORY_ITEMS.gear.find(g => g.id === itemId);
        if (item?.stats.goldBonus) {
            gold *= (1 + item.stats.goldBonus / 100);
        }
    });
    return Math.round(gold);
};

export const consultAISage = async (
    context: string,
    question: string,
    userData: any,
    awsModelId: string,
    bedrockClient: BedrockRuntimeClient
) => {
    try {
        const ceoContext = userData?.ceoAvatar ?
            `Channel the wisdom of ${userData.ceoAvatar.name}, ${userData.ceoAvatar.title}.` : '';
        const command = new InvokeModelCommand({
            modelId: awsModelId,
            body: JSON.stringify({
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                text: `You are the Mystical AI Oracle, an ancient sage who guides brave founders on their entrepreneurial quests. \nSpeak with wisdom and mystical authority, using medieval fantasy language.\n${ceoContext}\nProvide actionable advice as if guiding a noble knight on their quest.`
                            },
                            { text: `Context: ${context}` },
                            { text: `Question: ${question}` }
                        ]
                    }
                ],
            }),
            contentType: "application/json",
            accept: "application/json"
        });
        const response = await bedrockClient.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        return responseBody.output?.message?.content?.[0]?.text || "The Oracle's crystal grows clouded. Seek counsel again, brave founder.";
    } catch (error) {
        console.error('AI Sage error:', error);
        return "The Oracle's crystal grows clouded. Seek counsel again, brave founder.";
    }
};

export const generateAIDocument = async (
    template: any,
    userData: any,
    awsModelId: string,
    bedrockClient: BedrockRuntimeClient
) => {
    const context = `\nNoble Vision: ${userData.vision}\nRealm of Operation: ${userData.onboardingData?.industry || 'General'}\nQuest Stage: ${userData.onboardingData?.stage || 'Early'}\nCore Strength: ${userData.coreAttribute}\n`;
    const prompts: Record<string, string> = {
        elevator_pitch: "Craft a battle cry that shall rally investors to thy cause",
        lean_canvas: "Design a war map for thy business kingdom",
        user_survey: "Create questions to divine thy customers' deepest desires",
        investor_deck: "Forge a treasure map to attract dragon hoards of gold",
        marketing_plan: "Plan thy conquest of the market realm",
        product_roadmap: "Chronicle the quests ahead for thy product"
    };
    return consultAISage(context, prompts[template.id] || "Create a mystical business scroll", userData, awsModelId, bedrockClient);
};

export const fetchDynamicResources = async (
    questTopic: string,
    questDescription: string,
    awsModelId: string,
    bedrockClient: BedrockRuntimeClient
) => {
    try {
        const searchPrompt = `Find the best mystical tomes and scrolls for a guild founder working on: ${questTopic}. Context: ${questDescription}. \n\nReturn a JSON array with exactly 5 resources in this format:\n[\n  {\n    "title": "Resource Title",\n    "type": "tome|scroll|artifact|grimoire|manuscript|rune",\n    "description": "Brief description",\n    "url": "https://...",\n    "icon": "appropriate medieval emoji",\n    "difficulty": "apprentice|journeyman|master",\n    "timeToComplete": "e.g., 1 candle mark, 2 moon cycles"\n  }\n]\n\nFocus on high-quality, actionable resources from reputable sources.`;
        const command = new InvokeModelCommand({
            modelId: awsModelId,
            body: JSON.stringify({
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                text: searchPrompt
                            }
                        ]
                    }
                ],
            }),
            contentType: "application/json",
            accept: "application/json"
        });
        const response = await bedrockClient.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        const content = responseBody.output?.message?.content?.[0]?.text || "[]";
        try {
            const resources = JSON.parse(content);
            return resources;
        } catch (e) {
            return getDefaultResources(questTopic);
        }
    } catch (error) {
        console.error('Error fetching dynamic resources:', error);
        return getDefaultResources(questTopic);
    }
};

export const getDefaultResources = (questTopic: string) => {
    const defaults: Record<string, any[]> = {
        vision: [
            { title: 'The Lean Grimoire', type: 'tome', icon: '📚', url: 'https://theleanstartup.com/', description: 'Ancient wisdom for founders', difficulty: 'apprentice', timeToComplete: '8 candle marks' },
            { title: 'Simon\'s Prophecy: Start with Why', type: 'scroll', icon: '📜', url: 'https://www.ted.com/talks/simon_sinek_how_great_leaders_inspire_action', description: 'Mystical visions of purpose', difficulty: 'apprentice', timeToComplete: '18 sand grains' },
            { title: 'Vision Rune Guide', type: 'rune', icon: '🔮', url: 'https://blog.hubspot.com/marketing/mission-statement', description: 'Carve thy destiny in stone', difficulty: 'journeyman', timeToComplete: '15 sand grains' },
            { title: 'Y Combinator Academy', type: 'grimoire', icon: '🎓', url: 'https://www.startupschool.org/', description: 'The grand school of entrepreneurship', difficulty: 'journeyman', timeToComplete: '10 moon cycles' },
            { title: 'Notion Vision Artifact', type: 'artifact', icon: '💎', url: 'https://www.notion.so/templates', description: 'Enchanted vision templates', difficulty: 'apprentice', timeToComplete: '30 sand grains' }
        ],
        problem: [
            { title: 'The Mother\'s Test', type: 'tome', icon: '📚', url: 'http://momtestbook.com/', description: 'Divine customer wisdom', difficulty: 'apprentice', timeToComplete: '4 candle marks' },
            { title: 'Problem Divination Guide', type: 'scroll', icon: '📜', url: 'https://www.ycombinator.com/library/5z-how-to-validate-your-startup-idea', description: 'YC oracle framework', difficulty: 'journeyman', timeToComplete: '20 sand grains' },
            { title: 'Customer Interrogation Scroll', type: 'manuscript', icon: '📋', url: 'https://customerdevlabs.com/2013/11/05/how-i-interview-customers/', description: 'Interview incantations', difficulty: 'apprentice', timeToComplete: '15 sand grains' },
            { title: 'Jobs to be Done Prophecy', type: 'scroll', icon: '📜', url: 'https://www.youtube.com/watch?v=sfGtw2C95Ms', description: 'Christensen\'s ancient wisdom', difficulty: 'master', timeToComplete: '1 candle mark' },
            { title: 'Typeform Survey Artifact', type: 'artifact', icon: '🔧', url: 'https://www.typeform.com/', description: 'Magical survey creation', difficulty: 'apprentice', timeToComplete: 'Free enchantment' }
        ]
    };
    return defaults[questTopic] || defaults.vision;
};

export const rateQuestSubmission = async (
    questData: any,
    userData: any,
    awsModelId: string,
    bedrockClient: BedrockRuntimeClient
) => {
    try {
        const ratingPrompt = `As the Grand Master of the Founder's Guild, rate this quest submission on a scale of 1-5 stars.\n\nQuest: ${questData.questName}\nSubmission: ${JSON.stringify(questData.inputs)}\n\nProvide thy judgment as a JSON scroll:\n{\n  "rating": [1-5],\n  "feedback": "Brief words of wisdom",\n  "suggestions": ["Path to improvement 1", "Path to improvement 2"]\n}`;
        const command = new InvokeModelCommand({
            modelId: awsModelId,
            body: JSON.stringify({
                messages: [
                    {
                        role: "user",
                        content: [{ text: ratingPrompt }]
                    }
                ],
            }),
            contentType: "application/json",
            accept: "application/json"
        });
        const response = await bedrockClient.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        const content = responseBody.output?.message?.content?.[0]?.text || "{}";
        try {
            const rating = JSON.parse(content);
            if (userData.activeEffects?.includes('ratingBoost')) {
                rating.rating = Math.min(5, rating.rating + 1);
            }
            return rating;
        } catch (e) {
            return { rating: 3, feedback: "A valiant effort, young squire!", suggestions: [] };
        }
    } catch (error) {
        console.error('Rating error:', error);
        return { rating: 3, feedback: "A valiant effort, young squire!", suggestions: [] };
    }
};


export function getSuggestedSageQuestions({ quest, guildData, guildLevel }: { quest: any, guildData: any, guildLevel: any }) {
    const base: string[] = [];
    // Quest-specific
    if (quest.id === 'vision') {
        base.push(
            'What makes a compelling vision for a new founder?',
            'How can I inspire my team with our mission?',
            'What are common mistakes in startup vision statements?',
            'How do I align my guild around our vision?'
        );
    } else if (quest.id === 'problem') {
        base.push(
            'How do I validate if this problem is real?',
            'What are the best ways to interview potential users?',
            'How do I find my target audience\'s pain points?',
            'What signals show a problem is worth solving?'
        );
    } else if (quest.id === 'solution') {
        base.push(
            'How do I make my solution stand out?',
            'What features should I prioritize first?',
            'How do I test my solution with real users?',
            'What makes a solution magical for customers?'
        );
    } else if (quest.id === 'market') {
        base.push(
            'How do I estimate the size of my market?',
            'What are the best ways to research competitors?',
            'How do I spot trends in my industry?',
            'What are signs of a good market opportunity?'
        );
    } else if (quest.id === 'legal') {
        base.push(
            'What legal structure is best for my startup?',
            'How do I protect my intellectual property?',
            'What agreements should my team have?',
            'What are common legal mistakes for new founders?'
        );
    } else {
        base.push(
            `What advice do you have for this quest: ${quest.name}?`,
            'What are common pitfalls for founders at this stage?',
            'How can I make progress on this quest?'
        );
    }

    // Guild level context
    if (guildLevel.level >= 4) {
        base.push('What advanced strategies should I consider at my guild level?');
    }
    if ((guildData?.xp || 0) > 1000) {
        base.push('How do experienced founders approach this challenge?');
    }
    if (guildData?.coreAttribute) {
        base.push(`How can I use my strength in ${guildData.coreAttribute} to excel in this quest?`);
    }
    return base;
}

export const triggerConfetti = (options = {}) => {
    const defaults = {
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffd700', '#ff6b35', '#fef3c7', '#c084fc', '#9333ea']
    };
    confetti({ ...defaults, ...options });
};

export const createMagicalParticles = () => {
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'magic-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        document.body.appendChild(particle);
    }
};

export const QUEST_STAGES = {
    FUNDAMENTALS: {
        id: 'fundamentals',
        name: 'Training Grounds',
        description: 'Master the ancient arts of entrepreneurship',
        icon: Shield,
        color: 'bg-green-600',
        quests: [
            { id: 'vision', name: 'Vision Quest', xp: 100, description: 'Divine thy sacred purpose', attribute: 'marketing' },
            { id: 'problem', name: 'Dragon Hunt', xp: 150, description: 'Identify the beast to slay', attribute: 'marketing' },
            { id: 'solution', name: 'Forge the Blade', xp: 150, description: 'Craft thy magical solution', attribute: 'tech' },
            { id: 'market', name: 'Scout the Realm', xp: 200, description: 'Map thy kingdom\'s borders', attribute: 'marketing' },
            { id: 'legal', name: 'Royal Charter', xp: 100, description: 'Establish thy guild\'s law', attribute: 'legal' }
        ]
    },
    KICKOFF: {
        id: 'kickoff',
        name: 'Kickoff Citadel',
        description: 'Launch thy venture into the world',
        icon: Castle,
        color: 'bg-blue-600',
        quests: [
            { id: 'mvp', name: 'First Fortress', xp: 300, description: 'Build thy minimum viable castle', attribute: 'tech' },
            { id: 'team', name: 'Rally the Knights', xp: 200, description: 'Recruit thy fellowship', attribute: 'operations' },
            { id: 'pitch', name: 'War Cry', xp: 150, description: 'Perfect thy battle cry', attribute: 'sales' },
            { id: 'firstusers', name: 'First Subjects', xp: 250, description: 'Win thy first loyal followers', attribute: 'marketing' },
            { id: 'feedback', name: 'Council of Elders', xp: 200, description: 'Hear the wisdom of thy users', attribute: 'marketing' }
        ]
    },
    GTM: {
        id: 'gtm',
        name: 'Market Conquest Plains',
        description: 'Conquer the realm with thy strategy',
        icon: Swords,
        color: 'bg-purple-600',
        quests: [
            { id: 'marketing', name: 'Herald\'s Campaign', xp: 250, description: 'Spread thy legend far and wide', attribute: 'marketing' },
            { id: 'sales', name: 'Merchant\'s Guild', xp: 250, description: 'Master the art of commerce', attribute: 'sales' },
            { id: 'channels', name: 'Trade Routes', xp: 200, description: 'Establish thy distribution paths', attribute: 'operations' },
            { id: 'pricing', name: 'Gold Alchemy', xp: 150, description: 'Perfect thy pricing magic', attribute: 'finance' },
            { id: 'metrics', name: 'Oracle\'s Vision', xp: 200, description: 'Divine thy key measurements', attribute: 'finance' }
        ]
    },
    GROWTH: {
        id: 'growth',
        name: 'Empire Mountains',
        description: 'Scale thy dominion to legendary heights',
        icon: Crown,
        color: 'bg-orange-600',
        quests: [
            { id: 'funding', name: 'Dragon\'s Hoard', xp: 400, description: 'Secure thy war chest', attribute: 'finance' },
            { id: 'scaling', name: 'Empire Expansion', xp: 350, description: 'Grow thy kingdom\'s borders', attribute: 'operations' },
            { id: 'culture', name: 'Code of Honor', xp: 200, description: 'Establish thy guild\'s culture', attribute: 'operations' },
            { id: 'partnerships', name: 'Alliance Pacts', xp: 300, description: 'Forge strategic alliances', attribute: 'sales' },
            { id: 'exit', name: 'Legendary Victory', xp: 500, description: 'Plan thy ultimate triumph', attribute: 'finance' }
        ]
    }
};