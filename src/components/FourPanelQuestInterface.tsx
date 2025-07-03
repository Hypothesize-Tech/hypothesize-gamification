import { useEffect, useRef, useState } from "react";
import { QUEST_INPUT_TEMPLATES } from "../utils/constant";
import { calculateGoldReward, calculateLevel, calculateXPWithBonuses, consultAISage, fetchDynamicResources, getPersonalizedQuestDetails, getSuggestedSageQuestions, rateQuestSubmission, triggerConfetti } from "../utils/helper";
import SwordIcon from "./DiamondSword3D";
import { BookOpen, Coins, Edit3, ExternalLink, Loader2, RefreshCw, Save, Scroll, Send, Sparkles, Swords, Trophy, X, ChevronDown, ChevronUp, Zap, Wand2, MessageSquare, Users, Share2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime';
import { EnergyWarning } from './EnergySystem';
import { ENERGY_COSTS } from '../config/energy';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "./FourPanelQuestInterface.css";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "../config/config";
import ShareAchievementModal from "./ShareAchievementModal";
import QuestCompletionModal from "./QuestCompletionModal";


export const FourPanelQuestInterface = ({
    quest,
    guildData,
    ceoAvatar,
    onComplete,
    onClose,
    saveConversation,
    updateGold,
    soundManager,
    bedrockClient,
    consumeEnergy,
    setGuildData,
    vision,
    savePersonalizedQuestDetails,
    currentUserRole,
    user
}: {
    quest: any;
    guildData: any;
    ceoAvatar: any;
    onComplete: (questData: any) => void;
    onClose: () => void;
    saveConversation: (quest: any, question: string, response: string) => Promise<void>;
    updateGold: (amount: number) => Promise<void>;
    soundManager: any;
    bedrockClient: BedrockRuntimeClient;
    consumeEnergy: (
        action: "QUEST_COMPLETION" | "DOCUMENT_GENERATION" | "AI_SAGE_CONSULTATION" | "SUBMIT_QUEST",
        onEnergyConsumed?: () => void
    ) => Promise<boolean>;
    setGuildData: React.Dispatch<React.SetStateAction<any | null>>;
    vision: string;
    savePersonalizedQuestDetails: (questKey: string, personalizedData: any) => Promise<void>;
    currentUserRole: 'leader' | 'knight' | 'scout';
    user: any;
}) => {
    const questKey = `${quest.stageId}_${quest.id}`;
    const questProgress = guildData?.questProgress?.[questKey];
    const isCompleted = !!questProgress?.completed;

    const [activeTab, setActiveTab] = useState<'sage' | 'war_room'>('sage');
    const [comments, setComments] = useState<any[]>([]);
    const [commentInput, setCommentInput] = useState('');
    const [commentsLoading, setCommentsLoading] = useState(true);

    const [sageMessages, setSageMessages] = useState<Array<{ type: 'user' | 'sage', content: string }>>(isCompleted ? (questProgress?.sageConversation || []) : []);
    const [sageInput, setSageInput] = useState('');
    const [sageLoading, setSageLoading] = useState(false);
    const [userInputs, setUserInputs] = useState<Record<string, string>>(isCompleted ? (questProgress?.inputs || {}) : {});
    const [isSaving, setIsSaving] = useState(false);
    const [dynamicResources, setDynamicResources] = useState<any[]>([]);
    const [resourcesLoading, setResourcesLoading] = useState(true);
    const [rating, setRating] = useState<any>(isCompleted ? { rating: questProgress?.rating, feedback: questProgress?.feedback } : null);
    const [showSuggestedQuestions, setShowSuggestedQuestions] = useState(true);
    const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
    const [personalizedDetails, setPersonalizedDetails] = useState<any>(questProgress?.personalizedData || null);
    const [isPersonalizing, setIsPersonalizing] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [completionData, setCompletionData] = useState<any>(null);

    // War Room: Fetch Comments
    useEffect(() => {
        if (!guildData?.guildId || !questKey) {
            setCommentsLoading(false);
            return;
        }
        console.log(`Setting up listener for questKey: ${questKey} in guild: ${guildData.guildId}`);

        const commentsRef = collection(db, 'guilds', guildData.guildId, 'quests', questKey, 'comments');
        const q = query(commentsRef, orderBy('createdAt', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedComments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setComments(fetchedComments);
            setCommentsLoading(false);
            console.log("Comments fetched: ", fetchedComments);
        }, (error) => {
            console.error("Error fetching comments: ", error);
            setCommentsLoading(false);
        });

        return () => {
            console.log(`Cleaning up listener for questKey: ${questKey}`);
            unsubscribe();
        };
    }, [guildData?.guildId, questKey]);

    useEffect(() => {
        const fetchInitialData = async () => {
            if (isCompleted) {
                setUserInputs(questProgress?.inputs || {});
                setSageMessages(questProgress?.sageConversation || []);
                setRating({ rating: questProgress?.rating, feedback: questProgress?.feedback });
                setResourcesLoading(false);
                setPersonalizedDetails(questProgress?.personalizedData || null);
            } else {
                // Fetch personalized details if they don't exist
                if (!questProgress?.personalizedData) {
                    setIsPersonalizing(true);
                    const details = await getPersonalizedQuestDetails(vision, quest, bedrockClient);
                    setPersonalizedDetails(details);
                    await savePersonalizedQuestDetails(questKey, details);
                    setIsPersonalizing(false);
                }

                // Set initial suggested questions
                const levelInfo = calculateLevel(guildData?.xp || 0);
                const questions = await getSuggestedSageQuestions({ quest, guildData, guildLevel: levelInfo, bedrockClient });
                setSuggestedQuestions(questions);

                // Fetch dynamic resources (now uses personalized data if available)
                setResourcesLoading(true);
                const resources = personalizedDetails?.resourceCache || await fetchDynamicResources(quest.name, quest.description, bedrockClient);
                setDynamicResources(resources);
                setResourcesLoading(false);
            }
        };

        fetchInitialData();
        // eslint-disable-next-line
    }, [questKey]);

    const inputTemplate = QUEST_INPUT_TEMPLATES[quest.id as keyof typeof QUEST_INPUT_TEMPLATES];

    const handleAddComment = async () => {
        if (!commentInput.trim()) return;

        const newComment = {
            text: commentInput,
            authorName: user.displayName,
            authorUid: user.uid,
            createdAt: serverTimestamp(),
        };

        try {
            const commentsRef = collection(db, 'guilds', guildData.guildId, 'quests', questKey, 'comments');
            await addDoc(commentsRef, newComment);
            setCommentInput('');
        } catch (error) {
            console.error("Error adding comment:", error);
            alert("Failed to post comment.");
        }
    };

    const handleSageChat = async () => {
        if (isCompleted || !sageInput.trim() || sageLoading) return;

        const hasEnergy = await consumeEnergy('AI_SAGE_CONSULTATION');
        if (!hasEnergy) {
            return;
        }

        setSageLoading(true);
        soundManager.play('magicCast');
        setShowSuggestedQuestions(false);

        const userMessage = sageInput;
        setSageInput('');
        setSageMessages(prev => [...prev, { type: 'user', content: userMessage }]);

        try {
            const response = await consultAISage(
                `Quest: ${quest.name} - ${quest.description}. Seeker's progress: ${JSON.stringify(userInputs)}`,
                userMessage,
                { ...guildData, ceoAvatar },
                bedrockClient
            );

            setSageMessages(prev => [...prev, { type: 'sage', content: response }]);
            await saveConversation(quest, userMessage, response);

            // Generate new suggested questions based on the new context
            const levelInfo = calculateLevel(guildData?.xp || 0);
            const newConversation = [...sageMessages, { type: 'user', content: userMessage }, { type: 'sage', content: response }];
            const questions = await getSuggestedSageQuestions({ quest, guildData, guildLevel: levelInfo, conversation: newConversation, bedrockClient });
            setSuggestedQuestions(questions);

        } catch (error) {
            setSageMessages(prev => [...prev, {
                type: 'sage',
                content: 'The Oracle\'s power wanes. Please try again later.'
            }]);
        } finally {
            setSageLoading(false);
        }
    };

    const handleInputChange = (fieldName: string, value: string) => {
        if (isCompleted) return; // Prevent editing if completed
        setUserInputs(prev => ({ ...prev, [fieldName]: value }));
    };

    const handleCompleteQuest = async () => {
        if (isCompleted) return; // Prevent re-completion
        setIsSaving(true);

        const questRating = await rateQuestSubmission({
            questName: quest.name,
            inputs: userInputs
        }, guildData, bedrockClient);

        setRating(questRating);

        const hasEnergy = await consumeEnergy('SUBMIT_QUEST');
        if (!hasEnergy) {
            setIsSaving(false);
            return;
        }

        const calculatedXpReward = calculateXPWithBonuses(quest.xp, questRating.rating, quest.attribute || 'general', guildData);
        const calculatedGoldReward = calculateGoldReward(quest.xp / 2, questRating.rating, guildData);

        // Format improvement feedback from suggestions
        let improvementFeedback = '';
        if (questRating.suggestions && questRating.suggestions.length > 0) {
            improvementFeedback = questRating.suggestions.join('\n\n');
        }

        const data = {
            inputs: userInputs,
            sageConversation: sageMessages,
            completedAt: new Date().toISOString(),
            rating: questRating.rating,
            feedback: questRating.feedback,
            improvementFeedback: improvementFeedback,
            xpReward: calculatedXpReward,
            goldReward: calculatedGoldReward,
        };

        setCompletionData(data);
        setShowCompletionModal(true);
        // The rest of the logic is moved to handleModalClose
    };

    const handleModalClose = async () => {
        if (!completionData) return;

        await onComplete({ ...completionData });
        await updateGold(completionData.goldReward);
        setGuildData((prev: any) => {
            if (!prev) return null;
            const updatedQuestProgress = {
                ...prev.questProgress,
                [questKey]: {
                    ...prev.questProgress?.[questKey],
                    ...completionData,
                    completed: true,
                },
            };

            return {
                ...prev,
                gold: (prev.gold || 0) + completionData.goldReward,
                xp: (prev.xp || 0) + completionData.xpReward,
                questProgress: updatedQuestProgress,
            };
        });
        soundManager.play('questComplete');
        triggerConfetti();
        setIsSaving(false);
        setShowCompletionModal(false);
    };

    const sageInputRef = useRef<HTMLInputElement>(null);

    const handleSuggestedSageQuestion = async (question: string) => {
        if (isCompleted || sageLoading) return;

        const hasEnergy = await consumeEnergy('AI_SAGE_CONSULTATION');
        if (!hasEnergy) {
            return;
        }

        setSageLoading(true);
        setShowSuggestedQuestions(false);
        setSageMessages(prev => [...prev, { type: 'user', content: question }]);
        try {
            soundManager.play('magicCast');
            const response = await consultAISage(
                `Quest: ${quest.name} - ${quest.description}. Seeker's progress: ${JSON.stringify(userInputs)}`,
                question,
                { ...guildData, ceoAvatar },
                bedrockClient
            );
            setSageMessages(prev => [...prev, { type: 'sage', content: response }]);
            await saveConversation(quest, question, response);

            // Generate new suggested questions
            const newLevelInfo = calculateLevel(guildData?.xp || 0);
            const newConversation = [...sageMessages, { type: 'user', content: question }, { type: 'sage', content: response }];
            const questions = await getSuggestedSageQuestions({ quest, guildData, guildLevel: newLevelInfo, conversation: newConversation, bedrockClient });
            setSuggestedQuestions(questions);

        } catch (error) {
            setSageMessages(prev => [...prev, {
                type: 'sage',
                content: 'The Oracle\'s power wanes. Please try again later.'
            }]);
        } finally {
            setSageLoading(false);
        }
    };


    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
            {/* 3D Weapon Display */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-32 h-32 z-10">
                <div className="w-full h-full flex items-center justify-center">
                    <SwordIcon width={100} height={100} />
                </div>
            </div>

            {/* Header */}
            <div className="parchment border-b border-yellow-700 px-6 py-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Swords className="w-6 h-6 text-yellow-500" />
                        <div>
                            <div className="flex items-center gap-4">
                                <h2 className="text-2xl font-bold text-yellow-100">{quest.name}</h2>
                                <button
                                    onClick={() => setShowShareModal(true)}
                                    className="p-2 -m-2 text-gray-400 hover:text-white"
                                    title="Share Achievements"
                                >
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-sm text-gray-300">{quest.description} • {quest.xp} XP</p>
                            {isCompleted && (
                                <div className="mt-1 flex items-center space-x-2">
                                    <span className="px-2 py-0.5 bg-gradient-to-r from-green-600 to-emerald-600 text-xs text-white rounded-full font-semibold border border-green-400">+{questProgress?.xpReward} XP</span>
                                    <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-600 to-orange-600 text-xs text-white rounded-full font-semibold border border-yellow-400">+{questProgress?.goldReward} Gold</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => { onClose(); soundManager.play('swordDraw'); }}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* 4-Panel Grid */}
            <div className="p-4 flex-1 overflow-hidden">
                <PanelGroup direction="vertical" className="h-full">
                    <Panel defaultSize={50}>
                        <PanelGroup direction="horizontal" className="h-full">
                            <Panel defaultSize={50}>
                                {/* Top Left - Quest Details */}
                                <div className="parchment p-6 flex flex-col overflow-hidden h-full">
                                    <div className="flex items-center mb-4 flex-shrink-0">
                                        <Scroll className="w-5 h-5 text-yellow-500 mr-2" />
                                        <h3 className="text-lg font-bold text-yellow-100">Quest Details</h3>
                                    </div>

                                    <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                                        <div className="parchment p-4">
                                            <h4 className="font-semibold mb-2 text-yellow-100">Your Quest</h4>
                                            <p className="text-gray-300">{quest.description}</p>
                                        </div>

                                        <div className="parchment p-4">
                                            <h4 className="font-semibold mb-2 text-yellow-100">How to Complete</h4>
                                            <ul className="list-disc list-inside text-gray-300 space-y-1">
                                                <li>Complete all required entries</li>
                                                <li>Ask the Sage for advice ({ENERGY_COSTS.AI_SAGE_CONSULTATION} energy per question)</li>
                                                <li>Review the resources</li>
                                                <li>Record your progress</li>
                                            </ul>
                                        </div>

                                        {isPersonalizing ? (
                                            <div className="parchment p-4 flex items-center justify-center">
                                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                                <span>The Sage is personalizing your quest...</span>
                                            </div>
                                        ) : personalizedDetails?.contextualAdvice && (
                                            <div className="parchment p-4">
                                                <h4 className="font-semibold mb-2 text-yellow-100 flex items-center">
                                                    <Wand2 className="w-4 h-4 mr-2" />
                                                    Sage's Enchantment
                                                </h4>
                                                <p className="text-gray-300 text-sm italic">{personalizedDetails.contextualAdvice}</p>
                                            </div>
                                        )}

                                        <div className="parchment p-4">
                                            <h4 className="font-semibold mb-2 text-yellow-100">Rewards</h4>
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex items-center space-x-2">
                                                        <Sparkles className="w-5 h-5 text-yellow-500" />
                                                        <span>{quest.xp} XP</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Coins className="w-5 h-5 text-yellow-500" />
                                                        <span>{quest.xp / 2} Gold (base)</span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-400">Final reward is based on the Grand Master's judgment (1-5 stars)</p>
                                                <p className="text-xs text-yellow-400 mt-1">Complete all quests in this stage to earn 500 gold coins!</p>
                                            </div>
                                        </div>

                                        {rating && (
                                            <div className="parchment p-4 magic-border">
                                                <h4 className="font-semibold mb-2 flex items-center text-yellow-100">
                                                    Review: {'⭐'.repeat(rating.rating)}
                                                </h4>
                                                <p className="text-sm text-gray-300 mb-2">{rating.feedback}</p>
                                                <div className="flex items-center space-x-4 text-sm">
                                                    <span className="text-green-400">+{calculateXPWithBonuses(quest.xp, rating.rating, quest.attribute || 'general', guildData)} XP</span>
                                                </div>
                                            </div>
                                        )}

                                        {ceoAvatar && (
                                            <div className={`p-4 rounded-lg bg-gradient-to-r ${ceoAvatar.color} bg-opacity-20 parchment`}>
                                                <div className="flex items-center mb-2">
                                                    <span className="text-2xl mr-2">{ceoAvatar.avatar}</span>
                                                    <p className="font-semibold text-yellow-100">{ceoAvatar.name}'s Wisdom</p>
                                                </div>
                                                <p className="text-sm italic text-gray-300">"{ceoAvatar.advice}"</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Panel>
                            <PanelResizeHandle className="resize-handle-vertical" />
                            <Panel defaultSize={50}>
                                {/* Top Right - Input Section */}
                                <div className="parchment p-6 flex flex-col overflow-hidden h-full">
                                    <div className="flex items-center mb-4 flex-shrink-0">
                                        <Edit3 className="w-5 h-5 text-yellow-500 mr-2" />
                                        <h3 className="text-lg font-bold text-yellow-100">
                                            {inputTemplate?.title || 'Sacred Inscriptions'}
                                        </h3>
                                    </div>

                                    <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                                        {inputTemplate ? (
                                            inputTemplate.fields.map((field: any) => (
                                                <div key={field.name}>
                                                    <label className="block text-sm font-medium mb-2 text-yellow-100">
                                                        {field.label}
                                                    </label>
                                                    {field.type === 'textarea' ? (
                                                        <textarea
                                                            value={userInputs[field.name] || ''}
                                                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                            placeholder={field.placeholder}
                                                            className="w-full p-3 bg-gray-700 rounded-lg text-white resize-none h-24"
                                                            disabled={isCompleted}
                                                        />
                                                    ) : field.type === 'select' ? (
                                                        <select
                                                            value={userInputs[field.name] || ''}
                                                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                            className="w-full p-3 bg-gray-700 rounded-lg text-white"
                                                            disabled={isCompleted}
                                                        >
                                                            <option value="">Choose wisely...</option>
                                                            {field.options?.map((option: any) => (
                                                                <option key={option} value={option}>{option}</option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            value={userInputs[field.name] || ''}
                                                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                            placeholder={field.placeholder}
                                                            className="w-full p-3 bg-gray-700 rounded-lg text-white"
                                                            disabled={isCompleted}
                                                        />
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-yellow-100">
                                                    Thy Quest Journal
                                                </label>
                                                <textarea
                                                    value={userInputs.general || ''}
                                                    onChange={(e) => handleInputChange('general', e.target.value)}
                                                    placeholder="Chronicle thy deeds for this quest..."
                                                    className="w-full p-3 bg-gray-700 rounded-lg text-white resize-none h-48"
                                                    disabled={isCompleted}
                                                />
                                            </div>
                                        )}

                                        {!isCompleted && guildData && !guildData.isPremium && guildData.currentEnergy < ENERGY_COSTS.QUEST_COMPLETION && (
                                            <div className="mt-4">
                                                <EnergyWarning
                                                    action="Completing this quest"
                                                    energyCost={ENERGY_COSTS.QUEST_COMPLETION}
                                                    currentEnergy={guildData.currentEnergy}
                                                    onPurchaseClick={() => {
                                                        alert("Please close the quest and purchase energy from the main screen.");
                                                    }}
                                                />
                                            </div>
                                        )}

                                        <div className="flex space-x-3 mt-4">
                                            <button
                                                onClick={() => {
                                                    soundManager.play('swordDraw');
                                                    alert('Thy progress has been saved to the archives!');
                                                }}
                                                className="flex-1 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all flex items-center justify-center space-x-2"
                                                disabled={isCompleted}
                                            >
                                                <Save className="w-4 h-4" />
                                                <span>Save to Archives</span>
                                            </button>
                                            <button
                                                onClick={handleCompleteQuest}
                                                disabled={isSaving || isCompleted}
                                                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all disabled:opacity-50 flex items-center justify-center space-x-2 magic-border"
                                            >
                                                {isSaving ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                        <span>Submitting...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Trophy className="w-4 h-4" />
                                                        <span>Complete Quest</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Panel>
                        </PanelGroup>
                    </Panel>
                    <PanelResizeHandle className="resize-handle-horizontal" />
                    <Panel defaultSize={50}>
                        <PanelGroup direction="horizontal" className="h-full">
                            <Panel defaultSize={50}>
                                {/* Bottom Left - Dynamic Resources Library */}
                                <div className="parchment p-6 flex flex-col overflow-hidden h-full">
                                    <div className="flex items-center justify-between mb-4 flex-shrink-0">
                                        <div className="flex items-center">
                                            <BookOpen className="w-5 h-5 text-green-500 mr-2" />
                                            <h3 className="text-lg font-bold text-yellow-100">Ancient Grimoire</h3>
                                        </div>
                                        {!resourcesLoading && (
                                            <button
                                                onClick={async () => {
                                                    setResourcesLoading(true);
                                                    const resources = await fetchDynamicResources(quest.name, quest.description, bedrockClient);
                                                    setDynamicResources(resources);
                                                    setResourcesLoading(false);
                                                }}
                                                className="p-2 -m-2 text-gray-400 hover:text-white"
                                                title="Refresh resources"
                                            >
                                                <RefreshCw className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-3 overflow-y-auto flex-1 pr-2">
                                        {isPersonalizing || resourcesLoading ? (
                                            <div className="text-center py-8">
                                                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-500" />
                                                <p className="text-gray-400">{isPersonalizing ? 'Enchanting resources...' : 'Loading resources...'}</p>
                                            </div>
                                        ) : (personalizedDetails?.resourceCache || dynamicResources).length > 0 ? (
                                            <>
                                                {(personalizedDetails?.resourceCache || dynamicResources).map((resource: any, index: number) => (
                                                    <a
                                                        key={index}
                                                        href={resource.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block parchment p-3 hover:transform hover:scale-105 transition-all"
                                                        onMouseEnter={() => soundManager.play('swordDraw')}
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex items-start space-x-3">
                                                                <span className="text-2xl mt-1">{resource.icon}</span>
                                                                <div className="flex-1">
                                                                    <p className="font-medium text-yellow-100">{resource.title}</p>
                                                                    <p className="text-xs text-gray-300 mt-1">{resource.description}</p>
                                                                    <div className="flex items-center space-x-3 mt-2 text-xs">
                                                                        <span className="text-purple-400">{resource.type}</span>
                                                                        <span className="text-gray-500">•</span>
                                                                        <span className="text-gray-400">{resource.timeToComplete}</span>
                                                                        <span className="text-gray-500">•</span>
                                                                        <span className={`${resource.difficulty === 'apprentice' ? 'text-green-400' :
                                                                            resource.difficulty === 'journeyman' ? 'text-yellow-400' :
                                                                                'text-red-400'
                                                                            }`}>
                                                                            {resource.difficulty}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                        </div>
                                                    </a>
                                                ))}
                                            </>
                                        ) : (
                                            <div className="text-center py-8 text-gray-400">
                                                <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                                <p>No resources found. Try refreshing again.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Panel>
                            <PanelResizeHandle className="resize-handle-vertical" />
                            <Panel defaultSize={50}>
                                {/* Bottom Right - AI Sage Chat & War Room */}
                                <div className="parchment flex flex-col overflow-hidden h-full">
                                    <div className="p-3 border-b border-yellow-700 flex items-center justify-between flex-shrink-0">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                className={`px-3 py-1 text-sm rounded-md flex items-center space-x-2 transition-colors ${activeTab === 'sage' ? 'bg-purple-800 text-white' : 'bg-transparent text-gray-400 hover:bg-gray-700/50'}`}
                                                onClick={() => setActiveTab('sage')}
                                            >
                                                <Sparkles className="w-4 h-4" />
                                                <span>AI Sage</span>
                                            </button>
                                            <button
                                                className={`px-3 py-1 text-sm rounded-md flex items-center space-x-2 transition-colors ${activeTab === 'war_room' ? 'bg-purple-800 text-white' : 'bg-transparent text-gray-400 hover:bg-gray-700/50'}`}
                                                onClick={() => setActiveTab('war_room')}
                                            >
                                                <Users className="w-4 h-4" />
                                                <span>War Room</span>
                                            </button>
                                        </div>
                                        {activeTab === 'sage' && (
                                            <div className="flex items-center space-x-2 text-sm">
                                                <Zap className="w-4 h-4 text-blue-400" />
                                                <span className="font-medium text-yellow-100">{ENERGY_COSTS.AI_SAGE_CONSULTATION} energy</span>
                                            </div>
                                        )}
                                    </div>

                                    {activeTab === 'sage' ? (
                                        <div className="p-6 flex flex-col overflow-hidden h-full">
                                            {/* AI Sage Content */}
                                            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                                                {sageMessages.length === 0 && (
                                                    <div className="text-center py-8">
                                                        <Sparkles className="w-12 h-12 text-yellow-500/50 mx-auto mb-3" />
                                                        <p className="text-gray-400 px-4">Ask the Sage for advice on this quest.</p>
                                                    </div>
                                                )}
                                                {sageMessages.map((msg, index) => (
                                                    <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                        <div className={`max-w-[85%] rounded-lg p-3 ${msg.type === 'user' ? 'bg-blue-900/50' : 'bg-gray-800/60'}`}>
                                                            <div className="prose prose-sm max-w-none text-gray-200">
                                                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {sageLoading && (
                                                    <div className="flex justify-start">
                                                        <div className="bg-gray-800/60 rounded-lg p-3 max-w-[85%]">
                                                            <div className="flex items-center space-x-2">
                                                                <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />
                                                                <p className="text-gray-200 italic">The Sage is contemplating...</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-shrink-0 mt-2">
                                                <button
                                                    onClick={() => setShowSuggestedQuestions(!showSuggestedQuestions)}
                                                    className="w-full text-left p-2 rounded hover:bg-gray-800/50 flex justify-between items-center"
                                                >
                                                    <span className="text-sm font-semibold text-yellow-300">Suggested Questions</span>
                                                    {showSuggestedQuestions ? <ChevronUp className="w-4 h-4 text-yellow-300" /> : <ChevronDown className="w-4 h-4 text-yellow-300" />}
                                                </button>
                                                {showSuggestedQuestions && (
                                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                                        {suggestedQuestions.map((q, i) => (
                                                            <button
                                                                key={i}
                                                                onClick={() => handleSuggestedSageQuestion(q)}
                                                                disabled={isCompleted || sageLoading}
                                                                className="text-left text-xs p-2 bg-gray-800/70 rounded hover:bg-gray-700/90 text-gray-300 disabled:opacity-50 transition-colors"
                                                            >{q}</button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            {!isCompleted && guildData && !guildData.isPremium && guildData.currentEnergy < ENERGY_COSTS.AI_SAGE_CONSULTATION && (
                                                <EnergyWarning action="AI Sage consultation" energyCost={ENERGY_COSTS.AI_SAGE_CONSULTATION} currentEnergy={guildData.currentEnergy} onPurchaseClick={() => { alert("Please close the quest and purchase energy from the main screen."); }} />
                                            )}
                                            <div className="mt-4 flex gap-2 flex-shrink-0">
                                                <input type="text" value={sageInput} onChange={(e) => setSageInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSageChat()} placeholder="Ask the Sage a question..." className="flex-1 p-3 bg-gray-700 rounded-lg text-white" disabled={sageLoading || isCompleted} ref={sageInputRef} />
                                                <button onClick={handleSageChat} disabled={sageLoading || !sageInput.trim() || isCompleted} className="px-4 py-3 bg-purple-800 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all" title={guildData.gold < 20 ? 'Insufficient gold coins' : ''}>
                                                    <Send className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-6 flex flex-col overflow-hidden h-full">
                                            {/* War Room Content */}
                                            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                                                {commentsLoading ? (
                                                    <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-yellow-400" /></div>
                                                ) : comments.length === 0 ? (
                                                    <div className="text-center text-gray-400 py-10"><MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" /><p>The War Room is silent. Be the first to strategize.</p></div>
                                                ) : (
                                                    comments.map((comment) => (
                                                        <div key={comment.id} className="flex items-start gap-3">
                                                            <div className="text-sm w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-600" title={comment.authorName}>
                                                                {comment.authorName?.charAt(0) || '?'}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center space-x-2">
                                                                    <p className="font-bold text-yellow-100">{comment.authorName}</p>
                                                                    <p className="text-xs text-gray-400">{comment.createdAt ? new Date(comment.createdAt?.toDate()).toLocaleTimeString() : ''}</p>
                                                                </div>
                                                                <p className="text-gray-300">{comment.text}</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                            <div className="mt-4 flex gap-2 flex-shrink-0">
                                                <input type="text" value={commentInput} onChange={(e) => setCommentInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddComment()} placeholder={currentUserRole === 'scout' ? "Scouts can only observe" : "Your message..."} className="flex-1 p-3 bg-gray-700 rounded-lg text-white" disabled={currentUserRole === 'scout' || isCompleted} />
                                                <button onClick={handleAddComment} disabled={currentUserRole === 'scout' || isCompleted || !commentInput.trim()} className="px-4 py-3 bg-blue-800 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                                                    <Send className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Panel>
                        </PanelGroup>
                    </Panel>
                </PanelGroup>
            </div>
            {showShareModal && (
                <ShareAchievementModal
                    isOpen={showShareModal}
                    onClose={() => setShowShareModal(false)}
                    achievement={{
                        name: quest.name,
                        description: `I've completed the "${quest.name}" quest!`,
                    }}
                    shareUrls={{
                        linkedIn: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(`Achievement Unlocked: ${quest.name}`)}&summary=${encodeURIComponent(`I just completed the "${quest.name}" quest and earned valuable rewards!`)}&source=${encodeURIComponent(window.location.origin)}`,
                        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`I just unlocked the "${quest.name}" achievement in my founder journey! #gamification #startup`)}`
                    }}
                />
            )}
            {completionData && (
                <QuestCompletionModal
                    isOpen={showCompletionModal}
                    onClose={handleModalClose}
                    questName={quest.name}
                    rating={completionData.rating}
                    feedback={completionData.feedback}
                    improvementFeedback={completionData.improvementFeedback}
                    xpReward={completionData.xpReward}
                    goldReward={completionData.goldReward}
                />
            )}
        </div>
    );
}