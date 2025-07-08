import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateSubtaskName, sanitizeInput } from '@/utils/validation';
import { rateLimiter, RATE_LIMITS } from '@/utils/rateLimiter';
import { handleSecureError } from '@/utils/errorHandler';

export interface Subtask {
  id: string;
  habit_id: string;
  name: string;
  completed: boolean;
}

export const useSubtasks = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);

  const fetchSubtasks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('subtasks')
        .select('*');

      if (error) throw error;

      setSubtasks(data || []);
    } catch (error) {
      console.error('Error fetching subtasks:', error);
    }
  };

  const addSubtask = async (habitId: string, subtaskName: string) => {
    // Validate input
    const nameValidation = validateSubtaskName(subtaskName);
    if (!nameValidation.isValid) {
      toast({
        title: "Invalid subtask name",
        description: nameValidation.error,
        variant: "destructive",
      });
      return;
    }

    // Rate limiting check
    if (!rateLimiter.isAllowed('subtask_create', habitId, RATE_LIMITS.HABIT_OPERATIONS.maxAttempts, RATE_LIMITS.HABIT_OPERATIONS.windowMs)) {
      const remainingTime = rateLimiter.getRemainingTime('subtask_create', habitId);
      toast({
        title: "Too many requests",
        description: `Please wait ${remainingTime} seconds before adding another subtask.`,
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('subtasks')
        .insert([{
          habit_id: habitId,
          name: sanitizeInput(subtaskName),
          user_id: user?.id,
        }])
        .select()
        .single();

      if (error) throw error;

      const newSubtask = {
        id: data.id,
        habit_id: data.habit_id,
        name: data.name,
        completed: data.completed,
      };

      setSubtasks([...subtasks, newSubtask]);

      toast({
        title: "Subtask added!",
        description: "New subtask has been added.",
      });
    } catch (error) {
      const secureError = handleSecureError(error, 'useSubtasks.addSubtask');
      toast({
        title: "Error adding subtask",
        description: secureError.userMessage,
        variant: "destructive",
      });
    }
  };

  const updateSubtask = async (subtaskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('subtasks')
        .update({ completed })
        .eq('id', subtaskId);

      if (error) throw error;

      setSubtasks(subtasks.map(subtask =>
        subtask.id === subtaskId ? { ...subtask, completed } : subtask
      ));
    } catch (error) {
      toast({
        title: "Error updating subtask",
        description: "Could not update subtask. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteSubtask = async (subtaskId: string) => {
    try {
      const { error } = await supabase
        .from('subtasks')
        .delete()
        .eq('id', subtaskId);

      if (error) throw error;

      setSubtasks(subtasks.filter(subtask => subtask.id !== subtaskId));

      toast({
        title: "Subtask deleted",
        description: "Subtask has been deleted.",
      });
    } catch (error) {
      toast({
        title: "Error deleting subtask",
        description: "Could not delete subtask. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchSubtasks();
    }
  }, [user]);

  return {
    subtasks,
    addSubtask,
    updateSubtask,
    deleteSubtask,
    refetchSubtasks: fetchSubtasks
  };
};