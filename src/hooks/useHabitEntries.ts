import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateDateEntry, validateNotes, sanitizeInput } from '@/utils/validation';
import { rateLimiter, RATE_LIMITS } from '@/utils/rateLimiter';
import { handleSecureError } from '@/utils/errorHandler';
import { useAchievements } from '@/hooks/useAchievements';
import type { Habit } from './useHabits';

export interface HabitEntry {
  id: string;
  habit_id: string;
  date: string;
  completed: boolean;
  notes?: string;
}

export const useHabitEntries = (habits: Habit[]) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { checkAndAwardAchievements } = useAchievements();
  const [habitEntries, setHabitEntries] = useState<HabitEntry[]>([]);

  const fetchHabitEntries = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('habit_entries')
        .select('*');

      if (error) throw error;

      setHabitEntries(data || []);
    } catch (error) {
      console.error('Error fetching habit entries:', error);
    }
  };

  const checkAndAutoCompleteDay = async (date: string, updatedHabitId: string, updatedCompleted: boolean, onDayCompleted?: () => void) => {
    try {
      // Get all habits for the user
      const allHabits = habits;
      
      // Get all entries for the specific date
      const { data: dayEntries } = await supabase
        .from('habit_entries')
        .select('*')
        .eq('date', date)
        .eq('user_id', user?.id);

      // Create a map of habit completions including the just-updated one
      const completionMap = new Map();
      
      // Add existing entries to the map
      dayEntries?.forEach(entry => {
        completionMap.set(entry.habit_id, entry.completed);
      });
      
      // Update with the current change
      completionMap.set(updatedHabitId, updatedCompleted);

      // Check if all habits are completed
      const allCompleted = allHabits.every(habit => 
        completionMap.get(habit.id) === true
      );

      if (allCompleted && allHabits.length > 0 && updatedCompleted) {
        // Call the celebration callback if provided
        if (onDayCompleted) {
          onDayCompleted();
        }
        
        toast({
          title: "🎉 Day Completed!",
          description: "Congratulations! You've completed all your habits for today!",
        });
      }
    } catch (error) {
      console.error('Error checking day completion:', error);
    }
  };

  const updateHabitEntry = async (habitId: string, date: string, completed: boolean, notes?: string, onDayCompleted?: () => void) => {
    // Enhanced date validation
    const dateValidation = validateDateEntry(date);
    if (!dateValidation.isValid) {
      toast({
        title: "Invalid date",
        description: dateValidation.error,
        variant: "destructive",
      });
      return;
    }

    // Rate limiting check
    if (!rateLimiter.isAllowed('habit_update', habitId, RATE_LIMITS.HABIT_OPERATIONS.maxAttempts, RATE_LIMITS.HABIT_OPERATIONS.windowMs)) {
      const remainingTime = rateLimiter.getRemainingTime('habit_update', habitId);
      toast({
        title: "Too many updates",
        description: `Please wait ${remainingTime} seconds before updating again.`,
        variant: "destructive",
      });
      return;
    }

    // Validate notes if provided
    if (notes) {
      const notesValidation = validateNotes(notes);
      if (!notesValidation.isValid) {
        toast({
          title: "Invalid notes",
          description: notesValidation.error,
          variant: "destructive",
        });
        return;
      }
      notes = sanitizeInput(notes);
    }

    try {
      const { data, error } = await supabase
        .from('habit_entries')
        .upsert({
          habit_id: habitId,
          date: date,
          completed: completed,
          notes: notes || null,
          user_id: user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      setHabitEntries(prev => {
        const existing = prev.find(entry => entry.habit_id === habitId && entry.date === date);
        if (existing) {
          return prev.map(entry => 
            entry.habit_id === habitId && entry.date === date 
              ? { ...entry, completed, notes }
              : entry
          );
        } else {
          return [...prev, {
            id: data.id,
            habit_id: habitId,
            date: date,
            completed: completed,
            notes: notes,
          }];
        }
      });

      // Check if all habits for today are completed after this update
      const entryDate = new Date(date).toISOString().split('T')[0];
      const today = new Date().toISOString().split('T')[0];
      if (entryDate === today) {
        checkAndAutoCompleteDay(date, habitId, completed, onDayCompleted);
      }

      // Check for achievements after updating entry
      await checkAndAwardAchievements();

      toast({
        title: completed ? "Great job!" : "Entry updated",
        description: completed ? "You've completed this habit!" : "Your entry has been saved.",
      });
    } catch (error) {
      const secureError = handleSecureError(error, 'useHabitEntries.updateHabitEntry');
      toast({
        title: "Error saving entry",
        description: secureError.userMessage,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchHabitEntries();
    }
  }, [user]);

  return {
    habitEntries,
    updateHabitEntry,
    refetchHabitEntries: fetchHabitEntries
  };
};