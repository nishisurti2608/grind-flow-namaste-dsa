
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, User, Mail, Save, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AchievementGrid from './AchievementGrid';
import { useAchievements } from '@/hooks/useAchievements';

interface ProfileSettingsProps {
  onBack: () => void;
}

const ProfileSettings = ({ onBack }: ProfileSettingsProps) => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { achievements, calculateCurrentStreak } = useAchievements();
  const [profile, setProfile] = useState({
    full_name: '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalHabits, setTotalHabits] = useState(0);
  const [daysTracked, setDaysTracked] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);

  useEffect(() => {
    if (user) {
      fetchProfile();
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    if (!user) return;
    
    try {
      // Calculate current streak
      const streak = await calculateCurrentStreak();
      setCurrentStreak(streak);

      // Get total habits
      const { data: habits, error: habitsError } = await supabase
        .from('habits')
        .select('id')
        .eq('user_id', user.id);

      if (habitsError) throw habitsError;
      setTotalHabits(habits?.length || 0);

      // Get total days tracked and completion rate
      const { data: entries, error: entriesError } = await supabase
        .from('habit_entries')
        .select('date, completed')
        .eq('user_id', user.id);

      if (entriesError) throw entriesError;

      const uniqueDates = new Set(entries?.map(e => e.date) || []);
      setDaysTracked(uniqueDates.size);

      const totalEntries = entries?.length || 0;
      const completedEntries = entries?.filter(e => e.completed).length || 0;
      const rate = totalEntries > 0 ? Math.round((completedEntries / totalEntries) * 100) : 0;
      setCompletionRate(rate);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        // Profile doesn't exist, create one
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{
            id: user?.id,
            email: user?.email,
            full_name: '',
          }]);

        if (insertError) throw insertError;
        
        setProfile({
          full_name: '',
          email: user?.email || '',
        });
      } else {
        setProfile({
          full_name: data.full_name || '',
          email: data.email || user?.email || '',
        });
      }
    } catch (error) {
      toast({
        title: "Error fetching profile",
        description: "Could not load your profile information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          full_name: profile.full_name,
          email: profile.email,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error saving profile",
        description: "Could not save your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="text-lg text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Profile Settings</h1>
                <p className="text-sm text-gray-500">Manage your account information</p>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={signOut} className="text-gray-600">
            Sign Out
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid gap-8">
          {/* Profile Information */}
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                  <p className="text-gray-600">Update your personal details</p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    placeholder="Enter your full name"
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Account Statistics */}
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Account Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{totalHabits}</div>
                  <div className="text-sm text-gray-600">Total Habits</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{daysTracked}</div>
                  <div className="text-sm text-gray-600">Days Tracked</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{completionRate}%</div>
                  <div className="text-sm text-gray-600">Completion Rate</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{currentStreak}</div>
                  <div className="text-sm text-gray-600">Current Streak</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Achievements */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Trophy className="w-6 h-6 text-yellow-600" />
                <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
              </div>
              <AchievementGrid currentStreak={currentStreak} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
