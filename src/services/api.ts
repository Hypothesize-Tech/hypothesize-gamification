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
export const claimDailyBonus = () => api.post('/guilds/claim-daily-bonus');
export const updateGold = (amount: number) => api.post('/guilds/update-gold', { amount });
export const getConversations = () => api.get('/guilds/conversations');
export const saveConversation = (data: any) => api.post('/guilds/save-conversation', data);
export const getDocuments = () => api.get('/guilds/documents');
export const saveDocument = (data: any) => api.post('/guilds/save-document', data);
export const getQuestComments = (questKey: string) => api.get(`/guilds/quests/${questKey}/comments`);
export const addQuestComment = (questKey: string, text: string) => api.post(`/guilds/quests/${questKey}/comments`, { text });


// Quests
export const completeQuest = (data: any) => api.post('/quests/complete', data);
export const assignQuest = (data: any) => api.post('/quests/assign', data);
export const savePersonalizedQuestDetails = (data: any) => api.post('/quests/details', data);

// Armory
export const purchaseArmoryItem = (data: any) => api.post('/armory/purchase', data);

// Documents
export const generateDocument = (template: any) => api.post('/documents/generate', { template });

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

export default api; 