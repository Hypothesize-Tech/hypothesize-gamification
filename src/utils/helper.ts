import confetti from 'canvas-confetti';
import { ARMORY_ITEMS } from './constant';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { Castle, Crown, Swords } from 'lucide-react';
import { Shield } from 'lucide-react';
import { achievements } from '../config/achievements';
import {
    MILESTONE_ACHIEVEMENTS,
    PERSONAL_ACHIEVEMENTS,
    ENGAGEMENT_ACHIEVEMENTS,
    GUILD_ACHIEVEMENTS,
} from '../config/achievements.v2';

interface NewAchievement {
    name: string;
    description: string;
    [key: string]: any;
}

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
        const item = ARMORY_ITEMS.items.find((g: any) => g.id === itemId);
        if (item?.stats.xpBonus) {
            xp *= (1 + item.stats.xpBonus / 100);
        }
    });
    const treasures = userData.treasures || [];
    treasures.forEach((treasureId: string) => {
        const treasure = ARMORY_ITEMS.specials.find((t: any) => t.id === treasureId);
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
        const item = ARMORY_ITEMS.items.find((g: any) => g.id === itemId);
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
    bedrockClient: BedrockRuntimeClient
) => {
    try {
        const ceoContext = userData?.ceoAvatar ?
            `Channel the expertise of ${userData.ceoAvatar.name}, ${userData.ceoAvatar.title}.` : '';
        const command = new InvokeModelCommand({
            modelId: import.meta.env.VITE_NOVA_INFERENCE_PROFILE_ARN || "arn:aws:bedrock:us-east-1:148123604300:inference-profile/us.amazon.nova-pro-v1:0",
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
    return consultAISage(context, prompts[template.id] || "Create a business document", userData, bedrockClient);
};

export const fetchDynamicResources = async (
    questTopic: string,
    questDescription: string,
    bedrockClient: BedrockRuntimeClient
) => {
    try {
        const searchPrompt = `Find the best resources for a founder working on: ${questTopic}. Context: ${questDescription}. \n\nReturn a JSON array with exactly 5 resources in this format:\n[\n  {\n    "title": "Resource Title",\n    "type": "book|article|tool|course|guide|video",\n    "description": "Brief description",\n    "url": "https://...",\n    "icon": "appropriate emoji",\n    "difficulty": "beginner|intermediate|advanced",\n    "timeToComplete": "e.g., 1 hour, 2 weeks"\n  }\n]\n\nFocus on high-quality, actionable resources from reputable sources.`;
        const command = new InvokeModelCommand({
            modelId: import.meta.env.VITE_NOVA_INFERENCE_PROFILE_ARN || "arn:aws:bedrock:us-east-1:148123604300:inference-profile/us.amazon.nova-pro-v1:0",
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

export const generateFollowUpQuestions = async (
    context: string,
    conversation: any[],
    bedrockClient: BedrockRuntimeClient
): Promise<string[]> => {
    try {
        const conversationText = conversation.map(msg => `${msg.type}: ${msg.content}`).join('\\n');
        const prompt = `Based on the following quest context and conversation, generate 3-4 insightful and relevant follow-up questions that the user could ask. These questions should help the user dig deeper into the topic, overcome challenges, or think about the next steps.
        
        Context: ${context}
        Conversation:
        ${conversationText}
        
        Return a JSON array of strings: ["question 1", "question 2", "question 3"]`;

        const command = new InvokeModelCommand({
            modelId: import.meta.env.VITE_NOVA_INFERENCE_PROFILE_ARN || "arn:aws:bedrock:us-east-1:148123604300:inference-profile/us.amazon.nova-pro-v1:0",
            body: JSON.stringify({
                messages: [{ role: "user", content: [{ text: prompt }] }],
            }),
            contentType: "application/json",
        });

        const response = await bedrockClient.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        const content = responseBody.output?.message?.content?.[0]?.text || "[]";

        try {
            const questions = JSON.parse(content);
            return Array.isArray(questions) ? questions.slice(0, 4) : [];
        } catch (e) {
            console.error('Error parsing follow-up questions:', e);
            return [];
        }
    } catch (error) {
        console.error('Error generating follow-up questions:', error);
        return [];
    }
};

export async function getSuggestedSageQuestions({ quest, guildData, guildLevel, conversation, bedrockClient }: { quest: any, guildData: any, guildLevel: any, conversation?: any[], bedrockClient?: BedrockRuntimeClient }) {
    if (!bedrockClient) {
        return ["How should I get started?", "What's the most important thing to focus on?", "What are some common mistakes to avoid?"];
    }

    if (conversation && conversation.length > 0 && bedrockClient) {
        const context = `Quest: ${quest.name} - ${quest.description}. Seeker's progress: ${JSON.stringify(guildData.questProgress?.[`${quest.stageId}_${quest.id}`]?.inputs || {})}`;
        const newQuestions = await generateFollowUpQuestions(context, conversation, bedrockClient);
        return newQuestions;
    }
    // Default questions
    switch (quest.id) {
        case 'vision':
            return [
                "What makes a good vision statement?",
                "Can you give me an example of a strong vision statement?",
                "How do I align my vision with my company's mission and values?",
                "How specific should my vision be at this early stage?",
            ];
        case 'problem':
            return [
                "How do I know if the problem I'm solving is big enough?",
                "What's the best way to validate the problem with potential customers?",
                "Can you help me frame my problem statement?",
                "What's the difference between a problem and a solution?",
            ];
        case 'solution':
            return [
                "How do I create a unique value proposition?",
                "What are some effective ways to brainstorm and evaluate solutions?",
                "How do I avoid building a solution nobody wants?",
                "Can you help me define the core features of my MVP?",
            ];
        case 'market':
            return [
                "How do I calculate the Total Addressable Market (TAM)?",
                "What are the best strategies for identifying my target market segment?",
                "Can you help me analyze my top competitors?",
                "What is a go-to-market strategy and why do I need one?",
            ];
        default:
            return [
                "How should I get started on this quest?",
                "What is the most important outcome for this quest?",
                "What are some common mistakes to avoid?",
                "Can you give me a real-world example related to this topic?",
            ];
    }
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

export const getPersonalizedQuestDetails = async (
    vision: string,
    quest: any,
    bedrockClient: BedrockRuntimeClient
) => {
    try {
        let specializedInstructions = "";
        if (quest.id === 'market') { // Corresponds to "Scout the Territory"
            specializedInstructions = "For the `contextualAdvice`, you MUST include a list of 3-5 potential competitors based on the user's vision. For the `resourceCache`, include market analysis tools.";
        } else if (quest.id === 'legal') { // Corresponds to "Forge the Legal Shield"
            specializedInstructions = "For the `contextualAdvice`, you MUST include specific warnings about relevant regulations (like GDPR, CCPA, HIPAA, etc.) if applicable to the user's vision. For the `resourceCache`, include links to legal document templates or services.";
        }

        const prompt = `You are the AI Sage, an expert startup advisor forging a personalized Quest Map for a founder.
The founder's vision is: "${vision}"

They are now undertaking the quest: "${quest.name} - ${quest.description}"

Your task is to enchant this quest with personalized guidance. Provide your response as a single, valid JSON object with the following keys:
- "contextualAdvice": "A paragraph of specific, actionable advice for this quest, tailored directly to the founder's vision. ${specializedInstructions}"
- "specificChallenges": ["A list of 3 potential challenges the founder might face, specific to their vision and this quest.", "Challenge 2", "Challenge 3"]
- "resourceCache": [
    {
      "title": "Resource Title 1",
      "type": "book|article|tool|course|guide|video",
      "description": "A brief, compelling description of why this resource is useful for this specific founder and quest.",
      "url": "https://...",
      "icon": "📚"
    },
    {
      "title": "Resource Title 2",
      "type": "tool",
      "description": "Description for tool.",
      "url": "https://...",
      "icon": "🛠️"
    }
  ]

Ensure the JSON is well-formed. Do not include any text outside of the JSON object.
`;

        const command = new InvokeModelCommand({
            modelId: import.meta.env.VITE_NOVA_INFERENCE_PROFILE_ARN || "arn:aws:bedrock:us-east-1:148123604300:inference-profile/us.amazon.nova-pro-v1:0",
            body: JSON.stringify({
                messages: [{ role: "user", content: [{ text: prompt }] }],
            }),
            contentType: "application/json",
        });

        const response = await bedrockClient.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        const content = responseBody.output?.message?.content?.[0]?.text || "{}";

        try {
            // Find the start and end of the JSON object
            const startIndex = content.indexOf('{');
            const endIndex = content.lastIndexOf('}');
            if (startIndex === -1 || endIndex === -1) {
                throw new Error("No JSON object found in the AI response.");
            }
            const jsonString = content.substring(startIndex, endIndex + 1);
            const details = JSON.parse(jsonString);
            return details;
        } catch (e) {
            console.error('Error parsing personalized quest details:', e, "Raw content:", content);
            return {
                contextualAdvice: "The AI Sage is pondering... but couldn't forge a personalized path for this quest. Try consulting the Sage in the chat.",
                specificChallenges: ["Connecting to the ethereal plane of knowledge.", "Deciphering ancient runes of wisdom.", "Avoiding pesky knowledge gremlins."],
                resourceCache: getDefaultResources(quest.id)
            };
        }
    } catch (error: any) {
        console.error('Error getting personalized quest details:', error);
        // Add more detailed error info
        const errorMessage = error.message || "An unknown error occurred";
        return {
            contextualAdvice: `A magical interference prevented the Sage from personalizing this quest. Please try again. (Error: ${errorMessage})`,
            specificChallenges: [],
            resourceCache: getDefaultResources(quest.id)
        };
    }
};

const checkMilestoneAchievements = (completedQuestIds: string[], existingAchievements: { [key: string]: any }) => {
    const newAchievements: NewAchievement[] = [];
    for (const achievementName in MILESTONE_ACHIEVEMENTS) {
        if (existingAchievements[achievementName]) {
            continue;
        }

        const achievement = (MILESTONE_ACHIEVEMENTS as any)[achievementName];
        const hasCompletedAll = achievement.requiredQuests.every((questId: string) =>
            completedQuestIds.includes(questId)
        );

        if (hasCompletedAll) {
            newAchievements.push({ name: achievementName, ...achievement });
        }
    }
    return newAchievements;
};

const checkPersonalAchievements = (userData: any, existingAchievements: { [key: string]: any }) => {
    const newAchievements: NewAchievement[] = [];
    const attributes = ['tech', 'marketing', 'sales', 'legal', 'operations', 'finance'];

    // Attribute achievements
    attributes.forEach(attr => {
        const a = PERSONAL_ACHIEVEMENTS.attribute;
        const attrLevel = userData.attributes?.[attr]?.level || 0;
        const achievementName = a.name(attr);
        a.levels.forEach(levelInfo => {
            const levelAchievementName = `${achievementName} ${levelInfo.name}`;
            if (attrLevel >= levelInfo.level && !existingAchievements[levelAchievementName]) {
                newAchievements.push({
                    name: levelAchievementName,
                    description: a.description(levelInfo.level, attr),
                });
            }
        });
    });

    // Polymath achievements
    const p = PERSONAL_ACHIEVEMENTS.polymath;
    const minAttributeLevel = Math.min(...attributes.map(attr => userData.attributes?.[attr]?.level || 0));
    p.levels.forEach(levelInfo => {
        const achievementName = `${p.name} ${levelInfo.name}`;
        if (minAttributeLevel >= levelInfo.level && !existingAchievements[achievementName]) {
            newAchievements.push({
                name: achievementName,
                description: p.description(levelInfo.level),
            });
        }
    });


    // Quest-Taker achievements
    const q = PERSONAL_ACHIEVEMENTS.quest_taker;
    const completedQuestsCount = Object.keys(userData.completedQuests || {}).length;
    q.levels.forEach(levelInfo => {
        const achievementName = `${q.name} ${levelInfo.name}`;
        if (completedQuestsCount >= levelInfo.count && !existingAchievements[achievementName]) {
            newAchievements.push({
                name: achievementName,
                description: q.description(levelInfo.count),
            });
        }
    });

    return newAchievements;
}

const checkEngagementAchievements = (userData: any, existingAchievements: { [key: string]: any }) => {
    const newAchievements: NewAchievement[] = [];
    const loginStreak = userData.loginStats?.streak || 0;
    const totalLogins = userData.loginStats?.totalLogins || 0;

    // Daily Dedication
    const d = ENGAGEMENT_ACHIEVEMENTS.daily_dedication;
    d.levels.forEach(levelInfo => {
        const achievementName = `${d.name} ${levelInfo.name}`;
        if (loginStreak >= levelInfo.days && !existingAchievements[achievementName]) {
            newAchievements.push({
                name: achievementName,
                description: d.description(levelInfo.days),
            });
        }
    });


    // The Regular
    const r = ENGAGEMENT_ACHIEVEMENTS.the_regular;
    r.levels.forEach(levelInfo => {
        const achievementName = `${r.name} ${levelInfo.name}`;
        if (totalLogins >= levelInfo.days && !existingAchievements[achievementName]) {
            newAchievements.push({
                name: achievementName,
                description: r.description(levelInfo.days),
            });
        }
    });

    return newAchievements;
}

const checkGuildAchievements = (userData: any, existingAchievements: { [key: string]: any }) => {
    if (!userData.guild) return [];
    const newAchievements: NewAchievement[] = [];
    const guildData = userData.guild;

    // Founding Achievements
    const f = GUILD_ACHIEVEMENTS.founding;
    if (guildData.id && !existingAchievements[f["The Fellowship Begins"].name]) {
        newAchievements.push(f["The Fellowship Begins"]);
    }
    if (guildData.roles?.length >= 6 && !existingAchievements[f["All Hands on Deck"].name]) {
        newAchievements.push(f["All Hands on Deck"]);
    }
    if (userData.synergyQuestCompleted && !existingAchievements[f.Synergist.name]) {
        newAchievements.push(f.Synergist);
    }

    // Collaborative Achievements
    const c = GUILD_ACHIEVEMENTS.collaborative;
    const synergyBonuses = guildData.synergyBonuses || 0;
    c.powerhouse_partnership.levels.forEach(levelInfo => {
        const achievementName = `${c.powerhouse_partnership.name} ${levelInfo.name}`;
        if (synergyBonuses >= levelInfo.count && !existingAchievements[achievementName]) {
            newAchievements.push({
                name: achievementName,
                description: c.powerhouse_partnership.description(levelInfo.count),
            });
        }
    });

    const maxGuildLevel = Math.max(0, ...Object.values(guildData.attributeLevels || {}).map(v => Number(v)));
    c.guild_excellence.levels.forEach(levelInfo => {
        const achievementName = `${c.guild_excellence.name} ${levelInfo.name}`;
        if (maxGuildLevel >= levelInfo.level && !existingAchievements[achievementName]) {
            newAchievements.push({
                name: achievementName,
                description: c.guild_excellence.description(levelInfo.level),
            });
        }
    });


    // Management Achievements
    const m = GUILD_ACHIEVEMENTS.management;
    const upkeepPaid = guildData.upkeep?.consecutiveMonthsPaid || 0;
    m.sustainable_venture.levels.forEach(levelInfo => {
        const achievementName = `${m.sustainable_venture.name} ${levelInfo.name}`;
        if (upkeepPaid >= levelInfo.months && !existingAchievements[achievementName]) {
            newAchievements.push({
                name: achievementName,
                description: m.sustainable_venture.description(levelInfo.months),
            });
        }
    });

    const hqLevels = m.master_architects.levels.map(l => l.hq);
    const currentHqLevel = guildData.headquartersLevel || "";
    const currentHqIndex = hqLevels.indexOf(currentHqLevel);
    m.master_architects.levels.forEach((levelInfo, index) => {
        const achievementName = `${m.master_architects.name} ${levelInfo.name}`;
        if (currentHqIndex >= index && !existingAchievements[achievementName]) {
            newAchievements.push({
                name: achievementName,
                description: m.master_architects.description(levelInfo.hq),
            });
        }
    });

    return newAchievements;
}

export const checkAndAwardAchievements = (
    userData: any,
) => {
    const completedQuests = userData.completedQuests || {};
    const existingAchievements = userData.achievements || {};

    const completedQuestIds = Object.keys(completedQuests).map(questKey => {
        return questKey.split('_').slice(1).join('_');
    });

    const newRoleAchievements = [];
    const roleAchievements = (achievements as any)[userData.role?.toLowerCase()];
    if (roleAchievements) {
        for (const achievementName in roleAchievements) {
            if (existingAchievements && existingAchievements[achievementName]) {
                continue;
            }
            const achievement = roleAchievements[achievementName];
            const requiredQuests = achievement.requiredQuests;
            const hasCompletedAll = requiredQuests.every((questId: string) =>
                completedQuestIds.includes(questId)
            );
            if (hasCompletedAll) {
                newRoleAchievements.push({
                    name: achievementName,
                    ...achievement,
                });
            }
        }
    }

    const newMilestoneAchievements = checkMilestoneAchievements(completedQuestIds, existingAchievements);
    const newPersonalAchievements = checkPersonalAchievements(userData, existingAchievements);
    const newEngagementAchievements = checkEngagementAchievements(userData, existingAchievements);
    const newGuildAchievements = checkGuildAchievements(userData, existingAchievements);


    return [
        ...newRoleAchievements,
        ...newMilestoneAchievements,
        ...newPersonalAchievements,
        ...newEngagementAchievements,
        ...newGuildAchievements,
    ];
};

/**
 * Determines the guild's current level based on completed quests
 * @param guildData The guild data object containing completed quests
 * @returns Object with level number, name, and other level info
 */
export const determineGuildLevel = (guildData: any) => {
    // Default to level 1 (Campfire)
    let currentLevel = 1;

    // Get completed quest IDs from guild data
    const completedQuestIds = guildData?.completedQuests?.map((q: any) => q.id) || [];

    // Helper function to check if all quests in a category are completed
    const isQuestCategoryComplete = (category: string) => {
        // Get all quest IDs for the given category
        const categoryQuests = Object.values(QUEST_STAGES)
            .find(stage => stage.name.toLowerCase() === category.toLowerCase())
            ?.quests.map((q: any) => q.id) || [];

        // Check if all quests in the category are completed
        return categoryQuests.length > 0 &&
            categoryQuests.every(questId => completedQuestIds.includes(questId));
    };

    // Check each level's unlock criteria
    if (isQuestCategoryComplete('Fundamentals')) {
        currentLevel = 2; // Outpost

        if (isQuestCategoryComplete('Kickoff')) {
            currentLevel = 3; // Hovel

            if (isQuestCategoryComplete('Go-to-Market')) {
                currentLevel = 4; // Manor

                if (isQuestCategoryComplete('Growth')) {
                    currentLevel = 5; // Tower

                    if (isQuestCategoryComplete('Prestige')) {
                        currentLevel = 6; // Castle

                        // Check if all quests are completed for the final level
                        const allQuests = Object.values(QUEST_STAGES)
                            .flatMap(stage => stage.quests.map((q: any) => q.id));

                        if (allQuests.every(questId => completedQuestIds.includes(questId))) {
                            currentLevel = 7; // Stronghold
                        }
                    }
                }
            }
        }
    }

    // Import from constants to get the level details
    const { GUILD_LEVELS } = require('./constant');

    // Return level number and all associated level details
    return {
        level: currentLevel,
        ...GUILD_LEVELS[currentLevel]
    };
};

/**
 * Gets the guild level name based on level number
 * @param level Guild level number
 * @returns The name of the level (e.g. "Campfire")
 */
export const getGuildLevelName = (level: number) => {
    const { GUILD_LEVELS } = require('./constant');
    return GUILD_LEVELS[level]?.name || 'Unknown';
};
