import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const loginWithGoogle = async (code: string) => {
    try {
        const { data } = await api.post('/auth/google', { code });
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        return data;
    } catch (e) {
        console.error('Error logging in with Google:', e);
        return null;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
};

export const getAuthenticatedUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const { data } = await api.get('/auth/me');
        return data;
    } catch (e) {
        console.error('Failed to get authenticated user', e);
        logout();
        return null;
    }
};

// Guild
export const getGuild = (id: string) => api.get(`/guilds/${id}`);
export const createGuild = async (vision: string, onboardingData: any) => {
    const { data } = await api.post('/guilds', { vision, onboardingData });
    return data;
};
export const updateGuild = (id: string, data: any) => api.put(`/guilds/${id}`, data);
export const joinGuild = async (guildId: string, role: string) => api.post(`/guilds/${guildId}/join`, { role });
export const resetGuild = (id: string) => api.post(`/guilds/${id}/reset`);
export const leaveGuild = () => api.delete('/guilds/leave');
export const claimDailyBonus = () => api.post('/guilds/claim-daily-bonus');
export const updateGold = (amount: number) => api.post('/guilds/update-gold', { amount });
export const getConversations = () => api.get('/guilds/conversations');
export const saveConversation = (data: any) => api.post('/guilds/save-conversation', data);
export const getDocuments = () => api.get('/guilds/documents');
export const saveDocument = (data: any) => api.post('/guilds/save-document', data);
export const getQuestComments = (questKey: string) => api.get(`/guilds/quests/${questKey}/comments`);
export const addQuestComment = (questKey: string, text: string) => api.post(`/guilds/quests/${questKey}/comments`, { text });
export const kickMember = (memberId: string) => api.post(`/guilds/kick`, { memberId });

// Quests
export const completeQuest = (data: any) => api.post('/quests/complete', data);
export const assignQuest = (data: any) => api.post('/quests/assign', data);
export const savePersonalizedQuestDetails = (data: any) => api.post('/quests/details', data);

// Armory
export const purchaseArmoryItem = (data: any) => api.post('/armory/purchase', data);

// Documents
export const generateDocument = (prompt: string) => api.post('/documents/generate', { prompt });

// Document Conversations
export interface Message {
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface DocumentConversation {
    _id: string;
    documentId: string;
    documentName: string;
    title: string;
    messages: Message[];
    lastUpdated: Date;
    createdAt: Date;
}

/**
 * Save or update a document conversation
 * @param documentId - ID of the document
 * @param documentName - Name of the document
 * @param messages - Array of conversation messages
 * @param title - Optional title for the conversation
 * @returns Promise with the saved conversation
 */
export const saveDocumentConversation = (
    documentId: string,
    documentName: string,
    messages: Message[],
    title?: string
) => {
    return api.post('/document-conversations/save', {
        documentId,
        documentName,
        messages,
        title
    });
};

/**
 * Add a message to an existing conversation
 * @param conversationId - ID of the conversation
 * @param message - Message object to add
 * @returns Promise with the updated conversation
 */
export const addDocumentConversationMessage = (conversationId: string, message: Message) => {
    return api.post('/document-conversations/message', { conversationId, message });
};

/**
 * Get all document conversations for current user
 * @param documentId - Optional document ID to filter by
 * @returns Promise with array of conversations
 */
export const getDocumentConversations = (documentId?: string) => {
    const queryParam = documentId ? `?documentId=${documentId}` : '';
    return api.get(`/document-conversations/user${queryParam}`);
};

/**
 * Get a specific conversation by ID
 * @param conversationId - ID of the conversation to retrieve
 * @returns Promise with the conversation data
 */
export const getDocumentConversationById = (conversationId: string) => {
    return api.get(`/document-conversations/${conversationId}`);
};

/**
 * Delete a conversation
 * @param conversationId - ID of the conversation to delete
 * @returns Promise with deletion confirmation
 */
export const deleteDocumentConversation = (conversationId: string) => {
    return api.delete(`/document-conversations/${conversationId}`);
};

// AI
export const consultAISage = (data: any) => api.post('/ai/consult-sage', data);
export const rateQuestSubmission = (data: any) => api.post('/ai/rate-submission', data);
export const getPersonalizedQuestDetails = (data: any) => api.post('/ai/quest-details', data);
export const getSuggestedSageQuestions = (data: any) => api.post('/ai/suggested-questions', data);
export const fetchDynamicResources = (data: any) => api.post('/ai/dynamic-resources', data);

// Energy
export const checkEnergyReset = () => api.post('/energy/reset');
export const consumeEnergy = (action: string) => api.post('/energy/consume', { action });
export const purchaseEnergy = (amount: number) => api.post('/energy/purchase', { amount });

// Activity Logs
export const getGuildActivityLogs = (
    guildId: string,
    page: number = 1,
    limit: number = 20,
    activityType?: string
) => {
    let url = `/activity/guild/${guildId}?page=${page}&limit=${limit}`;
    if (activityType) url += `&type=${activityType}`;
    return api.get(url);
};

// Email
/**
 * Send a generic email via the backend
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param text - Plain text email content
 * @param html - Optional HTML email content
 * @returns Promise with response data
 */
export const sendEmail = (to: string, subject: string, text: string, html?: string) => {
    return api.post('/email/send', { to, subject, text, html });
};

/**
 * Send a guild invitation email via the backend
 * @param to - Recipient email address
 * @param guildName - Name of the guild
 * @param founderName - Name of the founder
 * @param ventureIdea - Description of the guild's venture
 * @param inviteLink - Invitation link
 * @returns Promise with response data
 */
export const sendGuildInviteEmail = (
    to: string,
    guildName: string,
    founderName: string,
    ventureIdea: string,
    inviteLink: string
) => {
    return api.post('/email/guild-invite', {
        to,
        guildName,
        founderName,
        ventureIdea,
        inviteLink
    });
};

export const getRecentActivities = () => api.get('/activity/recent');

export default api;