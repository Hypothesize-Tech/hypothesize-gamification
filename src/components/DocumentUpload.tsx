import React, { useState } from 'react';
import { Upload, Loader2, X } from 'lucide-react';

interface DocumentUploadProps {
    onUpload: (file: File) => Promise<void>;
    maxSizeMB?: number;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
    onUpload,
    maxSizeMB = 25
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            'text/csv'
        ];

        if (!allowedTypes.includes(file.type)) {
            setError('Please upload PDF, Word, TXT, MD, or CSV files');
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
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                    border-2 border-dashed rounded-lg 
                    p-4 sm:p-6 md:p-8 
                    text-center transition-all duration-200 
                    ${isDragging
                        ? 'border-purple-500 bg-purple-500/10 scale-[1.02]'
                        : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/30'
                    } 
                    ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'}
                    touch-manipulation
                `}
            >
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileInput}
                    accept=".pdf,.doc,.docx,.txt,.md,.csv"
                    disabled={uploading}
                    aria-describedby="file-upload-description"
                />

                <label
                    htmlFor="file-upload"
                    className="cursor-pointer block w-full h-full"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            document.getElementById('file-upload')?.click();
                        }
                    }}
                >
                    <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                        {uploading ? (
                            <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-purple-500 animate-spin" />
                        ) : (
                            <Upload className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400 group-hover:text-gray-300 transition-colors" />
                        )}

                        <div className="space-y-1 sm:space-y-2">
                            <p className="text-base sm:text-lg md:text-xl font-medium text-white">
                                {uploading ? 'Uploading...' : 'Drop your file here'}
                            </p>
                            <p
                                id="file-upload-description"
                                className="text-xs sm:text-sm text-gray-400 px-2"
                            >
                                or tap to browse
                            </p>
                            <p className="text-xs text-gray-500 px-2">
                                PDF, Word, TXT, MD, CSV • Max {maxSizeMB}MB
                            </p>
                        </div>
                    </div>
                </label>
            </div>

            {error && (
                <div
                    className="mt-3 p-3 sm:p-4 bg-red-900/30 border border-red-700 rounded-lg 
                               flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4"
                    role="alert"
                    aria-live="polite"
                >
                    <p className="text-sm text-red-400 flex-1">{error}</p>
                    <button
                        onClick={() => setError(null)}
                        className="text-red-400 hover:text-red-300 active:scale-95 transition-all
                                 self-end sm:self-auto p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-400/50"
                        aria-label="Dismiss error"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default DocumentUpload;