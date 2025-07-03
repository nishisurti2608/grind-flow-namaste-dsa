import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import AchievementBadge, { Achievement } from './AchievementBadge';

const milestones = [
  { days: 7, element: 'earth', name: '7 Days Grounded', description: 'Started your consistency journey' },
  { days: 21, element: 'water', name: '21 Days Flowing', description: 'Momentum begins to build' },
  { days: 30, element: 'fire', name: '1 Month Ignited', description: 'Habit is heating up' },
  { days: 45, element: 'air', name: '45 Days Breezing', description: 'Light, consistent flow' },
  { days: 60, element: 'lightning', name: '60 Days Charged', description: 'Surge of willpower' },
  { days: 75, element: 'aether', name: '75 Days Ascended', description: 'Elevated discipline' },
  { days: 90, element: 'master', name: '90 Days Master', description: 'Ultimate consistency achieved' },
];

interface AchievementGridProps {
  currentStreak?: number;
}

const AchievementGrid = ({ currentStreak = 0 }: AchievementGridProps) => {
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
        .order('milestone_days', { ascending: true });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      toast({
        title: "Error",
        description: "Failed to load achievements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAchievementStatus = (milestone: typeof milestones[0]) => {
    const earned = achievements.find(a => a.milestone_days === milestone.days);
    if (earned) return { status: 'earned', achievement: earned };
    if (currentStreak >= milestone.days) return { status: 'available' };
    return { status: 'locked' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading achievements...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Trophy className="w-6 h-6 text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Achievements</h3>
            <p className="text-sm text-muted-foreground">
              {achievements.length} of {milestones.length} badges earned
            </p>
          </div>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
          Current Streak: {currentStreak} days
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {milestones.map((milestone) => {
          const status = getAchievementStatus(milestone);
          
          if (status.status === 'earned' && status.achievement) {
            return (
              <AchievementBadge 
                key={milestone.days}
                achievement={status.achievement}
                size="medium"
                showShare={true}
              />
            );
          }

          return (
            <Card 
              key={milestone.days}
              className={`p-4 relative ${
                status.status === 'locked' 
                  ? 'opacity-50 bg-muted/50' 
                  : 'bg-card border-dashed border-primary/30'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className={`w-24 h-24 rounded-full border-2 flex items-center justify-center ${
                  status.status === 'locked' 
                    ? 'border-muted-foreground/20 bg-muted/30' 
                    : 'border-primary/30 bg-primary/5'
                }`}>
                  {status.status === 'locked' ? (
                    <Lock className="w-8 h-8 text-muted-foreground/50" />
                  ) : (
                    <Trophy className="w-8 h-8 text-primary/50" />
                  )}
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-sm text-foreground">
                    {milestone.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {milestone.description}
                  </p>
                  <Badge 
                    variant={status.status === 'locked' ? 'outline' : 'default'} 
                    className="mt-2 text-xs"
                  >
                    {status.status === 'locked' 
                      ? `${milestone.days - currentStreak} days to go` 
                      : 'Ready to claim!'
                    }
                  </Badge>
                </div>
              </div>
              
              {status.status === 'locked' && (
                <div className="absolute inset-0 bg-background/50 rounded-lg" />
              )}
            </Card>
          );
        })}
      </div>

      {achievements.length === 0 && currentStreak === 0 && (
        <Card className="p-8 text-center bg-muted/30">
          <Trophy className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <h4 className="font-semibold text-foreground mb-2">Start Your Journey</h4>
          <p className="text-sm text-muted-foreground">
            Complete your habits consistently to earn your first achievement badge!
          </p>
        </Card>
      )}
    </div>
  );
};

export default AchievementGrid;