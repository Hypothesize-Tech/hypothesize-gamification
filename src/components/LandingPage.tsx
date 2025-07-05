import React, { useRef, useState, useEffect } from 'react';
import { sendEmail } from '../services/api';
import heroSectionBg from '../assets/hero-section.png';
import questWindow from '../assets/quest-window.png';
import guildActivity from '../assets/activity.png';
import guildQuest from '../assets/four-panel.png';
import tenzing from '../assets/ai_sage.png';

const LandingPage: React.FC = () => {
    // Refs for form fields
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const companyRef = useRef<HTMLInputElement>(null);
    const messageRef = useRef<HTMLTextAreaElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [showIndianPricing, setShowIndianPricing] = useState(false);
    const [isPricingLoading, setIsPricingLoading] = useState(true);

    useEffect(() => {
        const fetchLocationAndSetPricing = async () => {
            setIsPricingLoading(true);
            try {
                // Using a free geo-IP service to determine country.
                const response = await fetch('https://ipapi.co/json/');
                if (!response.ok) {
                    throw new Error('Failed to fetch location');
                }
                const data = await response.json();
                if (data.country_code === 'IN') {
                    setShowIndianPricing(true);
                } else {
                    setShowIndianPricing(false);
                }
            } catch (error) {
                console.error('Error fetching location:', error);
                // Default to global pricing on error
                setShowIndianPricing(false);
            } finally {
                setIsPricingLoading(false);
            }
        };

        fetchLocationAndSetPricing();
    }, []);

    // Handler to send contact form through backend API
    const handleSendCrow = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage(null);

        const name = nameRef.current?.value.trim() || '';
        const email = emailRef.current?.value.trim() || '';
        const company = companyRef.current?.value.trim() || '';
        const message = messageRef.current?.value.trim() || '';

        // Compose subject and body
        const subject = `Contact from The Startup Quest: ${company ? company : name ? name : 'New Inquiry'}`;

        let body = '';
        if (name) body += `Name: ${name}\n`;
        if (email) body += `Email: ${email}\n`;
        if (company) body += `Company: ${company}\n`;
        if (message) body += `\nMessage:\n${message}\n`;

        try {
            // Send email through backend API
            await sendEmail('hello@hypothesize.tech', subject, body);

            // Clear form fields
            if (nameRef.current) nameRef.current.value = '';
            if (emailRef.current) emailRef.current.value = '';
            if (companyRef.current) companyRef.current.value = '';
            if (messageRef.current) messageRef.current.value = '';

            setSubmitMessage({
                type: 'success',
                text: 'Your message has been sent successfully! We will get back to you soon.'
            });
        } catch (error) {
            console.error('Error sending message:', error);
            setSubmitMessage({
                type: 'error',
                text: 'Failed to send your message. Please try again later.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="scroll-smooth">
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-amber-50/90 border-b border-amber-200/50 shadow-sm"



            >
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <a href="#" className="text-3xl font-cinzel font-bold text-amber-900 hover:text-amber-700 transition-colors">
                        The Startup Quest
                    </a>
                    <div className="hidden md:flex space-x-8 text-lg">
                        <a href="#gameplay" className="text-amber-800 hover:text-amber-600 transition-colors font-medium">Gameplay</a>
                        <a href="#pricing" className="text-amber-800 hover:text-amber-600 transition-colors font-medium">The Treasury</a>
                        <a href="#ai-sage" className="text-amber-800 hover:text-amber-600 transition-colors font-medium">Tenzing</a>
                        <a href="#faq" className="text-amber-800 hover:text-amber-600 transition-colors font-medium">FAQ</a>
                    </div>
                    <a href="/" className="hidden md:inline-block bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-cinzel font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                        Begin Your Quest
                    </a>
                </nav>
            </header>

            {/* Main Content */}
            <main>
                {/* Hero Section */}
                <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
                    {/* Animated Background */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroSectionBg})`, backgroundSize: 'cover', backgroundPosition: 'center', }}></div>
                        <div className="absolute inset-0 bg-black opacity-50"></div> {/* Added black overlay for depth */}
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZjEwIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

                        {/* Floating particles */}
                        <div className="absolute inset-0">
                            <div className="particle particle-1"></div>
                            <div className="particle particle-2"></div>
                            <div className="particle particle-3"></div>
                            <div className="particle particle-4"></div>
                        </div>
                    </div>

                    {/* Hero Content */}
                    <div className="relative z-10 container mx-auto px-6 text-center">
                        <div className="flex flex-col md:flex-row items-center justify-start">
                            <div className="md:w-1/2 mb-8 md:mb-0">
                                <h1 className="text-6xl md:text-8xl font-cinzel font-black text-white mb-6 animate-fade-in-up" style={{ textShadow: '3px 3px 6px rgba(0, 0, 0, 0.7)' }}>
                                    Forge Your Legacy
                                </h1>
                                <p className="text-xl md:text-2xl text-amber-100 max-w-3xl mx-auto mb-12 animate-fade-in-up animation-delay-200">
                                    The Startup Quest provides an engaging, gamified roadmap based on a successful, real-world venture-building process. We break down this complicated process of building your startup into a clear sequence of manageable quests, so you can focus your energy on what truly matters: bringing your idea to life.
                                </p>
                                <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-up animation-delay-400">
                                    <a href="/" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-cinzel font-bold py-4 px-10 rounded-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 w-full sm:w-auto">
                                        Start Your Quest
                                    </a>
                                    <a href="/" className="bg-white/10 backdrop-blur-sm border-2 border-amber-300/50 hover:bg-white/20 text-white font-cinzel font-bold py-4 px-10 rounded-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 w-full sm:w-auto">
                                        Resume Your Journey
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                        <svg className="w-8 h-8 text-amber-300/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                        </svg>
                    </div>
                </section>

                {/* Social Proof Section */}
                <section id="social-proof" className="py-16 bg-gradient-to-b from-amber-50 to-white">
                    <div className="container mx-auto px-6 text-center">
                        <h3 className="font-cinzel text-lg text-amber-700 tracking-widest mb-8">Trusted by hundreds of Founders Across the Realms</h3>
                        <div
                            className="flex flex-row flex-wrap justify-center items-stretch gap-6 md:gap-12"
                            style={{
                                rowGap: '1.5rem',
                                columnGap: '2.5rem',
                                width: '100%',
                                maxWidth: '1100px',
                                margin: '0 auto',
                            }}
                        >
                            <div
                                className="font-cinzel text-xl md:text-2xl text-amber-800/60 hover:text-amber-800 transition-colors"
                                style={{
                                    flex: '1 1 250px',
                                    minWidth: '220px',
                                    maxWidth: '340px',
                                    wordBreak: 'break-word',
                                    textAlign: 'center',
                                    padding: '0.5rem 1rem',
                                }}
                            >
                                <span
                                    style={{
                                        color: '#d97706', // amber-600
                                        fontWeight: 700,
                                        fontSize: '2.1rem',
                                        display: 'block',
                                        marginBottom: '0.25rem',
                                        lineHeight: 1.1,
                                    }}
                                >
                                    200+
                                </span>
                                Ventures Currently on the Platform
                            </div>
                            <div
                                className="font-cinzel text-xl md:text-2xl text-amber-800/60 hover:text-amber-800 transition-colors"
                                style={{
                                    flex: '1 1 250px',
                                    minWidth: '220px',
                                    maxWidth: '340px',
                                    wordBreak: 'break-word',
                                    textAlign: 'center',
                                    padding: '0.5rem 1rem',
                                }}
                            >
                                <span
                                    style={{
                                        color: '#d97706',
                                        fontWeight: 700,
                                        fontSize: '2.1rem',
                                        display: 'block',
                                        marginBottom: '0.25rem',
                                        lineHeight: 1.1,
                                    }}
                                >
                                    1000+
                                </span>
                                Case Studies Put into Training Tenzing
                            </div>
                            <div
                                className="font-cinzel text-xl md:text-2xl text-amber-800/60 hover:text-amber-800 transition-colors"
                                style={{
                                    flex: '1 1 250px',
                                    minWidth: '220px',
                                    maxWidth: '340px',
                                    wordBreak: 'break-word',
                                    textAlign: 'center',
                                    padding: '0.5rem 1rem',
                                }}
                            >
                                <span
                                    style={{
                                        color: '#d97706',
                                        fontWeight: 700,
                                        fontSize: '2.1rem',
                                        display: 'block',
                                        marginBottom: '0.25rem',
                                        lineHeight: 1.1,
                                    }}
                                >
                                    50+
                                </span>
                                Ventures In Finalize Stage
                            </div>
                        </div>
                    </div>
                </section>

                {/* How to Start Your Journey */}
                <section id="start-journey" className="py-24 bg-white">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-amber-900 text-center mb-16">Your Chronicle Begins...</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Step 1 */}
                            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </div>
                                <h3 className="text-2xl font-cinzel font-bold text-amber-900 mb-3 text-center">1. Define Your Idea</h3>
                                <p className="text-lg text-amber-700 text-center">The AI learns about you and your idea and customizes a unique roadmap just for you.</p>
                            </div>
                            {/* Step 2 */}
                            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                                </div>
                                <h3 className="text-2xl font-cinzel font-bold text-amber-900 mb-3 text-center">2. Choose Your Path</h3>
                                <p className="text-lg text-amber-700 text-center">Select your role, and tell the AI about what aspect of business you want to handle. The AI will guide you accordingly.</p>
                            </div>
                            {/* Step 3 */}
                            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                </div>
                                <h3 className="text-2xl font-cinzel font-bold text-amber-900 mb-3 text-center">3. Build Your Team</h3>
                                <p className="text-lg text-amber-700 text-center">Invite members with different core attributes and build your team to complete the quest together.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>

                {/* Four Phases Section */}
                <section id="phases" className="py-24 bg-gradient-to-b from-white to-amber-50">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-amber-900 text-center mb-16">The Four Chapters of Your Saga</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="group relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-amber-400/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                                <h3 className="relative text-2xl font-cinzel font-bold text-amber-900 mb-3">I. Hypothesize</h3>
                                <p className="relative text-amber-700">Discover a need in the realm. Study the landscape and forge your core belief.</p>
                            </div>
                            <div className="group relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-amber-400/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                                <h3 className="relative text-2xl font-cinzel font-bold text-amber-900 mb-3">II. Conceptualize</h3>
                                <p className="relative text-amber-700">Transform belief into a plan. Define your mission and gather your fellowship.</p>
                            </div>
                            <div className="group relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-amber-400/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                                <h3 className="relative text-2xl font-cinzel font-bold text-amber-900 mb-3">III. Realize</h3>
                                <p className="relative text-amber-700">Bring your concept to life. Build your artifact and establish foundations.</p>
                            </div>
                            <div className="group relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-amber-400/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                                <h3 className="relative text-2xl font-cinzel font-bold text-amber-900 mb-3">IV. Finalize</h3>
                                <p className="relative text-amber-700">Launch your venture. Grow your influence and expand across the realm.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Visual Hook Section */}
                <section id="visual-hook" className="py-24 bg-gradient-to-b from-amber-800 to-amber-900 text-white">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-4xl md:text-5xl font-cinzel font-bold mb-4">Behold Your Quest Log</h2>
                        <p className="text-xl max-w-3xl mx-auto mb-12 text-amber-100">This is not a mere checklist. It is a living chronicle of your venture, where strategy meets action.</p>
                        <div className="px-4">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                <img src={questWindow} alt="Screenshot of The Startup Quest gameplay window" className="relative rounded-lg shadow-2xl w-full max-w-5xl mx-auto" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Chronicle of a Guild Section */}
                <section id="chronicle" className="py-24 bg-gradient-to-b from-white to-amber-50">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-amber-900 text-center mb-4">The Chronicle of a Guild</h2>
                        <p className="text-xl text-center max-w-3xl mx-auto mb-16 text-amber-700">Follow the epic journey of a legendary guild. Every action, every decision, is recorded in the Great Library.</p>
                        <div className="mx-auto flex flex-row items-center justify-center">
                            <div className="w-1/2 flex-col h-[70vh] rounded-lg">
                                <img src={guildActivity} alt="Guild Activity" className="h-full object-contain border-[10px] border-amber-400 rounded-lg w-fit ml-auto mr-4 p-2" />
                            </div>
                            <div className="border-l-4 border-amber-400 ml-4 pl-8 space-y-8 w-1/2 flex-col">
                                {/* Timeline Items */}
                                <div className="relative timeline-item group">
                                    <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-x-2">
                                        <h3 className="font-cinzel font-bold text-amber-900">Quest: Competitive Landscape</h3>
                                        <p className="text-lg text-amber-700">Completed by: <span className="font-bold">Elara, the Loremaster</span></p>
                                        <p className="text-sm text-amber-600">Duration: 3 Days | Consultations: 1 | Rating: ★★★★☆</p>
                                    </div>
                                </div>
                                <div className="relative timeline-item group">
                                    <div className="p-6 bg-gradient-to-r from-amber-100 to-amber-50 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-x-2">
                                        <h3 className="font-cinzel font-bold text-amber-600">Achievement Unlocked: Mission Ready!</h3>
                                        <p className="text-lg text-amber-700 italic">The 'Innovatech' Guild has completed the Kickoff phase.</p>
                                    </div>
                                </div>
                                <div className="relative timeline-item group">
                                    <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-x-2">
                                        <h3 className="font-cinzel font-bold text-amber-900">Quest: Define Brand</h3>
                                        <p className="text-lg text-amber-700">Completed by: <span className="font-bold">Kael, the Herald</span></p>
                                        <p className="text-sm text-amber-600">Duration: 2 Days | Consultations: 0 | Rating: ★★★★★</p>
                                    </div>
                                </div>
                                <div className="relative timeline-item group">
                                    <div className="p-6 bg-gradient-to-r from-green-100 to-green-50 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-x-2">
                                        <h3 className="font-cinzel font-bold text-green-700">Level Up: Kael is now a Level 12 Herald!</h3>
                                        <p className="text-lg text-green-600 italic">New abilities and bonuses have been unlocked.</p>
                                    </div>
                                </div>
                                <div className="relative timeline-item group">
                                    <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-x-2">
                                        <h3 className="font-cinzel font-bold text-amber-900">Quest: Build Supply Chain</h3>
                                        <p className="text-lg text-amber-700">Completed by: <span className="font-bold">Bram, the Quartermaster</span></p>
                                        <p className="text-sm text-amber-600">Duration: 5 Days | Consultations: 2 | Rating: ★★★★☆</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Gameplay Section */}
                <section id="gameplay" className="py-24 bg-gradient-to-b from-amber-100 to-white">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-amber-900 text-center mb-4">The Anatomy of a Quest</h2>
                        <p className="text-xl text-center max-w-3xl mx-auto mb-16 text-amber-700">Every step on your journey is taken through the Quest Window—your central hub for action and insight.</p>
                        <div className="flex flex-row items-center justify-center">
                            <img src={guildQuest} alt="Guild Quest" className="w-full h-full object-contain rounded-lg border-[10px] border-amber-400 p-2 mb-4" />
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-2xl text-white">📜</span>
                                </div>
                                <h3 className="text-xl font-cinzel font-bold text-amber-900 mb-2">Quest Log</h3>
                                <p className="text-amber-700">Receive your objective—a clear, concise description of the task at hand.</p>
                            </div>
                            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-2xl text-white">✍️</span>
                                </div>
                                <h3 className="text-xl font-cinzel font-bold text-amber-900 mb-2">Input Scroll</h3>
                                <p className="text-amber-700">Inscribe your findings, strategies, and completed work.</p>
                            </div>
                            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-2xl text-white">📚</span>
                                </div>
                                <h3 className="text-xl font-cinzel font-bold text-amber-900 mb-2">The Grimoire</h3>
                                <p className="text-amber-700">Access curated knowledge and resources relevant to your quest.</p>
                            </div>
                            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-2xl text-white">🔮</span>
                                </div>
                                <h3 className="text-xl font-cinzel font-bold text-amber-900 mb-2">Seek Counsel</h3>
                                <p className="text-amber-700">Spend Gold to consult Tenzing for personalized guidance.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* AI Sage (Tenzing) */}
                <section id="ai-sage" className="py-24 bg-gradient-to-r from-amber-800 to-amber-900">
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="text-center md:text-left">
                                <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-white mb-6">Meet Tenzing</h2>
                                <p className="text-xl text-amber-100 mb-6">Meet Tenzing, your AI personal guide on the perilous journey of entrepreneurship. It doesn't just provide answers; it helps you ask the right questions and build the right way. Tenzing learns about your unique idea to forge a personalized roadmap, offers expert counsel drawn from over thousands of case studies, judges your progress with actionable feedback, and generates strategic artifacts like a Business Model Canvas on command. With every step you take, Tenzing learns more about your vision, making your journey smoother and its guidance more attuned to you.</p>
                                <p className="text-lg text-amber-200">The Inspiration Behind the Name: We named our AI Sage after Tenzing Norgay, the legendary Sherpa who guided the first successful ascent of Mount Everest. Our Tenzing is designed to guide founders through the treacherous startup landscape to help them reach their own peak of success.</p>
                            </div>
                            <div className="flex justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                                    <div className="relative h-64 w-64 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl">
                                        <img src={tenzing} alt="Tenzing" className="h-full w-full object-contain rounded-full border-[10px] border-amber-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* The Power of Tenzing */}
                <section id="tenzing-power" className="py-24 bg-gradient-to-b from-amber-50 to-white">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-amber-900 text-center mb-16">The Arcane Engine</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-2xl text-white">🧠</span>
                                </div>
                                <h3 className="text-xl font-cinzel font-bold text-amber-900 mb-3">Living Knowledge (RAG)</h3>
                                <p className="text-amber-700">Dynamically pulls relevant data from case studies and resources.</p>
                            </div>
                            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-2xl text-white">👁️</span>
                                </div>
                                <h3 className="text-xl font-cinzel font-bold text-amber-900 mb-3">Constant Scrutiny</h3>
                                <p className="text-amber-700">Performance is continuously evaluated and improved.</p>
                            </div>
                            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-2xl text-white">⚖️</span>
                                </div>
                                <h3 className="text-xl font-cinzel font-bold text-amber-900 mb-3">Task Judgment</h3>
                                <p className="text-amber-700">Provides detailed feedback and improvement suggestions.</p>
                            </div>
                            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                                <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-2xl text-white">📊</span>
                                </div>
                                <h3 className="text-xl font-cinzel font-bold text-amber-900 mb-3">Strategic Artifacts</h3>
                                <p className="text-amber-700">Generate powerful tools like Business Model Canvas, Pitch Deck, User Surveys, Product Roadmaps etc.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Roles and Attributes Section */}
                <section id="roles" className="py-24 bg-gradient-to-b from-white to-amber-50">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-amber-900 text-center mb-16">Choose Your Calling</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <span className="text-3xl">⚙️</span>
                                </div>
                                <h3 className="text-2xl font-cinzel font-bold text-amber-900">The Engineer</h3>
                                <p className="text-amber-600 italic">Core Attribute: Tech</p>
                            </div>
                            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <span className="text-3xl">📢</span>
                                </div>
                                <h3 className="text-2xl font-cinzel font-bold text-amber-900">The Herald</h3>
                                <p className="text-amber-600 italic">Core Attribute: Marketing</p>
                            </div>
                            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <span className="text-3xl">⚔️</span>
                                </div>
                                <h3 className="text-2xl font-cinzel font-bold text-amber-900">The Vanguard</h3>
                                <p className="text-amber-600 italic">Core Attribute: Sales</p>
                            </div>
                            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <span className="text-3xl">📚</span>
                                </div>
                                <h3 className="text-2xl font-cinzel font-bold text-amber-900">The Loremaster</h3>
                                <p className="text-amber-600 italic">Core Attribute: Legal</p>
                            </div>
                            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <span className="text-3xl">📦</span>
                                </div>
                                <h3 className="text-2xl font-cinzel font-bold text-amber-900">The Quartermaster</h3>
                                <p className="text-amber-600 italic">Core Attribute: Operations</p>
                            </div>
                            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <span className="text-3xl">💰</span>
                                </div>
                                <h3 className="text-2xl font-cinzel font-bold text-amber-900">The Treasurer</h3>
                                <p className="text-amber-600 italic">Core Attribute: Finance</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="py-24 bg-gradient-to-b from-amber-800 to-amber-900">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-white text-center mb-4">The Treasury</h2>
                        <p className="text-xl text-center max-w-3xl mx-auto mb-16 text-amber-100">Your quest is free to begin. Acquire Gold from the Treasury to gain a strategic edge for your Guild.</p>

                        {isPricingLoading ? (
                            <div className="text-center text-white py-12">
                                <p className="text-xl font-cinzel animate-pulse">Summoning the exchequer...</p>
                            </div>
                        ) : (
                            <>
                                {/* Global Pricing */}
                                {!showIndianPricing && (
                                    <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                                        {/* Card 1 */}
                                        <div className="flex flex-col h-full p-8 bg-white/10 backdrop-blur-sm rounded-2xl text-center transform hover:scale-105 transition-all duration-300">
                                            <div>
                                                <div className="text-4xl mb-3">⚡</div>
                                                <h3 className="text-2xl font-cinzel font-bold text-white mb-2">Starter</h3>
                                                <p className="text-amber-200 mb-4">200 Gold Coins</p>
                                                <p className="text-5xl font-cinzel font-bold text-amber-400 mb-2">$5</p>
                                                <p className="text-sm text-amber-200 mb-6">Perfect for beginners</p>
                                            </div>
                                            <div className="mt-auto">
                                                <a
                                                    href="/"
                                                    className="w-full block bg-gradient-to-r from-yellow-600 to-yellow-500 text-white font-bold py-3 px-6 rounded-lg hover:from-yellow-500 hover:to-yellow-400 transition-all text-center"
                                                >
                                                    Select
                                                </a>
                                            </div>
                                        </div>
                                        {/* Card 2 */}
                                        <div className="flex flex-col h-full p-8 bg-white/10 backdrop-blur-sm rounded-2xl text-center transform hover:scale-105 transition-all duration-300">
                                            <div>
                                                <div className="text-4xl mb-3">⚔️</div>
                                                <h3 className="text-2xl font-cinzel font-bold text-white mb-2">Warrior</h3>
                                                <p className="text-amber-200 mb-4">500 Gold Coins</p>
                                                <p className="text-5xl font-cinzel font-bold text-amber-400 mb-2">$10</p>
                                                <p className="text-sm text-amber-200 mb-6">For active questers</p>
                                            </div>
                                            <div className="mt-auto">
                                                <a
                                                    href="/"
                                                    className="w-full block bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:from-orange-500 hover:to-orange-400 transition-all text-center"
                                                >
                                                    Select
                                                </a>
                                            </div>
                                        </div>
                                        {/* Card 3 */}
                                        <div className="flex flex-col h-full p-8 bg-gradient-to-br from-amber-400/20 to-amber-600/20 backdrop-blur-sm rounded-2xl text-center border-2 border-amber-400 shadow-2xl transform hover:scale-105 transition-all duration-300 relative">
                                            <div>
                                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-amber-400 text-amber-900 px-4 py-1 rounded-full text-sm font-bold">MOST POPULAR</div>
                                                <div className="text-4xl mb-3">🛡️</div>
                                                <h3 className="text-2xl font-cinzel font-bold text-white mb-2">Knight</h3>
                                                <p className="text-amber-200 mb-2">1500 Gold Coins</p>
                                                <p className="text-green-400 text-sm mb-2">+10 Bonus Coins!</p>
                                                <p className="text-5xl font-cinzel font-bold text-amber-300 mb-2">$20</p>
                                                <p className="text-sm text-amber-200 mb-6">Best value for teams</p>
                                            </div>
                                            <div className="mt-auto">
                                                <a
                                                    href="/"
                                                    className="w-full block bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-500 hover:to-purple-400 transition-all text-center"
                                                >
                                                    Select
                                                </a>
                                            </div>
                                        </div>
                                        {/* Card 4 */}
                                        <div className="flex flex-col h-full p-8 bg-white/10 backdrop-blur-sm rounded-2xl text-center transform hover:scale-105 transition-all duration-300">
                                            <div>
                                                <div className="text-4xl mb-3">👑</div>
                                                <h3 className="text-2xl font-cinzel font-bold text-white mb-2">Legend</h3>
                                                <p className="text-amber-200 mb-2">5000 Gold Coins</p>
                                                <p className="text-green-400 text-sm mb-2">+20 Bonus Coins!</p>
                                                <p className="text-5xl font-cinzel font-bold text-amber-400 mb-2">$50</p>
                                                <p className="text-sm text-amber-200 mb-6">For serious ventures</p>
                                            </div>
                                            <div className="mt-auto">
                                                <a
                                                    href="/"
                                                    className="w-full block bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all text-center"
                                                >
                                                    Select
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* India Pricing */}
                                {showIndianPricing && (
                                    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
                                        {/* Card 1 */}
                                        <div className="flex flex-col h-full p-6 bg-white/10 backdrop-blur-sm rounded-2xl text-center transform hover:scale-105 transition-all duration-300">
                                            <div>
                                                <div className="text-4xl mb-3">⚡</div>
                                                <h3 className="text-xl font-cinzel font-bold text-white mb-2">Starter</h3>
                                                <p className="text-amber-200 mb-2 text-sm">100 Gold Coins</p>
                                                <p className="text-4xl font-cinzel font-bold text-amber-400 mb-2">₹100</p>
                                                <p className="text-xs text-amber-200 mb-4">Quick boost</p>
                                            </div>
                                            <div className="mt-auto">
                                                <a
                                                    href="/"
                                                    className="w-full block bg-gradient-to-r from-yellow-600 to-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:from-yellow-500 hover:to-yellow-400 transition-all text-sm text-center"
                                                >
                                                    Select
                                                </a>
                                            </div>
                                        </div>
                                        {/* Card 2 */}
                                        <div className="flex flex-col h-full p-6 bg-white/10 backdrop-blur-sm rounded-2xl text-center transform hover:scale-105 transition-all duration-300">
                                            <div>
                                                <div className="text-4xl mb-3">⚔️</div>
                                                <h3 className="text-xl font-cinzel font-bold text-white mb-2">Warrior</h3>
                                                <p className="text-amber-200 mb-1 text-sm">250 Gold Coins</p>
                                                <p className="text-green-400 text-xs mb-1">+25 Bonus!</p>
                                                <p className="text-4xl font-cinzel font-bold text-amber-400 mb-2">₹200</p>
                                                <p className="text-xs text-amber-200 mb-4">Great value</p>
                                            </div>
                                            <div className="mt-auto">
                                                <a
                                                    href="/"
                                                    className="w-full block bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:from-orange-500 hover:to-orange-400 transition-all text-sm text-center"
                                                >
                                                    Select
                                                </a>
                                            </div>
                                        </div>
                                        {/* Card 3 */}
                                        <div className="flex flex-col h-full p-6 bg-gradient-to-br from-amber-400/20 to-amber-600/20 backdrop-blur-sm rounded-2xl text-center border-2 border-amber-400 shadow-2xl transform hover:scale-105 transition-all duration-300 relative">
                                            <div>
                                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-400 text-amber-900 px-3 py-0.5 rounded-full text-xs font-bold">POPULAR</div>
                                                <div className="text-4xl mb-3">🛡️</div>
                                                <h3 className="text-xl font-cinzel font-bold text-white mb-2">Knight</h3>
                                                <p className="text-amber-200 mb-1 text-sm">600 Gold Coins</p>
                                                <p className="text-green-400 text-xs mb-1">+50 Bonus!</p>
                                                <p className="text-4xl font-cinzel font-bold text-amber-300 mb-2">₹400</p>
                                                <p className="text-xs text-amber-200 mb-4">Best for teams</p>
                                            </div>
                                            <div className="mt-auto">
                                                <a
                                                    href="/"
                                                    className="w-full block bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold py-2 px-4 rounded-lg hover:from-purple-500 hover:to-purple-400 transition-all text-sm text-center"
                                                >
                                                    Select
                                                </a>
                                            </div>
                                        </div>
                                        {/* Card 4 */}
                                        <div className="flex flex-col h-full p-6 bg-white/10 backdrop-blur-sm rounded-2xl text-center transform hover:scale-105 transition-all duration-300">
                                            <div>
                                                <div className="text-4xl mb-3">👑</div>
                                                <h3 className="text-xl font-cinzel font-bold text-white mb-2">Legend</h3>
                                                <p className="text-amber-200 mb-1 text-sm">1500 Gold Coins</p>
                                                <p className="text-green-400 text-xs mb-1">+125 Bonus!</p>
                                                <p className="text-4xl font-cinzel font-bold text-amber-400 mb-2">₹800</p>
                                                <p className="text-xs text-amber-200 mb-4">Pro package</p>
                                            </div>
                                            <div className="mt-auto">
                                                <a
                                                    href="/"
                                                    className="w-full block bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all text-sm text-center"
                                                >
                                                    Select
                                                </a>
                                            </div>
                                        </div>
                                        {/* Card 5 */}
                                        <div className="flex flex-col h-full p-6 bg-white/10 backdrop-blur-sm rounded-2xl text-center transform hover:scale-105 transition-all duration-300">
                                            <div>
                                                <div className="text-4xl mb-3">🏰</div>
                                                <h3 className="text-xl font-cinzel font-bold text-white mb-2">Emperor</h3>
                                                <p className="text-amber-200 mb-1 text-sm">3000 Gold Coins</p>
                                                <p className="text-green-400 text-xs mb-1">+300 Bonus!</p>
                                                <p className="text-4xl font-cinzel font-bold text-amber-400 mb-2">₹1500</p>
                                                <p className="text-xs text-amber-200 mb-4">Ultimate power</p>
                                            </div>
                                            <div className="mt-auto">
                                                <a
                                                    href="/"
                                                    className="w-full block bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold py-2 px-4 rounded-lg hover:from-red-500 hover:to-pink-500 transition-all text-sm text-center"
                                                >
                                                    Select
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Payment Methods & Features */}
                        <div className="mt-16 max-w-4xl mx-auto">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                                <h3 className="text-2xl font-cinzel font-bold text-white mb-6 text-center">Secure Payment Options</h3>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-lg font-bold text-amber-300 mb-3">🌍 Global Payments</h4>
                                        <ul className="space-y-2 text-amber-100">
                                            <li className="flex items-center"><span className="mr-2">✓</span> PayPal (All major cards)</li>
                                            <li className="flex items-center"><span className="mr-2">✓</span> Multiple currencies supported</li>
                                            <li className="flex items-center"><span className="mr-2">✓</span> Instant gold delivery</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-amber-300 mb-3">🇮🇳 India Payments</h4>
                                        <ul className="space-y-2 text-amber-100">
                                            <li className="flex items-center"><span className="mr-2">✓</span> UPI, Cards, Net Banking</li>
                                            <li className="flex items-center"><span className="mr-2">✓</span> Razorpay secure gateway</li>
                                            <li className="flex items-center"><span className="mr-2">✓</span> Special regional pricing</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="mt-6 text-center">
                                    <p className="text-amber-200 text-sm">🔒 All transactions are secure and encrypted</p>
                                    <p className="text-amber-300 text-sm mt-2">⚡ Weekend Special: +25% bonus coins on all purchases!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="py-24 bg-gradient-to-b from-white to-amber-50">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-amber-900 text-center mb-16">Scrolls of Knowledge</h2>
                        <div className="max-w-3xl mx-auto space-y-6">
                            <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                                <h3 className="text-xl font-cinzel font-bold text-amber-900 mb-3">Is this for solo founders too?</h3>
                                <p className="text-lg text-amber-700">Absolutely! While the Guild system is designed for teams, a solo founder can embark on the quest alone, forming a "Guild of One." You'll have access to all the same tools and guidance from Tenzing.</p>
                            </div>
                            <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                                <h3 className="text-xl font-cinzel font-bold text-amber-900 mb-3">How is my company's data protected?</h3>
                                <p className="text-lg text-amber-700">Your specific inputs and strategies are your own private chronicle. Tenzing learns from anonymized, aggregated data patterns only. Your individual venture data is never shared or made public.</p>
                            </div>
                            <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                                <h3 className="text-xl font-cinzel font-bold text-amber-900 mb-3">What if my idea changes?</h3>
                                <p className="text-lg text-amber-700">Pivoting is a natural part of any quest. The platform includes a "Log a Pivot" feature, allowing you to officially change your venture's direction. Tenzing will then adjust its guidance and help you navigate the new path.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section id="testimonials" className="py-24 bg-gradient-to-b from-amber-100 to-white">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-amber-900 text-center mb-16">Tales from the Realm</h2>
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            <div className="p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow">
                                <div className="flex mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-amber-400 text-xl">★</span>
                                    ))}
                                </div>
                                <p className="text-xl text-amber-800 mb-6 italic">"The Startup Quest brought much-needed structure to our chaotic early days. The gamification kept us motivated, and Tenzing was like having a seasoned advisor on call 24/7."</p>
                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold mr-4">S</div>
                                    <div>
                                        <p className="font-bold font-cinzel text-lg text-amber-900">Sarah Lee</p>
                                        <p className="text-amber-600 text-sm">CEO & Founder, Innovatech</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow">
                                <div className="flex mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-amber-400 text-xl">★</span>
                                    ))}
                                </div>
                                <p className="text-xl text-amber-800 mb-6 italic">"As a solo founder, the loneliness is real. Joining a Guild and seeing our shared progress made all the difference. It felt like we were truly building something together, even when working remotely."</p>
                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold mr-4">M</div>
                                    <div>
                                        <p className="font-bold font-cinzel text-lg text-amber-900">Mike Patel</p>
                                        <p className="text-amber-600 text-sm">Founder, Connectify</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Us */}
                <section id="contact" className="py-24 bg-gradient-to-b from-amber-800 to-amber-900">
                    <div className="container mx-auto px-6">
                        <div className="max-w-2xl mx-auto text-center">
                            <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-white mb-4">Seek an Audience?</h2>
                            <p className="text-xl text-amber-100 mb-12">Contact us for a demo or to get a custom AI-driven roadmap for your accelerator, incubator, or university program.</p>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                                <div className="w-full max-w-xl mx-auto">
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-amber-100 text-sm font-bold mb-2" htmlFor="grid-first-name">Name</label>
                                            <input
                                                className="w-full bg-white/20 backdrop-blur-sm text-white placeholder-amber-200/50 border border-amber-300/30 rounded-lg py-3 px-4 focus:outline-none focus:border-amber-400 focus:bg-white/30 transition-all"
                                                id="grid-first-name"
                                                type="text"
                                                placeholder="Elara of Highgarden"
                                                ref={nameRef}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-amber-100 text-sm font-bold mb-2" htmlFor="grid-email">Email</label>
                                            <input
                                                className="w-full bg-white/20 backdrop-blur-sm text-white placeholder-amber-200/50 border border-amber-300/30 rounded-lg py-3 px-4 focus:outline-none focus:border-amber-400 focus:bg-white/30 transition-all"
                                                id="grid-email"
                                                type="email"
                                                placeholder="founder@yourguild.com"
                                                ref={emailRef}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-amber-100 text-sm font-bold mb-2" htmlFor="grid-company">Company Name</label>
                                        <input
                                            className="w-full bg-white/20 backdrop-blur-sm text-white placeholder-amber-200/50 border border-amber-300/30 rounded-lg py-3 px-4 focus:outline-none focus:border-amber-400 focus:bg-white/30 transition-all"
                                            id="grid-company"
                                            type="text"
                                            placeholder="Your Awesome Startup"
                                            ref={companyRef}
                                        />
                                    </div>
                                    <div className="mb-6">
                                        <label className="block text-amber-100 text-sm font-bold mb-2" htmlFor="grid-message">Message</label>
                                        <textarea
                                            className="w-full bg-white/20 backdrop-blur-sm text-white placeholder-amber-200/50 border border-amber-300/30 rounded-lg py-3 px-4 focus:outline-none focus:border-amber-400 focus:bg-white/30 transition-all h-32"
                                            id="grid-message"
                                            placeholder="Tell us of your quest..."
                                            ref={messageRef}
                                        ></textarea>
                                    </div>
                                    <div className="flex justify-center">
                                        <button
                                            className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-900 font-cinzel font-bold py-3 px-8 rounded-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
                                            type="button"
                                            onClick={handleSendCrow}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Sending...' : 'Send a Crow'}
                                        </button>
                                    </div>
                                    {submitMessage && (
                                        <div className={`mt-4 text-lg ${submitMessage.type === 'success' ? 'text-green-300' : 'text-red-300'}`}>
                                            {submitMessage.text}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-8 bg-amber-950 text-amber-100">
                <div className="container mx-auto px-6 text-center">
                    <div className="flex justify-center space-x-6 mb-4">
                        <a href="#" className="hover:text-amber-300 transition-colors">Twitter</a>
                        <a href="#" className="hover:text-amber-300 transition-colors">LinkedIn</a>
                        <a href="#" className="hover:text-amber-300 transition-colors">Medium</a>
                    </div>
                    <p className="text-amber-200/70">&copy; 2025 The Startup Quest. All Rights Reserved.</p>
                </div>
            </footer>

            {/* Custom styles */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
                
                body {
                    font-family: 'EB Garamond', serif;
                    background-color: #fefefe;
                }
                
                h1, h2, h3, .font-cinzel {
                    font-family: 'Cinzel', serif;
                }
                
                /* Timeline styles */
                .timeline-item::before {
                    content: '';
                    position: absolute;
                    left: -31px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #f59e0b, #d97706);
                    border: 4px solid #fef3c7;
                    box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.2);
                }
                
                /* Animations */
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in-up {
                    animation: fadeInUp 0.8s ease-out forwards;
                }
                
                .animation-delay-200 {
                    animation-delay: 0.2s;
                    opacity: 0;
                }
                
                .animation-delay-400 {
                    animation-delay: 0.4s;
                    opacity: 0;
                }
                
                /* Floating particles */
                .particle {
                    position: absolute;
                    background: radial-gradient(circle, rgba(251, 191, 36, 0.8) 0%, transparent 70%);
                    border-radius: 50%;
                    pointer-events: none;
                }
                
                .particle-1 {
                    width: 80px;
                    height: 80px;
                    top: 10%;
                    left: 10%;
                    animation: float1 20s infinite ease-in-out;
                }
                
                .particle-2 {
                    width: 60px;
                    height: 60px;
                    top: 70%;
                    right: 10%;
                    animation: float2 15s infinite ease-in-out;
                }
                
                .particle-3 {
                    width: 100px;
                    height: 100px;
                    bottom: 10%;
                    left: 50%;
                    animation: float3 25s infinite ease-in-out;
                }
                
                .particle-4 {
                    width: 40px;
                    height: 40px;
                    top: 50%;
                    right: 30%;
                    animation: float4 18s infinite ease-in-out;
                }
                
                @keyframes float1 {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(100px, -100px) rotate(120deg); }
                    66% { transform: translate(-100px, 100px) rotate(240deg); }
                }
                
                @keyframes float2 {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(-100px, -100px) rotate(120deg); }
                    66% { transform: translate(100px, 100px) rotate(240deg); }
                }
                
                @keyframes float3 {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(50px, -150px) rotate(120deg); }
                    66% { transform: translate(-50px, 50px) rotate(240deg); }
                }
                
                @keyframes float4 {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(-150px, 50px) rotate(120deg); }
                    66% { transform: translate(150px, -50px) rotate(240deg); }
                }
                
                /* Smooth scroll */
                html {
                    scroll-behavior: smooth;
                }
                
                /* Custom scrollbar */
                ::-webkit-scrollbar {
                    width: 12px;
                }
                
                ::-webkit-scrollbar-track {
                    background: #fef3c7;
                }
                
                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(180deg, #f59e0b, #d97706);
                    border-radius: 6px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(180deg, #d97706, #b45309);
                }
            `}</style>
        </div>
    );
};

export default LandingPage;