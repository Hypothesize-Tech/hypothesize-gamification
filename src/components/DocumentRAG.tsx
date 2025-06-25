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

// Add this CSS to your global styles or as a styled component
const parchmentStyles = `
  .parchment-container {
    position: relative;
    background: 
      linear-gradient(to bottom, 
        rgba(245, 235, 220, 0.95) 0%, 
        rgba(235, 225, 210, 0.95) 20%,
        rgba(225, 215, 200, 0.95) 40%,
        rgba(235, 225, 210, 0.95) 60%,
        rgba(245, 235, 220, 0.95) 100%);
    box-shadow: 
      inset 0 0 40px rgba(139, 69, 19, 0.2),
      0 0 20px rgba(0, 0, 0, 0.5);
    overflow: hidden;
  }

  .parchment-container::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    background: 
      url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='roughPaper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' result='noise' seed='1'/%3E%3CfeDiffuseLighting in='noise' lighting-color='white' surfaceScale='1'%3E%3CfeDistantLight azimuth='45' elevation='60'/%3E%3C/feDiffuseLighting%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23roughPaper)' opacity='0.6'/%3E%3C/svg%3E");
    opacity: 0.3;
    pointer-events: none;
  }

  .torn-edge-top {
    position: absolute;
    top: -2px;
    left: 0;
    right: 0;
    height: 20px;
    background: url("data:image/svg+xml,%3Csvg width='100' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,15 Q5,5 10,15 T20,15 T30,15 T40,15 T50,15 T60,15 T70,15 T80,15 T90,15 T100,15 L100,0 L0,0 Z' fill='%23f5f5dc' opacity='0.9'/%3E%3C/svg%3E") repeat-x;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
  }

  .torn-edge-bottom {
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 20px;
    background: url("data:image/svg+xml,%3Csvg width='100' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,5 Q5,15 10,5 T20,5 T30,5 T40,5 T50,5 T60,5 T70,5 T80,5 T90,5 T100,5 L100,20 L0,20 Z' fill='%23f5f5dc' opacity='0.9'/%3E%3C/svg%3E") repeat-x;
    filter: drop-shadow(0 -2px 4px rgba(0,0,0,0.2));
  }

  .torn-edge-left {
    position: absolute;
    top: 0;
    left: -2px;
    bottom: 0;
    width: 20px;
    background: url("data:image/svg+xml,%3Csvg width='20' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15,0 Q5,5 15,10 T15,20 T15,30 T15,40 T15,50 T15,60 T15,70 T15,80 T15,90 T15,100 L0,100 L0,0 Z' fill='%23f5f5dc' opacity='0.9'/%3E%3C/svg%3E") repeat-y;
    filter: drop-shadow(2px 0 4px rgba(0,0,0,0.2));
  }

  .torn-edge-right {
    position: absolute;
    top: 0;
    right: -2px;
    bottom: 0;
    width: 20px;
    background: url("data:image/svg+xml,%3Csvg width='20' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5,0 Q15,5 5,10 T5,20 T5,30 T5,40 T5,50 T5,60 T5,70 T5,80 T5,90 T5,100 L20,100 L20,0 Z' fill='%23f5f5dc' opacity='0.9'/%3E%3C/svg%3E") repeat-y;
    filter: drop-shadow(-2px 0 4px rgba(0,0,0,0.2));
  }

  .old-paper-text {
    color: #3e2723;
    text-shadow: 1px 1px 1px rgba(0,0,0,0.1);
  }

  .parchment-inner {
    background: rgba(245, 235, 220, 0.4);
    border: 1px solid rgba(139, 69, 19, 0.2);
    box-shadow: inset 0 0 10px rgba(139, 69, 19, 0.1);
  }

  .ink-stain {
    position: absolute;
    width: 40px;
    height: 40px;
    background: radial-gradient(ellipse at center, rgba(46, 34, 24, 0.3) 0%, transparent 70%);
    border-radius: 50%;
    filter: blur(8px);
  }
`;

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

            setChatMessages(prev => [...prev, {
                id: Date.now().toString(),
                type: 'assistant',
                content: `I've successfully processed "${file.name}". I'm now ready to answer questions about this document and help you extract insights for your startup journey!`,
                timestamp: new Date()
            }]);

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

    const handlePreviewDocument = async (doc: UploadedDocument) => {
        setSelectedDocument(doc);
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
                        {/* Torn edges */}
                        <div className="torn-edge-top"></div>
                        <div className="torn-edge-bottom"></div>
                        <div className="torn-edge-left"></div>
                        <div className="torn-edge-right"></div>

                        {/* Ink stains for atmosphere */}
                        <div className="ink-stain" style={{ top: '10%', right: '5%' }}></div>
                        <div className="ink-stain" style={{ bottom: '15%', left: '8%' }}></div>

                        <div className="relative z-10 p-8">
                            {/* Header */}
                            <div className="pb-6 border-b-2 border-dashed border-amber-800/30">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex-1">
                                        <h2 className="text-3xl font-bold old-paper-text flex items-center space-x-2" style={{ fontFamily: 'Georgia, serif' }}>
                                            <Database className="w-7 h-7 text-amber-700" />
                                            <span>Document Assistant</span>
                                        </h2>
                                        <p className="old-paper-text opacity-80 mt-1 text-sm italic">
                                            Upload your documents and let the Assistant analyze their content
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
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pt-8">
                                {/* Left Column - Document Management */}
                                <div className="xl:col-span-1 space-y-6">
                                    {/* Upload Section */}
                                    <div className="parchment-inner rounded-lg p-5">
                                        <h3 className="text-lg font-semibold old-paper-text mb-3 flex items-center space-x-2">
                                            <FileText className="w-5 h-5 text-amber-700" />
                                            <span>Upload Document</span>
                                        </h3>
                                        <DocumentUpload onUpload={handleUpload} />
                                    </div>

                                    {/* Documents List */}
                                    <div className="parchment-inner rounded-lg p-5">
                                        <h3 className="text-lg font-semibold old-paper-text mb-3 flex items-center space-x-2">
                                            <BookOpen className="w-5 h-5 text-amber-700" />
                                            <span>Your Documents</span>
                                            {loading && <Loader2 className="w-4 h-4 animate-spin text-amber-700" />}
                                        </h3>

                                        {documents.length === 0 ? (
                                            <div className="text-center py-6">
                                                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50 text-amber-700" />
                                                <p className="text-base old-paper-text opacity-70">No documents uploaded yet</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                                {documents.map(doc => (
                                                    <div
                                                        key={doc.id}
                                                        className="parchment-inner p-3 rounded hover:shadow-md transition-all cursor-pointer"
                                                        onClick={() => handlePreviewDocument(doc)}
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
                                                            {deleteDocument && (
                                                                <button
                                                                    className="ml-2 text-red-700 hover:text-red-900 text-lg font-bold px-2"
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
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column - Chat Interface */}
                                <div className="xl:col-span-2 parchment-inner rounded-lg p-6 flex flex-col h-[70vh]">
                                    {/* Chat Header */}
                                    <div className="mb-4 flex items-center space-x-2">
                                        <Sparkles className="w-5 h-5 text-amber-700" />
                                        <h3 className="text-lg font-bold old-paper-text">Ask the Assistant</h3>
                                    </div>

                                    {/* Chat Messages */}
                                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                                        {chatMessages.length === 0 ? (
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
                                            chatMessages.map(message => (
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
                                                        <p className="text-base old-paper-text italic">The Assistant is processing your request...</p>
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
                                            placeholder="Ask the Assistant about your documents..."
                                            className="flex-1 p-3 bg-amber-50/30 old-paper-text rounded-lg placeholder-amber-700/50 
                                                     border border-amber-700/30 focus:outline-none focus:border-amber-700/50 text-base
                                                     transition-all"
                                            disabled={isProcessing || documents.length === 0}
                                        />
                                        <button
                                            onClick={handleAskQuestion}
                                            disabled={isProcessing || !currentQuestion.trim() || documents.length === 0}
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
            <Modal open={!!selectedDocument} onClose={() => { setSelectedDocument(null); setDocumentContent(null); setPdfUrl(null); setPdfError(null); }} size="xl">
                {selectedDocument && (
                    <div className="p-6 max-w-4xl w-full parchment-container rounded-lg">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-2xl font-bold old-paper-text">{selectedDocument.name}</h3>
                                <button
                                    onClick={() => { setSelectedDocument(null); setDocumentContent(null); setPdfUrl(null); setPdfError(null); }}
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
                                ) : selectedDocument.name.split('.').pop()?.toLowerCase() === 'pdf' ? (
                                    pdfUrl ? (
                                        <div className="bg-white p-2 rounded-lg h-full overflow-auto">
                                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                                <Viewer
                                                    fileUrl={pdfUrl}
                                                    defaultScale={SpecialZoomLevel.PageWidth}
                                                />
                                            </Worker>
                                        </div>
                                    ) : pdfError ? (
                                        <div className="p-4 rounded-lg text-red-700 h-full flex items-center justify-center text-center">
                                            <div>
                                                <p className="text-base">{pdfError}</p>
                                                <button
                                                    onClick={() => handlePreviewDocument(selectedDocument)}
                                                    className="mt-2 px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800 text-base"
                                                >
                                                    Try Again
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 rounded-lg old-paper-text h-full flex items-center justify-center">
                                            <p className="text-base">Loading PDF preview...</p>
                                        </div>
                                    )
                                ) : documentContent ? (
                                    (() => {
                                        const ext = selectedDocument.name.split('.').pop()?.toLowerCase();
                                        if (ext === 'md') {
                                            return (
                                                <div className="prose prose-sm max-w-none p-4 rounded-lg h-full overflow-auto old-paper-text">
                                                    <ReactMarkdown>{documentContent}</ReactMarkdown>
                                                </div>
                                            );
                                        } else if (ext === 'txt' || ext === 'csv') {
                                            return (
                                                <pre className="p-4 rounded-lg old-paper-text overflow-auto h-full whitespace-pre-wrap text-sm font-mono">
                                                    {documentContent}
                                                </pre>
                                            );
                                        } else {
                                            return (
                                                <div className="p-4 rounded-lg old-paper-text h-full flex items-center justify-center">
                                                    <p className="text-base text-center">Preview not supported for this file type.</p>
                                                </div>
                                            );
                                        }
                                    })()
                                ) : (
                                    <div className="p-4 rounded-lg old-paper-text h-full flex items-center justify-center">
                                        <p className="text-base">No content to preview.</p>
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