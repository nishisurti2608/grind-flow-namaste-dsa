-- Fix cascade delete issue to preserve user progress data when habits are deleted

-- First, drop the existing foreign key constraints
ALTER TABLE public.habit_entries 
DROP CONSTRAINT habit_entries_habit_id_fkey;

ALTER TABLE public.subtasks 
DROP CONSTRAINT subtasks_habit_id_fkey;

-- Re-add the foreign key constraints with SET NULL instead of CASCADE
-- This preserves habit entries even when habits are deleted
ALTER TABLE public.habit_entries 
ADD CONSTRAINT habit_entries_habit_id_fkey 
FOREIGN KEY (habit_id) REFERENCES public.habits(id) ON DELETE SET NULL;

-- For subtasks, we'll use CASCADE since subtasks don't represent progress data
-- and should be deleted when the parent habit is deleted
ALTER TABLE public.subtasks 
ADD CONSTRAINT subtasks_habit_id_fkey 
FOREIGN KEY (habit_id) REFERENCES public.habits(id) ON DELETE CASCADE;

-- Update the achievement calculation function to handle NULL habit_id entries
-- This ensures progress calculation works even with orphaned entries
CREATE OR REPLACE FUNCTION public.check_and_award_achievements(user_uuid UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  consecutive_days INTEGER;
  achievement_record RECORD;
BEGIN
  -- Calculate consecutive days from habit entries (including orphaned entries)
  WITH daily_completion AS (
    SELECT 
      date,
      COUNT(*) as total_habits,
      COUNT(*) FILTER (WHERE completed = true) as completed_habits
    FROM habit_entries 
    WHERE user_id = user_uuid 
      AND date >= (SELECT created_at::date FROM profiles WHERE id = user_uuid)
    GROUP BY date
    HAVING COUNT(*) FILTER (WHERE completed = true) > 0
  ),
  consecutive_sequence AS (
    SELECT 
      date,
      date - ROW_NUMBER() OVER (ORDER BY date)::integer * INTERVAL '1 day' as grp
    FROM daily_completion
    WHERE date <= CURRENT_DATE
  ),
  longest_streak AS (
    SELECT MAX(COUNT(*)) as max_consecutive
    FROM consecutive_sequence
    GROUP BY grp
  )
  SELECT COALESCE(max_consecutive, 0) INTO consecutive_days FROM longest_streak;

  -- Define achievement milestones
  FOR achievement_record IN 
    SELECT * FROM (VALUES 
      (7, 'earth', '7 Days Grounded', 'Started your consistency journey', '#4B5563'),
      (21, 'water', '21 Days Flowing', 'Momentum begins to build', '#06B6D4'),
      (30, 'fire', '1 Month Ignited', 'Habit is heating up', '#EF4444'),
      (45, 'air', '45 Days Breezing', 'Light, consistent flow', '#3B82F6'),
      (60, 'lightning', '60 Days Charged', 'Surge of willpower', '#8B5CF6'),
      (75, 'aether', '75 Days Ascended', 'Elevated discipline', '#7C3AED'),
      (90, 'master', '90 Days Master', 'Ultimate consistency achieved', '#F59E0B')
    ) AS milestones(days, element, name, description, color)
  LOOP
    -- Check if user has reached this milestone and hasn't earned it yet
    IF consecutive_days >= achievement_record.days THEN
      -- Insert achievement if not already exists
      INSERT INTO public.achievements (
        user_id, 
        milestone_days, 
        element_type, 
        badge_name, 
        badge_description, 
        badge_color
      )
      SELECT 
        user_uuid,
        achievement_record.days,
        achievement_record.element,
        achievement_record.name,
        achievement_record.description,
        achievement_record.color
      WHERE NOT EXISTS (
        SELECT 1 FROM public.achievements 
        WHERE user_id = user_uuid AND milestone_days = achievement_record.days
      );
    END IF;
  END LOOP;
END;
$$;