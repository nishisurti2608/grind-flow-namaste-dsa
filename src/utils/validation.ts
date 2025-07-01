
// Input validation utilities for security
export const VALIDATION_LIMITS = {
  HABIT_NAME_MAX_LENGTH: 100,
  SUBTASK_NAME_MAX_LENGTH: 80,
  NOTES_MAX_LENGTH: 500,
  PASSWORD_MIN_LENGTH: 8,
} as const;

export const ALLOWED_COLORS = [
  'bg-indigo-500',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-orange-500',
  'bg-red-500',
  'bg-cyan-500',
  'bg-yellow-500',
  'bg-green-500',
] as const;

export const validateHabitName = (name: string): { isValid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Habit name is required' };
  }
  
  if (name.length > VALIDATION_LIMITS.HABIT_NAME_MAX_LENGTH) {
    return { isValid: false, error: `Habit name must be ${VALIDATION_LIMITS.HABIT_NAME_MAX_LENGTH} characters or less` };
  }
  
  // Check for potentially harmful characters
  const dangerousPattern = /[<>\"'&]/;
  if (dangerousPattern.test(name)) {
    return { isValid: false, error: 'Habit name contains invalid characters' };
  }
  
  return { isValid: true };
};

export const validateSubtaskName = (name: string): { isValid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Subtask name is required' };
  }
  
  if (name.length > VALIDATION_LIMITS.SUBTASK_NAME_MAX_LENGTH) {
    return { isValid: false, error: `Subtask name must be ${VALIDATION_LIMITS.SUBTASK_NAME_MAX_LENGTH} characters or less` };
  }
  
  // Check for potentially harmful characters
  const dangerousPattern = /[<>\"'&]/;
  if (dangerousPattern.test(name)) {
    return { isValid: false, error: 'Subtask name contains invalid characters' };
  }
  
  return { isValid: true };
};

export const validateNotes = (notes: string): { isValid: boolean; error?: string } => {
  if (notes && notes.length > VALIDATION_LIMITS.NOTES_MAX_LENGTH) {
    return { isValid: false, error: `Notes must be ${VALIDATION_LIMITS.NOTES_MAX_LENGTH} characters or less` };
  }
  
  return { isValid: true };
};

export const validateColor = (color: string): { isValid: boolean; error?: string } => {
  if (!ALLOWED_COLORS.includes(color as any)) {
    return { isValid: false, error: 'Invalid color selection' };
  }
  
  return { isValid: true };
};

export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (password.length < VALIDATION_LIMITS.PASSWORD_MIN_LENGTH) {
    return { isValid: false, error: `Password must be at least ${VALIDATION_LIMITS.PASSWORD_MIN_LENGTH} characters long` };
  }
  
  return { isValid: true };
};

export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>\"'&]/g, '') // Remove potentially dangerous characters
    .trim();
};

export const validateDateEntry = (date: string): { isValid: boolean; error?: string } => {
  const today = new Date().toISOString().split('T')[0];
  const entryDate = new Date(date).toISOString().split('T')[0];
  
  if (entryDate > today) {
    return { isValid: false, error: 'Cannot mark future dates as complete' };
  }
  
  // Check if date is too far in the past (more than 1 year)
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const oneYearAgoStr = oneYearAgo.toISOString().split('T')[0];
  
  if (entryDate < oneYearAgoStr) {
    return { isValid: false, error: 'Cannot modify entries older than one year' };
  }
  
  return { isValid: true };
};
