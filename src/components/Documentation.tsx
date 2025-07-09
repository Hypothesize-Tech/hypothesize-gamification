import React, { useState } from 'react';
import './Documentation.css';

interface DocumentationProps {
    onClose?: () => void;
}

const Documentation: React.FC<DocumentationProps> = ({ onClose }) => {
    const [activeSection, setActiveSection] = useState<string>('about');

    const sections = [
        { id: 'about', title: 'About The Startup Quest' },
        { id: 'begin', title: 'How to Begin' },
        { id: 'quest-window', title: 'The Quest Window' },
        { id: 'resources', title: 'Resources' },
        { id: 'attributes', title: 'Attributes & Synergies' },
        { id: 'treasures', title: 'Treasures' },
        { id: 'tenzing', title: 'Tenzing (The AI Sage)' },
        { id: 'guilds', title: 'Guilds' },
        { id: 'roles', title: 'Roles & Attributes' },
        { id: 'library', title: 'Library' },
        { id: 'tools', title: 'Tools' },
    ];

    const scrollToSection = (sectionId: string) => {
        setActiveSection(sectionId);
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="documentation-container">
            <div className="documentation-header">
                <h1 className="documentation-title">The Startup Quest: Documentation</h1>
                <p className="documentation-subtitle">
                    Welcome, Founder. This documentation provides a comprehensive overview of The Startup Quest platform,
                    its features, and core concepts. Use this guide to understand the tools at your disposal as you forge your venture.
                </p>
                {onClose && (
                    <button className="close-btn" onClick={onClose} aria-label="Close Documentation">
                        ×
                    </button>
                )}
            </div>

            <div className="documentation-content">
                <nav className="documentation-nav">
                    <h3>Table of Contents</h3>
                    <ul>
                        {sections.map((section) => (
                            <li key={section.id}>
                                <button
                                    className={`nav-link ${activeSection === section.id ? 'active' : ''}`}
                                    onClick={() => scrollToSection(section.id)}
                                >
                                    {section.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <main className="documentation-main">
                    <section id="about" className="documentation-section">
                        <h2>1. About The Startup Quest</h2>
                        <h3>Build your Venture like a Game</h3>
                        <p>
                            The Startup Quest is a gamified, AI-driven platform designed to systematize the entrepreneurial journey.
                            It transforms the complex process of building a company into a clear, step-by-step roadmap based on a
                            proven venture-building framework.
                        </p>
                        <p>
                            Our system is built to provide structure, motivation, and intelligent guidance, helping founders navigate
                            the critical stages of ideation, validation, launch, and growth. By combining a task-based progression
                            system with a powerful AI Sage, we provide a holistic ecosystem for founders to bring their ideas to life.
                        </p>
                    </section>

                    <section id="begin" className="documentation-section">
                        <h2>2. How to Begin</h2>
                        <div className="media-placeholder">
                            <div className="video-placeholder">
                                <p>📹 Video: Signing up with AI Voice over</p>
                            </div>
                        </div>
                        <p>Your saga starts with the onboarding process, which is designed to personalize your entire experience.</p>
                        <div className="process-steps">
                            <div className="step">
                                <h4>Sign Up</h4>
                                <p>Create your account using a secure Google sign-in.</p>
                            </div>
                            <div className="step">
                                <h4>Provide Your Details</h4>
                                <p>Enter your name and gender to create your founder profile.</p>
                            </div>
                            <div className="step">
                                <h4>Recount Your Journey</h4>
                                <p>
                                    Share your academic and professional background. This initial data helps our AI, Tenzing,
                                    understand your core capabilities and experience from day one.
                                </p>
                            </div>
                            <div className="step">
                                <h4>Define Your Idea</h4>
                                <p>
                                    State your startup idea. Tenzing analyzes this input to customize a unique roadmap tailored
                                    to your specific industry and concept.
                                </p>
                            </div>
                            <div className="step">
                                <h4>Choose Your Role</h4>
                                <p>
                                    Select one of the six founder Roles. This determines your core proficiency and unlocks special synergies.
                                </p>
                            </div>
                            <div className="step">
                                <h4>Found Your Guild</h4>
                                <p>
                                    Name your startup and invite your co-founders or team members via email to join your Guild.
                                </p>
                            </div>
                            <div className="step">
                                <h4>Start Your Journey</h4>
                                <p>With your profile complete, you are ready to embark on your first quest.</p>
                            </div>
                        </div>
                        <div className="privacy-note">
                            <h4>Note on Privacy</h4>
                            <p>
                                All information you provide is privately saved and encrypted. It is used solely to personalize
                                your experience and is never shared. Our platform is a safe space for you to develop your ideas.
                            </p>
                        </div>
                    </section>

                    <section id="quest-window" className="documentation-section">
                        <h2>3. The Quest Window</h2>
                        <div className="media-placeholder">
                            <div className="image-placeholder">
                                <p>🖼️ Image: The Quest Window Interface</p>
                            </div>
                        </div>
                        <p>
                            The Quest Window is the central user interface where you will interact with every task on your roadmap.
                            It is composed of four key components:
                        </p>
                        <div className="components-grid">
                            <div className="component">
                                <h4>Quest Log</h4>
                                <p>
                                    Displays the objective for your current quest, providing a clear description of the task and its importance.
                                </p>
                            </div>
                            <div className="component">
                                <h4>Input Form</h4>
                                <p>
                                    A dedicated text area where you will enter your work, analysis, and strategies to complete the quest objective.
                                </p>
                            </div>
                            <div className="component">
                                <h4>Grimoire</h4>
                                <p>
                                    Your personal, AI-curated library. The Grimoire automatically populates with relevant articles, videos,
                                    and tools from the internet that are directly related to your current quest, saving you hours of research.
                                </p>
                            </div>
                            <div className="component">
                                <h4>AI Sage Consultation</h4>
                                <p>
                                    An interface to "Consult Tenzing." You can ask for guidance, brainstorm ideas, or request feedback
                                    on your work-in-progress directly within the quest.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section id="resources" className="documentation-section">
                        <h2>4. Resources</h2>
                        <div className="media-placeholder">
                            <div className="image-placeholder">
                                <p>🖼️ Image: Resources Overview</p>
                            </div>
                        </div>
                        <p>You have two primary resources to manage throughout your quest:</p>
                        <div className="resources-grid">
                            <div className="resource">
                                <h4>Energy</h4>
                                <p>
                                    Represents your personal capacity for action. Completing quests costs Energy. You are granted 50 Energy
                                    every day, which encourages consistent, focused work without promoting burnout.
                                </p>
                            </div>
                            <div className="resource">
                                <h4>Gold</h4>
                                <p>
                                    The shared currency of your Guild, held in the Guild Vault. Gold is used for strategic actions like
                                    consulting Tenzing, paying for your Guild's monthly upkeep, or purchasing powerful Treasures from the Treasury.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section id="attributes" className="documentation-section">
                        <h2>5. Attributes & Synergies</h2>
                        <div className="media-placeholder">
                            <div className="image-placeholder">
                                <p>🖼️ Image: Personal Attribute Window</p>
                            </div>
                        </div>

                        <h3>Attributes</h3>
                        <p>
                            Attributes are the six core pillars of skill and knowledge within The Startup Quest. Every quest, role,
                            and synergy bonus is tied to one of these attributes. Leveling up your attributes is the primary way
                            to measure your growth as a founder.
                        </p>

                        <div className="attributes-grid">
                            <div className="attribute">
                                <h4>Tech</h4>
                                <p>
                                    Represents your ability to build and manage your product. This includes everything from software
                                    development and UI/UX design to managing your tech stack and infrastructure.
                                </p>
                            </div>
                            <div className="attribute">
                                <h4>Marketing</h4>
                                <p>
                                    Represents your ability to tell your story and attract an audience. This covers branding, content
                                    creation, social media, public relations, and demand generation.
                                </p>
                            </div>
                            <div className="attribute">
                                <h4>Sales</h4>
                                <p>
                                    Represents your ability to convert interest into revenue. This includes defining customer profiles,
                                    conducting outreach, negotiating deals, and building sales funnels.
                                </p>
                            </div>
                            <div className="attribute">
                                <h4>Legal</h4>
                                <p>
                                    Represents your ability to navigate the complex regulatory landscape. This includes company formation,
                                    compliance, contracts, and intellectual property.
                                </p>
                            </div>
                            <div className="attribute">
                                <h4>Operations</h4>
                                <p>
                                    Represents your ability to build and manage the systems that run your business. This covers supply
                                    chains, logistics, project management, and internal processes.
                                </p>
                            </div>
                            <div className="attribute">
                                <h4>Finance</h4>
                                <p>
                                    Represents your ability to manage your company's capital. This includes budgeting, financial modeling,
                                    fundraising, and accounting.
                                </p>
                            </div>
                        </div>

                        <h3>Synergies</h3>
                        <p>
                            The Startup Quest is designed to reward focused expertise and teamwork through the Synergy System.
                        </p>
                        <div className="synergy-explanation">
                            <div className="synergy-item">
                                <h4>Concept</h4>
                                <p>
                                    Every founder has a Role with a corresponding Core Attribute (e.g., the Engineer's Core Attribute is Tech).
                                    Every quest on the roadmap is also tied to one of these attributes.
                                </p>
                            </div>
                            <div className="synergy-item">
                                <h4>Mechanic</h4>
                                <p>
                                    When a founder completes a quest that matches their Role's Core Attribute, they trigger a Synergy Bonus,
                                    earning extra Experience Points (XP). This allows founders to level up faster by focusing on their strengths,
                                    while encouraging teams to delegate tasks to the most suitable member.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section id="treasures" className="documentation-section">
                        <h2>6. Treasures</h2>
                        <div className="media-placeholder">
                            <div className="image-placeholder">
                                <p>🖼️ Image: Treasures Collection</p>
                            </div>
                        </div>
                        <p>
                            Treasures are powerful artifacts that can be acquired from the Treasury using your Guild's Gold.
                            These items provide permanent, passive bonuses that grant your team a strategic advantage.
                        </p>
                    </section>

                    <section id="tenzing" className="documentation-section">
                        <h2>7. Tenzing (The AI Sage)</h2>
                        <div className="media-placeholder">
                            <div className="video-placeholder">
                                <p>📹 Video: Showcasing Tenzing's Capabilities</p>
                            </div>
                        </div>
                        <p>
                            Tenzing is your personal AI Sage, a sophisticated guide built on a framework of advanced AI technologies.
                        </p>
                        <div className="tenzing-features">
                            <div className="feature">
                                <h4>Knowledge Base</h4>
                                <p>Tenzing is pre-trained on a dataset of thousands of business case studies.</p>
                            </div>
                            <div className="feature">
                                <h4>Knowledge Update</h4>
                                <p>
                                    It uses Retrieval-Augmented Generation (RAG) to pull live, relevant information from the web,
                                    ensuring its advice is always current and fact-based.
                                </p>
                            </div>
                            <div className="feature">
                                <h4>Continuous Evaluation</h4>
                                <p>
                                    Tenzing's performance is constantly evaluated to ensure its suggestions for quests, Grimoire resources,
                                    and consultations are accurate and effective.
                                </p>
                            </div>
                            <div className="feature">
                                <h4>Task Judgment</h4>
                                <p>
                                    Upon quest completion, Tenzing analyzes your work and provides a rating with a detailed justification,
                                    offering actionable feedback for improvement.
                                </p>
                            </div>
                            <div className="feature">
                                <h4>Personalization</h4>
                                <p>
                                    Tenzing learns from your inputs in real-time. With every quest you complete, its guidance becomes more
                                    attuned to your unique vision and working style, making your journey smoother.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section id="guilds" className="documentation-section">
                        <h2>8. Guilds</h2>
                        <div className="media-placeholder">
                            <div className="image-placeholder">
                                <p>🖼️ Image: Guild Management Screen</p>
                            </div>
                        </div>
                        <p>A Guild is your founding team. It is the core collaborative unit in The Startup Quest.</p>
                        <div className="guild-features">
                            <div className="guild-feature">
                                <h4>Formation</h4>
                                <p>The founding member names the Guild and can invite co-founders and team members via email.</p>
                            </div>
                            <div className="guild-feature">
                                <h4>Guild Vault</h4>
                                <p>
                                    All Gold is held in a shared vault, promoting collaborative decisions on how to spend resources
                                    for strategic advantage.
                                </p>
                            </div>
                            <div className="guild-feature">
                                <h4>Headquarters & Upkeep</h4>
                                <p>
                                    Guilds can upgrade their headquarters, from a simple Campfire to a mighty Stronghold. Each upgrade
                                    provides powerful bonuses to all members but requires a monthly upkeep cost paid from the Guild Vault.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section id="roles" className="documentation-section">
                        <h2>9. Roles & Attributes</h2>
                        <div className="media-placeholder">
                            <div className="image-placeholder">
                                <p>🖼️ Image: Role Selection Window</p>
                            </div>
                        </div>
                        <p>
                            Every member of a Guild chooses one of six Roles, each with a Core Attribute. This system encourages
                            specialization and effective delegation.
                        </p>
                        <div className="roles-grid">
                            <div className="role">
                                <h4>The Engineer</h4>
                                <p>Core Attribute: Tech</p>
                            </div>
                            <div className="role">
                                <h4>The Herald</h4>
                                <p>Core Attribute: Marketing</p>
                            </div>
                            <div className="role">
                                <h4>The Vanguard</h4>
                                <p>Core Attribute: Sales</p>
                            </div>
                            <div className="role">
                                <h4>The Loremaster</h4>
                                <p>Core Attribute: Legal</p>
                            </div>
                            <div className="role">
                                <h4>The Quartermaster</h4>
                                <p>Core Attribute: Operations</p>
                            </div>
                            <div className="role">
                                <h4>The Treasurer</h4>
                                <p>Core Attribute: Finance</p>
                            </div>
                        </div>
                    </section>

                    <section id="library" className="documentation-section">
                        <h2>10. Library (Your Private Knowledge Base)</h2>
                        <div className="media-placeholder">
                            <div className="image-placeholder">
                                <p>🖼️ Image: Upload Document Window</p>
                            </div>
                        </div>
                        <p>The Startup Quest provides a secure space to build your own private library of documents.</p>
                        <div className="library-features">
                            <div className="library-feature">
                                <h4>Function</h4>
                                <p>
                                    You can upload any document (e.g., market research PDFs, articles, internal notes) to your private library.
                                </p>
                            </div>
                            <div className="library-feature">
                                <h4>Interaction with Tenzing</h4>
                                <p>
                                    Once uploaded, you can use Tenzing to interact with your documents. Ask specific questions about the content,
                                    request summaries, or ask for suggestions on how to incorporate the information within your startup strategy.
                                    Tenzing acts as your personal research assistant, helping you extract value from your own resources.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section id="tools" className="documentation-section">
                        <h2>11. Tools (Strategic Artifact Generation)</h2>
                        <p>
                            Tenzing can instantly generate crucial strategic documents based on your inputs throughout the quests.
                            This saves countless hours and provides a strong foundation for your business planning.
                        </p>
                        <div className="tools-grid">
                            <div className="tool">Double Diamond Analysis</div>
                            <div className="tool">SWOT Analysis</div>
                            <div className="tool">Business Model Canvas</div>
                            <div className="tool">User Surveys</div>
                            <div className="tool">Pitch Deck</div>
                            <div className="tool">Marketing Plan</div>
                            <div className="tool">Product Roadmap</div>
                            <div className="tool">Sales Pitch</div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default Documentation; 