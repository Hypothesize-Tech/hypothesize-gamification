import React, { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import { getAuthenticatedUser, getGuild, loginWithGoogle, logout as logoutApi } from '../services/api';

interface User {
    _id: string;
    name: string;
    email: string;
    picture: string;
    guildId?: string;
}

interface AuthContextType {
    user: User | null;
    guildData: any | null;
    loading: boolean;
    signIn: (code: string) => Promise<void>;
    signOut: () => void;
    refetch: () => Promise<void>;
    setGuildData: (data: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [guildData, setGuildData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchInitialData = async () => {
        try {
            const userData = await getAuthenticatedUser();
            if (userData) {
                setUser(userData);
                if (userData.guildId) {
                    const { data: guild } = await getGuild(userData.guildId);
                    setGuildData(guild);
                } else {
                    setGuildData(null);
                }
            } else {
                setUser(null);
                setGuildData(null);
            }
        } catch (error) {
            console.error("Failed to fetch initial data:", error);
            setUser(null);
            setGuildData(null);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchInitialData();
            setLoading(false);
        };
        loadData();
    }, []);

    const signIn = async (code: string) => {
        setLoading(true);
        try {
            await loginWithGoogle(code);
            await fetchInitialData();
        } catch (error) {
            console.error("Sign in error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signOut = () => {
        logoutApi();
        setUser(null);
        setGuildData(null);
    };

    return (
        <AuthContext.Provider value={{ user, guildData, loading, signIn, signOut, refetch: fetchInitialData, setGuildData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 