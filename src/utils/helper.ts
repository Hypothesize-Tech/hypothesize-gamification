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
            `Channel the expertise of ${userData.ceoAvatar.name}, ${userData.ceoAvatar.title}.` : '';
        const command = new InvokeModelCommand({
            modelId: awsModelId,
            body: JSON.stringify({
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                text: `You are the AI Advisor, an experienced mentor who guides founders on their business journeys. \nSpeak with clarity and authority, using professional and supportive language.\n${ceoContext}\nProvide actionable advice as if guiding a business leader on their path.`
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
        return responseBody.output?.message?.content?.[0]?.text || "The Advisor is unavailable. Please try again.";
    } catch (error) {
        console.error('AI Advisor error:', error);
        return "The Advisor is unavailable. Please try again.";
    }
};

export const generateAIDocument = async (
    template: any,
    userData: any,
    awsModelId: string,
    bedrockClient: BedrockRuntimeClient
) => {
    const context = `\nVision: ${userData.vision}\nIndustry: ${userData.onboardingData?.industry || 'General'}\nStage: ${userData.onboardingData?.stage || 'Early'}\nCore Strength: ${userData.coreAttribute}\n`;
    const prompts: Record<string, string> = {
        elevator_pitch: "Craft a compelling elevator pitch to attract investors to your business",
        lean_canvas: "Design a business model canvas for your company",
        user_survey: "Create questions to understand your customers' needs",
        investor_deck: "Develop a pitch deck to attract investment",
        marketing_plan: "Plan your marketing strategy",
        product_roadmap: "Outline the product development roadmap"
    };
    return consultAISage(context, prompts[template.id] || "Create a business document", userData, awsModelId, bedrockClient);
};

export const fetchDynamicResources = async (
    questTopic: string,
    questDescription: string,
    awsModelId: string,
    bedrockClient: BedrockRuntimeClient
) => {
    try {
        const searchPrompt = `Find the best resources for a founder working on: ${questTopic}. Context: ${questDescription}. \n\nReturn a JSON array with exactly 5 resources in this format:\n[\n  {\n    "title": "Resource Title",\n    "type": "book|article|tool|course|guide|video",\n    "description": "Brief description",\n    "url": "https://...",\n    "icon": "appropriate emoji",\n    "difficulty": "beginner|intermediate|advanced",\n    "timeToComplete": "e.g., 1 hour, 2 weeks"\n  }\n]\n\nFocus on high-quality, actionable resources from reputable sources.`;
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
            { title: 'The Lean Startup', type: 'book', icon: '📚', url: 'https://theleanstartup.com/', description: 'Essential reading for founders', difficulty: 'beginner', timeToComplete: '8 hours' },
            { title: "Start with Why (Simon Sinek)", type: 'video', icon: '📺', url: 'https://www.ted.com/talks/simon_sinek_how_great_leaders_inspire_action', description: 'Purpose-driven leadership', difficulty: 'beginner', timeToComplete: '18 minutes' },
            { title: 'Mission Statement Guide', type: 'guide', icon: '📝', url: 'https://blog.hubspot.com/marketing/mission-statement', description: 'How to write a mission statement', difficulty: 'intermediate', timeToComplete: '15 minutes' },
            { title: 'Y Combinator Startup School', type: 'course', icon: '🎓', url: 'https://www.startupschool.org/', description: 'Free startup education', difficulty: 'intermediate', timeToComplete: '10 weeks' },
            { title: 'Notion Templates', type: 'tool', icon: '💻', url: 'https://www.notion.so/templates', description: 'Business planning templates', difficulty: 'beginner', timeToComplete: '30 minutes' }
        ],
        problem: [
            { title: 'The Mom Test', type: 'book', icon: '📚', url: 'http://momtestbook.com/', description: 'How to talk to customers', difficulty: 'beginner', timeToComplete: '4 hours' },
            { title: 'Validating Startup Ideas', type: 'guide', icon: '📝', url: 'https://www.ycombinator.com/library/5z-how-to-validate-your-startup-idea', description: 'YC validation framework', difficulty: 'intermediate', timeToComplete: '20 minutes' },
            { title: 'Customer Interview Guide', type: 'guide', icon: '📋', url: 'https://customerdevlabs.com/2013/11/05/how-i-interview-customers/', description: 'Interview techniques', difficulty: 'beginner', timeToComplete: '15 minutes' },
            { title: 'Jobs to be Done (Clayton Christensen)', type: 'video', icon: '📺', url: 'https://www.youtube.com/watch?v=sfGtw2C95Ms', description: 'Understanding customer needs', difficulty: 'advanced', timeToComplete: '1 hour' },
            { title: 'Typeform', type: 'tool', icon: '🛠️', url: 'https://www.typeform.com/', description: 'Survey creation tool', difficulty: 'beginner', timeToComplete: 'Free' }
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
        const ratingPrompt = `As a business mentor, rate this Quest submission on a scale of 1-5 stars.\n\nQuest: ${questData.questName}\nSubmission: ${JSON.stringify(questData.inputs)}\n\nProvide your feedback as a JSON object:\n{\n  "rating": [1-5],\n  "feedback": "Brief feedback",\n  "suggestions": ["Improvement suggestion 1", "Improvement suggestion 2"]\n}`;
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
            return { rating: 3, feedback: "Good effort!", suggestions: [] };
        }
    } catch (error) {
        console.error('Rating error:', error);
        return { rating: 3, feedback: "Good effort!", suggestions: [] };
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
            'How do I align my Guild around our vision?'
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
            'What makes a solution valuable for customers?'
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
            `What advice do you have for this Quest: ${quest.name}?`,
            'What are common pitfalls for founders at this stage?',
            'How can I make progress on this Quest?'
        );
    }

    // Guild level context
    if (guildLevel.level >= 4) {
        base.push('What advanced strategies should I consider at my Guild level?');
    }
    if ((guildData?.xp || 0) > 1000) {
        base.push('How do experienced founders approach this challenge?');
    }
    if (guildData?.coreAttribute) {
        base.push(`How can I use my strength in ${guildData.coreAttribute} to excel in this Quest?`);
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

export const QUEST_STAGES = {
    FUNDAMENTALS: {
        id: 'fundamentals',
        name: 'Fundamentals',
        description: 'Master the basics of entrepreneurship',
        icon: Shield,
        color: 'bg-green-600',
        quests: [
            { id: 'vision', name: 'Vision Quest', xp: 100, description: 'Define your company vision', attribute: 'marketing' },
            { id: 'problem', name: 'Problem Identification', xp: 150, description: 'Identify the problem to solve', attribute: 'marketing' },
            { id: 'solution', name: 'Solution Design', xp: 150, description: 'Develop your solution', attribute: 'tech' },
            { id: 'market', name: 'Market Research', xp: 200, description: 'Analyze your market', attribute: 'marketing' },
            { id: 'legal', name: 'Legal Setup', xp: 100, description: 'Establish your company\'s legal structure', attribute: 'legal' }
        ]
    },
    KICKOFF: {
        id: 'kickoff',
        name: 'Kickoff',
        description: 'Launch your business into the market',
        icon: Castle,
        color: 'bg-blue-600',
        quests: [
            { id: 'mvp', name: 'MVP Build', xp: 300, description: 'Build your minimum viable product', attribute: 'tech' },
            { id: 'team', name: 'Team Formation', xp: 200, description: 'Recruit your team', attribute: 'operations' },
            { id: 'pitch', name: 'Pitch Preparation', xp: 150, description: 'Perfect your pitch', attribute: 'sales' },
            { id: 'firstusers', name: 'First Users', xp: 250, description: 'Acquire your first users', attribute: 'marketing' },
            { id: 'feedback', name: 'User Feedback', xp: 200, description: 'Gather feedback from users', attribute: 'marketing' }
        ]
    },
    GTM: {
        id: 'gtm',
        name: 'Go-To-Market',
        description: 'Develop and execute your go-to-market strategy',
        icon: Swords,
        color: 'bg-purple-600',
        quests: [
            { id: 'marketing', name: 'Marketing Campaign', xp: 250, description: 'Launch your marketing campaign', attribute: 'marketing' },
            { id: 'sales', name: 'Sales Strategy', xp: 250, description: 'Develop your sales strategy', attribute: 'sales' },
            { id: 'channels', name: 'Distribution Channels', xp: 200, description: 'Establish your distribution channels', attribute: 'operations' },
            { id: 'pricing', name: 'Pricing Strategy', xp: 150, description: 'Set your pricing', attribute: 'finance' },
            { id: 'metrics', name: 'Key Metrics', xp: 200, description: 'Identify your key business metrics', attribute: 'finance' }
        ]
    },
    GROWTH: {
        id: 'growth',
        name: 'Growth',
        description: 'Scale your business to new heights',
        icon: Crown,
        color: 'bg-orange-600',
        quests: [
            { id: 'funding', name: 'Fundraising', xp: 400, description: 'Raise capital for your business', attribute: 'finance' },
            { id: 'scaling', name: 'Scaling Operations', xp: 350, description: 'Scale your operations', attribute: 'operations' },
            { id: 'culture', name: 'Company Culture', xp: 200, description: 'Build your company culture', attribute: 'operations' },
            { id: 'partnerships', name: 'Partnerships', xp: 300, description: 'Form strategic partnerships', attribute: 'sales' },
            { id: 'exit', name: 'Exit Strategy', xp: 500, description: 'Plan your exit strategy', attribute: 'finance' }
        ]
    }
};


export const createMagicalParticles = () => {
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'magic-particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        particle.style.animationDuration = `${15 + Math.random() * 10}s`;

        // Ensure we're appending to body only after DOM is ready
        if (document.body) {
            document.body.appendChild(particle);
        }
    }
};