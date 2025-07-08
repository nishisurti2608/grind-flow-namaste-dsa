import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateHabitName, validateColor, sanitizeInput } from '@/utils/validation';
import { handleSecureError } from '@/utils/errorHandler';

export interface Habit {
  id: string;
  name: string;
  color: string;
}

export const useHabits = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHabits = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedHabits = data.map(habit => ({
        id: habit.id,
        name: habit.name,
        color: habit.color,
      }));

      setHabits(formattedHabits);
    } catch (error) {
      toast({
        title: "Error fetching habits",
        description: "Could not load your habits",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async (habitData: Omit<Habit, 'id'>) => {
    // Validate input
    const nameValidation = validateHabitName(habitData.name);
    if (!nameValidation.isValid) {
      throw new Error(nameValidation.error);
    }

    const colorValidation = validateColor(habitData.color);
    if (!colorValidation.isValid) {
      throw new Error(colorValidation.error);
    }

    try {
      const { data, error } = await supabase
        .from('habits')
        .insert([{
          name: sanitizeInput(habitData.name),
          color: habitData.color,
          type: 'checkbox',
          user_id: user?.id,
        }])
        .select()
        .single();

      if (error) throw error;

      const newHabit = {
        id: data.id,
        name: data.name,
        color: data.color,
      };

      setHabits([newHabit, ...habits]);
      
      toast({
        title: "Habit created!",
        description: `${habitData.name} has been added to your habits.`,
      });
    } catch (error) {
      const secureError = handleSecureError(error, 'useHabits.addHabit');
      toast({
        title: "Error creating habit",
        description: secureError.userMessage,
        variant: "destructive",
      });
      throw error; // Re-throw for modal handling
    }
  };

  const updateHabit = async (habitId: string, updates: Partial<Habit>) => {
    // Validate updates
    if (updates.name) {
      const nameValidation = validateHabitName(updates.name);
      if (!nameValidation.isValid) {
        toast({
          title: "Invalid habit name",
          description: nameValidation.error,
          variant: "destructive",
        });
        return;
      }
    }

    if (updates.color) {
      const colorValidation = validateColor(updates.color);
      if (!colorValidation.isValid) {
        toast({
          title: "Invalid color",
          description: colorValidation.error,
          variant: "destructive",
        });
        return;
      }
    }

    try {
      const { error } = await supabase
        .from('habits')
        .update({
          name: updates.name ? sanitizeInput(updates.name) : undefined,
          color: updates.color,
        })
        .eq('id', habitId);

      if (error) throw error;

      setHabits(habits.map(habit => 
        habit.id === habitId 
          ? { ...habit, ...updates }
          : habit
      ));
      
      toast({
        title: "Habit updated!",
        description: "Your habit has been updated successfully.",
      });
    } catch (error) {
      const secureError = handleSecureError(error, 'useHabits.updateHabit');
      toast({
        title: "Error updating habit",
        description: secureError.userMessage,
        variant: "destructive",
      });
    }
  };

  const deleteHabit = async (habitId: string) => {
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId);

      if (error) throw error;

      const updatedHabits = habits.filter(habit => habit.id !== habitId);
      setHabits(updatedHabits);
      
      toast({
        title: "Habit deleted",
        description: "Your habit has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error deleting habit",
        description: "Could not delete your habit. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchHabits();
    }
  }, [user]);

  return {
    habits,
    loading,
    addHabit,
    updateHabit,
    deleteHabit,
    refetchHabits: fetchHabits
  };
};