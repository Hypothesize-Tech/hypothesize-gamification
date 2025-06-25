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
import * as pdfjsLib from 'pdfjs-dist';
// import workerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Set up PDF.js worker for Vite
// pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

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
        pageNumber?: number;
        previousChunk?: string;
        nextChunk?: string;
    };
}

interface DocumentMetadata {
    id: string;
    name: string;
    type: string;
    size: number;
    uploadedAt: string;
    userId: string;
    fullContent: string;
    chunks: DocumentChunk[];
    processedContent?: {
        keywords: string[];
        sections: Array<{ title: string; content: string }>;
        documentInfo?: {
            title?: string;
            author?: string;
            subject?: string;
            pageCount?: number;
        };
    };
}

// Document Processing Functions
export class AWSRAGService {

    // Extract text from PDF with proper handling
    async extractPDFText(file: File): Promise<{ text: string; info: any }> {
        try {
            console.log(`Extracting text from PDF: ${file.name}`);

            // Convert file to ArrayBuffer
            const arrayBuffer = await file.arrayBuffer();

            // Load the PDF document
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;

            console.log(`PDF loaded: ${pdf.numPages} pages`);

            let fullText = '';
            const documentInfo: any = {
                pageCount: pdf.numPages
            };

            // Try to get metadata
            try {
                const metadata = await pdf.getMetadata();
                if (metadata.info) {
                    documentInfo.title = this.cleanPDFString(metadata.info.Title);
                    documentInfo.author = this.cleanPDFString(metadata.info.Author);
                    documentInfo.subject = this.cleanPDFString(metadata.info.Subject);
                    documentInfo.creator = this.cleanPDFString(metadata.info.Creator);
                }
                console.log('PDF Metadata:', documentInfo);
            } catch (metaError) {
                console.warn('Could not extract PDF metadata:', metaError);
            }

            // Extract text from each page
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                try {
                    const page = await pdf.getPage(pageNum);
                    const textContent = await page.getTextContent();

                    // Build text with proper spacing
                    let pageText = '';
                    let lastY = null;

                    for (const item of textContent.items) {
                        if ('str' in item) {
                            // Check if we need a line break based on Y position
                            if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
                                pageText += '\n';
                            }
                            pageText += item.str + ' ';
                            lastY = item.transform[5];
                        }
                    }

                    // Clean up the page text
                    pageText = pageText
                        .replace(/\s+/g, ' ')  // Multiple spaces to single
                        .replace(/\n{3,}/g, '\n\n')  // Multiple newlines to double
                        .trim();

                    if (pageText) {
                        fullText += `\n--- Page ${pageNum} ---\n${pageText}\n`;
                    }
                } catch (pageError) {
                    console.error(`Error extracting page ${pageNum}:`, pageError);
                    fullText += `\n--- Page ${pageNum} ---\n[Error extracting text from this page]\n`;
                }
            }

            // Clean the full text
            fullText = this.cleanExtractedText(fullText);

            console.log(`Extracted ${fullText.length} characters from PDF`);

            return {
                text: fullText || `Could not extract readable text from PDF: ${file.name}`,
                info: documentInfo
            };

        } catch (error) {
            console.error('PDF extraction error:', error);
            throw new Error(`Failed to extract text from PDF: ${error.message}`);
        }
    }

    // Clean PDF strings that may have encoding issues
    cleanPDFString(str: string | undefined): string | undefined {
        if (!str) return undefined;

        // Remove null characters and non-printable characters
        let cleaned = str.replace(/\0/g, '').replace(/[\x00-\x1F\x7F-\x9F]/g, '');

        // Try to decode if it looks like it has encoding issues
        if (cleaned.includes('�')) {
            try {
                // Remove problematic characters
                cleaned = cleaned.replace(/[�]/g, '');
            } catch (e) {
                console.warn('Could not clean string:', e);
            }
        }

        return cleaned.trim() || undefined;
    }

    // Clean extracted text to ensure readability
    cleanExtractedText(text: string): string {
        return text
            .replace(/[^\x20-\x7E\n\r\t]/g, '') // Remove non-ASCII characters except newlines
            .replace(/\r\n/g, '\n') // Normalize line endings
            .replace(/\t/g, '    ') // Convert tabs to spaces
            .replace(/\n{4,}/g, '\n\n\n') // Limit consecutive newlines
            .replace(/[ ]{3,}/g, '  ') // Limit consecutive spaces
            .trim();
    }

    // Upload document to S3
    async uploadDocument(file: File, userId: string): Promise<string> {
        const documentId = uuidv4();

        try {
            console.log(`Starting upload for ${file.name}`);

            // Extract text content based on file type
            let content = '';
            let documentInfo = {};

            if (file.type === 'application/pdf') {
                const pdfResult = await this.extractPDFText(file);
                content = pdfResult.text;
                documentInfo = pdfResult.info;
            } else {
                content = await this.extractTextContent(file);
            }

            console.log(`Extracted ${content.length} characters from ${file.name}`);

            // Process content for better search
            const processedContent = this.preprocessContent(content);
            if (Object.keys(documentInfo).length > 0) {
                processedContent.documentInfo = documentInfo;
            }

            // Split into chunks with better strategy
            const chunks = this.smartChunking(content, file.name, documentId);
            console.log(`Created ${chunks.length} chunks with smart chunking`);

            // Save document metadata with full content
            const metadata: DocumentMetadata = {
                id: documentId,
                name: file.name,
                type: file.type,
                size: file.size,
                uploadedAt: new Date().toISOString(),
                userId: userId,
                fullContent: content,
                chunks: chunks,
                processedContent: processedContent
            };

            await this.saveDocumentMetadata(metadata, userId);
            console.log(`Saved metadata for document ${documentId}`);

            // Also save the raw file to S3
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

    // Preprocess content for better search
    preprocessContent(content: string): any {
        // Extract potential keywords (numbers, capitalized words, etc.)
        const numbers = content.match(/\$?[\d,]+\.?\d*/g) || [];
        const capitalizedWords = content.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g) || [];

        // Try to identify sections
        const sections: Array<{ title: string; content: string }> = [];
        const lines = content.split('\n');
        let currentSection = { title: 'Introduction', content: '' };

        for (const line of lines) {
            // Check if line looks like a header
            if (line.match(/^[A-Z\s]{3,}$/) || line.match(/^\d+\.?\s+[A-Z]/) || line.match(/^#+\s/) || line.includes('---')) {
                if (currentSection.content) {
                    sections.push(currentSection);
                }
                currentSection = { title: line.replace(/---/g, '').trim(), content: '' };
            } else if (line.trim()) {
                currentSection.content += line + '\n';
            }
        }
        if (currentSection.content) {
            sections.push(currentSection);
        }

        return {
            keywords: [...new Set([...numbers, ...capitalizedWords])],
            sections: sections
        };
    }

    // Smart chunking that preserves context better
    smartChunking(content: string, fileName: string, documentId: string): DocumentChunk[] {
        const chunks: DocumentChunk[] = [];
        const baseChunkSize = 600; // Smaller for more granular search
        const overlap = 150; // Larger overlap for better context

        // Split by pages if it's from a PDF
        const pages = content.split(/--- Page \d+ ---/);
        let chunkIndex = 0;

        for (let pageNum = 0; pageNum < pages.length; pageNum++) {
            const pageContent = pages[pageNum].trim();
            if (!pageContent) continue;

            // Try to chunk by paragraphs within each page
            const paragraphs = pageContent.split(/\n\n+/);
            let currentChunk = '';
            let previousChunkEnd = '';

            for (const paragraph of paragraphs) {
                // If adding this paragraph would exceed chunk size, save current chunk
                if (currentChunk.length + paragraph.length > baseChunkSize && currentChunk.length > 0) {
                    chunks.push({
                        id: uuidv4(),
                        content: currentChunk.trim(),
                        metadata: {
                            documentId: documentId,
                            documentName: fileName,
                            chunkIndex: chunkIndex++,
                            pageNumber: pageNum,
                            previousChunk: previousChunkEnd.slice(-100),
                            nextChunk: paragraph.slice(0, 100)
                        }
                    });

                    // Start new chunk with overlap from previous
                    previousChunkEnd = currentChunk.slice(-overlap);
                    currentChunk = previousChunkEnd + '\n' + paragraph;
                } else {
                    currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
                }
            }

            // Don't forget the last chunk of the page
            if (currentChunk.trim()) {
                chunks.push({
                    id: uuidv4(),
                    content: currentChunk.trim(),
                    metadata: {
                        documentId: documentId,
                        documentName: fileName,
                        chunkIndex: chunkIndex++,
                        pageNumber: pageNum,
                        previousChunk: previousChunkEnd.slice(-100)
                    }
                });
            }
        }

        // If no chunks were created, fall back to simple chunking
        if (chunks.length === 0) {
            return this.splitIntoChunks(content, fileName, documentId);
        }

        return chunks;
    }

    // Original simple chunking as fallback
    splitIntoChunks(content: string, fileName: string, documentId: string): DocumentChunk[] {
        const chunkSize = 600;
        const overlap = 150;
        const chunks: DocumentChunk[] = [];

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

            // Clean and ensure we have content
            content = this.cleanExtractedText(content);

            if (!content || content.trim().length === 0) {
                content = `Empty or unreadable file: ${file.name}`;
            }

        } catch (error) {
            console.error('Error extracting text:', error);
            content = `Error reading ${file.name}: ${error}`;
        }

        return content;
    }

    // Save document metadata to S3
    async saveDocumentMetadata(metadata: DocumentMetadata, userId: string): Promise<void> {
        const metadataKey = `metadata/${userId}/${metadata.id}/metadata.json`;

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

    // Enhanced search with multiple strategies
    async searchDocuments(query: string, userId: string, topK: number = 8): Promise<DocumentChunk[]> {
        console.log(`Enhanced search for: "${query}"`);

        // Preprocess query
        const processedQuery = this.preprocessQuery(query);
        console.log(`Processed query:`, processedQuery);

        // Get all documents for the user
        const documents = await this.getUserDocuments(userId);
        console.log(`Found ${documents.length} documents for user`);

        const scoredChunks: Array<DocumentChunk & { score: number; reason: string }> = [];

        for (const doc of documents) {
            if (!doc.fullContent || typeof doc.fullContent !== 'string') {
                console.warn(`Document ${doc.id} is missing fullContent. Skipping.`);
                continue;
            }

            // Strategy 1: Exact phrase match (highest priority)
            for (const chunk of doc.chunks) {
                const chunkLower = chunk.content.toLowerCase();
                let score = 0;
                let reasons: string[] = [];

                // Check exact phrase match
                if (chunkLower.includes(processedQuery.originalLower)) {
                    score += 100;
                    reasons.push('exact phrase');
                }

                // Check all variations
                for (const variation of processedQuery.variations) {
                    if (chunkLower.includes(variation)) {
                        score += 80;
                        reasons.push(`variation: ${variation}`);
                    }
                }

                // Check individual words with proximity bonus
                let wordMatches = 0;
                let lastWordPos = -1;
                for (const word of processedQuery.words) {
                    const wordPos = chunkLower.indexOf(word);
                    if (wordPos !== -1) {
                        wordMatches++;
                        score += 20;

                        // Proximity bonus - words close together score higher
                        if (lastWordPos !== -1 && Math.abs(wordPos - lastWordPos) < 50) {
                            score += 10;
                            reasons.push('proximity bonus');
                        }
                        lastWordPos = wordPos;
                    }
                }

                // All words present bonus
                if (wordMatches === processedQuery.words.length && processedQuery.words.length > 1) {
                    score += 30;
                    reasons.push('all words present');
                }

                // Check for numbers in query
                for (const number of processedQuery.numbers) {
                    if (chunkLower.includes(number)) {
                        score += 50; // High score for number matches
                        reasons.push(`number: ${number}`);
                    }
                }

                // Context bonus - check if surrounding chunks also match
                if (chunk.metadata.previousChunk && processedQuery.words.some((w: string) =>
                    chunk.metadata.previousChunk!.toLowerCase().includes(w))) {
                    score += 5;
                    reasons.push('context match');
                }

                if (score > 0) {
                    scoredChunks.push({
                        ...chunk,
                        score,
                        reason: reasons.join(', ')
                    });
                }
            }
        }

        // Sort by score and log top results
        scoredChunks.sort((a, b) => b.score - a.score);
        const results = scoredChunks.slice(0, topK);

        console.log(`Found ${results.length} relevant chunks:`);
        results.slice(0, 3).forEach((r, i) => {
            console.log(`  ${i + 1}. Score: ${r.score} (${r.reason}) - "${r.content.slice(0, 50)}..."`);
        });

        return results;
    }

    // Preprocess query for better matching
    preprocessQuery(query: string): any {
        const originalLower = query.toLowerCase();
        const words = originalLower
            .split(/\s+/)
            .filter(w => w.length > 1 && !['the', 'a', 'an', 'is', 'are', 'was', 'were', 'what', 'how', 'why', 'when', 'where', 'who'].includes(w));

        // Extract numbers from query
        const numbers = query.match(/\$?[\d,]+\.?\d*/g) || [];

        // Generate query variations
        const variations: string[] = [originalLower];

        // Try without question words
        const withoutQuestion = originalLower
            .replace(/^(what|how|why|when|where|who|which)\s+/i, '')
            .replace(/\?$/, '');
        if (withoutQuestion !== originalLower) {
            variations.push(withoutQuestion);
        }

        // Try key phrase extraction
        if (originalLower.includes('is')) {
            const parts = originalLower.split(/\s+is\s+/);
            if (parts.length === 2) {
                variations.push(parts[0].trim());
                variations.push(parts[1].trim());
            }
        }

        return {
            original: query,
            originalLower,
            words,
            numbers,
            variations: [...new Set(variations)]
        };
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

    // Enhanced RAG-powered question answering
    async askQuestion(
        question: string,
        userId: string
    ): Promise<string> {
        try {
            // Try initial search
            let relevantChunks = await this.searchDocuments(question, userId, 8);

            // If no results, try fallback search with broader terms
            if (relevantChunks.length === 0) {
                console.log('No results found, trying fallback search...');
                const fallbackQuery = question
                    .toLowerCase()
                    .replace(/[^\w\s]/g, '') // Remove punctuation
                    .split(' ')
                    .filter(w => w.length > 3) // Keep longer words
                    .join(' ');

                relevantChunks = await this.searchDocuments(fallbackQuery, userId, 5);
            }

            if (relevantChunks.length === 0) {
                return "I couldn't find any relevant information in your documents. Please make sure you've uploaded documents and try rephrasing your question. You can also try using keywords that you know are in your documents.";
            }

            // Build context from relevant chunks
            const documentContext = relevantChunks
                .map((chunk, index) => {
                    // Include surrounding context if available
                    let context = chunk.content;
                    if (chunk.metadata.previousChunk) {
                        context = `[...${chunk.metadata.previousChunk.slice(-50)}]\n${context}`;
                    }
                    if (chunk.metadata.nextChunk) {
                        context = `${context}\n[${chunk.metadata.nextChunk.slice(0, 50)}...]`;
                    }

                    // Include page number if available
                    const pageInfo = chunk.metadata.pageNumber !== undefined ? ` (Page ${chunk.metadata.pageNumber})` : '';

                    return `[Excerpt ${index + 1} from "${chunk.metadata.documentName}"${pageInfo}]: ${context}`;
                })
                .join('\n\n---\n\n');

            console.log(`Sending ${documentContext.length} characters of context to AI`);

            // Enhanced prompt for better accuracy
            const systemPrompt = `You are the AI Sage helping a startup founder analyze their documents. 
Your task is to answer questions based ONLY on the provided document excerpts.

IMPORTANT INSTRUCTIONS:
1. Base your answer strictly on the information in the provided excerpts
2. If you find relevant information, quote or reference it specifically
3. Provide clear, readable answers without any encoding issues or special characters
4. If the information is partially available, mention what you found and what's missing
5. If you cannot find the answer, clearly state that and suggest what to look for
6. Be precise with numbers, dates, and specific details from the documents
7. When multiple excerpts contain relevant info, synthesize them coherently
8. Format your response in a clean, professional manner`;

            const userPrompt = `Document excerpts:

${documentContext}

Question: ${question}

Please provide a specific, well-formatted answer based on the excerpts above. If you find relevant information, cite which excerpt it comes from.`;

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

    /**
     * Fetch the full content of a document by its ID for a given user.
     * Returns the fullContent string or throws if not found.
     */
    async getDocumentContent(documentId: string, userId: string): Promise<string> {
        // The metadata is stored at metadata/{userId}/{documentId}/metadata.json
        const metadataKey = `metadata/${userId}/${documentId}/metadata.json`;
        try {
            const getCommand = new GetObjectCommand({
                Bucket: s3BucketName,
                Key: metadataKey
            });
            const getResponse = await s3Client.send(getCommand);
            const bodyString = await getResponse.Body!.transformToString();
            const metadata = JSON.parse(bodyString);
            if (metadata.fullContent && typeof metadata.fullContent === 'string') {
                return metadata.fullContent;
            } else {
                throw new Error('No content found in document metadata.');
            }
        } catch (error) {
            console.error('Error fetching document content:', error);
            throw error;
        }
    }

    /**
     * Get a signed S3 URL for the original uploaded file (for PDF preview)
     */
    async getDocumentFileUrl(documentId: string, userId: string): Promise<string> {
        // First, get the metadata to find the file name
        const metadataKey = `metadata/${userId}/${documentId}/metadata.json`;
        try {
            const getCommand = new GetObjectCommand({
                Bucket: s3BucketName,
                Key: metadataKey
            });
            const getResponse = await s3Client.send(getCommand);
            const bodyString = await getResponse.Body!.transformToString();
            const metadata = JSON.parse(bodyString);
            const fileName = metadata.name;
            if (!fileName) throw new Error('File name not found in metadata');
            const fileKey = `documents/${userId}/${documentId}/${fileName}`;
            const fileCommand = new GetObjectCommand({
                Bucket: s3BucketName,
                Key: fileKey
            });
            // Signed URL valid for 5 minutes
            return await getSignedUrl(s3Client, fileCommand, { expiresIn: 300 });
        } catch (error) {
            console.error('Error generating file URL:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const ragService = new AWSRAGService();