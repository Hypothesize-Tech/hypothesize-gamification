// src/components/DocumentRAG.tsx
import React, { useState, useEffect } from 'react';
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

interface DocumentRAGProps {
    userId: string;
    userName?: string;
    ceoAvatar?: any;
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

export const DocumentRAG: React.FC<DocumentRAGProps> = ({ userId, userName, ceoAvatar }) => {
    const [documents, setDocuments] = useState<UploadedDocument[]>([]);
    const [loading, setLoading] = useState(false);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load user documents on mount
    useEffect(() => {
        loadDocuments();
    }, [userId]);

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

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="bg-gray-800 rounded-lg shadow-xl">
                {/* Header */}
                <div className="p-6 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                                <Database className="w-6 h-6 text-purple-500" />
                                <span>Document Intelligence</span>
                            </h2>
                            <p className="text-gray-400 mt-1">
                                Upload documents and let AI help you extract insights for your startup
                            </p>
                        </div>
                        {ceoAvatar && (
                            <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg bg-gradient-to-r ${ceoAvatar.color} bg-opacity-20`}>
                                <span className="text-2xl">{ceoAvatar.avatar}</span>
                                <span className="text-sm">Powered by AI</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                    {/* Left Column - Document Management */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Upload Section */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                                <FileText className="w-5 h-5" />
                                <span>Upload Document</span>
                            </h3>
                            <DocumentUpload onUpload={handleUpload} />
                        </div>

                        {/* Documents List */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                                <BookOpen className="w-5 h-5" />
                                <span>Your Documents</span>
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            </h3>

                            {documents.length === 0 ? (
                                <div className="text-center py-8 text-gray-400">
                                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>No documents uploaded yet</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {documents.map(doc => (
                                        <div
                                            key={doc.id}
                                            className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-all"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <p className="font-medium text-white text-sm truncate">
                                                        {doc.name}
                                                    </p>
                                                    <div className="flex items-center space-x-3 text-xs text-gray-400 mt-1">
                                                        <span className="flex items-center space-x-1">
                                                            <Clock className="w-3 h-3" />
                                                            <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                                                        </span>
                                                        <span>{formatFileSize(doc.size)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Chat Interface */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-700 rounded-lg h-[600px] flex flex-col">
                            {/* Chat Header */}
                            <div className="p-4 border-b border-gray-600">
                                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                                    <Sparkles className="w-5 h-5 text-purple-500" />
                                    <span>Ask About Your Documents</span>
                                </h3>
                                <p className="text-sm text-gray-400 mt-1">
                                    Get insights, summaries, and actionable advice from your documents
                                </p>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {chatMessages.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Search className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                                        <p className="text-gray-400">
                                            Upload a document and start asking questions!
                                        </p>
                                        <div className="mt-4 space-y-2 text-sm text-gray-500">
                                            <p>Try questions like:</p>
                                            <p className="italic">"What are the key insights from this document?"</p>
                                            <p className="italic">"How can I apply this to my startup?"</p>
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
                                                className={`max-w-[80%] rounded-lg p-4 ${message.type === 'user'
                                                    ? 'bg-purple-600 text-white'
                                                    : 'bg-gray-600 text-gray-100'
                                                    }`}
                                            >
                                                {message.type === 'assistant' ? (
                                                    <ReactMarkdown>{message.content}</ReactMarkdown>
                                                ) : (
                                                    <p>{message.content}</p>
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
                                        <div className="bg-gray-600 rounded-lg p-4 max-w-[80%]">
                                            <div className="flex items-center space-x-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <p className="text-sm">Analyzing your documents...</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Chat Input */}
                            <div className="p-4 border-t border-gray-600">
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={currentQuestion}
                                        onChange={(e) => setCurrentQuestion(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                                        placeholder="Ask a question about your documents..."
                                        className="flex-1 p-3 bg-gray-600 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        disabled={isProcessing || documents.length === 0}
                                    />
                                    <button
                                        onClick={handleAskQuestion}
                                        disabled={isProcessing || !currentQuestion.trim() || documents.length === 0}
                                        className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mx-6 mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
                        <p className="text-red-400">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentRAG;