// Energy System Configuration
export const ENERGY_CONFIG = {
    MAX_DAILY_ENERGY: 100,
    RESET_HOUR: 0, // UTC
    GOLD_TO_ENERGY_RATE: 1, // 1 gold = 1 energy
    DAILY_BONUS_GOLD: 5,
};

// Gold Costs Configuration
export const GOLD_COSTS = {
};

export const ENERGY_COSTS = {
    // Quest related
    START_QUEST: 10,
    GET_AI_ASSISTANCE: 5,
    SUBMIT_QUEST: 0, // No cost to submit
    QUEST_COMPLETION: 0,

    // Guild related
    CREATE_GUILD: 50,
    POST_COMMENT: 2,

    // Beast related
    CONFRONT_BEAST: 40,

    // Document related
    DOCUMENT_UPLOAD: 10, // Cost to upload a document

    // Default
    DEFAULT_ACTION: 5,
    DOCUMENT_GENERATION: 15,
    AI_SAGE_CONSULTATION: 3
};
