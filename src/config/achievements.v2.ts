export const MILESTONE_ACHIEVEMENTS = {
    // Stage 1: Fundamentals
    "Market Scholar": {
        name: "Market Scholar",
        description: "Awarded for completing all quests in the 'Markets' sub-stage.",
        stage: 1,
        requiredQuests: ["market_research", "competitor_analysis"], // Placeholder
    },
    "Business Architect": {
        name: "Business Architect",
        description: "Awarded for completing all quests in the 'Business Models' sub-stage.",
        stage: 1,
        requiredQuests: ["business_model_canvas", "revenue_model"], // Placeholder
    },
    "The Validator": {
        name: "The Validator",
        description: "Awarded for completing all 'Validation' quests.",
        stage: 1,
        requiredQuests: ["customer_interviews", "mvp_testing"], // Placeholder
    },
    "Functionally Fluent": {
        name: "Functionally Fluent",
        description: "Awarded for completing all 'Business Functions' crash courses.",
        stage: 1,
        requiredQuests: ["finance_basics", "marketing_basics", "sales_basics", "ops_basics"], // Placeholder
    },

    // Stage 2: Kickoff
    "Problem Identified": {
        name: "Problem Identified",
        description: "Awarded for completing all quests in 'The Problem' sub-stage.",
        stage: 2,
        requiredQuests: ["problem_discovery", "problem_validation"], // Placeholder from problem
    },
    "Solution Forged": {
        name: "Solution Forged",
        description: "Awarded for completing 'The Solution' sub-stage.",
        stage: 2,
        requiredQuests: ["solution_brainstorming", "solution_design"], // Placeholder from solution
    },
    "Mission Ready": {
        name: "Mission Ready",
        description: "Awarded for completing the 'Plan Mission' sub-stage.",
        stage: 2,
        requiredQuests: ["vision", "mission_statement"], // Placeholder
    },
    "First Contact": {
        name: "First Contact",
        description: "Awarded for completing 'The Customer' sub-stage.",
        stage: 2,
        requiredQuests: ["firstusers", "feedback"],
    },
    "Brand Builder": {
        name: "Brand Builder",
        description: "Awarded for completing 'The Brand' quests.",
        stage: 2,
        requiredQuests: ["brand_identity", "brand_voice"], // Placeholder
    },

    // Stage 3: Go-to-Market
    "Incorporated": {
        name: "Incorporated",
        description: "Awarded for completing all 'Administration' quests.",
        stage: 3,
        requiredQuests: ["legal"],
    },
    "Operational Readiness": {
        name: "Operational Readiness",
        description: "Awarded for completing all 'Operations' quests.",
        stage: 3,
        requiredQuests: ["scaling", "culture"],
    },
    "Launch Control": {
        name: "Launch Control",
        description: "Awarded for completing all 'Functions' and 'Reporting' quests.",
        stage: 3,
        requiredQuests: ["channels", "metrics"],
    },
    "Battle-Tested": {
        name: "Battle-Tested",
        description: "Awarded for successfully completing the 'Stress Test' sub-stage.",
        stage: 3,
        requiredQuests: ["stress_test_1", "stress_test_2"], // Placeholder
    },
    "We Have Liftoff!": {
        name: "We Have Liftoff!",
        description: "Awarded for completing all 'Go-Live' quests.",
        stage: 3,
        requiredQuests: ["go_live_checklist", "launch_day"], // Placeholder
    },

    // Stage 4: Growth
    "Culture Keeper": {
        name: "Culture Keeper",
        description: "Awarded for completing all quests in the 'Culture' sub-stage.",
        stage: 4,
        requiredQuests: ["culture"],
    },
    "Master & Commander": {
        name: "Master & Commander",
        description: "Awarded for completing the 'Management' quests.",
        stage: 4,
        requiredQuests: ["team_management", "performance_reviews"], // Placeholder
    },
    "Data-Driven": {
        name: "Data-Driven",
        description: "Awarded for completing all quests in the 'Data' sub-stage.",
        stage: 4,
        requiredQuests: ["data_analytics", "kpi_tracking"], // Placeholder
    },
    "The Optimizer": {
        name: "The Optimizer",
        description: "Awarded for completing all quests in the 'Optimization' sub-stage.",
        stage: 4,
        requiredQuests: ["process_optimization", "conversion_rate_optimization"], // Placeholder
    },
    "Alliance Builder": {
        name: "Alliance Builder",
        description: "Awarded for mastering 'Partnerships'.",
        stage: 4,
        requiredQuests: ["partnerships"],
    },
    "Expansionist": {
        name: "Expansionist",
        description: "Awarded for completing all quests in the 'Expansion' sub-stage.",
        stage: 4,
        requiredQuests: ["new_market_entry", "product_line_expansion"], // Placeholder
    },
};

export const PERSONAL_ACHIEVEMENTS = {
    attribute: {
        name: (attribute: string) => `${attribute.charAt(0).toUpperCase() + attribute.slice(1)} Proficiency`,
        description: (level: number, attribute: string) => `Reach Level ${level * 10} in the ${attribute} attribute.`,
        levels: [
            { level: 10, name: "Level I" },
            { level: 20, name: "Level II" },
            { level: 30, name: "Level III" },
            { level: 40, name: "Level IV" },
            { level: 50, name: "Level V" },
        ],
    },
    polymath: {
        name: "Polymath (Jack of All Trades)",
        description: (level: number) => `Reach Level ${level * 5} in all six attributes.`,
        levels: [
            { level: 5, name: "Level I" },
            { level: 10, name: "Level II" },
            { level: 15, name: "Level III" },
            { level: 20, name: "Level IV" },
            { level: 25, name: "Level V" },
        ],
    },
    quest_taker: {
        name: "Quest-Taker",
        description: (count: number) => `Complete ${count} quests.`,
        levels: [
            { count: 10, name: "Level I" },
            { count: 25, name: "Level II" },
            { count: 50, name: "Level III" },
            { count: 75, name: "Level IV" },
            { count: 100, name: "Level V" },
        ],
    },
};

export const ENGAGEMENT_ACHIEVEMENTS = {
    daily_dedication: {
        name: "Daily Dedication (Streak)",
        description: (days: number) => `Achieve a ${days}-day sign-in streak.`,
        levels: [
            { days: 7, name: "Level I" },
            { days: 14, name: "Level II" },
            { days: 30, name: "Level III" },
            { days: 60, name: "Level IV" },
            { days: 90, name: "Level V" },
        ],
    },
    the_regular: {
        name: "The Regular (Total Logins)",
        description: (days: number) => `Log in on ${days} separate days.`,
        levels: [
            { days: 10, name: "Level I" },
            { days: 30, name: "Level II" },
            { days: 100, name: "Level III" },
            { days: 200, name: "Level IV" },
            { days: 365, name: "Level V" },
        ],
    },
};

export const GUILD_ACHIEVEMENTS = {
    founding: {
        "The Fellowship Begins": {
            name: "The Fellowship Begins",
            description: "Found or join your first Guild.",
        },
        "All Hands on Deck": {
            name: "All Hands on Deck",
            description: "Have all six core Roles represented in your Guild.",
        },
        "Synergist": {
            name: "Synergist",
            description: "Complete a quest that matches your Role's core proficiency for the first time.",
        },
    },
    collaborative: {
        powerhouse_partnership: {
            name: "Powerhouse Partnership",
            description: (count: number) => `Complete ${count} quests with synergy bonuses.`,
            levels: [
                { count: 10, name: "Level I" },
                { count: 25, name: "Level II" },
                { count: 50, name: "Level III" },
                { count: 100, name: "Level IV" },
                { count: 200, name: "Level V" },
            ],
        },
        guild_excellence: {
            name: "Guild Excellence",
            description: (level: number) => `Reach a Guild Level of ${level} in any attribute.`,
            levels: [
                { level: 5, name: "Level I" },
                { level: 10, name: "Level II" },
                { level: 20, name: "Level III" },
                { level: 30, name: "Level IV" },
                { level: 50, name: "Level V" },
            ],
        },
    },
    management: {
        sustainable_venture: {
            name: "Sustainable Venture (Upkeep)",
            description: (months: number) => months === 1 ? "Successfully pay your Guild's monthly upkeep for the first time." : `Successfully pay upkeep for ${months} consecutive months.`,
            levels: [
                { months: 1, name: "Level I" },
                { months: 3, name: "Level II" },
                { months: 6, name: "Level III" },
                { months: 9, name: "Level IV" },
                { months: 12, name: "Level V" },
            ],
        },
        master_architects: {
            name: "Master Architects (Headquarters)",
            description: (hq: string) => `Upgrade your headquarters to a ${hq}.`,
            levels: [
                { hq: "Outpost", name: "Level I" },
                { hq: "Manor", name: "Level II" },
                { hq: "Fort", name: "Level III" },
                { hq: "Castle", name: "Level IV" },
                { hq: "Stronghold", name: "Level V" },
            ],
        },
    },
}; 