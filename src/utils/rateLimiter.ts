
// Client-side rate limiting utilities
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private storage: Map<string, RateLimitEntry> = new Map();
  
  private getKey(operation: string, identifier: string): string {
    return `${operation}:${identifier}`;
  }
  
  private cleanupExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.storage.entries()) {
      if (now > entry.resetTime) {
        this.storage.delete(key);
      }
    }
  }
  
  isAllowed(operation: string, identifier: string, maxAttempts: number, windowMs: number): boolean {
    this.cleanupExpired();
    
    const key = this.getKey(operation, identifier);
    const now = Date.now();
    const entry = this.storage.get(key);
    
    if (!entry || now > entry.resetTime) {
      // First attempt or window expired
      this.storage.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }
    
    if (entry.count >= maxAttempts) {
      return false;
    }
    
    entry.count++;
    return true;
  }
  
  getRemainingTime(operation: string, identifier: string): number {
    const key = this.getKey(operation, identifier);
    const entry = this.storage.get(key);
    
    if (!entry) return 0;
    
    const remaining = entry.resetTime - Date.now();
    return Math.max(0, Math.ceil(remaining / 1000)); // Return seconds
  }
}

export const rateLimiter = new RateLimiter();

// Rate limiting configurations
export const RATE_LIMITS = {
  PASSWORD_RESET: { maxAttempts: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour
  HABIT_OPERATIONS: { maxAttempts: 20, windowMs: 60 * 1000 }, // 20 operations per minute
  AUTH_ATTEMPTS: { maxAttempts: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
} as const;
