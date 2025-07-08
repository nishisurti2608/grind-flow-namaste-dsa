-- Create daily_medals table for tracking user achievement medals
CREATE TABLE public.daily_medals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  streak_count INTEGER NOT NULL,
  earned_date DATE NOT NULL,
  medal_type TEXT NOT NULL CHECK (medal_type IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.daily_medals ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own daily medals" 
ON public.daily_medals 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own daily medals" 
ON public.daily_medals 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily medals" 
ON public.daily_medals 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily medals" 
ON public.daily_medals 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create unique constraint to prevent duplicate medals for same streak
CREATE UNIQUE INDEX idx_daily_medals_user_streak 
ON public.daily_medals (user_id, streak_count);