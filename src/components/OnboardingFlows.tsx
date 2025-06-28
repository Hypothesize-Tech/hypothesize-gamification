// Complete Onboarding System with Exact Messaging

import React, { useState, useEffect } from 'react';
import { Upload, Mail, Zap, Coins, Users } from 'lucide-react';

// FOUNDER ONBOARDING COMPONENT
const FounderOnboarding: React.FC<{
    onComplete: (data: any) => void;
    user: any;
}> = ({ onComplete, user }) => {
    const [step, setStep] = useState(0);
    const [onboardingData, setOnboardingData] = useState<any>({});
    const [vision, setVision] = useState('');

    // Use user prop to prefill name if available
    useEffect(() => {
        if (user && user.name && !onboardingData.name) {
            setOnboardingData((prev: any) => ({ ...prev, name: user.name }));
        }
        if (user && user.gender && !onboardingData.gender) {
            setOnboardingData((prev: any) => ({ ...prev, gender: user.gender }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const updateData = (key: string, value: any) => {
        setOnboardingData({ ...onboardingData, [key]: value });
    };

    const FOUNDER_ROLES = [
        {
            id: 'engineer',
            name: 'The Engineer',
            description: 'The builder of things, focused on product and technology.',
            attribute: 'Tech',
            sageResponse: "An Engineer. You see the world as a set of systems to be built and improved. Your path will be one of logic, creation, and technological excellence. Your 'Tech' attribute has received a bonus."
        },
        {
            id: 'herald',
            name: 'The Herald',
            description: 'The storyteller, focused on marketing and brand.',
            attribute: 'Marketing',
            sageResponse: "A Herald. You believe that a great story can change the world. Your path will be one of communication, brand-building, and connecting with your future customers. Your 'Marketing' attribute has received a bonus."
        },
        {
            id: 'vanguard',
            name: 'The Vanguard',
            description: 'The deal-maker, focused on sales and revenue.',
            attribute: 'Sales',
            sageResponse: "A Vanguard. You stand at the forefront, forging relationships and driving growth. Your path will be one of persuasion, negotiation, and building revenue. Your 'Sales' attribute has received a bonus."
        },
        {
            id: 'loremaster',
            name: 'The Loremaster',
            description: 'The strategist, focused on law and market knowledge.',
            attribute: 'Legal',
            sageResponse: "A Loremaster. You understand that knowledge is power and strategy is the key to victory. Your path will be one of careful planning, compliance, and strategic positioning. Your 'Legal' attribute has received a bonus."
        },
        {
            id: 'quartermaster',
            name: 'The Quartermaster',
            description: 'The organizer, focused on operations and efficiency.',
            attribute: 'Operations',
            sageResponse: "A Quartermaster. You know that an idea is only as strong as its execution. Your path will be one of organization, efficiency, and flawless operations. Your 'Operations' attribute has received a bonus."
        },
        {
            id: 'treasurer',
            name: 'The Treasurer',
            description: 'The financier, focused on capital and financial health.',
            attribute: 'Finance',
            sageResponse: "A Treasurer. You see the numbers behind the vision, managing the lifeblood of the venture. Your path will be one of financial prudence, investment, and sustainable growth. Your 'Finance' attribute has received a bonus."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-3xl w-full">

                {/* Step 1: Welcome & Identity */}
                {step === 0 && (
                    <>
                        <div className="text-center mb-8">
                            <div className="text-8xl mb-6">🧙‍♂️</div>
                            <h2 className="text-3xl font-bold text-white mb-6">Welcome, Founder</h2>
                        </div>

                        <div className="text-gray-300 mb-8 space-y-4 leading-relaxed">
                            <p>I am <span className="text-purple-400 font-semibold">Tenzing</span>, your guide on the path from idea to impact. The journey you are about to embark on is challenging, filled with uncertainty and difficult decisions. Many have walked it, but no two paths are the same.</p>
                            <p>My purpose is to help you navigate it. But first, let's get to know the person behind the vision.</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-lg font-medium text-white mb-3">What shall I call you? How do you identify?</label>
                                <input
                                    type="text"
                                    value={onboardingData.name || ''}
                                    onChange={(e) => updateData('name', e.target.value)}
                                    placeholder="Your preferred name"
                                    className="w-full p-4 bg-gray-700 text-white rounded-lg text-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                                    autoComplete="name"
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-white mb-3">Gender</label>
                                <select
                                    value={onboardingData.gender || ''}
                                    onChange={(e) => updateData('gender', e.target.value)}
                                    className="w-full p-4 bg-gray-700 text-white rounded-lg text-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                                >
                                    <option value="">Select your gender...</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="non-binary">Non-binary</option>
                                    <option value="prefer-not-to-say">Prefer not to say</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={() => setStep(1)}
                            disabled={!onboardingData.name || !onboardingData.gender}
                            className="w-full mt-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Continue Your Journey
                        </button>
                    </>
                )}

                {/* Step 2: Experience Background */}
                {step === 1 && (
                    <>
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4">📚</div>
                            <h3 className="text-2xl font-bold text-white mb-4">Your Journey So Far</h3>
                        </div>

                        <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                            Your past experiences are the foundation of your future success. Tell me a bit about your journey so far.
                        </p>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-lg font-medium text-white mb-3">Academics</label>
                                <p className="text-gray-400 mb-3">Select your highest level of education</p>
                                <select
                                    value={onboardingData.education || (user && user.education) || ''}
                                    onChange={(e) => updateData('education', e.target.value)}
                                    className="w-full p-4 bg-gray-700 text-white rounded-lg text-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                                >
                                    <option value="">Select your highest education...</option>
                                    <option value="high-school">High School</option>
                                    <option value="bachelors">Bachelor's Degree</option>
                                    <option value="masters">Master's Degree</option>
                                    <option value="phd">PhD</option>
                                    <option value="bootcamp">Bootcamp/Certificate</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-white mb-3">Working Experience</label>
                                <p className="text-gray-400 mb-3">Tell me about your job/work experience and what you can do</p>
                                <textarea
                                    value={onboardingData.experience || (user && user.experience) || ''}
                                    onChange={(e) => updateData('experience', e.target.value)}
                                    placeholder="Describe your professional experience, skills, and what you bring to the table..."
                                    className="w-full p-4 bg-gray-700 text-white rounded-lg h-32 resize-none border border-gray-600 focus:border-purple-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-white mb-3">Bio</label>
                                <p className="text-gray-400 mb-3">A short, one-to-two sentence bio</p>
                                <textarea
                                    value={onboardingData.bio || (user && user.bio) || ''}
                                    onChange={(e) => updateData('bio', e.target.value)}
                                    placeholder="e.g., 'I'm a software engineer turned product manager with a passion for sustainable tech.'"
                                    className="w-full p-4 bg-gray-700 text-white rounded-lg h-24 resize-none border border-gray-600 focus:border-purple-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex space-x-4 mt-8">
                            <button
                                onClick={() => setStep(0)}
                                className="flex-1 bg-gray-700 text-white px-6 py-4 rounded-lg text-lg hover:bg-gray-600 transition-all"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setStep(2)}
                                disabled={!onboardingData.education || !onboardingData.experience || !onboardingData.bio}
                                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-lg text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
                            >
                                Continue
                            </button>
                        </div>
                    </>
                )}

                {/* Step 3: Vision & Insignia */}
                {step === 2 && (
                    <>
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4">💡</div>
                            <h3 className="text-2xl font-bold text-white mb-4">The Spark</h3>
                        </div>

                        <div className="text-gray-300 mb-8 space-y-4 leading-relaxed">
                            <p>Thank you. Your experiences have shaped you into the founder you are today. Now, every great venture starts with a single spark. Let's define yours.</p>
                            <p className="text-white font-semibold">Tell me about your vision. Be concise. The best ideas can be described simply.</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-lg font-medium text-white mb-3">Your Idea</label>
                                <textarea
                                    value={vision || (user && user.vision) || ''}
                                    onChange={(e) => setVision(e.target.value)}
                                    placeholder="e.g., 'A subscription box for rare, indoor plants.'"
                                    className="w-full p-4 bg-gray-700 text-white rounded-lg h-32 resize-none border border-gray-600 focus:border-purple-500 focus:outline-none text-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-white mb-3">Create your Guild insignia (Logo)</label>
                                <div className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center hover:border-purple-500 transition-colors cursor-pointer">
                                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-400 text-lg">Upload your logo</p>
                                    <p className="text-gray-500 text-sm mt-2">Optional - you can add this later</p>
                                    <input type="file" accept="image/*" className="hidden" />
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-4 mt-8">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 bg-gray-700 text-white px-6 py-4 rounded-lg text-lg hover:bg-gray-600 transition-all"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                disabled={!vision}
                                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-lg text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
                            >
                                Continue
                            </button>
                        </div>
                    </>
                )}

                {/* Step 4: Excellence Declaration */}
                {step === 3 && (
                    <>
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4">⚡</div>
                            <h3 className="text-2xl font-bold text-white mb-4">Contributing to Excellence</h3>
                        </div>

                        <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-8 mb-8">
                            <div className="text-gray-300 space-y-4 leading-relaxed text-lg">
                                <p><span className="text-white font-semibold">Excellent.</span> An idea is a seed. Now, let's give it fertile ground to grow in.</p>
                                <p>Every contribution you make here, every challenge you overcome, helps us build a database of knowledge for all founders. You are not just building a company; you are <span className="text-purple-400 font-semibold">contributing to a legacy of innovation</span>.</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setStep(4)}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                        >
                            I Accept This Responsibility
                        </button>
                    </>
                )}

                {/* Step 5: Role Selection */}
                {step === 4 && (
                    <>
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4">🎭</div>
                            <h3 className="text-2xl font-bold text-white mb-4">Choose Your Path</h3>
                        </div>

                        <div className="text-gray-300 mb-8 space-y-4 leading-relaxed">
                            <p>Now, tell me about yourself. A founder wears many hats, but every great leader has a core strength. Your choice here will define your starting attributes and the kind of challenges you'll excel at.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {FOUNDER_ROLES.map((role) => {
                                const isSelected = onboardingData.role === role.id;

                                return (
                                    <button
                                        key={role.id}
                                        onClick={() => updateData('role', role.id)}
                                        className={`p-6 rounded-lg border-2 transition-all text-left ${isSelected
                                            ? 'border-purple-500 bg-purple-900/30'
                                            : 'border-gray-600 bg-gray-700 hover:border-purple-400'
                                            }`}
                                    >
                                        <h4 className="font-bold text-white text-lg mb-2">{role.name}</h4>
                                        <p className="text-sm text-gray-300 mb-3">{role.description}</p>
                                        <p className="text-xs text-purple-400 font-semibold">+{role.attribute} attribute bonus</p>
                                    </button>
                                );
                            })}
                        </div>

                        {onboardingData.role && (
                            <div className="bg-gray-700 rounded-lg p-6 mb-8">
                                <div className="flex items-center mb-3">
                                    <div className="text-3xl mr-3">🧙‍♂️</div>
                                    <p className="text-purple-400 font-semibold">Tenzing speaks:</p>
                                </div>
                                <p className="text-gray-300 leading-relaxed">
                                    {FOUNDER_ROLES.find(r => r.id === onboardingData.role)?.sageResponse}
                                </p>
                            </div>
                        )}

                        {onboardingData.role && (
                            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-6 mb-8">
                                <p className="text-blue-300 leading-relaxed">
                                    Because you chose the path of the <span className="font-semibold">{FOUNDER_ROLES.find(r => r.id === onboardingData.role)?.name}</span>, you have a core proficiency. This means whenever you complete a quest that matches your role—for example, a {FOUNDER_ROLES.find(r => r.id === onboardingData.role)?.attribute} quest for {FOUNDER_ROLES.find(r => r.id === onboardingData.role)?.name}—you will receive a significant XP bonus, allowing you to level up your core skill faster than others.
                                </p>
                                <p className="text-blue-300 mt-4">
                                    <span className="font-semibold">Focus on your strengths to excel, but remember that a successful founder must be well-rounded.</span> Now, let's found your Guild.
                                </p>
                            </div>
                        )}

                        <div className="flex space-x-4 mt-8">
                            <button
                                onClick={() => setStep(3)}
                                className="flex-1 bg-gray-700 text-white px-6 py-4 rounded-lg text-lg hover:bg-gray-600 transition-all"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setStep(5)}
                                disabled={!onboardingData.role}
                                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-lg text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
                            >
                                Found My Guild
                            </button>
                        </div>
                    </>
                )}

                {/* Step 6: Guild Foundation */}
                {step === 5 && (
                    <>
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4">🏰</div>
                            <h3 className="text-2xl font-bold text-white mb-4">Found Your Guild</h3>
                        </div>

                        <div className="text-gray-300 mb-8 space-y-4 leading-relaxed">
                            <p>Now, no founder is an island. The greatest ventures are built by teams—a fellowship bound by a shared vision. In this world, we call this your <span className="text-blue-400 font-semibold">Guild</span>.</p>
                            <p>Your Guild is your founding team, your inner circle. Together, you will share resources, tackle challenges, and build your stronghold, from a simple Campfire to a mighty Citadel. Let's establish yours now.</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-lg font-medium text-white mb-3">Guild Name</label>
                                <input
                                    type="text"
                                    value={onboardingData.guildName || (user && user.guildName) || ''}
                                    onChange={(e) => updateData('guildName', e.target.value)}
                                    placeholder="Your startup/guild name"
                                    className="w-full p-4 bg-gray-700 text-white rounded-lg text-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-white mb-3">Invite Members</label>
                                <p className="text-gray-400 mb-4">An interface with email input fields appears below the Guild Name.</p>
                                <p className="text-gray-300 mb-6">Invite the co-founders and team members who will join you on this quest. They will receive an email invitation to join your Guild. You can always add more members later.</p>

                                <div className="space-y-3">
                                    {[0, 1, 2, 3, 4].map((index) => (
                                        <div key={index} className="flex items-center space-x-3">
                                            <Mail className="w-5 h-5 text-gray-400" />
                                            <input
                                                type="email"
                                                placeholder={`Team member ${index + 1} email (optional)`}
                                                className="flex-1 p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                                                value={
                                                    (onboardingData.invites && onboardingData.invites[index]) ||
                                                    (user && user.invites && user.invites[index]) ||
                                                    ''
                                                }
                                                onChange={(e) => {
                                                    const invites = onboardingData.invites
                                                        ? [...onboardingData.invites]
                                                        : user && user.invites
                                                            ? [...user.invites]
                                                            : [];
                                                    invites[index] = e.target.value;
                                                    updateData('invites', invites.filter(email => email && email.trim()));
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-4 mt-8">
                            <button
                                onClick={() => setStep(4)}
                                className="flex-1 bg-gray-700 text-white px-6 py-4 rounded-lg text-lg hover:bg-gray-600 transition-all"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setStep(6)}
                                disabled={!onboardingData.guildName}
                                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-lg text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
                            >
                                Continue
                            </button>
                        </div>
                    </>
                )}

                {/* Step 7: Resources Explanation */}
                {step === 6 && (
                    <>
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4">⚡</div>
                            <h3 className="text-2xl font-bold text-white mb-4">Your Resources</h3>
                        </div>

                        <div className="text-gray-300 mb-8 space-y-4 leading-relaxed">
                            <p>Your Guild has been founded. The founder's path is not walked with passion alone; it requires resources. You have two primary resources to manage: <span className="text-blue-400 font-semibold">Energy</span> and <span className="text-yellow-400 font-semibold">Gold</span>.</p>
                        </div>

                        <div className="space-y-6 mb-8">
                            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-6">
                                <div className="flex items-center space-x-3 mb-4">
                                    <Zap className="w-8 h-8 text-blue-400" />
                                    <h4 className="font-bold text-blue-400 text-xl">Energy</h4>
                                </div>
                                <p className="text-gray-300 leading-relaxed">
                                    <span className="font-semibold">Energy is your capacity for action.</span> You will spend it to complete tasks and quests on your roadmap. Your energy replenishes by 50 points every day, so manage your time wisely.
                                </p>
                            </div>

                            <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-6">
                                <div className="flex items-center space-x-3 mb-4">
                                    <Coins className="w-8 h-8 text-yellow-400" />
                                    <h4 className="font-bold text-yellow-400 text-xl">Gold</h4>
                                </div>
                                <p className="text-gray-300 leading-relaxed">
                                    <span className="font-semibold">Gold is your currency for strategic advantage.</span> Use it to seek my advice when you are stuck, contribute to your Guild's growth, pay for its monthly upkeep, or purchase powerful Treasures. These treasures provide permanent bonuses, like reducing costs or boosting your XP gain. A wise investment can change the course of your venture.
                                </p>
                            </div>

                            <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-8 text-center">
                                <div className="text-6xl mb-4">🎁</div>
                                <h4 className="font-bold text-purple-400 text-xl mb-3">Founder's Grant</h4>
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    To begin your journey, we are awarding you a <span className="text-yellow-400 font-bold text-xl">Founder's Grant of 50 Gold</span>. Spend it wisely.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setStep(7)}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                        >
                            I Understand My Resources
                        </button>
                    </>
                )}

                {/* Step 8: The First Step */}
                {step === 7 && (
                    <>
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4">🚀</div>
                            <h3 className="text-2xl font-bold text-white mb-4">The First Step</h3>
                        </div>

                        <div className="bg-gray-700/50 rounded-lg p-8 mb-8 border-4 border-purple-500 border-dashed">
                            <div className="text-center">
                                <p className="text-gray-400 mb-4">(The main dashboard appears, slightly blurred out. The very first task on the "Fundamentals" roadmap is highlighted.)</p>
                                <div className="bg-green-900/30 border border-green-700 rounded-lg p-6">
                                    <div className="flex items-center justify-center space-x-3 mb-3">
                                        <div className="text-3xl">📊</div>
                                        <h4 className="text-xl font-bold text-green-400">Supply and Demand</h4>
                                    </div>
                                    <p className="text-gray-300">Understanding the market is the foundation upon which all great companies are built.</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 mb-8">
                            <div className="bg-gray-700 rounded-lg p-6">
                                <div className="flex items-center mb-3">
                                    <div className="text-3xl mr-3">🧙‍♂️</div>
                                    <p className="text-purple-400 font-semibold">Tenzing speaks:</p>
                                </div>
                                <div className="text-gray-300 space-y-3">
                                    <p>"Your journey begins now. Your first task is <span className="text-green-400 font-semibold">'Supply and Demand'</span>. Understanding the market is the foundation upon which all great companies are built. Click here to begin."</p>
                                </div>
                            </div>

                            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-6">
                                <div className="text-blue-300 space-y-3">
                                    <p>"Remember, you are not alone. Your Guild will be your source of strength. Together, you can pool your resources, learn from each other's victories and mistakes, and build something far greater than you could alone."</p>
                                </div>
                            </div>

                            <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-6">
                                <div className="text-purple-300 space-y-3">
                                    <p>"Your every action is now being chronicled in your venture's private journey log. It will become your story, your case study."</p>
                                </div>
                            </div>

                            <div className="bg-gray-700 rounded-lg p-6">
                                <div className="flex items-center mb-3">
                                    <div className="text-3xl mr-3">🧙‍♂️</div>
                                    <p className="text-purple-400 font-semibold">Final words:</p>
                                </div>
                                <div className="text-gray-300">
                                    <p>"The road is long, but it starts with this single step. I will be here if you need guidance. Good luck, <span className="text-white font-semibold">{onboardingData.name || (user && user.name)}</span>."</p>
                                    <p className="text-gray-400 text-sm mt-3">(The Sage avatar fades away, leaving the user on their main dashboard, ready to engage with their first task. The onboarding is complete.)</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => onComplete({
                                ...onboardingData,
                                vision: vision || (user && user.vision),
                                isFounder: true,
                                type: 'founder',
                                user
                            })}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-lg text-xl font-bold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
                        >
                            Begin My Quest
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

// MEMBER ONBOARDING COMPONENT
const MemberOnboarding: React.FC<{
    onComplete: (data: any) => void;
    onDecline: () => void;
    inviteData: any;
    user: any;
}> = ({ onComplete, onDecline, inviteData, user }) => {
    const [step, setStep] = useState(0);
    const [onboardingData, setOnboardingData] = useState<any>({});

    // Use user prop to prefill name/gender/education/experience/bio if available
    useEffect(() => {
        if (user) {
            setOnboardingData((prev: any) => ({
                ...prev,
                name: prev.name || user.name,
                gender: prev.gender || user.gender,
                education: prev.education || user.education,
                experience: prev.experience || user.experience,
                bio: prev.bio || user.bio,
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const updateData = (key: string, value: any) => {
        setOnboardingData({ ...onboardingData, [key]: value });
    };

    const FOUNDER_ROLES = [
        {
            id: 'engineer',
            name: 'The Engineer',
            description: 'The builder of things, focused on product and technology.',
            attribute: 'Tech',
            sageResponse: "An Engineer. You see the world as a set of systems to be built and improved. Your path will be one of logic, creation, and technological excellence. Your 'Tech' attribute has received a bonus."
        },
        {
            id: 'herald',
            name: 'The Herald',
            description: 'The storyteller, focused on marketing and brand.',
            attribute: 'Marketing',
            sageResponse: "A Herald. You believe that a great story can change the world. Your path will be one of communication, brand-building, and connecting with your future customers. Your 'Marketing' attribute has received a bonus."
        },
        {
            id: 'vanguard',
            name: 'The Vanguard',
            description: 'The deal-maker, focused on sales and revenue.',
            attribute: 'Sales',
            sageResponse: "A Vanguard. You stand at the forefront, forging relationships and driving growth. Your path will be one of persuasion, negotiation, and building revenue. Your 'Sales' attribute has received a bonus."
        },
        {
            id: 'loremaster',
            name: 'The Loremaster',
            description: 'The strategist, focused on law and market knowledge.',
            attribute: 'Legal',
            sageResponse: "A Loremaster. You understand that knowledge is power and strategy is the key to victory. Your path will be one of careful planning, compliance, and strategic positioning. Your 'Legal' attribute has received a bonus."
        },
        {
            id: 'quartermaster',
            name: 'The Quartermaster',
            description: 'The organizer, focused on operations and efficiency.',
            attribute: 'Operations',
            sageResponse: "A Quartermaster. You know that an idea is only as strong as its execution. Your path will be one of organization, efficiency, and flawless operations. Your 'Operations' attribute has received a bonus."
        },
        {
            id: 'treasurer',
            name: 'The Treasurer',
            description: 'The financier, focused on capital and financial health.',
            attribute: 'Finance',
            sageResponse: "A Treasurer. You see the numbers behind the vision, managing the lifeblood of the venture. Your path will be one of financial prudence, investment, and sustainable growth. Your 'Finance' attribute has received a bonus."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-3xl w-full">

                {/* Step 1: Invitation */}
                {step === 0 && (
                    <>
                        <div className="text-center mb-8">
                            <div className="text-8xl mb-6">🧙‍♂️</div>
                            <h2 className="text-3xl font-bold text-white mb-6">Welcome, traveler</h2>
                        </div>

                        <div className="text-gray-300 mb-8 space-y-4 leading-relaxed text-lg">
                            <p>A quest is underway, and your presence has been requested. It is not a small thing to be called upon to help shape an idea into reality.</p>
                        </div>

                        <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-8 mb-8">
                            <div className="text-center space-y-4">
                                <p className="text-white text-xl">
                                    <span className="text-purple-400 font-semibold">{inviteData.founderName}</span> has invited you to join the
                                    <span className="text-blue-400 font-semibold"> '{inviteData.guildName}' </span>Guild.
                                </p>
                                <div className="bg-gray-700/50 rounded-lg p-4">
                                    <p className="text-gray-300 mb-2">They have begun a venture to create:</p>
                                    <p className="text-green-400 font-semibold text-lg">"{inviteData.ventureIdea}"</p>
                                </div>
                                <p className="text-gray-300">
                                    They believe your skills are vital to this quest. Do you accept the call?
                                </p>
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                onClick={onDecline}
                                className="flex-1 bg-gray-700 text-white px-6 py-4 rounded-lg text-lg hover:bg-gray-600 transition-all"
                            >
                                Decline
                            </button>
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-lg text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                            >
                                I Accept the Call
                            </button>
                        </div>
                    </>
                )}

                {/* Step 2: Profile Creation */}
                {step === 1 && (
                    <>
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4">📋</div>
                            <h3 className="text-2xl font-bold text-white mb-4">Create Your Profile</h3>
                        </div>

                        <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                            Excellent. Every member of a fellowship brings their own unique history. Let's create your profile so your Guild members know who you are.
                        </p>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-lg font-medium text-white mb-3">Name</label>
                                <input
                                    type="text"
                                    value={onboardingData.name || ''}
                                    onChange={(e) => updateData('name', e.target.value)}
                                    placeholder="Your preferred name"
                                    className="w-full p-4 bg-gray-700 text-white rounded-lg text-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                                    autoComplete="name"
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-white mb-3">Gender</label>
                                <select
                                    value={onboardingData.gender || ''}
                                    onChange={(e) => updateData('gender', e.target.value)}
                                    className="w-full p-4 bg-gray-700 text-white rounded-lg text-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                                >
                                    <option value="">Select your gender...</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="non-binary">Non-binary</option>
                                    <option value="prefer-not-to-say">Prefer not to say</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-white mb-3">Academics</label>
                                <select
                                    value={onboardingData.education || ''}
                                    onChange={(e) => updateData('education', e.target.value)}
                                    className="w-full p-4 bg-gray-700 text-white rounded-lg text-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                                >
                                    <option value="">Select your highest education...</option>
                                    <option value="high-school">High School</option>
                                    <option value="bachelors">Bachelor's Degree</option>
                                    <option value="masters">Master's Degree</option>
                                    <option value="phd">PhD</option>
                                    <option value="bootcamp">Bootcamp/Certificate</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-white mb-3">Working Experience</label>
                                <textarea
                                    value={onboardingData.experience || ''}
                                    onChange={(e) => updateData('experience', e.target.value)}
                                    placeholder="Tell me about your job/work experience and what you can do..."
                                    className="w-full p-4 bg-gray-700 text-white rounded-lg h-32 resize-none border border-gray-600 focus:border-purple-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-white mb-3">Bio</label>
                                <textarea
                                    value={onboardingData.bio || ''}
                                    onChange={(e) => updateData('bio', e.target.value)}
                                    placeholder="A short, one-to-two sentence bio..."
                                    className="w-full p-4 bg-gray-700 text-white rounded-lg h-24 resize-none border border-gray-600 focus:border-purple-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex space-x-4 mt-8">
                            <button
                                onClick={() => setStep(0)}
                                className="flex-1 bg-gray-700 text-white px-6 py-4 rounded-lg text-lg hover:bg-gray-600 transition-all"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setStep(2)}
                                disabled={!onboardingData.name || !onboardingData.gender || !onboardingData.education || !onboardingData.experience || !onboardingData.bio}
                                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-lg text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
                            >
                                Continue
                            </button>
                        </div>
                    </>
                )}

                {/* Step 3: Role Selection */}
                {step === 2 && (
                    <>
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4">⚔️</div>
                            <h3 className="text-2xl font-bold text-white mb-4">Your Unique Contribution</h3>
                        </div>

                        <div className="text-gray-300 mb-8 space-y-4 leading-relaxed">
                            <p>Now for the most important question. Your founder, <span className="text-purple-400 font-semibold">{inviteData.founderName}</span>, leads this quest as a <span className="text-blue-400 font-semibold">{inviteData.founderRole}</span>. To succeed, they need a balanced team.</p>
                            <p className="text-white font-semibold">What unique skills and perspective do you bring to this idea?</p>
                            <p>Review these roles and choose the one that best represents your contribution to the '<span className="text-blue-400">{inviteData.guildName}</span>' Guild. Your choice will define your core proficiency and how you can best support the team.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {FOUNDER_ROLES.map((role) => {
                                const isSelected = onboardingData.role === role.id;

                                return (
                                    <button
                                        key={role.id}
                                        onClick={() => updateData('role', role.id)}
                                        className={`p-6 rounded-lg border-2 transition-all text-left ${isSelected
                                            ? 'border-purple-500 bg-purple-900/30'
                                            : 'border-gray-600 bg-gray-700 hover:border-purple-400'
                                            }`}
                                    >
                                        <h4 className="font-bold text-white text-lg mb-2">{role.name}</h4>
                                        <p className="text-sm text-gray-300 mb-3">{role.description}</p>
                                        <p className="text-xs text-purple-400 font-semibold">+{role.attribute} attribute bonus</p>
                                    </button>
                                );
                            })}
                        </div>

                        {onboardingData.role && (
                            <div className="bg-gray-700 rounded-lg p-6 mb-8">
                                <div className="flex items-center mb-3">
                                    <div className="text-3xl mr-3">🧙‍♂️</div>
                                    <p className="text-purple-400 font-semibold">Tenzing speaks:</p>
                                </div>
                                <p className="text-gray-300 leading-relaxed mb-4">
                                    {FOUNDER_ROLES.find(r => r.id === onboardingData.role)?.sageResponse}
                                </p>
                                <p className="text-blue-300">
                                    Because you chose the path of the <span className="font-semibold">{FOUNDER_ROLES.find(r => r.id === onboardingData.role)?.name}</span>, you have a core proficiency. This means whenever you complete a quest that matches your role—for example, a {FOUNDER_ROLES.find(r => r.id === onboardingData.role)?.attribute} quest for {FOUNDER_ROLES.find(r => r.id === onboardingData.role)?.name}—you will receive a significant XP bonus, allowing you to level up your core skill faster than others.
                                </p>
                            </div>
                        )}

                        <div className="flex space-x-4 mt-8">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 bg-gray-700 text-white px-6 py-4 rounded-lg text-lg hover:bg-gray-600 transition-all"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                disabled={!onboardingData.role}
                                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-lg text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
                            >
                                Continue
                            </button>
                        </div>
                    </>
                )}

                {/* Step 4: Resources & Welcome */}
                {step === 3 && (
                    <>
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4">⚡</div>
                            <h3 className="text-2xl font-bold text-white mb-4">Your Resources</h3>
                        </div>

                        <div className="text-gray-300 mb-8 space-y-4 leading-relaxed">
                            <p>Though you join a quest in progress, your start is no less important. You will also need resources to make your mark.</p>
                        </div>

                        <div className="space-y-6 mb-8">
                            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-6">
                                <div className="flex items-center space-x-3 mb-4">
                                    <Zap className="w-8 h-8 text-blue-400" />
                                    <h4 className="font-bold text-blue-400 text-xl">Energy</h4>
                                </div>
                                <p className="text-gray-300 leading-relaxed">
                                    <span className="font-semibold">Energy is your capacity for action.</span> You will spend it to complete tasks and help the Guild advance. It replenishes daily.
                                </p>
                            </div>

                            <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-6">
                                <div className="flex items-center space-x-3 mb-4">
                                    <Users className="w-8 h-8 text-yellow-400" />
                                    <h4 className="font-bold text-yellow-400 text-xl">Guild Vault</h4>
                                </div>
                                <p className="text-gray-300 leading-relaxed">
                                    <span className="font-semibold">The Guild Vault holds all of the team's Gold.</span> This shared resource is used for major expenses, like upgrading your headquarters, paying monthly upkeep, or acquiring powerful Treasures that benefit the entire Guild.
                                </p>
                            </div>

                            <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-8 text-center">
                                <div className="text-6xl mb-4">🎁</div>
                                <h4 className="font-bold text-purple-400 text-xl mb-3">Starting Grant</h4>
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    To build this shared wealth, we are granting a <span className="text-yellow-400 font-bold text-xl">Starting Grant of 50 Gold</span> on your behalf, which will be deposited directly into your Guild's Vault.
                                </p>
                            </div>

                            <div className="bg-green-900/30 border border-green-700 rounded-lg p-6 text-center">
                                <p className="text-green-300 text-lg">
                                    <span className="font-semibold">The Vault has been credited. You have a full bar of 50 Energy.</span>
                                </p>
                                <p className="text-white text-xl font-bold mt-2">Welcome to the fellowship!</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setStep(4)}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                        >
                            I Understand My Resources
                        </button>
                    </>
                )}

                {/* Step 5: Welcome to Guild */}
                {step === 4 && (
                    <>
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4">🏰</div>
                            <h3 className="text-2xl font-bold text-white mb-4">Welcome to the Guild</h3>
                        </div>

                        <div className="bg-gray-700/50 rounded-lg p-8 mb-8 border-4 border-purple-500 border-dashed">
                            <p className="text-gray-400 mb-4 text-center">(The main dashboard appears. It is not on the first task, but on the task the Guild is currently focused on. A welcome message is displayed.)</p>
                        </div>

                        <div className="space-y-6 mb-8">
                            <div className="bg-gray-700 rounded-lg p-6">
                                <div className="flex items-center mb-3">
                                    <div className="text-3xl mr-3">🧙‍♂️</div>
                                    <p className="text-purple-400 font-semibold">Tenzing speaks:</p>
                                </div>
                                <div className="text-gray-300 space-y-3">
                                    <p>"Welcome to the '<span className="text-blue-400 font-semibold">{inviteData.guildName}</span>' Guild, <span className="text-white font-semibold">{FOUNDER_ROLES.find(r => r.id === onboardingData.role)?.name || (user && user.role && FOUNDER_ROLES.find(r => r.id === user.role)?.name)}</span>."</p>
                                </div>
                            </div>

                            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-6">
                                <div className="text-blue-300 space-y-3">
                                    <p>"Your team is currently focused on the '<span className="text-green-400 font-semibold">{inviteData.currentStage}</span>' stage. Your immediate priority is to contribute your skills to the task at hand: '<span className="text-yellow-400 font-semibold">{inviteData.currentTask}</span>'."</p>
                                </div>
                            </div>

                            <div className="bg-gray-700 rounded-lg p-6">
                                <div className="flex items-center mb-3">
                                    <div className="text-3xl mr-3">🧙‍♂️</div>
                                    <p className="text-purple-400 font-semibold">Final guidance:</p>
                                </div>
                                <div className="text-gray-300">
                                    <p>"Review the progress your Guild has made, coordinate with your fellow members, and lend your strength to the mission. Your journey as part of this fellowship begins now."</p>
                                    <p className="text-gray-400 text-sm mt-3">(The Alchemist avatar fades away, leaving the user on their Guild's shared dashboard, ready to collaborate. The onboarding is complete.)</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => onComplete({
                                ...onboardingData,
                                isFounder: false,
                                type: 'member',
                                inviteData,
                                user
                            })}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-lg text-xl font-bold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
                        >
                            Join the Guild
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

// EXPORT COMPONENTS
export { FounderOnboarding, MemberOnboarding };