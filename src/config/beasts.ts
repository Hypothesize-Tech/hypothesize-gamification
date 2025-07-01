export interface Beast {
    id: string;
    name: string;
    metaphor: string;
    description: string;
    gameplayMechanic: string;
    status?: 'active' | 'defeated' | 'inactive';
}

export const FANTASY_BEASTS: Beast[] = [
    {
        id: 'market-incumbent-dragon',
        name: 'The Market Incumbent Dragon',
        metaphor: 'The massive, established competitor that dominates the market.',
        description: "A colossal, ancient dragon sleeping on a mountain of gold and artifacts. It isn't necessarily aggressive but its sheer presence warps the landscape, making it difficult for new things to grow. Its scales are made of \"Brand Loyalty,\" and its fiery breath is \"Predatory Pricing.\"",
        gameplayMechanic: "This isn't a beast to be \"slain\" in a single fight. Instead, Guilds must complete a series of difficult quests to chip away at its dominance:\n- Steal a Scale: A high-risk \"Marketing\" quest to convert a major client.\n- Weather the Inferno: A \"Finance\" quest to survive a period of low prices.\n- Find the Chink in its Armor: An \"Operations\" quest to exploit a weakness in the competitor's supply chain or service."
    },
    {
        id: 'hydra-of-scope-creep',
        name: 'The Hydra of Scope Creep',
        metaphor: 'Uncontrolled feature expansion and technical debt.',
        description: 'A monstrous, multi-headed serpent that lurks in the swamps of development. For every head that is severed, two more grow in its place, each more demanding than the last.',
        gameplayMechanic: "Appears during a \"Realize\" or \"Finalize\" phase quest. To defeat it, the Guild can't just attack wildly. They must use a special \"Product Management\" ability (perhaps unlocked by a Loremaster or Engineer) to \"cauterize the wound,\" which prevents new heads from growing. This requires spending resources (Gold/Energy) to stop developing and instead focus on core functionality."
    },
    {
        id: 'siren-of-vanity-metrics',
        name: 'The Siren of Vanity Metrics',
        metaphor: "Getting distracted by metrics that look good but don't contribute to the bottom line (e.g., social media likes without conversions).",
        description: "A beautiful, ethereal creature whose song is irresistibly appealing. Her song promises glory, fame, and vast numbers, luring founders towards the rocky shores of bankruptcy.",
        gameplayMechanic: "A random event where a Guild is presented with a tempting but ultimately useless side-quest. Accepting it drains significant Energy for a \"treasure\" that provides no real statistical benefit, only a cosmetic \"Ego Boost\" badge. A Treasurer or a high-level Herald can perform a \"Profitability Analysis\" check to see through the illusion."
    },
    {
        id: 'red-tape-golems',
        name: 'Red Tape Golems',
        metaphor: 'Bureaucracy, regulations, and legal hurdles.',
        description: "Slow, mindless, but incredibly durable constructs made of stacked, moving paperwork and sealed with red wax. They don't attack, but they block critical paths on the roadmap.",
        gameplayMechanic: "These Golems bar progress on quests like \"Incorporate\" or \"Address Tax Obligations.\" They are immune to normal \"attacks.\" They can only be dismantled by a Loremaster completing a series of \"Legal\" attribute quests or by spending a large amount of Gold from the Guild Vault to hire a \"Mercenary Lawyer\" to find a loophole."
    },
    {
        id: 'burnout-spectre',
        name: 'The Burnout Spectre',
        metaphor: 'Founder burnout and team fatigue.',
        description: "An incorporeal, shadowy wraith that haunts Guilds that are over-extending themselves. It doesn't deal damage but drains the will to continue.",
        gameplayMechanic: "If a Guild's average Energy level remains below 20% for three consecutive days, the Burnout Spectre may appear. While it is active, all Guild members' daily Energy replenishment is halved. It can only be banished by completing a \"Culture\" quest or by purchasing a \"Morale Boost\" treasure from the Treasury."
    },
    {
        id: 'cashflow-quicksand',
        name: 'Cashflow Quicksand',
        metaphor: 'Unexpected expenses and poor cash flow management.',
        description: "A patch of seemingly solid ground that suddenly turns into shimmering, golden sand that pulls victims under. It appears harmless until it's too late.",
        gameplayMechanic: "A random event triggered after a high-cost quest or Guild upgrade. For the next 7 days, a percentage of all Gold earned is immediately consumed by the quicksand. A Treasurer can spend Energy on a \"Financial Forecasting\" ability to test the ground and avoid the trap."
    }
]; 