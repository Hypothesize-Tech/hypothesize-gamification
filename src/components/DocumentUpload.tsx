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
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${isDragging
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-gray-600 hover:border-gray-500'
                    } ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileInput}
                    accept=".pdf,.doc,.docx,.txt,.md,.csv"
                    disabled={uploading}
                />

                <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center space-y-3">
                        {uploading ? (
                            <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
                        ) : (
                            <Upload className="w-12 h-12 text-gray-400" />
                        )}

                        <div>
                            <p className="text-lg font-medium text-white">
                                {uploading ? 'Uploading...' : 'Drop your document here'}
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                                or click to browse (PDF, Word, TXT, MD, CSV - Max {maxSizeMB}MB)
                            </p>
                        </div>
                    </div>
                </label>
            </div>

            {error && (
                <div className="mt-3 p-3 bg-red-900/30 border border-red-700 rounded-lg flex items-center justify-between">
                    <p className="text-sm text-red-400">{error}</p>
                    <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default DocumentUpload;