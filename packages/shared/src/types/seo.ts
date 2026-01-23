// ==========================================
// SEO TYPES
// Type definitions for Google Indexing API and SEO services
// ==========================================

// ==========================================
// API KEY INTERFACES
// ==========================================

export interface GoogleApiKeyConfig {
  /** Unique identifier for this key (e.g., key_1, key_2) */
  id: string;

  /** Google Cloud Project ID */
  projectId: string;

  /** Service Account Email */
  clientEmail: string;

  /** Private Key (PEM format) */
  privateKey: string;

  /** Daily quota limit (default: 200) */
  dailyQuota: number;

  /** Number of requests used today */
  usedToday: number;

  /** Date of last quota reset (YYYY-MM-DD) */
  lastReset: string;

  /** Whether this key is currently active */
  isActive: boolean;
}

export interface GoogleApiKeyInput {
  projectId?: string;
  project_id?: string;
  clientEmail?: string;
  client_email?: string;
  privateKey?: string;
  private_key?: string;
}

export interface KeyStats {
  totalKeys: number;
  totalCapacity: number;
  totalUsed: number;
  remainingToday: number;
  keys: Array<{
    id: string;
    used: number;
    remaining: number;
    isActive: boolean;
  }>;
}

// ==========================================
// SEO RESULT INTERFACES
// ==========================================

/** Result from Google Indexing API submission */
export interface GoogleIndexingResult {
  url: string;
  success: boolean;
  keyUsed: string;
  response?: {
    urlNotificationMetadata?: {
      url?: string;
      latestUpdate?: {
        type?: string;
        notifyTime?: string;
      };
    };
  };
  error?: string;
}

/** Result from IndexNow submission */
export interface IndexNowResult {
  endpoint: string;
  status: number;
  success: boolean;
  error?: string;
}

/** Result from Google Sitemap Ping */
export interface GooglePingResult {
  sitemapUrl: string;
  success: boolean;
  status: number;
  error?: string;
}

/** Combined result from all SEO engines */
export interface SeoIndexResult {
  tenant: string;
  googleIndexing: {
    success: boolean;
    urlsSubmitted: number;
    quotaRemaining: number;
    results?: GoogleIndexingResult[];
  };
  indexNow: {
    success: boolean;
    urlsSubmitted: number;
    results?: IndexNowResult[];
  };
  googlePing: {
    success: boolean;
    status?: number;
  };
  timestamp: string;
}

/** Status response for SEO service */
export interface SeoServiceStatus {
  googleIndexing: {
    enabled: boolean;
    totalKeys: number;
    totalCapacity: number;
    totalUsed: number;
    remainingToday: number;
  };
  indexNow: {
    enabled: boolean;
  };
  googlePing: {
    enabled: boolean;
  };
  timestamp: string;
}

/** Product indexing result */
export interface ProductIndexResult {
  success: boolean;
  productUrl: string;
  googleIndexing?: GoogleIndexingResult;
  indexNow?: {
    success: boolean;
    urlsSubmitted: number;
  };
  googlePing?: {
    success: boolean;
  };
}
