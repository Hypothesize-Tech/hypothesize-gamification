import { Suspense, useEffect, useRef, useState } from "react";
import { QUEST_INPUT_TEMPLATES } from "../utils/constant";
import { calculateGoldReward, calculateLevel, calculateXPWithBonuses, consultAISage, fetchDynamicResources, getSuggestedSageQuestions, rateQuestSubmission, triggerConfetti } from "../utils/helper";
import { Canvas } from "@react-three/fiber";
import DiamondSword3D from "./DiamondSword3D";
import { BookOpen, Coins, Edit3, ExternalLink, Loader2, MessageCircle, RefreshCw, Save, Scroll, Send, Sparkles, Swords, Trophy, X } from "lucide-react";
import ReactMarkdown from 'react-markdown';

export const FourPanelQuestInterface = ({
    quest,
    guildData,
    ceoAvatar,
    onComplete,
    onClose,
    saveConversation,
    updateGold,
    soundManager,
    awsModelId,
    bedrockClient
}: {
    quest: any;
    guildData: any;
    ceoAvatar: any;
    onComplete: (questData: any) => void;
    onClose: () => void;
    saveConversation: (quest: any, question: string, response: string) => Promise<void>;
    updateGold: (amount: number) => Promise<void>;
    soundManager: any;
    awsModelId: string;
    bedrockClient: any;
}) => {
    const questKey = `${quest.stageId}_${quest.id}`;
    const questProgress = guildData?.questProgress?.[questKey];
    const isCompleted = !!questProgress?.completed;

    const [sageMessages, setSageMessages] = useState<Array<{ type: 'user' | 'sage', content: string }>>(isCompleted ? (questProgress?.sageConversation || []) : []);
    const [sageInput, setSageInput] = useState('');
    const [sageLoading, setSageLoading] = useState(false);
    const [userInputs, setUserInputs] = useState<Record<string, string>>(isCompleted ? (questProgress?.inputs || {}) : {});
    const [isSaving, setIsSaving] = useState(false);
    const [dynamicResources, setDynamicResources] = useState<any[]>([]);
    const [resourcesLoading, setResourcesLoading] = useState(true);
    const [rating, setRating] = useState<any>(isCompleted ? { rating: questProgress?.rating, feedback: questProgress?.feedback } : null);

    useEffect(() => {
        if (isCompleted) {
            setUserInputs(questProgress?.inputs || {});
            setSageMessages(questProgress?.sageConversation || []);
            setRating({ rating: questProgress?.rating, feedback: questProgress?.feedback });
        }
        // eslint-disable-next-line
    }, [questKey]);

    const inputTemplate = QUEST_INPUT_TEMPLATES[quest.id as keyof typeof QUEST_INPUT_TEMPLATES];

    const handleSageChat = async () => {
        if (isCompleted) return; // Prevent chat if completed
        if (!sageInput.trim()) return;

        if (guildData.gold < 20) {
            soundManager.play('error');
            alert('Not enough gold! Ye need 20 gold coins to consult the Oracle.');
            return;
        }

        const userMessage = sageInput;
        setSageInput('');
        setSageMessages(prev => [...prev, { type: 'user', content: userMessage }]);
        setSageLoading(true);

        try {
            await updateGold(-20);
            soundManager.play('magicCast');

            const response = await consultAISage(
                `Quest: ${quest.name} - ${quest.description}. Seeker's progress: ${JSON.stringify(userInputs)}`,
                userMessage,
                { ...guildData, ceoAvatar },
                awsModelId,
                bedrockClient
            );

            setSageMessages(prev => [...prev, { type: 'sage', content: response }]);
            await saveConversation(quest, userMessage, response);
        } catch (error) {
            setSageMessages(prev => [...prev, {
                type: 'sage',
                content: 'The Oracle\'s power wanes. Thy gold has been returned.'
            }]);
            await updateGold(20);
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
        }, guildData, awsModelId, bedrockClient);

        setRating(questRating);

        const questData = {
            inputs: userInputs,
            sageConversation: sageMessages,
            completedAt: new Date().toISOString(),
            rating: questRating.rating,
            feedback: questRating.feedback,
            xpReward: calculateXPWithBonuses(quest.xp, questRating.rating, quest.attribute || 'general', guildData),
            goldReward: calculateGoldReward(quest.xp / 2, questRating.rating, guildData)
        };

        await onComplete({ ...questData });
        soundManager.play('questComplete');
        triggerConfetti();
        setIsSaving(false);
    };

    const levelInfo = calculateLevel(guildData?.xp || 0);
    const suggestedQuestions = getSuggestedSageQuestions({ quest, guildData, guildLevel: levelInfo });
    const sageInputRef = useRef<HTMLInputElement>(null);

    // New: handle suggested question click
    const handleSuggestedSageQuestion = async (question: string) => {
        if (isCompleted || sageLoading) return;
        setSageLoading(true);
        setSageMessages(prev => [...prev, { type: 'user', content: question }]);
        try {
            await updateGold(-20);
            soundManager.play('magicCast');
            const response = await consultAISage(
                `Quest: ${quest.name} - ${quest.description}. Seeker's progress: ${JSON.stringify(userInputs)}`,
                question,
                { ...guildData, ceoAvatar },
                awsModelId,
                bedrockClient
            );
            setSageMessages(prev => [...prev, { type: 'sage', content: response }]);
            await saveConversation(quest, question, response);
        } catch (error) {
            setSageMessages(prev => [...prev, {
                type: 'sage',
                content: 'The Oracle\'s power wanes. Thy gold has been returned.'
            }]);
            await updateGold(20);
        } finally {
            setSageLoading(false);
        }
    };

    // Utility to chunk array into rows of 2
    function chunkArray<T>(arr: T[], size: number): T[][] {
        const result: T[][] = [];
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    }

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
            {/* 3D Weapon Display */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-32 h-32 z-10">
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <Suspense fallback={null}>
                        <DiamondSword3D standingRotation={{ x: 0, y: 0, z: Math.PI / 2 }} />
                    </Suspense>
                </Canvas>
            </div>

            {/* Header */}
            <div className="parchment border-b border-yellow-700 px-6 py-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Swords className="w-6 h-6 text-yellow-500" />
                        <div>
                            <h2 className="text-2xl font-bold text-yellow-100">{quest.name}</h2>
                            <p className="text-sm text-gray-300">{quest.description} • {quest.xp} XP</p>
                            {isCompleted && (
                                <div className="mt-1 flex items-center space-x-2">
                                    <span className="px-2 py-0.5 bg-green-700/80 text-xs text-green-100 rounded-full font-semibold">Completed</span>
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
            <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4 p-6 overflow-hidden">
                {/* Top Left - Quest Details */}
                <div className="parchment p-6 flex flex-col overflow-hidden">
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
                                <li>Ask the Oracle for advice (20 gold per question)</li>
                                <li>Review the resources</li>
                                <li>Record your progress</li>
                            </ul>
                        </div>

                        <div className="parchment p-4">
                            <h4 className="font-semibold mb-2 text-yellow-100">Rewards</h4>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <Sparkles className="w-5 h-5 text-yellow-500" />
                                        <span>Base: {quest.xp} XP</span>
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

                {/* Top Right - Input Section */}
                <div className="parchment p-6 flex flex-col overflow-hidden">
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
                                        <span>{isCompleted ? 'Quest Completed' : 'Complete Quest'}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Left - Dynamic Resources Library */}
                <div className="parchment p-6 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between mb-4 flex-shrink-0">
                        <div className="flex items-center">
                            <BookOpen className="w-5 h-5 text-green-500 mr-2" />
                            <h3 className="text-lg font-bold text-yellow-100">Ancient Grimoire</h3>
                        </div>
                        {!resourcesLoading && (
                            <button
                                onClick={async () => {
                                    setResourcesLoading(true);
                                    const resources = await fetchDynamicResources(quest.name, quest.description, awsModelId, bedrockClient);
                                    setDynamicResources(resources);
                                    setResourcesLoading(false);
                                }}
                                className="text-gray-400 hover:text-white transition-colors"
                                title="Refresh resources"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="space-y-3 overflow-y-auto flex-1 pr-2">
                        {resourcesLoading ? (
                            <div className="text-center py-8">
                                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-500" />
                                <p className="text-gray-400">Loading resources...</p>
                            </div>
                        ) : dynamicResources.length > 0 ? (
                            <>
                                {dynamicResources.map((resource, index) => (
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

                {/* Bottom Right - AI Sage Chat */}
                <div className="parchment p-6 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between mb-4 flex-shrink-0">
                        <div className="flex items-center">
                            <Sparkles className="w-5 h-5 text-purple-500 mr-2" />
                            <h3 className="text-lg font-bold text-yellow-100">Assistant Chat</h3>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                            <Coins className="w-4 h-4 text-yellow-500" />
                            <span className="font-medium text-yellow-100">20 gold per response</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2">
                        {sageMessages.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>Ask a question to the Assistant</p>
                                <p className="text-sm mt-2">Each response requires 20 gold coins</p>
                            </div>
                        ) : (
                            sageMessages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`${message.type === 'user' ? 'text-right' : 'text-left'}`}
                                >
                                    <div
                                        className={`inline-block max-w-[80%] p-3 rounded-lg ${message.type === 'user'
                                            ? 'bg-purple-800 text-white'
                                            : 'parchment text-gray-100'
                                            }`}
                                    >
                                        {message.type === 'sage' ? (
                                            <ReactMarkdown>{message.content}</ReactMarkdown>
                                        ) : (
                                            <p>{message.content}</p>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                        {sageLoading && (
                            <div className="text-left">
                                <div className="inline-block parchment rounded-lg p-3">
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                                        <span className="text-sm">The Assistant is processing your request...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Suggested Questions */}
                    {!isCompleted && !sageLoading && suggestedQuestions.length > 0 && (
                        <div className="mb-3 flex flex-col gap-2">
                            {chunkArray(suggestedQuestions, 2).map((row, rowIndex) => (
                                <div key={rowIndex} className="flex gap-2">
                                    {row.map((q: string, i: number) => (
                                        <button
                                            key={i}
                                            type="button"
                                            className="flex-1 px-3 py-1 bg-purple-900/70 text-purple-200 rounded-full text-xs hover:bg-purple-700 hover:text-white transition-all border border-purple-700 disabled:opacity-50"
                                            onClick={() => handleSuggestedSageQuestion(q)}
                                            disabled={sageLoading}
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="flex space-x-2 flex-shrink-0">
                        <input
                            type="text"
                            value={sageInput}
                            onChange={(e) => setSageInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSageChat()}
                            placeholder="Ask the Assistant a question..."
                            className="flex-1 p-3 bg-gray-700 rounded-lg text-white"
                            disabled={sageLoading || isCompleted}
                            ref={sageInputRef}
                        />
                        <button
                            onClick={handleSageChat}
                            disabled={sageLoading || !sageInput.trim() || guildData.gold < 20 || isCompleted}
                            className="px-4 py-3 bg-purple-800 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            title={guildData.gold < 20 ? 'Insufficient gold coins' : ''}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};