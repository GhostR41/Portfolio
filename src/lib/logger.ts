// SECURITY: Secure logging utility - only logs in development, redacts sensitive data

const SENSITIVE_PATTERNS = [
  /Bearer\s+[\w-]+\.[\w-]+\.[\w-]+/gi, // JWT tokens
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, // Email addresses
  /\b\d{3}-\d{2}-\d{4}\b/g, // SSN-like patterns
];

function redactSensitiveData(message: string): string {
  let redacted = message;
  SENSITIVE_PATTERNS.forEach(pattern => {
    redacted = redacted.replace(pattern, '[REDACTED]');
  });
  return redacted;
}

export const logger = {
  error: (message: string, error?: any) => {
    if (import.meta.env.DEV) {
      const safeMessage = typeof message === 'string' ? redactSensitiveData(message) : message;
      console.error(safeMessage, error);
    }
  },
  
  warn: (message: string) => {
    if (import.meta.env.DEV) {
      const safeMessage = typeof message === 'string' ? redactSensitiveData(message) : message;
      console.warn(safeMessage);
    }
  },
  
  info: (message: string) => {
    if (import.meta.env.DEV) {
      console.log(message);
    }
  },
  
  // Production-safe logging (only critical errors)
  critical: (message: string) => {
    console.error(message);
  }
};
