
-- Create subtasks table
CREATE TABLE public.subtasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) for subtasks
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;

-- Create policies for subtasks
CREATE POLICY "Users can view their own subtasks" 
  ON public.subtasks 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subtasks" 
  ON public.subtasks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subtasks" 
  ON public.subtasks 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subtasks" 
  ON public.subtasks 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to automatically create default habits for new users
CREATE OR REPLACE FUNCTION create_default_habits_for_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert default habits for web developers
  INSERT INTO public.habits (user_id, name, color, type) VALUES
    (NEW.id, 'DSA (Data Structures & Algorithms)', 'bg-blue-500', 'checkbox'),
    (NEW.id, 'Project', 'bg-green-500', 'checkbox'),
    (NEW.id, 'Core', 'bg-purple-500', 'checkbox'),
    (NEW.id, 'Social Media', 'bg-pink-500', 'checkbox');
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create default habits when a user signs up
CREATE TRIGGER on_user_created_create_habits
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_default_habits_for_user();
