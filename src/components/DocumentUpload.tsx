import React, { useState } from 'react';
import { Upload, Loader2, X, AlertTriangle } from 'lucide-react';
import { ENERGY_COSTS } from '../config/energy';

interface DocumentUploadProps {
    onUpload: (file: File) => Promise<void>;
    maxSizeMB?: number;
    guildData?: any; // Add guild data to check gold balance
}

/**
 * DocumentUpload Component
 * 
 * Handles file upload with drag-and-drop functionality.
 * Requires 10 gold per upload and shows appropriate warnings.
 */
export const DocumentUpload: React.FC<DocumentUploadProps> = ({
    onUpload,
    maxSizeMB = 25,
    guildData
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadCost = ENERGY_COSTS.DOCUMENT_UPLOAD;
    const userGold = guildData?.gold ?? 0;
    const hasEnoughGold = userGold >= uploadCost;

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            await handleFile(files[0]);
        }
    };

    const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            await handleFile(files[0]);
        }
    };

    const handleFile = async (file: File) => {
        setError(null);

        // Check gold before processing
        if (!hasEnoughGold) {
            setError(`Insufficient gold! Need ${uploadCost} gold to upload (Current: ${userGold})`);
            return;
        }

        // Validate file size
        const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
        if (file.size > maxSize) {
            setError(`File size exceeds ${maxSizeMB}MB limit`);
            return;
        }

        // Validate file type
        const allowedTypes = [
            'application/pdf',
            'text/plain',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/markdown',
            'text/csv',
            'application/json'
        ];

        if (!allowedTypes.includes(file.type)) {
            setError('Please upload PDF, Word, TXT, MD, CSV, JSON, or DOCX files');
            return;
        }

        try {
            setUploading(true);
            await onUpload(file);
        } catch (err) {
            setError('Upload failed. Please try again.');
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Gold cost indicator */}
            <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Upload Cost:</span>
                    <span className="text-yellow-400 font-semibold">{uploadCost} Gold</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-gray-300">Your Gold:</span>
                    <span className={`font-semibold ${hasEnoughGold ? 'text-green-400' : 'text-red-400'}`}>
                        {userGold} Gold
                        {!hasEnoughGold && (
                            <span className="ml-2 text-red-300 text-xs">
                                (Need {uploadCost - userGold} more)
                            </span>
                        )}
                    </span>
                </div>
            </div>

            <div
                className={`
                    relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
                    ${isDragging ? 'border-blue-400 bg-blue-50/10' : 'border-gray-600'}
                    ${hasEnoughGold ? 'hover:border-gray-500 cursor-pointer' : 'opacity-50 cursor-not-allowed'}
                `}
                onDragOver={hasEnoughGold ? handleDragOver : undefined}
                onDragLeave={hasEnoughGold ? handleDragLeave : undefined}
                onDrop={hasEnoughGold ? handleDrop : undefined}
                onClick={hasEnoughGold && !uploading ? () => document.getElementById('file-input')?.click() : undefined}
            >
                <input
                    id="file-input"
                    type="file"
                    className="hidden"
                    onChange={handleFileInput}
                    accept=".pdf,.txt,.md,.csv,.json,.docx"
                    disabled={uploading || !hasEnoughGold}
                />

                <div className="flex flex-col items-center space-y-4">
                    {uploading ? (
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                    ) : !hasEnoughGold ? (
                        <AlertTriangle className="w-12 h-12 text-red-400" />
                    ) : (
                        <Upload className="w-12 h-12 text-gray-400" />
                    )}

                    <div>
                        <p className={`text-lg font-medium ${hasEnoughGold ? 'text-gray-300' : 'text-red-400'}`}>
                            {uploading
                                ? 'Uploading...'
                                : !hasEnoughGold
                                    ? `Need ${uploadCost} Gold to Upload`
                                    : 'Drop files here or click to browse'
                            }
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Supports: PDF, TXT, MD, CSV, JSON, DOCX (Max {maxSizeMB}MB)
                        </p>
                        <div className={`text-xs flex items-center gap-1 ${hasEnoughGold ? 'text-amber-700' : 'text-red-600'}`}>
                            Cost: {uploadCost} Gold (Your Gold: {userGold})
                            {!hasEnoughGold && <AlertTriangle className="w-4 h-4" />}
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <X className="w-4 h-4 text-red-400" />
                            <span className="text-red-400 text-sm">{error}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentUpload;