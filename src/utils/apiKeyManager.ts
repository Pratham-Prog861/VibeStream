/**
 * @fileoverview Utility for managing and rotating API keys.
 */

class ApiKeyManager {
  private apiKeys: string[] = [];
  private currentKeyIndex = 0;
  private rateLimitedKeys = new Set<number>();

  constructor(apiKeys: string[]) {
    if (!apiKeys || apiKeys.length === 0) {
      throw new Error('At least one API key is required');
    }
    this.apiKeys = [...new Set(apiKeys)]; // Remove duplicates
  }

  /**
   * Gets the current active API key
   */
  public getCurrentKey(): string {
    return this.apiKeys[this.currentKeyIndex];
  }

  /**
   * Marks the current API key as rate limited and rotates to the next available key
   * @returns The new active API key, or null if all keys are rate limited
   */
  public rotateKey(): string | null {
    // Mark current key as rate limited
    this.rateLimitedKeys.add(this.currentKeyIndex);
    
    // If all keys are rate limited, return null
    if (this.rateLimitedKeys.size >= this.apiKeys.length) {
      return null;
    }
    
    // Find next available key that's not rate limited
    let nextIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
    while (this.rateLimitedKeys.has(nextIndex)) {
      nextIndex = (nextIndex + 1) % this.apiKeys.length;
      
      // Safety check to prevent infinite loop (shouldn't happen due to earlier check)
      if (nextIndex === this.currentKeyIndex) {
        return null;
      }
    }
    
    this.currentKeyIndex = nextIndex;
    return this.getCurrentKey();
  }

  /**
   * Resets the rate limit status for all keys
   */
  public resetRateLimits(): void {
    this.rateLimitedKeys.clear();
  }

  /**
   * Gets the number of available (not rate limited) API keys
   */
  public getAvailableKeyCount(): number {
    return this.apiKeys.length - this.rateLimitedKeys.size;
  }
}

// Create a singleton instance
export const youtubeApiKeyManager = new ApiKeyManager(
  process.env.YOUTUBE_API_KEYS?.split(',').map(k => k.trim()).filter(Boolean) || []
);
