import React, { useState, useEffect, useRef } from 'react';
import {
    FileText,
    Send,
    Loader2,
    Clock,
    Database,
    Search,
    BookOpen,
    Sparkles,
    MessageCircle
} from 'lucide-react';
import DocumentUpload from './DocumentUpload';
import { ragService } from '../services/awsRAGService';
import { updateGold, consumeEnergy, generateDocument, saveDocumentConversation, getDocumentConversationById, getDocumentConversations, deleteDocumentConversation, type Message } from '../services/api';
import { GOLD_COSTS, ENERGY_COSTS } from '../config/energy';
import ReactMarkdown from 'react-markdown';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import Modal from './Modal';
import confetti from 'canvas-confetti';
import paperBg from '../assets/wallpaper_2.jpg';
import DocumentConversationSidebar from './DocumentConversationSidebar';
import { v4 as uuidv4 } from 'uuid';

const parchmentStyles = `
  .parchment-container {
    position: relative;
    background: url(${paperBg}) no-repeat center center;
    background-size: cover;
    box-shadow: 
      inset 0 0 120px rgba(166, 124, 82, 0.3),
      inset 0 0 60px rgba(139, 69, 19, 0.2),
      inset 0 0 30px rgba(101, 67, 33, 0.2),
      0 0 40px rgba(0, 0, 0, 0.4),
      0 10px 50px rgba(0, 0, 0, 0.3);
    overflow: hidden;
    border-radius: 3px;
  }

  .parchment-container::before,
  .parchment-container::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 25px;
    z-index: 5;
    pointer-events: none;
  }

  .parchment-container::before {
    top: -5px;
    background: 
      linear-gradient(to bottom, 
        rgba(139, 69, 19, 0.3) 0%, 
        rgba(205, 133, 63, 0.2) 30%,
        transparent 100%),
      url("data:image/svg+xml,%3Csvg width='100' height='30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,20 Q10,10 20,15 T40,18 T60,16 T80,19 T100,17 L100,0 L0,0 Z' fill='%23f5e6d3' stroke='%238B6914' stroke-width='0.5' opacity='0.8'/%3E%3Cpath d='M0,25 Q15,15 30,20 T60,22 T90,20 L100,25 L100,30 L0,30 Z' fill='%23000000' opacity='0.2'/%3E%3C/svg%3E") repeat-x;
    filter: drop-shadow(0 3px 5px rgba(0,0,0,0.3));
  }

  .parchment-container::after {
    bottom: -5px;
    background: 
      linear-gradient(to top, 
        rgba(139, 69, 19, 0.3) 0%, 
        rgba(205, 133, 63, 0.2) 30%,
        transparent 100%),
      url("data:image/svg+xml,%3Csvg width='100' height='30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,10 Q10,20 20,15 T40,12 T60,14 T80,11 T100,13 L100,30 L0,30 Z' fill='%23f5e6d3' stroke='%238B6914' stroke-width='0.5' opacity='0.8'/%3E%3Cpath d='M0,5 Q15,15 30,10 T60,8 T90,10 L100,5 L100,0 L0,0 Z' fill='%23000000' opacity='0.2'/%3E%3C/svg%3E") repeat-x;
    filter: drop-shadow(0 -3px 5px rgba(0,0,0,0.3));
  }

  .paper-texture {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.4;
    pointer-events: none;
    background-image: 
      url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='roughPaper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' result='noise' seed='3'/%3E%3CfeDiffuseLighting in='noise' lighting-color='white' surfaceScale='1.5'%3E%3CfeDistantLight azimuth='45' elevation='60'/%3E%3C/feDiffuseLighting%3E%3CfeGaussianBlur stdDeviation='0.5'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23roughPaper)' opacity='1'/%3E%3C/svg%3E");
    mix-blend-mode: multiply;
  }

  .paper-wrinkles {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.3;
    pointer-events: none;
    background-image: 
      linear-gradient(115deg, transparent 40%, rgba(139, 69, 19, 0.1) 50%, transparent 60%),
      linear-gradient(65deg, transparent 35%, rgba(139, 69, 19, 0.08) 45%, transparent 55%),
      linear-gradient(-20deg, transparent 45%, rgba(139, 69, 19, 0.06) 50%, transparent 55%);
    background-size: 200px 200px, 300px 300px, 250px 250px;
    background-position: 0 0, 50px 50px, 100px 100px;
  }

  .coffee-stain {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(ellipse at center, 
      rgba(139, 90, 43, 0.1) 0%, 
      rgba(160, 82, 45, 0.08) 30%, 
      rgba(139, 69, 19, 0.05) 60%, 
      transparent 100%);
    filter: blur(2px);
  }

  .tea-stain {
    position: absolute;
    border-radius: 40% 60% 60% 40% / 60% 40% 60% 40%;
    background: radial-gradient(ellipse at center, 
      rgba(184, 134, 11, 0.08) 0%, 
      rgba(218, 165, 32, 0.06) 40%, 
      transparent 100%);
    filter: blur(3px);
  }

  .ink-stain {
    position: absolute;
    background: radial-gradient(ellipse at center, 
      rgba(46, 34, 24, 0.4) 0%, 
      rgba(46, 34, 24, 0.2) 40%, 
      transparent 70%);
    border-radius: 40% 60% 50% 50% / 50% 50% 60% 40%;
    filter: blur(6px);
    transform: rotate(var(--rotation, 0deg));
  }

  .ink-splatter {
    position: absolute;
    width: 8px;
    height: 8px;
    background: rgba(46, 34, 24, 0.3);
    border-radius: 50%;
    filter: blur(1px);
  }

  .old-paper-text {
    color: #2e2218;
    text-shadow: 
      1px 1px 1px rgba(0,0,0,0.1),
      0 0 1px rgba(139, 69, 19, 0.2);
    font-family: 'Georgia', 'Times New Roman', serif;
  }

  .parchment-inner {
    background: 
      linear-gradient(105deg, 
        rgba(255, 248, 220, 0.4) 0%, 
        rgba(245, 235, 215, 0.5) 50%, 
        rgba(255, 248, 220, 0.4) 100%);
    border: 1px solid rgba(160, 130, 100, 0.3);
    box-shadow: 
      inset 0 1px 4px rgba(139, 69, 19, 0.1),
      inset 0 0 20px rgba(222, 184, 135, 0.1);
    position: relative;
  }

  .parchment-inner::before,
  .parchment-inner::after {
    content: '';
    position: absolute;
    width: 40px;
    height: 40px;
    background: radial-gradient(ellipse at center, 
      rgba(139, 69, 19, 0.15) 0%, 
      transparent 70%);
  }

  .parchment-inner::before {
    top: -5px;
    right: -5px;
    border-radius: 0 8px 0 50%;
  }

  .parchment-inner::after {
    bottom: -5px;
    left: -5px;
    border-radius: 50% 0 8px 0;
  }

  .burn-mark {
    position: absolute;
    background: radial-gradient(ellipse at center,
      rgba(92, 51, 23, 0.3) 0%,
      rgba(139, 69, 19, 0.15) 40%,
      transparent 70%);
    filter: blur(8px);
  }

  .folded-corner {
    position: absolute;
    top: -2px;
    right: -2px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 30px 30px 0;
    border-color: transparent #f5e6d3 transparent transparent;
    filter: drop-shadow(-2px 2px 3px rgba(0,0,0,0.2));
  }

  .folded-corner::after {
    content: '';
    position: absolute;
    top: 0;
    right: -30px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 30px 30px 0;
    border-color: transparent rgba(139, 69, 19, 0.1) transparent transparent;
  }

  .parchment-inner:hover {
    box-shadow: 
      inset 0 1px 4px rgba(139, 69, 19, 0.15),
      inset 0 0 25px rgba(222, 184, 135, 0.15),
      0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .wax-seal {
    position: absolute;
    width: 60px;
    height: 60px;
    background: radial-gradient(circle at 30% 30%,
      #d2691e 0%,
      #8b4513 50%,
      #654321 100%);
    border-radius: 50%;
    box-shadow: 
      inset -2px -2px 4px rgba(0,0,0,0.3),
      inset 2px 2px 4px rgba(255,255,255,0.2),
      0 3px 6px rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: #3e2723;
    text-shadow: -1px -1px 1px rgba(0,0,0,0.3);
  }
`;

interface DocumentRAGProps {
    userId: string;
    guildData: any;
    updateGold: (gold: number) => void;
    userName?: string;
    ceoAvatar?: any;
    open?: boolean;
    onClose?: () => void;
    deleteDocument?: (docId: string) => Promise<void>;
}

interface UploadedDocument {
    id: string;
    name: string;
    uploadedAt: string;
    size: number;
}

interface ChatMessage {
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

class SoundManager {
    private sounds: { [key: string]: HTMLAudioElement } = {};
    private enabled: boolean = true;

    constructor() {
        this.sounds = {
            swordDraw: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp9y9Dn'),
            questComplete: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp9y9Dn'),
            magicCast: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp9y9Dn'),
        };
        Object.values(this.sounds).forEach(sound => {
            sound.volume = 0.3;
        });
    }
    play(soundName: keyof typeof this.sounds) {
        if (this.enabled && this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(e => console.log('Sound play failed:', e));
        }
    }
}
const soundManager = new SoundManager();

export const DocumentRAG: React.FC<DocumentRAGProps> = ({ userId, guildData, updateGold, ceoAvatar, open = true, onClose, deleteDocument }) => {
    const [documents, setDocuments] = useState<UploadedDocument[]>([]);
    const [loading, setLoading] = useState(false);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [selectedDocument, setSelectedDocument] = useState<UploadedDocument | null>(null);
    const [documentToPreview, setDocumentToPreview] = useState<UploadedDocument | null>(null);
    const [documentContent, setDocumentContent] = useState<string | null>(null);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [pdfError, setPdfError] = useState<string | null>(null);

    // New state for conversation features - showSidebar set to true by default
    const [showSidebar, setShowSidebar] = useState(true);
    const [conversations, setConversations] = useState<any[]>([]);
    const [currentConversation, setCurrentConversation] = useState<any>(null);
    const [savingConversation, setSavingConversation] = useState(false);

    // Load user documents and conversations independently on mount
    useEffect(() => {
        loadDocuments();
        loadConversations();
    }, [userId]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages, isProcessing]);

    // When document changes, update the UI but don't clear conversations
    useEffect(() => {
        if (selectedDocument) {
            // Only update the conversation/messages if we don't have a current conversation
            // or if we're changing documents
            if (!currentConversation || (currentConversation.documentId !== selectedDocument.id)) {
                // Check if there's a conversation for this document
                const docConversation = conversations.find(c => c.documentId === selectedDocument.id);

                if (docConversation) {
                    // If there's an existing conversation for this document, use it
                    setCurrentConversation(docConversation);
                    setChatMessages(Array.isArray(docConversation.messages) ? docConversation.messages : []);
                } else {
                    // Otherwise create a new default message for this document
                    setCurrentConversation(null);
                    setChatMessages([{
                        id: Date.now().toString(),
                        type: 'assistant',
                        content: `I've loaded "${selectedDocument.name}". What would you like to know about this document?`,
                        timestamp: new Date()
                    }]);
                }
            }
        }
    }, [selectedDocument]);

    const loadDocuments = async () => {
        try {
            setLoading(true);
            const docs = await ragService.getDocumentList(userId);
            setDocuments(docs);
        } catch (error) {
            console.error('Error loading documents:', error);
            setError('Failed to load documents');
        } finally {
            setLoading(false);
        }
    };

    const loadConversations = async () => {
        try {
            setLoading(true);
            const response = await getDocumentConversations();

            // Sort conversations by lastUpdated in descending order (newest first)
            const sortedConversations = response.data.sort((a: any, b: any) =>
                new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
            );

            // Always set all conversations regardless of document selection
            setConversations(sortedConversations);

            // If we have a current conversation, keep it selected
            // Otherwise, if we have any conversations, select the most recent one
            if (!currentConversation && sortedConversations.length > 0) {
                const mostRecent = sortedConversations[0];
                setCurrentConversation(mostRecent);
                setChatMessages(Array.isArray(mostRecent.messages) ? mostRecent.messages : []);

                // If this conversation has a document associated, also select that document
                if (mostRecent.documentId) {
                    const associatedDoc = documents.find(d => d.id === mostRecent.documentId);
                    if (associatedDoc) {
                        setSelectedDocument(associatedDoc);
                    }
                }
            } else if (!currentConversation) {
                // No conversations available, set default message
                setChatMessages([{
                    id: Date.now().toString(),
                    type: 'assistant',
                    content: selectedDocument
                        ? `I've loaded "${selectedDocument.name}". What would you like to know about this document?`
                        : 'Please select a document to start a conversation.',
                    timestamp: new Date()
                }]);
            }
        } catch (error) {
            console.error('Error loading conversations:', error);
            setError('Failed to load conversations.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (file: File) => {
        try {
            setError(null);
            const documentId = await ragService.uploadDocument(file, userId);
            soundManager.play('questComplete');
            confetti && confetti({ particleCount: 50, spread: 45, origin: { y: 0.8 } });

            // Deduct gold for document upload
            if (updateGold) {
                updateGold(-ENERGY_COSTS.DOCUMENT_UPLOAD);
            }

            const newDoc = {
                id: documentId,
                name: file.name,
                uploadedAt: new Date().toISOString(),
                size: file.size
            };

            setDocuments(prev => [...prev, newDoc]);

            // Rest of function...
        } catch (error) {
            console.error('Upload error:', error);
            setError('Failed to upload document. Please try again.');
            throw error;
        }
    };

    const handleAskQuestion = async () => {
        if (!currentQuestion.trim() || isProcessing || !selectedDocument) return;

        const messageId = uuidv4();
        const userMessage: ChatMessage = {
            id: messageId,
            type: 'user',
            content: currentQuestion,
            timestamp: new Date()
        };

        setChatMessages(prev => [...prev, userMessage]);
        setCurrentQuestion('');
        setIsProcessing(true);

        try {
            const response = await ragService.askQuestion(
                currentQuestion,
                userId
            );
            soundManager.play('magicCast');
            confetti && confetti({ particleCount: 30, spread: 45, origin: { y: 0.3 } });

            const assistantMessage: ChatMessage = {
                id: uuidv4(),
                type: 'assistant',
                content: response,
                timestamp: new Date()
            };

            setChatMessages(prev => [...prev, assistantMessage]);

            // Auto-save conversation after each question
            await saveConversation([...chatMessages, userMessage, assistantMessage]);
        } catch (error) {
            console.error('Question error:', error);
            setChatMessages(prev => [...prev, {
                id: uuidv4(),
                type: 'assistant',
                content: 'I encountered an error processing your question. Please try again.',
                timestamp: new Date()
            }]);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleGenerateWithSage = async () => {
        if (!currentQuestion.trim()) {
            setError('Please enter a topic or instruction for the Sage.');
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            // 1. Consume energy
            await consumeEnergy('DOCUMENT_GENERATION');
            soundManager.play('magicCast');

            // 2. Generate document
            const { data: generatedContent } = await generateDocument(currentQuestion);

            const assistantMessage: ChatMessage = {
                id: uuidv4(),
                type: 'assistant',
                content: generatedContent,
                timestamp: new Date(),
            };
            setChatMessages(prev => [...prev, assistantMessage]);
            setCurrentQuestion(''); // Clear input after sending
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

            // Auto-save conversation after generation
            await saveConversation([...chatMessages, assistantMessage]);
        } catch (err: any) {
            console.error('Sage generation error:', err);
            const errorMessage =
                err.response?.data?.message ||
                'The Sage failed to generate the document. Please try again.';
            setError(errorMessage);
            // Optionally add a message to the chat
            setChatMessages(prev => [
                ...prev,
                {
                    id: uuidv4(),
                    type: 'assistant',
                    content: `I am sorry, but I encountered a problem: ${errorMessage}`,
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsProcessing(false);
        }
    };

    // Save current conversation to backend
    const saveConversation = async (messagesToSave: ChatMessage[]) => {
        if (!selectedDocument) return;

        setSavingConversation(true);

        try {
            const conversationData = {
                documentId: selectedDocument.id,
                documentName: selectedDocument.name,
                messages: messagesToSave.map(({ id, type, content, timestamp }) => ({ id, type, content, timestamp })),
                title: (currentConversation as any)?.title || selectedDocument.name,
            };

            // Save conversation
            const response = await saveDocumentConversation(
                conversationData.documentId,
                conversationData.documentName,
                conversationData.messages,
                conversationData.title
            );

            // Update current conversation with the saved one
            const savedConversation = response.data.conversation;
            setCurrentConversation(savedConversation);

            // Update the main conversations list to refresh the sidebar
            setConversations(prevConvos => {
                const existingConvoIndex = prevConvos.findIndex(c => c._id === savedConversation._id);
                if (existingConvoIndex > -1) {
                    // Update existing conversation
                    const updatedConvos = [...prevConvos];
                    updatedConvos[existingConvoIndex] = savedConversation;
                    return updatedConvos;
                } else {
                    // Add new conversation
                    return [...prevConvos, savedConversation];
                }
            });
        } catch (error) {
            console.error('Error saving conversation:', error);
            setError('Failed to save conversation progress.');
        } finally {
            setSavingConversation(false);
        }
    };

    const handleSelectConversation = async (conversation: any) => {
        try {
            setLoading(true);

            // Set current conversation and load its messages regardless of document
            setCurrentConversation(conversation);

            // If the conversation has an associated document, select it as well
            if (conversation.documentId) {
                const doc = documents.find(d => d.id === conversation.documentId);
                if (doc) {
                    setSelectedDocument(doc);
                }
            }

            // Get the full conversation (in case it was updated)
            const response = await getDocumentConversationById(conversation._id);

            // Update current conversation with complete data
            setCurrentConversation(response.data);

            // Update chat messages with conversation messages
            const chatMsgs: ChatMessage[] = Array.isArray(response.data.messages)
                ? response.data.messages.map((msg: Message) => ({
                    id: msg.id,
                    type: msg.type,
                    content: msg.content,
                    timestamp: new Date(msg.timestamp)
                }))
                : [];

            setChatMessages(chatMsgs);

        } catch (error) {
            console.error('Error loading conversation:', error);
            setError('Failed to load the selected conversation');
        } finally {
            setLoading(false);
        }
    };

    const handleNewConversation = () => {
        // Reset current conversation
        setCurrentConversation(null);

        // Create welcome message based on document selection
        setChatMessages([
            {
                id: Date.now().toString(),
                type: 'assistant',
                content: selectedDocument
                    ? `I've loaded "${selectedDocument.name}". What would you like to know about this document?`
                    : 'Please select a document to start a conversation.',
                timestamp: new Date(),
            },
        ]);
    };

    const handleDeleteConversation = async (conversationId: string) => {
        try {
            await deleteDocumentConversation(conversationId);
            // Remove from local state
            const updatedConversations = conversations.filter(c => c._id !== conversationId);
            setConversations(updatedConversations);

            // If the deleted conversation was the current one, reset the chat
            if ((currentConversation as any)?._id === conversationId) {
                handleNewConversation();
            }
        } catch (err) {
            console.error('Error deleting conversation:', err);
            setError('Failed to delete conversation.');
        }
    };

    const formatFileSize = (bytes: number): string => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    };

    const handlePreviewDocument = async (doc: UploadedDocument, e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedDocument?.id !== doc.id) {
            setSelectedDocument(doc);
        }
        setDocumentToPreview(doc);
        setDocumentContent(null);
        setPreviewLoading(true);
        setPdfUrl(null);
        setPdfError(null);
        try {
            const ext = doc.name.split('.').pop()?.toLowerCase();
            if (ext === 'pdf') {
                const url = await ragService.getDocumentFileUrl(doc.id, userId);
                setPdfUrl(url);
            } else {
                const content = await ragService.getDocumentContent(doc.id, userId);
                setDocumentContent(content);
            }
        } catch (err) {
            setDocumentContent('Failed to load document preview.');
            setPdfError('Failed to load PDF preview.');
        } finally {
            setPreviewLoading(false);
        }
    };

    return (
        <>
            <style>{parchmentStyles}</style>
            <div className="w-full min-h-screen px-2 sm:px-4 md:px-6 py-4 md:py-6">
                <div className="max-w-7xl mx-auto">
                    <div className="parchment-container relative rounded-lg shadow-2xl overflow-visible">
                        {/* Paper texture overlay */}
                        <div className="paper-texture"></div>
                        <div className="paper-wrinkles"></div>

                        {/* Coffee and tea stains */}
                        <div className="coffee-stain" style={{ top: '15%', right: '10%', width: '120px', height: '100px' }}></div>
                        <div className="tea-stain" style={{ bottom: '20%', left: '5%', width: '80px', height: '90px' }}></div>
                        <div className="coffee-stain" style={{ top: '60%', left: '15%', width: '60px', height: '60px' }}></div>

                        {/* Ink stains and splatters */}
                        <div className="ink-stain" style={{ top: '10%', right: '5%', width: '40px', height: '40px', '--rotation': '45deg' } as any}></div>
                        <div className="ink-stain" style={{ bottom: '15%', left: '8%', width: '35px', height: '35px', '--rotation': '-30deg' } as any}></div>
                        <div className="ink-splatter" style={{ top: '12%', right: '8%' }}></div>
                        <div className="ink-splatter" style={{ top: '8%', right: '6%' }}></div>
                        <div className="ink-splatter" style={{ bottom: '18%', left: '6%' }}></div>

                        {/* Burn marks */}
                        <div className="burn-mark" style={{ top: '-10px', left: '30%', width: '60px', height: '20px' }}></div>
                        <div className="burn-mark" style={{ bottom: '-10px', right: '25%', width: '80px', height: '25px' }}></div>

                        {/* Folded corner */}
                        <div className="folded-corner"></div>

                        {/* Wax seal */}
                        <div className="wax-seal" style={{ top: '20px', right: '20px' }}>📜</div>

                        <div className="relative z-10 p-8">
                            {/* Header */}
                            <div className="pb-6 border-b-2 border-dashed border-amber-800/30">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex-1">
                                        <h2 className="text-3xl font-bold old-paper-text flex items-center space-x-2" style={{ fontFamily: 'Georgia, serif' }}>
                                            <Database className="w-7 h-7 text-amber-700" />
                                            <span>AI Sage's Archives</span>
                                        </h2>
                                        <p className="old-paper-text opacity-80 mt-1 text-sm italic">
                                            Upload your documents and let the AI Sage analyze their content
                                        </p>
                                    </div>
                                    {ceoAvatar && (
                                        <div className="flex items-center space-x-2 px-4 py-2 rounded parchment-inner">
                                            <span className="text-2xl">{ceoAvatar.avatar}</span>
                                            <span className="text-xs old-paper-text font-semibold">Mystical Guide</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="flex flex-row gap-8 pt-8 h-[70vh]">
                                {/* Left Sidebar - Document Conversations - always shows all conversations */}
                                {showSidebar && (
                                    <DocumentConversationSidebar
                                        className="w-80 border-r border-amber-700/20"
                                        conversations={conversations}
                                        onSelectConversation={handleSelectConversation}
                                        onNewConversation={handleNewConversation}
                                        onDeleteConversation={handleDeleteConversation}
                                        activeConversationId={currentConversation?._id}
                                        currentConversation={currentConversation}
                                        selectedDocumentId={selectedDocument?.id}
                                    />
                                )}

                                {/* Content Area */}
                                <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-8">
                                    {/* Left Column - Document Management */}
                                    <div className="xl:col-span-1 space-y-6">
                                        {/* Upload Section */}
                                        <div className="parchment-inner rounded-lg p-5">
                                            <h3 className="text-lg font-semibold old-paper-text mb-3 flex items-center space-x-2">
                                                <FileText className="w-5 h-5 text-amber-700" />
                                                <span>Upload Document</span>
                                            </h3>
                                            <DocumentUpload onUpload={handleUpload} guildData={guildData} />
                                        </div>

                                        {/* Documents List */}
                                        <div className="parchment-inner rounded-lg p-5 ">
                                            <div className="flex justify-between items-center mb-3">
                                                <h3 className="text-lg font-semibold old-paper-text flex items-center space-x-2">
                                                    <BookOpen className="w-5 h-5 text-amber-700" />
                                                    <span>Your Documents</span>
                                                    {loading && <Loader2 className="w-4 h-4 animate-spin text-amber-700" />}
                                                </h3>

                                                <button
                                                    className="flex items-center text-amber-700 hover:text-amber-800"
                                                    onClick={() => setShowSidebar(!showSidebar)}
                                                    title={showSidebar ? "Hide conversations" : "Show conversations"}
                                                >
                                                    <MessageCircle className="w-5 h-5" />
                                                </button>
                                            </div>

                                            {documents.length === 0 ? (
                                                <div className="text-center py-6">
                                                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50 text-amber-700" />
                                                    <p className="text-base old-paper-text opacity-70">No documents uploaded yet</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2 max-h-60 overflow-y-auto overflow-x-hidden">
                                                    {documents.map(doc => (
                                                        <div
                                                            key={doc.id}
                                                            className={`parchment-inner p-3 rounded hover:shadow-md transition-all cursor-pointer ${selectedDocument?.id === doc.id ? 'border-2 border-amber-700' : ''
                                                                }`}
                                                            onClick={() => setSelectedDocument(doc)}
                                                        >
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-medium old-paper-text text-sm truncate">
                                                                        {doc.name}
                                                                    </p>
                                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 text-xs old-paper-text opacity-60 mt-1 gap-1 sm:gap-0">
                                                                        <span className="flex items-center space-x-1">
                                                                            <Clock className="w-3 h-3" />
                                                                            <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                                                                        </span>
                                                                        <span>{formatFileSize(doc.size)}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center space-x-1 ml-2">
                                                                    <button
                                                                        className="p-1 text-amber-700 hover:text-amber-800 rounded-full hover:bg-amber-100/50 transition-colors"
                                                                        title="Preview document"
                                                                        onClick={(e) => handlePreviewDocument(doc, e)}
                                                                    >
                                                                        <BookOpen className="w-4 h-4" />
                                                                    </button>
                                                                    {deleteDocument && (
                                                                        <button
                                                                            className="text-red-700 hover:text-red-900 text-lg font-bold px-2"
                                                                            title="Delete document"
                                                                            onClick={async (e) => {
                                                                                e.stopPropagation();
                                                                                if (window.confirm('Are you sure you want to delete this document?')) {
                                                                                    await deleteDocument(doc.id);
                                                                                    await loadDocuments();
                                                                                }
                                                                            }}
                                                                        >
                                                                            ×
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Column - Chat Interface */}
                                    <div className="xl:col-span-2 parchment-inner rounded-lg p-6 flex flex-col h-full">
                                        {/* Chat Header */}
                                        <div className="mb-4 flex justify-between items-center">
                                            <div className="flex items-center space-x-2">
                                                <Sparkles className="w-5 h-5 text-amber-700" />
                                                <h3 className="text-lg font-bold old-paper-text">Ask the Sage</h3>
                                            </div>

                                            {savingConversation && (
                                                <div className="flex items-center text-xs text-amber-700">
                                                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                                    <span>Saving...</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Chat Messages */}
                                        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                                            {chatMessages?.length === 0 ? (
                                                <div className="text-center py-8 flex flex-col justify-center">
                                                    <Search className="w-12 h-12 text-amber-700 opacity-50 mx-auto mb-3" />
                                                    <p className="old-paper-text opacity-70 text-base px-4">
                                                        Upload a document and start asking questions!
                                                    </p>
                                                    <div className="mt-4 space-y-2 text-sm old-paper-text opacity-60 px-4 italic">
                                                        <p>Try questions like:</p>
                                                        <p>"What are the key insights from this document?"</p>
                                                        <p>"How can I apply this to my guild?"</p>
                                                        <p>"Summarize the main points"</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                (chatMessages ?? []).map(message => (
                                                    <div
                                                        key={message.id}
                                                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                                    >
                                                        <div
                                                            className={`max-w-[85%] rounded-lg p-4 ${message.type === 'user'
                                                                ? 'bg-amber-100/50 border border-amber-700/30'
                                                                : 'bg-amber-50/30 border border-amber-600/20'
                                                                }`}
                                                        >
                                                            {message.type === 'assistant' ? (
                                                                <div className="prose prose-sm max-w-none old-paper-text">
                                                                    <ReactMarkdown>{message.content}</ReactMarkdown>
                                                                </div>
                                                            ) : (
                                                                <p className="text-base old-paper-text">{message.content}</p>
                                                            )}
                                                            <p className="text-xs old-paper-text opacity-50 mt-2">
                                                                {message.timestamp.toLocaleTimeString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                            {isProcessing && (
                                                <div className="flex justify-start">
                                                    <div className="parchment-inner rounded-lg p-4 max-w-[85%]">
                                                        <div className="flex items-center space-x-2">
                                                            <Loader2 className="w-4 h-4 animate-spin text-amber-700" />
                                                            <p className="text-base old-paper-text italic">The Sage is processing your request...</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div ref={messagesEndRef} />
                                        </div>

                                        {/* Chat Input */}
                                        <div className="mt-4 flex gap-2">
                                            <input
                                                type="text"
                                                value={currentQuestion}
                                                onChange={(e) => setCurrentQuestion(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleAskQuestion()}
                                                placeholder="Ask the Sage about your documents..."
                                                className="flex-1 p-3 bg-amber-50/30 old-paper-text rounded-lg placeholder-amber-700/50 
                                                         border border-amber-700/30 focus:outline-none focus:border-amber-700/50 text-base
                                                         transition-all"
                                                disabled={isProcessing || !selectedDocument}
                                            />
                                            <button
                                                onClick={handleAskQuestion}
                                                disabled={isProcessing || !currentQuestion.trim() || !selectedDocument}
                                                className="px-4 py-3 bg-amber-700 text-amber-50 rounded-lg hover:bg-amber-800 
                                                         active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all 
                                                         flex items-center justify-center min-w-[48px] shadow-md"
                                            >
                                                {isProcessing ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <Send className="w-5 h-5" />
                                                )}
                                            </button>
                                            <button
                                                onClick={handleGenerateWithSage}
                                                disabled={isProcessing || !currentQuestion.trim()}
                                                className="px-4 py-3 bg-purple-700 text-amber-50 rounded-lg hover:bg-purple-800 
                                                         active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all 
                                                         flex items-center justify-center shadow-md"
                                            >
                                                <Sparkles className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Error Display */}
                            {error && (
                                <div className="mt-6 p-4 bg-red-100/50 border border-red-700/30 rounded-lg">
                                    <p className="text-red-800 text-base">{error}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Document Preview Modal */}
            <Modal open={!!documentToPreview} onClose={() => { setDocumentToPreview(null); setDocumentContent(null); setPdfUrl(null); setPdfError(null); }} size="xl">
                {documentToPreview && (
                    <div className="p-6 max-w-4xl w-full parchment-container rounded-lg">
                        <div className="paper-texture"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-2xl font-bold old-paper-text">{documentToPreview.name}</h3>
                                <button
                                    onClick={() => { setDocumentToPreview(null); setDocumentContent(null); setPdfUrl(null); setPdfError(null); }}
                                    className="old-paper-text hover:text-amber-900 text-2xl font-bold"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="parchment-inner rounded-lg p-6">
                                {previewLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <Loader2 className="w-8 h-8 animate-spin text-amber-700" />
                                    </div>
                                ) : documentToPreview.name.split('.').pop()?.toLowerCase() === 'pdf' ? (
                                    pdfUrl ? (
                                        <div className="bg-white p-2 rounded-lg h-full overflow-auto">
                                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                                <div style={{ height: '75vh' }}>
                                                    <Viewer fileUrl={pdfUrl} defaultScale={SpecialZoomLevel.PageFit} />
                                                </div>
                                            </Worker>
                                        </div>
                                    ) : (
                                        <div className="text-center text-red-700">{pdfError || 'Loading PDF...'}</div>
                                    )
                                ) : (
                                    <div className="prose prose-sm max-w-none old-paper-text h-full overflow-auto">
                                        <ReactMarkdown>{documentContent || ''}</ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default DocumentRAG;