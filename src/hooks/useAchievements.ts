import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Achievement } from '@/components/AchievementBadge';

export const useAchievements = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAchievements();
    }
  }, [user]);

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user?.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAndAwardAchievements = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase.rpc('check_and_award_achievements', {
        user_uuid: user.id
      });

      if (error) throw error;
      
      // Refetch achievements to get any newly awarded ones
      await fetchAchievements();
      
      // Check if any new achievements were earned
      const { data: newAchievements, error: checkError } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .gte('earned_at', new Date(Date.now() - 1000 * 60).toISOString()); // Last minute

      if (checkError) throw checkError;

      // Show toast for new achievements
      if (newAchievements && newAchievements.length > 0) {
        newAchievements.forEach(achievement => {
          toast({
            title: "Achievement Unlocked! 🎉",
            description: `You earned the "${achievement.badge_name}" badge!`,
            duration: 5000,
          });
        });
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  };

  const calculateCurrentStreak = async () => {
    if (!user) return 0;

    try {
      // Get user's signup date first
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('created_at')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      const signupDate = profile.created_at;
      
      // Calculate consecutive days from habit entries (including orphaned entries with NULL habit_id)
      const { data, error } = await supabase
        .from('habit_entries')
        .select('date, completed')
        .eq('user_id', user.id)
        .gte('date', signupDate)
        .order('date', { ascending: false });

      if (error) throw error;

      // Group by date and check if at least one habit was completed each day
      const dailyCompletion = new Map<string, boolean>();
      
      data?.forEach(entry => {
        if (!dailyCompletion.has(entry.date)) {
          dailyCompletion.set(entry.date, false);
        }
        if (entry.completed) {
          dailyCompletion.set(entry.date, true);
        }
      });

      // Calculate current streak
      let streak = 0;
      const today = new Date();
      
      for (let i = 0; i < 365; i++) { // Check up to a year back
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];
        
        if (dailyCompletion.get(dateStr)) {
          streak++;
        } else {
          break;
        }
      }

      return streak;
    } catch (error) {
      console.error('Error calculating streak:', error);
      return 0;
    }
  };

  return {
    achievements,
    loading,
    checkAndAwardAchievements,
    calculateCurrentStreak,
    refetchAchievements: fetchAchievements,
  };
};