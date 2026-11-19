/**
 * Used by: Extension (sends it) -> Next.js Backend (receives it)
 * Purpose: The capture data sent to POST /api/extract when you grab a YouTube video frame.
 */
export interface ExtractCodeRequest {
  videoId: string;
  videoUrl: string; // Canonical: https://www.youtube.com/watch?v={videoId}
  videoTitle: string;
  timestamp: number; // in seconds
  frameBase64: string; // data:image/webp;base64,...
  userNote?: string;
  manualCodeOverride?: string; // Optional manual code input while AI is in mock mode
}

/**
 * Used by: Both (Extension sidebar + Next.js Backend & Study Dashboard)
 * Purpose: The shape of one saved code snippet card everywhere in the app.
 */
export interface SnippetDTO {
  id: string;
  videoId: string;
  videoUrl: string;
  videoTitle: string;
  timestamp: number;
  frameBase64?: string;
  extractedCode: string;
  language: string;
  explanation: string;
  userNote: string | null;
  createdAt: string; // ISO 8601 string
}

/**
 * Used by: Next.js Backend (sends it) -> Extension (receives it)
 * Purpose: The reply from POST /api/extract after saving a single captured snippet.
 */
export interface ExtractCodeResponse {
  success: boolean;
  snippet?: SnippetDTO;
  error?: string;
}

/**
 * Used by: Next.js Backend (sends it) -> Extension & Web Clients (receive it)
 * Purpose: The reply from GET /api/snippets returning a list of saved snippets.
 */
export interface GetSnippetsResponse {
  success: boolean;
  snippets: SnippetDTO[];
  error?: string;
}
