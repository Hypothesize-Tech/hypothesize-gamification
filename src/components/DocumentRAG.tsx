// src/components/DocumentRAG.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
    FileText,
    Send,
    Loader2,
    Clock,
    Database,
    Search,
    BookOpen,
    Sparkles
} from 'lucide-react';
import DocumentUpload from './DocumentUpload';
import { ragService } from '../services/awsRAGService';
import ReactMarkdown from 'react-markdown';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import Modal from './Modal';
import confetti from 'canvas-confetti';

interface DocumentRAGProps {
    userId: string;
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
            swordHit: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp9y9Dn'),
            coinCollect: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp9y9Dn'),
            purchase: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp9y9Dn'),
            levelUp: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp9y9Dn'),
            questComplete: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp9y9Dn'),
            magicCast: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp9y9Dn'),
            error: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp9y9Dn')
        };
        Object.values(this.sounds).forEach(sound => {
            sound.volume = 0.3;
        });
    }
    play(soundName: keyof typeof this.sounds) {
        if (this.enabled && this.sounds[soundName]) {
            if (soundName === 'swordDraw') {
                this.sounds[soundName].volume = 0.2;
            }
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(e => console.log('Sound play failed:', e));
        }
    }
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
    isEnabled() {
        return this.enabled;
    }
}
const soundManager = new SoundManager();

export const DocumentRAG: React.FC<DocumentRAGProps> = ({ userId, ceoAvatar, open = true, onClose, deleteDocument }) => {
    const [documents, setDocuments] = useState<UploadedDocument[]>([]);
    const [loading, setLoading] = useState(false);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [selectedDocument, setSelectedDocument] = useState<UploadedDocument | null>(null);
    const [documentContent, setDocumentContent] = useState<string | null>(null);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [pdfError, setPdfError] = useState<string | null>(null);

    // Load user documents on mount
    useEffect(() => {
        loadDocuments();
    }, [userId]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages, isProcessing]);

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

    const handleUpload = async (file: File) => {
        try {
            setError(null);
            await ragService.uploadDocument(file, userId);
            soundManager.play('questComplete');
            confetti && confetti({ particleCount: 50, spread: 45, origin: { y: 0.8 } });

            // Add welcome message for new document
            setChatMessages(prev => [...prev, {
                id: Date.now().toString(),
                type: 'assistant',
                content: `I've successfully processed "${file.name}". I'm now ready to answer questions about this document and help you extract insights for your startup journey!`,
                timestamp: new Date()
            }]);

            // Reload documents
            await loadDocuments();
        } catch (error) {
            console.error('Upload error:', error);
            setError('Failed to upload document. Please try again.');
            throw error;
        }
    };

    const handleAskQuestion = async () => {
        if (!currentQuestion.trim() || isProcessing) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
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
                id: (Date.now() + 1).toString(),
                type: 'assistant',
                content: response,
                timestamp: new Date()
            };

            setChatMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Question error:', error);
            setChatMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                type: 'assistant',
                content: 'I encountered an error processing your question. Please try again.',
                timestamp: new Date()
            }]);
        } finally {
            setIsProcessing(false);
        }
    };

    const formatFileSize = (bytes: number): string => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    };

    // Handle document click for preview
    const handlePreviewDocument = async (doc: UploadedDocument) => {
        setSelectedDocument(doc);
        setDocumentContent(null);
        setPreviewLoading(true);
        setPdfUrl(null);
        setPdfError(null);
        try {
            const ext = doc.name.split('.').pop()?.toLowerCase();
            if (ext === 'pdf') {
                // Fetch the S3 file URL for the PDF
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
        <div className="w-full min-h-screen px-2 sm:px-4 md:px-6 py-4 md:py-6 font-cinzel">
            <div className="max-w-7xl mx-auto">
                <div className="parchment rounded-lg shadow-xl overflow-hidden magic-border">
                    {/* Header */}
                    <div className="p-4 sm:p-6 border-b border-yellow-700 bg-gradient-to-r from-purple-900 to-indigo-900">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-yellow-100 flex items-center space-x-2">
                                    <Database className="w-6 h-6 text-purple-500 flex-shrink-0 gem-shine" />
                                    <span className="truncate">Document Oracle</span>
                                </h2>
                                <p className="text-gray-300 mt-1 text-sm">
                                    Upload documents and let the Oracle divine their secrets for your guild
                                </p>
                            </div>
                            {ceoAvatar && (
                                <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r ${ceoAvatar.color} bg-opacity-20 self-start sm:self-auto`}>
                                    <span className="text-2xl gem-shine">{ceoAvatar.avatar}</span>
                                    <span className="text-xs whitespace-nowrap text-yellow-100">Powered by AI</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 p-6">
                        {/* Left Column - Document Management */}
                        <div className="xl:col-span-1 space-y-6">
                            {/* Upload Section */}
                            <div className="parchment p-4 magic-border">
                                <h3 className="text-lg font-semibold text-yellow-100 mb-3 flex items-center space-x-2">
                                    <FileText className="w-5 h-5 flex-shrink-0" />
                                    <span>Upload Scroll</span>
                                </h3>
                                <DocumentUpload onUpload={handleUpload} />
                            </div>

                            {/* Documents List */}
                            <div className="parchment p-4 magic-border">
                                <h3 className="text-lg font-semibold text-yellow-100 mb-3 flex items-center space-x-2">
                                    <BookOpen className="w-5 h-5 flex-shrink-0" />
                                    <span>Your Scrolls</span>
                                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                </h3>

                                {documents.length === 0 ? (
                                    <div className="text-center py-6 text-gray-400">
                                        <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p className="text-base">No scrolls uploaded yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {documents.map(doc => (
                                            <div
                                                key={doc.id}
                                                className="parchment p-3 rounded-lg hover:scale-105 transition-all cursor-pointer magic-border"
                                                onClick={() => handlePreviewDocument(doc)}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-yellow-100 text-sm truncate">
                                                            {doc.name}
                                                        </p>
                                                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 text-xs text-gray-400 mt-1 gap-1 sm:gap-0">
                                                            <span className="flex items-center space-x-1">
                                                                <Clock className="w-3 h-3 flex-shrink-0" />
                                                                <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                                                            </span>
                                                            <span>{formatFileSize(doc.size)}</span>
                                                        </div>
                                                    </div>
                                                    {deleteDocument && (
                                                        <button
                                                            className="ml-2 text-red-400 hover:text-red-200 text-lg font-bold px-2"
                                                            title="Delete document"
                                                            onClick={async (e) => {
                                                                e.stopPropagation();
                                                                if (window.confirm('Art thou certain ye wish to destroy this scroll?')) {
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
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Chat Interface */}
                        <div className="xl:col-span-2 mt-6 xl:mt-0 parchment p-6 magic-border flex flex-col h-[70vh]">
                            {/* Chat Header */}
                            <div className="mb-4 flex items-center space-x-2">
                                <Sparkles className="w-5 h-5 text-purple-500 gem-shine" />
                                <h3 className="text-lg font-bold text-yellow-100">Ask the Oracle</h3>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                                {chatMessages.length === 0 ? (
                                    <div className="text-center py-8 flex flex-col justify-center">
                                        <Search className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                                        <p className="text-gray-400 text-base px-4">
                                            Upload a scroll and start asking questions!
                                        </p>
                                        <div className="mt-4 space-y-2 text-sm text-gray-500 px-4">
                                            <p>Try questions like:</p>
                                            <p className="italic">"What are the key insights from this scroll?"</p>
                                            <p className="italic">"How can I apply this to my guild?"</p>
                                            <p className="italic">"Summarize the main points"</p>
                                        </div>
                                    </div>
                                ) : (
                                    chatMessages.map(message => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[85%] rounded-lg p-4 ${message.type === 'user'
                                                    ? 'bg-purple-800 text-white magic-border'
                                                    : 'parchment text-gray-100 magic-border'
                                                    }`}
                                            >
                                                {message.type === 'assistant' ? (
                                                    <div className="prose prose-sm max-w-none prose-invert">
                                                        <ReactMarkdown>{message.content}</ReactMarkdown>
                                                    </div>
                                                ) : (
                                                    <p className="text-base">{message.content}</p>
                                                )}
                                                <p className="text-xs opacity-70 mt-2">
                                                    {message.timestamp.toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                                {isProcessing && (
                                    <div className="flex justify-start">
                                        <div className="parchment rounded-lg p-4 magic-border max-w-[85%]">
                                            <div className="flex items-center space-x-2">
                                                <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                                                <p className="text-base">The Oracle consults the stars...</p>
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
                                    placeholder="Ask the Oracle about your scrolls..."
                                    className="flex-1 p-3 bg-gray-700 text-white rounded-lg placeholder-gray-400 
                                             focus:outline-none focus:ring-2 focus:ring-purple-500 text-base
                                             transition-all hover:bg-gray-600"
                                    disabled={isProcessing || documents.length === 0}
                                />
                                <button
                                    onClick={handleAskQuestion}
                                    disabled={isProcessing || !currentQuestion.trim() || documents.length === 0}
                                    className="px-4 py-3 bg-gradient-to-r from-purple-800 to-pink-700 text-white rounded-lg hover:from-purple-700 hover:to-pink-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center min-w-[48px] magic-border"
                                >
                                    {isProcessing ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Send className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="mx-6 mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg parchment magic-border">
                            <p className="text-red-400 text-base">{error}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Document Preview Modal */}
            <Modal open={!!selectedDocument} onClose={() => { setSelectedDocument(null); setDocumentContent(null); setPdfUrl(null); setPdfError(null); }} size="xl">
                {selectedDocument && (
                    <div className="p-6 max-w-4xl w-full parchment rounded-lg magic-border">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl font-bold text-yellow-100">{selectedDocument.name}</h3>
                            <button
                                onClick={() => { setSelectedDocument(null); setDocumentContent(null); setPdfUrl(null); setPdfError(null); }}
                                className="text-gray-400 hover:text-white text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        <div className="parchment rounded-lg p-6">
                            {previewLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                                </div>
                            ) : selectedDocument.name.split('.').pop()?.toLowerCase() === 'pdf' ? (
                                pdfUrl ? (
                                    <div className="bg-gray-800 p-2 rounded-lg h-full overflow-auto">
                                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                            <Viewer
                                                fileUrl={pdfUrl}
                                                defaultScale={SpecialZoomLevel.PageWidth}
                                            />
                                        </Worker>
                                    </div>
                                ) : pdfError ? (
                                    <div className="bg-gray-800 p-4 rounded-lg text-red-400 h-full flex items-center justify-center text-center">
                                        <div>
                                            <p className="text-base">{pdfError}</p>
                                            <button
                                                onClick={() => handlePreviewDocument(selectedDocument)}
                                                className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-base"
                                            >
                                                Try Again
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gray-800 p-4 rounded-lg text-gray-400 h-full flex items-center justify-center">
                                        <p className="text-base">Loading PDF preview...</p>
                                    </div>
                                )
                            ) : documentContent ? (
                                (() => {
                                    const ext = selectedDocument.name.split('.').pop()?.toLowerCase();
                                    if (ext === 'md') {
                                        return (
                                            <div className="prose prose-sm max-w-none bg-gray-800 p-4 rounded-lg h-full overflow-auto prose-invert">
                                                <ReactMarkdown>{documentContent}</ReactMarkdown>
                                            </div>
                                        );
                                    } else if (ext === 'txt' || ext === 'csv') {
                                        return (
                                            <pre className="bg-gray-800 p-4 rounded-lg text-gray-100 overflow-auto h-full whitespace-pre-wrap text-sm">
                                                {documentContent}
                                            </pre>
                                        );
                                    } else {
                                        return (
                                            <div className="bg-gray-800 p-4 rounded-lg text-gray-400 h-full flex items-center justify-center">
                                                <p className="text-base text-center">Preview not supported for this file type.</p>
                                            </div>
                                        );
                                    }
                                })()
                            ) : (
                                <div className="bg-gray-800 p-4 rounded-lg text-gray-400 h-full flex items-center justify-center">
                                    <p className="text-base">No content to preview.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default DocumentRAG;