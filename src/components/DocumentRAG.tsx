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

export const DocumentRAG: React.FC<DocumentRAGProps> = ({ userId, ceoAvatar }) => {
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
        <div className="w-full min-h-screen px-2 sm:px-4 md:px-6 py-4 md:py-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="p-4 sm:p-6 border-b border-gray-700">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex-1">
                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white flex items-center space-x-2">
                                    <Database className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 flex-shrink-0" />
                                    <span className="truncate">Document Intelligence</span>
                                </h2>
                                <p className="text-gray-400 mt-1 text-sm sm:text-base">
                                    Upload documents and let AI help you extract insights for your startup
                                </p>
                            </div>
                            {ceoAvatar && (
                                <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r ${ceoAvatar.color} bg-opacity-20 self-start sm:self-auto`}>
                                    <span className="text-xl sm:text-2xl">{ceoAvatar.avatar}</span>
                                    <span className="text-xs sm:text-sm whitespace-nowrap">Powered by AI</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6">
                        {/* Left Column - Document Management */}
                        <div className="xl:col-span-1 space-y-4 sm:space-y-6">
                            {/* Upload Section */}
                            <div>
                                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                    <span>Upload Document</span>
                                </h3>
                                <DocumentUpload onUpload={handleUpload} />
                            </div>

                            {/* Documents List */}
                            <div>
                                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                    <span>Your Documents</span>
                                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                </h3>

                                {documents.length === 0 ? (
                                    <div className="text-center py-6 sm:py-8 text-gray-400">
                                        <FileText className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm sm:text-base">No documents uploaded yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-60 sm:max-h-80 lg:max-h-96 overflow-y-auto">
                                        {documents.map(doc => (
                                            <div
                                                key={doc.id}
                                                className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 active:scale-[0.98] 
                                                         transition-all duration-200 cursor-pointer touch-manipulation"
                                                onClick={() => handlePreviewDocument(doc)}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-white text-sm truncate">
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
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Chat Interface */}
                        <div className="xl:col-span-2 mt-6 xl:mt-0">
                            <div className="bg-gray-700 rounded-lg flex flex-col h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[75vh] xl:h-[calc(100vh-280px)] min-h-[400px] max-h-[800px]">
                                {/* Chat Header */}
                                <div className="p-3 sm:p-4 border-b border-gray-600 flex-shrink-0">
                                    <h3 className="text-base sm:text-lg font-semibold text-white flex items-center space-x-2">
                                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 flex-shrink-0" />
                                        <span className="truncate">Ask About Your Documents</span>
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-400 mt-1">
                                        Get insights, summaries, and actionable advice from your documents
                                    </p>
                                </div>

                                {/* Chat Messages */}
                                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                                    {chatMessages.length === 0 ? (
                                        <div className="text-center py-8 sm:py-12 h-full flex flex-col justify-center">
                                            <Search className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500 mx-auto mb-3" />
                                            <p className="text-gray-400 text-sm sm:text-base px-4">
                                                Upload a document and start asking questions!
                                            </p>
                                            <div className="mt-4 space-y-2 text-xs sm:text-sm text-gray-500 px-4">
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
                                                    className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-3 sm:p-4 ${message.type === 'user'
                                                        ? 'bg-purple-600 text-white'
                                                        : 'bg-gray-600 text-gray-100'
                                                        }`}
                                                >
                                                    {message.type === 'assistant' ? (
                                                        <div className="prose prose-sm sm:prose max-w-none prose-invert">
                                                            <ReactMarkdown>{message.content}</ReactMarkdown>
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm sm:text-base">{message.content}</p>
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
                                            <div className="bg-gray-600 rounded-lg p-3 sm:p-4 max-w-[85%] sm:max-w-[80%]">
                                                <div className="flex items-center space-x-2">
                                                    <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                                                    <p className="text-sm">Analyzing your documents...</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Chat Input */}
                                <div className="p-3 sm:p-4 border-t border-gray-600 flex-shrink-0">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={currentQuestion}
                                            onChange={(e) => setCurrentQuestion(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleAskQuestion()}
                                            placeholder="Ask a question about your documents..."
                                            className="flex-1 p-3 bg-gray-600 text-white rounded-lg placeholder-gray-400 
                                                     focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base
                                                     transition-all duration-200 hover:bg-gray-500/50"
                                            disabled={isProcessing || documents.length === 0}
                                        />
                                        <button
                                            onClick={handleAskQuestion}
                                            disabled={isProcessing || !currentQuestion.trim() || documents.length === 0}
                                            className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                                                     active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed 
                                                     transition-all duration-200 flex items-center justify-center 
                                                     min-w-[48px] touch-manipulation"
                                        >
                                            {isProcessing ? (
                                                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                            ) : (
                                                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="mx-4 sm:mx-6 mb-4 sm:mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
                            <p className="text-red-400 text-sm sm:text-base">{error}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Document Preview Modal */}
            {selectedDocument && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-2 sm:p-4">
                    <div className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl h-full max-h-[90vh] sm:max-h-[85vh] p-4 sm:p-6 relative flex flex-col">
                        <button
                            className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-400 hover:text-white text-2xl sm:text-3xl z-10 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-gray-800 transition-colors"
                            onClick={() => { setSelectedDocument(null); setDocumentContent(null); setPdfUrl(null); setPdfError(null); }}
                        >
                            ×
                        </button>
                        <h3 className="text-lg sm:text-xl font-bold mb-4 text-white pr-8 sm:pr-12 truncate">
                            {selectedDocument.name}
                        </h3>
                        <div className="flex-1 overflow-hidden">
                            {previewLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                                </div>
                            ) : selectedDocument && selectedDocument.name.split('.').pop()?.toLowerCase() === 'pdf' ? (
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
                                            <p className="text-sm sm:text-base">{pdfError}</p>
                                            <button
                                                onClick={() => handlePreviewDocument(selectedDocument)}
                                                className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                                            >
                                                Try Again
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gray-800 p-4 rounded-lg text-gray-400 h-full flex items-center justify-center">
                                        <p className="text-sm sm:text-base">Loading PDF preview...</p>
                                    </div>
                                )
                            ) : documentContent ? (
                                (() => {
                                    const ext = selectedDocument.name.split('.').pop()?.toLowerCase();
                                    if (ext === 'md') {
                                        return (
                                            <div className="prose prose-sm sm:prose max-w-none bg-gray-800 p-4 rounded-lg h-full overflow-auto prose-invert">
                                                <ReactMarkdown>{documentContent}</ReactMarkdown>
                                            </div>
                                        );
                                    } else if (ext === 'txt' || ext === 'csv') {
                                        return (
                                            <pre className="bg-gray-800 p-4 rounded-lg text-gray-100 overflow-auto h-full whitespace-pre-wrap text-xs sm:text-sm">
                                                {documentContent}
                                            </pre>
                                        );
                                    } else {
                                        return (
                                            <div className="bg-gray-800 p-4 rounded-lg text-gray-400 h-full flex items-center justify-center">
                                                <p className="text-sm sm:text-base text-center">Preview not supported for this file type.</p>
                                            </div>
                                        );
                                    }
                                })()
                            ) : (
                                <div className="bg-gray-800 p-4 rounded-lg text-gray-400 h-full flex items-center justify-center">
                                    <p className="text-sm sm:text-base">No content to preview.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentRAG;