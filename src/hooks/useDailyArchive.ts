import { useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Habit } from './useHabits';

export const useDailyArchive = (habits: Habit[]) => {
  const { user } = useAuth();

  const archiveDayData = async (date: string) => {
    try {
      console.log(`Archiving data for date: ${date}`);
      
      // Get all habits that existed at the time
      const { data: allHabits } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user?.id);

      // Get all entries for the specific date
      const { data: dayEntries } = await supabase
        .from('habit_entries')
        .select('*')
        .eq('date', date)
        .eq('user_id', user?.id);

      if (allHabits && allHabits.length > 0) {
        const completedCount = dayEntries?.filter(entry => entry.completed).length || 0;
        const totalCount = allHabits.length;
        const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

        console.log(`Date: ${date}, Completed: ${completedCount}/${totalCount}, Rate: ${completionRate}%`);

        // Store in daily_history table
        const { error } = await supabase
          .from('daily_history')
          .insert({
            user_id: user?.id,
            date: date,
            completed_tasks: completedCount,
            total_tasks: totalCount,
            completion_rate: completionRate,
            habits_data: allHabits,
            entries_data: dayEntries || []
          });

        if (error) {
          console.error('Error inserting daily history:', error);
        } else {
          console.log(`Successfully archived data for ${date}`);
        }
      }
    } catch (error) {
      console.error('Error archiving day data:', error);
    }
  };

  const checkAndArchiveCompletedDays = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    
    // Get all unique dates from habit_entries that are before today
    const { data: pastEntries } = await supabase
      .from('habit_entries')
      .select('date')
      .eq('user_id', user.id)
      .lt('date', today);

    if (pastEntries) {
      const uniqueDates = [...new Set(pastEntries.map(entry => entry.date))];
      
      for (const date of uniqueDates) {
        // Check if this date is already archived
        const { data: existingHistory } = await supabase
          .from('daily_history')
          .select('id')
          .eq('date', date)
          .eq('user_id', user.id);

        if (!existingHistory || existingHistory.length === 0) {
          await archiveDayData(date);
        }
      }
    }
  };

  useEffect(() => {
    if (user && habits.length > 0) {
      checkAndArchiveCompletedDays();
    }
  }, [user, habits]);

  return { archiveDayData };
};