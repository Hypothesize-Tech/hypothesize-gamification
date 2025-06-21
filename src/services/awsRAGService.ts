// src/services/awsRAGService.ts
// Fixed version that properly stores and searches document content

import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    ListObjectsV2Command
} from '@aws-sdk/client-s3';
import {
    BedrockRuntimeClient,
    InvokeModelCommand
} from '@aws-sdk/client-bedrock-runtime';
import { v4 as uuidv4 } from 'uuid';

// AWS Configuration
const awsRegion = import.meta.env.VITE_AWS_REGION || 'us-west-2';
const s3BucketName = import.meta.env.VITE_S3_BUCKET_NAME || 'ai-startup-quest-docs';

// Initialize AWS Clients
const s3Client = new S3Client({
    region: awsRegion,
    ...(import.meta.env.VITE_AWS_ACCESS_KEY_ID && import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
        ? {
            credentials: {
                accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
                secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
            }
        }
        : {})
});

const bedrockClient = new BedrockRuntimeClient({
    region: awsRegion,
    ...(import.meta.env.VITE_AWS_ACCESS_KEY_ID && import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
        ? {
            credentials: {
                accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
                secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
            }
        }
        : {})
});

// Types
interface DocumentChunk {
    id: string;
    content: string;
    metadata: {
        documentId: string;
        documentName: string;
        chunkIndex: number;
    };
}

interface DocumentMetadata {
    id: string;
    name: string;
    type: string;
    size: number;
    uploadedAt: string;
    userId: string;
    fullContent: string; // Store full content for easier access
    chunks: DocumentChunk[];
}

// Document Processing Functions
export class AWSRAGService {

    // Upload document to S3
    async uploadDocument(file: File, userId: string): Promise<string> {
        const documentId = uuidv4();

        try {
            console.log(`Starting upload for ${file.name}`);

            // Extract text content first
            const content = await this.extractTextContent(file);
            console.log(`Extracted ${content.length} characters from ${file.name}`);

            // Split into chunks
            const chunks = this.splitIntoChunks(content, file.name, documentId);
            console.log(`Created ${chunks.length} chunks`);

            // Save document metadata with full content
            const metadata: DocumentMetadata = {
                id: documentId,
                name: file.name,
                type: file.type,
                size: file.size,
                uploadedAt: new Date().toISOString(),
                userId: userId,
                fullContent: content, // Store the full content
                chunks: chunks
            };

            await this.saveDocumentMetadata(metadata, userId);
            console.log(`Saved metadata for document ${documentId}`);

            // Also save the raw file to S3 (optional)
            const fileKey = `documents/${userId}/${documentId}/${file.name}`;
            const arrayBuffer = await file.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);

            const uploadCommand = new PutObjectCommand({
                Bucket: s3BucketName,
                Key: fileKey,
                Body: uint8Array,
                ContentType: file.type,
                Metadata: {
                    userId: userId,
                    documentId: documentId,
                    originalName: file.name
                }
            });

            await s3Client.send(uploadCommand);
            console.log(`Uploaded raw file to S3`);

            return documentId;
        } catch (error) {
            console.error('Error uploading document:', error);
            throw error;
        }
    }

    // Extract text content from various file types
    async extractTextContent(file: File): Promise<string> {
        const fileType = file.type;
        let content = '';

        try {
            // For text-based files, just read as text
            if (fileType === 'text/plain' ||
                fileType === 'text/markdown' ||
                fileType === 'text/csv' ||
                fileType === 'application/json' ||
                fileType === 'text/html' ||
                fileType === 'text/xml' ||
                file.name.endsWith('.txt') ||
                file.name.endsWith('.md') ||
                file.name.endsWith('.csv')) {
                content = await file.text();
            } else {
                // Try to read any file as text
                try {
                    content = await file.text();
                } catch {
                    content = `Unable to extract text from ${file.name}`;
                }
            }

            // Ensure we have content
            if (!content || content.trim().length === 0) {
                content = `Empty or unreadable file: ${file.name}`;
            }

        } catch (error) {
            console.error('Error extracting text:', error);
            content = `Error reading ${file.name}: ${error}`;
        }

        return content;
    }

    // Split content into chunks with overlap
    splitIntoChunks(content: string, fileName: string, documentId: string): DocumentChunk[] {
        const chunkSize = 800; // Smaller chunks for better search
        const overlap = 100; // Overlap to maintain context
        const chunks: DocumentChunk[] = [];

        // If content is too short, just create one chunk
        if (content.length <= chunkSize) {
            chunks.push({
                id: uuidv4(),
                content: content,
                metadata: {
                    documentId: documentId,
                    documentName: fileName,
                    chunkIndex: 0
                }
            });
            return chunks;
        }

        let start = 0;
        let chunkIndex = 0;

        while (start < content.length) {
            const end = Math.min(start + chunkSize, content.length);
            const chunkContent = content.slice(start, end);

            chunks.push({
                id: uuidv4(),
                content: chunkContent,
                metadata: {
                    documentId: documentId,
                    documentName: fileName,
                    chunkIndex: chunkIndex++
                }
            });

            start = end - overlap;
            if (start >= content.length - overlap) break;
        }

        return chunks;
    }

    // Save document metadata to S3
    async saveDocumentMetadata(metadata: DocumentMetadata, userId: string): Promise<void> {
        const metadataKey = `metadata/${userId}/${metadata.id}/metadata.json`;

        // Convert to JSON and encode
        const jsonString = JSON.stringify(metadata, null, 2);
        const encoder = new TextEncoder();
        const uint8Array = encoder.encode(jsonString);

        const command = new PutObjectCommand({
            Bucket: s3BucketName,
            Key: metadataKey,
            Body: uint8Array,
            ContentType: 'application/json'
        });

        await s3Client.send(command);
    }

    // Enhanced search with better matching
    async searchDocuments(query: string, userId: string, topK: number = 5): Promise<DocumentChunk[]> {
        console.log(`Searching for: "${query}"`);

        // Get all documents for the user
        const documents = await this.getUserDocuments(userId);
        console.log(`Found ${documents.length} documents for user`);

        // Improved search algorithm
        const queryLower = query.toLowerCase();
        const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);

        const scoredChunks: Array<DocumentChunk & { score: number }> = [];

        for (const doc of documents) {
            // Defensive: skip if fullContent is missing or not a string
            if (!doc.fullContent || typeof doc.fullContent !== 'string') {
                console.warn(`Document ${doc.id} is missing fullContent. Skipping.`);
                continue;
            }
            // Search in full content for better context
            const fullContentLower = doc.fullContent.toLowerCase();

            // Check if the full query appears in the document
            if (fullContentLower.includes(queryLower)) {
                // If exact match found, prioritize chunks containing it
                for (const chunk of doc.chunks) {
                    const chunkLower = chunk.content.toLowerCase();
                    if (chunkLower.includes(queryLower)) {
                        scoredChunks.push({ ...chunk, score: 100 }); // High score for exact match
                    } else {
                        // Still include nearby chunks for context
                        scoredChunks.push({ ...chunk, score: 10 });
                    }
                }
            } else {
                // Fallback to word matching
                for (const chunk of doc.chunks) {
                    const chunkLower = chunk.content.toLowerCase();
                    let score = 0;

                    // Count matching words
                    for (const word of queryWords) {
                        if (chunkLower.includes(word)) {
                            score += 10;
                            // Bonus for multiple occurrences
                            const matches = chunkLower.split(word).length - 1;
                            score += (matches - 1) * 5;
                        }
                    }

                    if (score > 0) {
                        scoredChunks.push({ ...chunk, score });
                    }
                }
            }
        }

        // Sort by score and return top K
        scoredChunks.sort((a, b) => b.score - a.score);
        const results = scoredChunks.slice(0, topK);

        console.log(`Found ${results.length} relevant chunks`);
        return results;
    }

    // Get all documents for a user
    async getUserDocuments(userId: string): Promise<DocumentMetadata[]> {
        const prefix = `metadata/${userId}/`;
        const command = new ListObjectsV2Command({
            Bucket: s3BucketName,
            Prefix: prefix
        });

        try {
            const response = await s3Client.send(command);
            const documents: DocumentMetadata[] = [];

            if (response.Contents && response.Contents.length > 0) {
                console.log(`Found ${response.Contents.length} objects in S3`);

                for (const object of response.Contents) {
                    if (object.Key?.endsWith('metadata.json')) {
                        try {
                            const getCommand = new GetObjectCommand({
                                Bucket: s3BucketName,
                                Key: object.Key
                            });

                            const getResponse = await s3Client.send(getCommand);
                            const bodyString = await getResponse.Body!.transformToString();
                            const metadata = JSON.parse(bodyString);
                            documents.push(metadata);
                        } catch (error) {
                            console.error(`Error reading ${object.Key}:`, error);
                        }
                    }
                }
            }

            return documents;
        } catch (error) {
            console.error('Error getting documents:', error);
            return [];
        }
    }

    // RAG-powered question answering
    async askQuestion(
        question: string,
        userId: string
    ): Promise<string> {
        try {
            // Search for relevant chunks
            const relevantChunks = await this.searchDocuments(question, userId, 5);

            if (relevantChunks.length === 0) {
                return "I couldn't find any relevant information in your documents. Please make sure you've uploaded documents and try asking about their content.";
            }

            // Build context from relevant chunks
            const documentContext = relevantChunks
                .map((chunk, index) =>
                    `[Excerpt ${index + 1} from "${chunk.metadata.documentName}"]: ${chunk.content}`
                )
                .join('\n\n');

            console.log(`Sending ${documentContext.length} characters of context to AI`);

            // Generate response using Bedrock
            const systemPrompt = `You are the AI Sage helping a startup founder analyze their documents. 
        Based on the document excerpts provided, answer the user's question accurately.
        If the information needed to answer the question is not in the excerpts, say so.
        Provide specific, actionable insights when possible.`;

            const userPrompt = `Here are relevant excerpts from the user's documents:
  
  ${documentContext}
  
  Based on these excerpts, please answer this question: ${question}`;

            const command = new InvokeModelCommand({
                modelId: import.meta.env.VITE_NOVA_INFERENCE_PROFILE_ARN || "anthropic.claude-3-sonnet-20240229-v1:0",
                body: JSON.stringify({
                    messages: [
                        {
                            role: "user",
                            content: [
                                {
                                    text: systemPrompt + "\n\n" + userPrompt
                                }
                            ]
                        }
                    ],
                }),
                contentType: "application/json",
                accept: "application/json"
            });

            const response = await bedrockClient.send(command);
            const responseBody = JSON.parse(new TextDecoder().decode(response.body));

            // Extract the response text
            const aiResponse = responseBody.content?.[0]?.text ||
                responseBody.output?.message?.content?.[0]?.text ||
                "I couldn't generate a response. Please try again.";

            return aiResponse;

        } catch (error: any) {
            console.error('RAG Question Error:', error);
            // Provide more helpful error message
            if (error.message?.includes('credentials')) {
                return "AWS credentials are not configured correctly. Please check your environment variables.";
            }
            return `Error: ${error.message || 'Unable to process your question. Please try again.'}`;
        }
    }

    // Get document list for a user
    async getDocumentList(userId: string): Promise<Array<{ id: string, name: string, uploadedAt: string, size: number }>> {
        const documents = await this.getUserDocuments(userId);
        return documents.map(doc => ({
            id: doc.id,
            name: doc.name,
            uploadedAt: doc.uploadedAt,
            size: doc.size
        }));
    }
}

// Export singleton instance
export const ragService = new AWSRAGService();