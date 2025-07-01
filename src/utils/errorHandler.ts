
// Enhanced error handling with security-focused messaging
export interface SecureError {
  userMessage: string;
  shouldLog: boolean;
  details?: string;
}

export const handleSecureError = (error: any, context: string): SecureError => {
  console.error(`Error in ${context}:`, error);
  
  // Default secure response
  let userMessage = 'An unexpected error occurred. Please try again.';
  let shouldLog = true;
  let details = '';
  
  if (error?.message) {
    const message = error.message.toLowerCase();
    
    // Handle specific Supabase errors with user-friendly messages
    if (message.includes('duplicate key value')) {
      userMessage = 'This item already exists. Please try a different name.';
      shouldLog = false;
    } else if (message.includes('violates row-level security')) {
      userMessage = 'You do not have permission to perform this action.';
      details = 'RLS violation detected';
    } else if (message.includes('invalid input syntax')) {
      userMessage = 'Invalid data format. Please check your input.';
      details = 'Input validation failed';
    } else if (message.includes('connection')) {
      userMessage = 'Connection issue. Please check your internet and try again.';
    } else if (message.includes('timeout')) {
      userMessage = 'The request took too long. Please try again.';
    } else if (message.includes('rate limit')) {
      userMessage = 'Too many requests. Please wait a moment before trying again.';
      shouldLog = false;
    }
  }
  
  return {
    userMessage,
    shouldLog,
    details
  };
};

export const getGenericErrorMessage = (operation: string): string => {
  const messages = {
    create: 'Unable to create item. Please try again.',
    update: 'Unable to save changes. Please try again.',
    delete: 'Unable to delete item. Please try again.',
    fetch: 'Unable to load data. Please refresh the page.',
    auth: 'Authentication failed. Please check your credentials.',
  };
  
  return messages[operation as keyof typeof messages] || 'An error occurred. Please try again.';
};
