
-- Add notes column to habit_entries table
ALTER TABLE public.habit_entries 
ADD COLUMN notes TEXT;

-- Add option_colors column to habits table to store color mapping for dropdown options
ALTER TABLE public.habits 
ADD COLUMN option_colors JSONB;
