import React from 'react';

const LandingPage: React.FC = () => {
    return (
        <div className="scroll-smooth">
            {/* Header */}
            <header className="parchment-bg sticky top-0 z-50 border-b-2 border-amber-800/20">
                <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
                    <a href="#" className="text-3xl font-cinzel font-bold text-[#5c3d2e]">
                        The Startup Quest
                    </a>
                    <div className="hidden md:flex space-x-8 text-lg">
                        <a href="#gameplay" className="hover:text-[#8c2d19] transition-colors">Gameplay</a>
                        <a href="#pricing" className="hover:text-[#8c2d19] transition-colors">The Treasury</a>
                        <a href="#ai-sage" className="hover:text-[#8c2d19] transition-colors">Tenzing</a>
                        <a href="#faq" className="hover:text-[#8c2d19] transition-colors">FAQ</a>
                    </div>
                    <a href="/" className="hidden md:inline-block fantasy-btn font-cinzel font-bold py-2 px-4 rounded-md text-sm">
                        Begin Your Quest
                    </a>
                </nav>
            </header>
            {/* Main Content */}
            <main>
                {/* Hero Section */}
                <section id="hero" className="py-24 md:py-40 hero-bg-fantasy">
                    <div className="container mx-auto px-6 text-center">
                        <h1 className="text-5xl md:text-7xl font-cinzel font-black text-[#5c3d2e] leading-tight mb-4" style={{ textShadow: '1px 1px 2px rgba(253, 246, 227, 0.5)' }}>
                            Forge Your Legacy
                        </h1>
                        <p className="text-xl md:text-2xl text-[#4a2c2a] max-w-3xl mx-auto mb-10 italic">
                            Navigate the chaos of creation with an AI Alchemist as your guide. Your legendary journey from idea to icon begins now.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <a href="#contact" className="fantasy-btn font-cinzel font-bold py-4 px-10 rounded-lg text-lg w-full sm:w-auto">
                                Start Your Quest
                            </a>
                            <a href="/" className="fantasy-btn fantasy-btn-secondary font-cinzel font-bold py-4 px-10 rounded-lg text-lg w-full sm:w-auto">
                                Resume Your Journey
                            </a>
                        </div>
                    </div>
                </section>
                {/* Social Proof Section */}
                <section id="social-proof" className="py-12 parchment-bg border-b-2 border-amber-800/20">
                    <div className="container mx-auto px-6 text-center">
                        <h3 className="font-cinzel text-lg text-amber-900/80 tracking-widest">TRUSTED BY THE REALM'S FINEST GUILDS & INSTITUTIONS</h3>
                        <div className="flex justify-center items-center space-x-8 md:space-x-12 mt-4 opacity-60">
                            <p className="font-cinzel text-2xl">Founders University</p>
                            <p className="font-cinzel text-2xl">Venture Academy</p>
                            <p className="font-cinzel text-2xl">The Alchemist's Circle</p>
                        </div>
                    </div>
                </section>
                {/* How to Start Your Journey */}
                <section id="start-journey" className="py-20">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-[#5c3d2e] text-center mb-16">Your Chronicle Begins...</h2>
                        <div className="grid md:grid-cols-3 gap-10 text-center">
                            {/* Step 1 */}
                            <div className="p-8">
                                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-amber-800/10 mx-auto mb-6 border-2 border-amber-800/20">
                                    {/* Pen Icon */}
                                    <svg className="h-10 w-10 text-[#8c2d19]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </div>
                                <h3 className="text-2xl font-cinzel font-bold text-[#5c3d2e] mb-2">1. Define Your Idea</h3>
                                <p className="text-lg text-[#4a2c2a]">The AI customizes your roadmap according to your input.</p>
                            </div>
                            {/* Step 2 */}
                            <div className="p-8">
                                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-amber-800/10 mx-auto mb-6 border-2 border-amber-800/20">
                                    {/* Path Icon */}
                                    <svg className="h-10 w-10 text-[#8c2d19]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-9-5.747h18M5.464 7.464l13.072 9.072M5.464 16.536L18.536 7.464" /></svg>
                                </div>
                                <h3 className="text-2xl font-cinzel font-bold text-[#5c3d2e] mb-2">2. Choose Your Path</h3>
                                <p className="text-lg text-[#4a2c2a]">Select your role, and tell the AI about your self. The AI will take this into account to find your core strengths and guide you accordingly.</p>
                            </div>
                            {/* Step 3 */}
                            <div className="p-8">
                                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-amber-800/10 mx-auto mb-6 border-2 border-amber-800/20">
                                    {/* Team Icon */}
                                    <svg className="h-10 w-10 text-[#8c2d19]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                </div>
                                <h3 className="text-2xl font-cinzel font-bold text-[#5c3d2e] mb-2">3. Build Your Team</h3>
                                <p className="text-lg text-[#4a2c2a]">Build your team to complete the quest together.</p>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Section Divider */}
                <div className="section-divider"></div>
                {/* Four Phases Section */}
                <section id="phases" className="py-20">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-[#5c3d2e] text-center mb-16">The Four Chapters of Your Saga</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                            <div className="p-6 rounded-lg">
                                <h3 className="text-2xl font-cinzel font-bold mb-2">I. Hypothesize</h3>
                                <p className="text-lg">Discover a need in the realm. Study the landscape, understand the market, and forge the core belief that will anchor your quest.</p>
                            </div>
                            <div className="p-6 rounded-lg">
                                <h3 className="text-2xl font-cinzel font-bold mb-2">II. Conceptualize</h3>
                                <p className="text-lg">Transform belief into a plan. Forge your solution, define your mission, and gather your fellowship to give your idea form and purpose.</p>
                            </div>
                            <div className="p-6 rounded-lg">
                                <h3 className="text-2xl font-cinzel font-bold mb-2">III. Realize</h3>
                                <p className="text-lg">Bring your concept to life. Build your artifact, establish your stronghold's foundations, and prepare to unveil your creation to the world.</p>
                            </div>
                            <div className="p-6 rounded-lg">
                                <h3 className="text-2xl font-cinzel font-bold mb-2">IV. Finalize</h3>
                                <p className="text-lg">Launch your venture. Grow your influence, optimize your operations, and expand your reach across the realm, securing your legacy.</p>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Visual Hook Section */}
                <section id="visual-hook" className="py-20 parchment-bg border-y-2 border-amber-800/20">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-[#5c3d2e] text-center mb-4">Behold Your Quest Log</h2>
                        <p className="text-xl text-center max-w-3xl mx-auto mb-10 italic">This is not a mere checklist. It is a living chronicle of your venture, where strategy meets action.</p>
                        <div className="px-4">
                            <img src="https://placehold.co/1200x800/d1c7b7/4a2c2a?text=Quest+Window+UI+Mockup" alt="Screenshot of The Startup Quest gameplay window" className="rounded-lg shadow-2xl border-4 border-amber-800/30 w-full max-w-5xl mx-auto" />
                        </div>
                    </div>
                </section>
                {/* Chronicle of a Guild Section */}
                <section id="chronicle" className="py-20">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-[#5c3d2e] text-center mb-4">The Chronicle of a Guild</h2>
                        <p className="text-xl text-center max-w-3xl mx-auto mb-16 italic">Follow the epic journey of a legendary guild. Every action, every decision, is recorded in the Great Library.</p>
                        <div className="max-w-3xl mx-auto">
                            <div className="border-l-4 border-amber-800/30 ml-4 pl-8 space-y-12">
                                {/* Timeline Items */}
                                <div className="relative timeline-item">
                                    <h3 className="text-2xl font-cinzel font-bold">Quest: Competitive Landscape</h3>
                                    <p className="text-lg">Completed by: <span className="font-bold">Elara, the Loremaster</span></p>
                                    <p className="text-sm text-amber-900/80">Duration: 3 Days | Consultations: 1 | Rating: ★★★★☆</p>
                                </div>
                                <div className="relative timeline-item">
                                    <h3 className="text-2xl font-cinzel font-bold text-amber-600">Achievement Unlocked: Mission Ready!</h3>
                                    <p className="text-lg italic">The 'Innovatech' Guild has completed the Kickoff phase.</p>
                                </div>
                                <div className="relative timeline-item">
                                    <h3 className="text-2xl font-cinzel font-bold">Quest: Define Brand</h3>
                                    <p className="text-lg">Completed by: <span className="font-bold">Kael, the Herald</span></p>
                                    <p className="text-sm text-amber-900/80">Duration: 2 Days | Consultations: 0 | Rating: ★★★★★</p>
                                </div>
                                <div className="relative timeline-item">
                                    <h3 className="text-2xl font-cinzel font-bold text-green-700">Level Up: Kael is now a Level 12 Herald!</h3>
                                    <p className="text-lg italic">New abilities and bonuses have been unlocked.</p>
                                </div>
                                <div className="relative timeline-item">
                                    <h3 className="text-2xl font-cinzel font-bold">Quest: Build Supply Chain</h3>
                                    <p className="text-lg">Completed by: <span className="font-bold">Bram, the Quartermaster</span></p>
                                    <p className="text-sm text-amber-900/80">Duration: 5 Days | Consultations: 2 | Rating: ★★★★☆</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Gameplay Section */}
                <section id="gameplay" className="py-20 parchment-bg border-y-2 border-amber-800/20">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-[#5c3d2e] text-center mb-4">The Anatomy of a Quest</h2>
                        <p className="text-xl text-center max-w-3xl mx-auto mb-16 italic">Every step on your journey is taken through the Quest Window—your central hub for action and insight.</p>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                            <div className="p-6 rounded-lg">
                                <h3 className="text-xl font-cinzel font-bold mb-2">Quest Log</h3>
                                <p className="text-lg">Receive your objective—a clear, concise description of the task at hand, drawn from the great roadmap.</p>
                            </div>
                            <div className="p-6 rounded-lg">
                                <h3 className="text-xl font-cinzel font-bold mb-2">Input Scroll</h3>
                                <p className="text-lg">This is where you inscribe your findings, strategies, and completed work, creating a record of your progress.</p>
                            </div>
                            <div className="p-6 rounded-lg">
                                <h3 className="text-xl font-cinzel font-bold mb-2">The Grimoire</h3>
                                <p className="text-lg">Access a curated library of ancient knowledge—internet resources most relevant to your quest, idea, and role.</p>
                            </div>
                            <div className="p-6 rounded-lg">
                                <h3 className="text-xl font-cinzel font-bold mb-2">Seek Counsel</h3>
                                <p className="text-lg">When the path is unclear, spend Gold from your Guild Vault to consult Tenzing for personalized guidance.</p>
                            </div>
                        </div>
                    </div>
                </section>
                {/* AI Sage (Tenzing) */}
                <section id="ai-sage" className="py-20">
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="text-center md:text-left">
                                <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-[#5c3d2e] mb-4">Meet Tenzing</h2>
                                <p className="text-xl text-[#4a2c2a] mb-4 italic">Your personal AI Sage, named after the legendary guide Tenzing Norgay. Pre-trained on over 7,000 business case studies—both successful and unsuccessful—Tenzing provides just-in-time advice to help you summit your peak.</p>
                                <p className="text-lg text-[#4a2c2a]">Tenzing is more than a guide; it's a learning entity. It enriches itself with knowledge from your input and the collective, anonymized journey of every founder on the platform. This creates a powerful feedback loop, ensuring the path for the next founder is always clearer than the last.</p>
                            </div>
                            <div className="flex justify-center">
                                <div className="h-64 w-64 rounded-full bg-amber-900/10 flex items-center justify-center p-8 border-4 border-amber-800/20">
                                    {/* AI Sage SVG */}
                                    <svg className="h-40 w-40 text-[#8c2d19]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l15.482 0m-15.482 0L12 5.343l2.74 4.804m-5.48 0l5.48 0m0 0l-5.48 0" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* The Power of Tenzing */}
                <section id="tenzing-power" className="py-20 parchment-bg border-y-2 border-amber-800/20">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-[#5c3d2e] text-center mb-16">The Arcane Engine</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                            <div className="p-6">
                                <h3 className="text-xl font-cinzel font-bold mb-2">Living Knowledge (RAG)</h3>
                                <p className="text-lg">Tenzing uses Retrieval-Augmented Generation to ground its advice in facts. It dynamically pulls the most relevant data from its library of case studies and the Grimoire's web resources to give you the most accurate counsel.</p>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-cinzel font-bold mb-2">Constant Scrutiny</h3>
                                <p className="text-lg">Through continuous evaluation, Tenzing's performance is always being honed. We ensure its guidance for quests, resources, and consultations remains sharp, relevant, and effective.</p>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-cinzel font-bold mb-2">Task Judgment</h3>
                                <p className="text-lg">Upon quest completion, Tenzing judges your work against its vast knowledge, providing a detailed justification for your rewards and offering concrete suggestions on how you can improve.</p>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-cinzel font-bold mb-2">Strategic Artifacts</h3>
                                <p className="text-lg">Use Tenzing to generate powerful artifacts like a Business Model Canvas or SWOT analysis, and even ask questions about any document to incorporate its wisdom into your strategy.</p>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Roles and Attributes Section */}
                <section id="roles" className="py-20">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-[#5c3d2e] text-center mb-16">Choose Your Calling</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="p-6 text-center">
                                <h3 className="text-2xl font-cinzel font-bold">The Engineer</h3>
                                <p className="text-amber-700 italic">Core Attribute: Tech</p>
                            </div>
                            <div className="p-6 text-center">
                                <h3 className="text-2xl font-cinzel font-bold">The Herald</h3>
                                <p className="text-amber-700 italic">Core Attribute: Marketing</p>
                            </div>
                            <div className="p-6 text-center">
                                <h3 className="text-2xl font-cinzel font-bold">The Vanguard</h3>
                                <p className="text-amber-700 italic">Core Attribute: Sales</p>
                            </div>
                            <div className="p-6 text-center">
                                <h3 className="text-2xl font-cinzel font-bold">The Loremaster</h3>
                                <p className="text-amber-700 italic">Core Attribute: Legal</p>
                            </div>
                            <div className="p-6 text-center">
                                <h3 className="text-2xl font-cinzel font-bold">The Quartermaster</h3>
                                <p className="text-amber-700 italic">Core Attribute: Operations</p>
                            </div>
                            <div className="p-6 text-center">
                                <h3 className="text-2xl font-cinzel font-bold">The Treasurer</h3>
                                <p className="text-amber-700 italic">Core Attribute: Finance</p>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Pricing Section */}
                <section id="pricing" className="py-20 parchment-bg border-y-2 border-amber-800/20">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-[#5c3d2e] text-center mb-4">The Treasury</h2>
                        <p className="text-xl text-center max-w-3xl mx-auto mb-16 italic">Your quest is free to begin. Acquire Gold from the Treasury to gain a strategic edge for your Guild.</p>
                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            <div className="p-8 rounded-lg card-bordered text-center">
                                <h3 className="text-2xl font-cinzel font-bold mb-2">Pouch of Gold</h3>
                                <p className="text-4xl font-cinzel font-bold text-amber-600 my-4">$10</p>
                                <p className="text-lg">A starter pack for essential consultations and minor treasures.</p>
                            </div>
                            <div className="p-8 rounded-lg card-bordered text-center border-4 border-amber-600 shadow-2xl">
                                <h3 className="text-2xl font-cinzel font-bold mb-2">Adventurer's Chest</h3>
                                <p className="text-4xl font-cinzel font-bold text-amber-600 my-4">$25</p>
                                <p className="text-lg">The most popular choice for ambitious Guilds looking to upgrade and grow.</p>
                            </div>
                            <div className="p-8 rounded-lg card-bordered text-center">
                                <h3 className="text-2xl font-cinzel font-bold mb-2">Dragon's Hoard</h3>
                                <p className="text-4xl font-cinzel font-bold text-amber-600 my-4">$50</p>
                                <p className="text-lg">For legendary ventures seeking to dominate the realm and acquire the best treasures.</p>
                            </div>
                        </div>
                    </div>
                </section>
                {/* FAQ Section */}
                <section id="faq" className="py-20">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-[#5c3d2e] text-center mb-16">Scrolls of Knowledge</h2>
                        <div className="max-w-3xl mx-auto space-y-8">
                            <div>
                                <h3 className="text-xl font-cinzel font-bold mb-2">Is this for solo founders too?</h3>
                                <p className="text-lg">Absolutely! While the Guild system is designed for teams, a solo founder can embark on the quest alone, forming a "Guild of One." You'll have access to all the same tools and guidance from Tenzing.</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-cinzel font-bold mb-2">How is my company's data protected?</h3>
                                <p className="text-lg">Your specific inputs and strategies are your own private chronicle. Tenzing learns from anonymized, aggregated data patterns only. Your individual venture data is never shared or made public.</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-cinzel font-bold mb-2">What if my idea changes?</h3>
                                <p className="text-lg">Pivoting is a natural part of any quest. The platform includes a "Log a Pivot" feature, allowing you to officially change your venture's direction. Tenzing will then adjust its guidance and help you navigate the new path.</p>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Testimonials */}
                <section id="testimonials" className="py-20 parchment-bg border-y-2 border-amber-800/20">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-[#5c3d2e] text-center mb-16">Tales from the Realm</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="p-8 rounded-lg card-bordered">
                                <p className="text-xl text-[#4a2c2a] mb-6 italic">"The Startup Quest brought much-needed structure to our chaotic early days. The gamification kept us motivated, and Tenzing was like having a seasoned advisor on call 24/7."</p>
                                <div className="flex items-center">
                                    <img className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-amber-800/30" src="https://placehold.co/100x100/fdf6e3/5c3d2e?text=S" alt="Testimonial author" />
                                    <div>
                                        <p className="font-bold font-cinzel text-lg">Sarah Lee</p>
                                        <p className="text-amber-700 text-sm">CEO & Founder, Innovatech</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 rounded-lg card-bordered">
                                <p className="text-xl text-[#4a2c2a] mb-6 italic">"As a solo founder, the loneliness is real. Joining a Guild and seeing our shared progress made all the difference. It felt like we were truly building something together, even when working remotely."</p>
                                <div className="flex items-center">
                                    <img className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-amber-800/30" src="https://placehold.co/100x100/fdf6e3/5c3d2e?text=M" alt="Testimonial author" />
                                    <div>
                                        <p className="font-bold font-cinzel text-lg">Mike Patel</p>
                                        <p className="text-amber-700 text-sm">Founder, Connectify</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Contact Us */}
                <section id="contact" className="py-20">
                    <div className="container mx-auto px-6">
                        <div className="max-w-2xl mx-auto text-center">
                            <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-[#5c3d2e] mb-4">Seek an Audience?</h2>
                            <p className="text-xl text-[#4a2c2a] mb-8 italic">Contact us for a demo or to get a custom AI-driven roadmap for your accelerator, incubator, or university program.</p>
                            <form className="w-full max-w-xl mx-auto">
                                <div className="flex flex-wrap -mx-3 mb-6">
                                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                        <label className="block uppercase tracking-wide text-[#5c3d2e] text-xs font-bold mb-2" htmlFor="grid-first-name">Name</label>
                                        <input className="appearance-none block w-full bg-[#fdf6e3]/50 text-[#4a2c2a] border border-amber-800/30 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-amber-600" id="grid-first-name" type="text" placeholder="Elara of Highgarden" />
                                    </div>
                                    <div className="w-full md:w-1/2 px-3">
                                        <label className="block uppercase tracking-wide text-[#5c3d2e] text-xs font-bold mb-2" htmlFor="grid-email">Email</label>
                                        <input className="appearance-none block w-full bg-[#fdf6e3]/50 text-[#4a2c2a] border border-amber-800/30 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-amber-600" id="grid-email" type="email" placeholder="founder@yourguild.com" />
                                    </div>
                                </div>
                                <div className="flex flex-wrap -mx-3 mb-6">
                                    <div className="w-full px-3">
                                        <label className="block uppercase tracking-wide text-[#5c3d2e] text-xs font-bold mb-2" htmlFor="grid-company">Company Name</label>
                                        <input className="appearance-none block w-full bg-[#fdf6e3]/50 text-[#4a2c2a] border border-amber-800/30 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-amber-600" id="grid-company" type="text" placeholder="Your Awesome Startup" />
                                    </div>
                                </div>
                                <div className="flex flex-wrap -mx-3 mb-6">
                                    <div className="w-full px-3">
                                        <label className="block uppercase tracking-wide text-[#5c3d2e] text-xs font-bold mb-2" htmlFor="grid-message">Message</label>
                                        <textarea className="appearance-none block w-full bg-[#fdf6e3]/50 text-[#4a2c2a] border border-amber-800/30 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-amber-600 h-32" id="grid-message" placeholder="Tell us of your quest..."></textarea>
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <button className="fantasy-btn font-cinzel font-bold py-3 px-8 rounded-lg" type="button">
                                        Send a Crow
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
            {/* Footer */}
            <footer className="py-8">
                <div className="container mx-auto px-6 text-center text-amber-900/80">
                    <div className="flex justify-center space-x-6 mb-4">
                        <a href="#" className="hover:text-[#8c2d19]">Twitter</a>
                        <a href="#" className="hover:text-[#8c2d19]">LinkedIn</a>
                        <a href="#" className="hover:text-[#8c2d19]">Medium</a>
                    </div>
                    <p>&copy; 2025 The Startup Quest. All Rights Reserved.</p>
                </div>
            </footer>
            {/* Custom styles for parchment, fantasy-btn, etc. should be in global CSS */}
            <style>{`
        body {
          font-family: 'EB Garamond', serif;
          background-color: #fdf6e3;
          color: #4a2c2a;
          background-image: url('https://www.transparenttextures.com/patterns/old-paper-2.png');
        }
        h1, h2, h3, .font-cinzel {
          font-family: 'Cinzel', serif;
        }
        .parchment-bg {
          background-color: rgba(253, 246, 227, 0.8);
          backdrop-filter: blur(2px);
        }
        .fantasy-btn {
          background-color: #8c2d19;
          color: #fdf6e3;
          border: 2px solid #5c3d2e;
          box-shadow: inset 0 0 10px rgba(0,0,0,0.3), 0 4px 6px rgba(0,0,0,0.2);
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
          transition: all 0.2s ease-in-out;
        }
        .fantasy-btn:hover {
          background-color: #a83d27;
          transform: translateY(-2px);
          box-shadow: inset 0 0 10px rgba(0,0,0,0.4), 0 6px 8px rgba(0,0,0,0.25);
        }
        .fantasy-btn-secondary {
          background-color: transparent;
          color: #8c2d19;
          border: 2px solid #8c2d19;
        }
        .fantasy-btn-secondary:hover {
          background-color: rgba(140, 45, 25, 0.1);
        }
        .section-divider {
          height: 2px;
          background-image: linear-gradient(to right, transparent, #8c2d19, transparent);
          margin: 3rem auto;
          width: 80%;
        }
        .card-bordered {
          border: 2px solid #d1c7b7;
          background: rgba(255,255,255,0.1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .hero-bg-fantasy {
          background-image: url('https://www.transparenttextures.com/patterns/worn-dots.png'), 
            radial-gradient(circle at top right, rgba(212, 175, 55, 0.2), transparent 60%),
            radial-gradient(circle at bottom left, rgba(140, 45, 25, 0.2), transparent 70%);
          border-bottom: 4px solid #c8a464;
          border-image: linear-gradient(to right, #8c2d19, #d4af37, #8c2d19) 1;
        }
        .timeline-item::before {
          content: '';
          position: absolute;
          left: -31px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #8c2d19;
          border: 4px solid #fdf6e3;
        }
      `}</style>
        </div>
    );
};

export default LandingPage;