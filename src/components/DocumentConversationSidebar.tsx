import React, { useState } from 'react';
import { Clock, Trash, FileText, Search, MessageCircle, PlusCircle, Loader2 } from 'lucide-react';
import paperBg from '../assets/wallpaper_2.jpg'; // Import the background

// Parchment styles from DocumentRAG.tsx
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

  .old-paper-text {
    color: #2e2218;
    text-shadow: 
      1px 1px 1px rgba(0,0,0,0.1),
      0 0 1px rgba(139, 69, 19, 0.2);
    font-family: 'Georgia', 'Times New Roman', serif;
  }
`;

interface DocumentConversation {
    _id: string;
    title: string;
    documentName: string;
    lastUpdated: Date;
}

interface DocumentConversationSidebarProps {
    conversations: DocumentConversation[];
    onSelectConversation: (conversation: DocumentConversation) => void;
    onNewConversation: () => void;
    onDeleteConversation: (conversationId: string) => Promise<void>;
    currentConversation: DocumentConversation | null;
    className?: string;
    activeConversationId?: string;
}

const DocumentConversationSidebar: React.FC<DocumentConversationSidebarProps> = ({
    conversations,
    onSelectConversation,
    onNewConversation,
    onDeleteConversation,
    currentConversation,
    className,
    activeConversationId
}) => {
    const [loading, setLoading] = useState(false); // Simplified loading state
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this conversation?')) {
            try {
                await onDeleteConversation(id);
            } catch (err) {
                console.error('Error deleting conversation:', err);
                setError('Failed to delete conversation. Please try again.');
            }
        }
    };

    const formatDate = (dateString: Date | string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const filteredConversations = conversations.filter(conv =>
        conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.documentName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <style>{parchmentStyles}</style>
            <div className={`flex flex-col h-full parchment-container old-paper-text ${className}`}>
                {/* Header */}
                <div className="p-4 border-b border-amber-700/20">
                    <h3 className="text-lg font-bold flex items-center">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Conversations
                    </h3>
                    <button
                        onClick={onNewConversation}
                        className="mt-2 w-full bg-amber-600/80 text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors duration-200 flex items-center justify-center shadow-md border-b-2 border-amber-800/50"
                    >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        New Chat
                    </button>
                </div>

                {/* Search Bar */}
                <div className="p-4 border-b border-amber-700/20">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-amber-50/30 border border-amber-600/20 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-700/50 old-paper-text placeholder-amber-800/50"
                        />
                    </div>
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader2 className="w-8 h-8 animate-spin text-amber-700" />
                        </div>
                    ) : error ? (
                        <div className="p-4 text-center text-red-500">{error}</div>
                    ) : filteredConversations.length === 0 ? (
                        <div className="p-6 text-center opacity-70">
                            <p>No conversations found.</p>
                        </div>
                    ) : (
                        <ul>
                            {filteredConversations.map(conv => (
                                <li
                                    key={conv._id}
                                    onClick={() => onSelectConversation(conv)}
                                    className={`cursor-pointer rounded px-3 py-2 transition-colors
                                        ${conv._id === activeConversationId ? 'bg-amber-200/60 border border-amber-700 font-bold shadow' : 'hover:bg-amber-100/40'}
                                      `}
                                >
                                    <div className="p-4">
                                        <div className="flex justify-between items-start">
                                            <p className="font-bold text-base mb-1 pr-2 truncate">{conv.title || 'Untitled Conversation'}</p>
                                            <button
                                                onClick={(e) => handleDelete(conv._id, e)}
                                                className="text-amber-700/50 hover:text-red-600 transition-colors duration-150 p-1"
                                                title="Delete conversation"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-sm opacity-80 flex items-center mb-2">
                                            <FileText className="w-3 h-3 mr-2 flex-shrink-0" />
                                            <span className="truncate">{conv.documentName}</span>
                                        </p>
                                        <div className="text-xs opacity-60 flex items-center">
                                            <Clock className="w-3 h-3 mr-2" />
                                            <span>{formatDate(conv.lastUpdated)}</span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
};

export default DocumentConversationSidebar;
