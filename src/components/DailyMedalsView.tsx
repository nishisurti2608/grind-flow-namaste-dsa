import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2, Twitter, Facebook, Linkedin, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DailyMedal {
  id: string;
  user_id: string;
  streak_count: number;
  earned_date: string;
  medal_type: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  created_at: string;
}

const DailyMedalsView = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [medals, setMedals] = useState<DailyMedal[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedMedal, setSelectedMedal] = useState<DailyMedal | null>(null);

  useEffect(() => {
    if (user) {
      fetchMedals();
      calculateCurrentStreak();
    }
  }, [user]);

  const fetchMedals = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('daily_medals')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_date', { ascending: false });

      if (error) throw error;
      setMedals((data || []) as DailyMedal[]);
    } catch (error) {
      console.error('Error fetching medals:', error);
    }
  };

  const calculateCurrentStreak = async () => {
    if (!user) return;

    try {
      // Get recent habit entries to calculate current streak
      const { data: entries, error } = await supabase
        .from('habit_entries')
        .select('date, completed')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(30);

      if (error) throw error;

      // Calculate consecutive days
      let streak = 0;
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      // Group by date and check completion
      const dailyCompletions = entries?.reduce((acc, entry) => {
        if (!acc[entry.date]) acc[entry.date] = { total: 0, completed: 0 };
        acc[entry.date].total++;
        if (entry.completed) acc[entry.date].completed++;
        return acc;
      }, {} as Record<string, { total: number; completed: number }>);

      // Check streak starting from today or yesterday
      let checkDate = dailyCompletions?.[today] ? today : yesterday;
      
      while (checkDate && dailyCompletions?.[checkDate]) {
        const dayData = dailyCompletions[checkDate];
        if (dayData.completed === dayData.total && dayData.total > 0) {
          streak++;
          // Move to previous day
          const prevDate = new Date(checkDate);
          prevDate.setDate(prevDate.getDate() - 1);
          checkDate = prevDate.toISOString().split('T')[0];
        } else {
          break;
        }
      }

      setCurrentStreak(streak);
      
      // Check if we should award a new medal
      await checkAndAwardMedal(streak);
    } catch (error) {
      console.error('Error calculating streak:', error);
    }
  };

  const checkAndAwardMedal = async (streak: number) => {
    if (!user || streak < 7) return;

    const medalThresholds = [
      { days: 7, type: 'bronze' as const },
      { days: 14, type: 'silver' as const },
      { days: 30, type: 'gold' as const },
      { days: 60, type: 'platinum' as const },
      { days: 100, type: 'diamond' as const },
    ];

    for (const threshold of medalThresholds.reverse()) {
      if (streak >= threshold.days) {
        // Check if medal already exists
        const existingMedal = medals.find(m => m.streak_count === threshold.days);
        if (!existingMedal) {
          // Award new medal
          try {
            const { data, error } = await supabase
              .from('daily_medals')
              .insert({
                user_id: user.id,
                streak_count: threshold.days,
                medal_type: threshold.type,
                earned_date: new Date().toISOString().split('T')[0]
              })
              .select()
              .single();

            if (error) throw error;

            setMedals(prev => [data as DailyMedal, ...prev]);
            toast({
              title: "🏆 New Medal Earned!",
              description: `Congratulations! You've earned a ${threshold.type} medal for ${threshold.days} days streak!`,
            });
          } catch (error) {
            console.error('Error awarding medal:', error);
          }
        }
        break;
      }
    }
  };

  const getMedalEmoji = (type: string) => {
    switch (type) {
      case 'bronze': return '🥉';
      case 'silver': return '🥈';
      case 'gold': return '🥇';
      case 'platinum': return '⭐';
      case 'diamond': return '💎';
      default: return '🏅';
    }
  };

  const getMedalColor = (type: string) => {
    switch (type) {
      case 'bronze': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'platinum': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'diamond': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const shareOnTwitter = (medal: DailyMedal) => {
    const text = `I just earned a ${medal.medal_type} medal on Grind Flow for ${medal.streak_count} days of consistent habit tracking! 🚀 ${getMedalEmoji(medal.medal_type)}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareOnLinkedIn = (medal: DailyMedal) => {
    const text = `I just earned a ${medal.medal_type} medal on Grind Flow for ${medal.streak_count} days of consistent habit tracking! 🚀 ${getMedalEmoji(medal.medal_type)}`;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const copyToClipboard = (medal: DailyMedal) => {
    const text = `I just earned a ${medal.medal_type} medal on Grind Flow for ${medal.streak_count} days of consistent habit tracking! 🚀 ${getMedalEmoji(medal.medal_type)}`;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "Share text has been copied to your clipboard.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Daily Achievement Medals</h2>
        <p className="text-gray-600">
          Current streak: <span className="font-semibold text-indigo-600">{currentStreak} days</span>
        </p>
      </div>

      {currentStreak >= 7 && (
        <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <div className="text-center">
            <div className="text-4xl mb-2">🚀</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Amazing Streak!</h3>
            <p className="text-sm text-gray-600">
              You're on fire! Keep going to unlock more medals.
            </p>
          </div>
        </Card>
      )}

      {medals.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-6xl mb-4">🏅</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No medals yet</h3>
          <p className="text-gray-600">
            Complete your habits for 7 consecutive days to earn your first bronze medal!
          </p>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {medals.map((medal) => (
            <Card key={medal.id} className="p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">{getMedalEmoji(medal.medal_type)}</div>
              <Badge className={`mb-3 ${getMedalColor(medal.medal_type)}`}>
                {medal.medal_type.toUpperCase()} MEDAL
              </Badge>
              <h3 className="font-semibold text-gray-900 mb-1">
                {medal.streak_count} Days Streak
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Earned {new Date(medal.earned_date).toLocaleDateString()}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedMedal(medal);
                  setShowShareModal(true);
                }}
                className="w-full"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Achievement
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && selectedMedal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 w-full max-w-md mx-4">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{getMedalEmoji(selectedMedal.medal_type)}</div>
              <h3 className="text-lg font-semibold mb-2">Share Your Achievement</h3>
              <p className="text-sm text-gray-600">
                Let others know about your {selectedMedal.streak_count} days streak!
              </p>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={() => shareOnTwitter(selectedMedal)}
                className="w-full flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600"
              >
                <Twitter className="w-4 h-4" />
                <span>Share on Twitter</span>
              </Button>
              
              <Button
                onClick={() => shareOnLinkedIn(selectedMedal)}
                className="w-full flex items-center justify-center space-x-2 bg-blue-700 hover:bg-blue-800"
              >
                <Linkedin className="w-4 h-4" />
                <span>Share on LinkedIn</span>
              </Button>
              
              <Button
                onClick={() => copyToClipboard(selectedMedal)}
                variant="outline"
                className="w-full flex items-center justify-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copy to Clipboard</span>
              </Button>
            </div>
            
            <Button
              onClick={() => setShowShareModal(false)}
              variant="ghost"
              className="w-full mt-4"
            >
              Close
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DailyMedalsView;