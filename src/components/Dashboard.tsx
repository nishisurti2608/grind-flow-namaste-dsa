import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Calendar, TrendingUp, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import HeatmapCalendar from './HeatmapCalendar';
import HabitList from './HabitList';
import AddHabitModal from './AddHabitModal';
import EditHabitModal from './EditHabitModal';
import OverallProgressView from './OverallProgressView';
import DashboardStats from './DashboardStats';
import DailyHistory from './DailyHistory';
import TaskCommitTimeline from './TaskCommitTimeline';
import { validateHabitName, validateSubtaskName, validateNotes, validateColor, sanitizeInput, validateDateEntry } from '@/utils/validation';
import { rateLimiter, RATE_LIMITS } from '@/utils/rateLimiter';
import { handleSecureError } from '@/utils/errorHandler';
import { useAchievements } from '@/hooks/useAchievements';

export interface Habit {
  id: string;
  name: string;
  color: string;
}

export interface HabitEntry {
  id: string;
  habit_id: string;
  date: string;
  completed: boolean;
  notes?: string;
}

export interface Subtask {
  id: string;
  habit_id: string;
  name: string;
  completed: boolean;
}

interface UserProfile {
  full_name: string | null;
  email: string | null;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { checkAndAwardAchievements } = useAchievements();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitEntries, setHabitEntries] = useState<HabitEntry[]>([]);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'individual' | 'overall' | 'history' | 'commits'>('individual');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (user) {
      fetchHabits();
      fetchHabitEntries();
      fetchSubtasks();
      fetchUserProfile();
      checkAndArchiveCompletedDays();
    }
  }, [user]);

  // Auto-select first habit when habits change
  useEffect(() => {
    if (habits.length > 0 && !selectedHabit) {
      setSelectedHabit(habits[0]);
    } else if (habits.length === 0) {
      setSelectedHabit(null);
    } else if (selectedHabit && !habits.find(h => h.id === selectedHabit.id)) {
      // If current selected habit was deleted, select the first available habit
      setSelectedHabit(habits[0]);
    }
  }, [habits, selectedHabit]);

  const checkAndArchiveCompletedDays = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Get all unique dates from habit_entries that are before today
    const { data: pastEntries } = await supabase
      .from('habit_entries')
      .select('date')
      .eq('user_id', user?.id)
      .lt('date', today);

    if (pastEntries) {
      const uniqueDates = [...new Set(pastEntries.map(entry => entry.date))];
      
      for (const date of uniqueDates) {
        // Check if this date is already archived
        const { data: existingHistory } = await supabase
          .from('daily_history')
          .select('id')
          .eq('date', date)
          .eq('user_id', user?.id);

        if (!existingHistory || existingHistory.length === 0) {
          await archiveDayData(date);
        }
      }
    }
  };

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

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setUserProfile({
          full_name: user?.user_metadata?.full_name || null,
          email: user?.email || null,
        });
      } else {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUserProfile({
        full_name: user?.user_metadata?.full_name || null,
        email: user?.email || null,
      });
    }
  };

  const fetchHabits = async () => {
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

  const fetchHabitEntries = async () => {
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

  const fetchSubtasks = async () => {
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

  const updateHabitEntry = async (habitId: string, date: string, completed: boolean, notes?: string) => {
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
        checkAndAutoCompleteDay(date, habitId, completed);
      }

      // Check for achievements after updating entry
      await checkAndAwardAchievements();

      toast({
        title: completed ? "Great job!" : "Entry updated",
        description: completed ? "You've completed this habit!" : "Your entry has been saved.",
      });
    } catch (error) {
      const secureError = handleSecureError(error, 'Dashboard.updateHabitEntry');
      toast({
        title: "Error saving entry",
        description: secureError.userMessage,
        variant: "destructive",
      });
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
      const secureError = handleSecureError(error, 'Dashboard.addHabit');
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
      const secureError = handleSecureError(error, 'Dashboard.updateHabit');
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
      const secureError = handleSecureError(error, 'Dashboard.addSubtask');
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

  const checkAndAutoCompleteDay = async (date: string, updatedHabitId: string, updatedCompleted: boolean) => {
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

      if (allCompleted && allHabits.length > 0) {
        toast({
          title: "🎉 Day Completed!",
          description: "Congratulations! You've completed all your habits for today!",
        });

        // Archive the day if it's not already archived
        setTimeout(() => {
          archiveDayData(date);
        }, 1000);
      }
    } catch (error) {
      console.error('Error checking day completion:', error);
    }
  };

  const getDisplayName = () => {
    return userProfile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="text-lg text-gray-600">Loading your habits...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header - Back button removed */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/bfdabed2-e05a-4763-a368-dacd61ff3332.png" 
                alt="Grind Flow Logo" 
                className="w-8 h-8 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Grind Flow</h1>
                <p className="text-sm text-gray-500">Level up your dev skills daily</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src="" alt={getDisplayName()} />
                <AvatarFallback className="bg-indigo-100 text-indigo-600 text-sm font-medium">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{getDisplayName()}</p>
                <p className="text-xs text-gray-500">Welcome back!</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Habit
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut} className="text-gray-600">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {habits.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No habits yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create your first habit to start tracking your progress and building better routines.
            </p>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Habit
            </Button>
          </div>
        ) : (
            <div>
              {/* Dashboard Stats */}
              <DashboardStats habits={habits} habitEntries={habitEntries} />
              
              <div className="grid lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <HabitList 
                    habits={habits}
                    subtasks={subtasks}
                    selectedHabit={selectedHabit}
                    onSelectHabit={setSelectedHabit}
                    onEditHabit={setEditingHabit}
                    onDeleteHabit={deleteHabit}
                    onAddSubtask={addSubtask}
                    onUpdateSubtask={updateSubtask}
                    onDeleteSubtask={deleteSubtask}
                  />
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <h2 className="text-2xl font-bold text-gray-900">
                          Progress Tracking
                        </h2>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant={viewMode === 'individual' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setViewMode('individual')}
                        >
                          Individual
                        </Button>
                        <Button
                          variant={viewMode === 'overall' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setViewMode('overall')}
                        >
                          Overall
                        </Button>
                        <Button
                          variant={viewMode === 'history' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setViewMode('history')}
                        >
                          History
                        </Button>
                        <Button
                          variant={viewMode === 'commits' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setViewMode('commits')}
                        >
                          Commits
                        </Button>
                      </div>
                    </div>

                    {viewMode === 'individual' && selectedHabit ? (
                      <div>
                        <div className="flex items-center space-x-3 mb-6">
                          <div className={`w-4 h-4 rounded-full ${selectedHabit.color}`}></div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {selectedHabit.name}
                            </h3>
                            <p className="text-gray-600">
                              Track your progress and build consistency
                            </p>
                          </div>
                        </div>

                        <HeatmapCalendar
                          habit={selectedHabit}
                          entries={habitEntries.filter(entry => entry.habit_id === selectedHabit.id)}
                          onUpdateEntry={updateHabitEntry}
                        />
                      </div>
                    ) : viewMode === 'overall' ? (
                      <OverallProgressView
                        habits={habits}
                        habitEntries={habitEntries}
                        onUpdateEntry={updateHabitEntry}
                      />
                    ) : viewMode === 'history' ? (
                      <DailyHistory />
                    ) : (
                      <TaskCommitTimeline
                        habits={habits}
                        habitEntries={habitEntries}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/lovable-uploads/bfdabed2-e05a-4763-a368-dacd61ff3332.png" 
                  alt="Grind Flow Logo" 
                  className="w-6 h-6 object-contain"
                />
                <h3 className="text-lg font-bold text-gray-900">Grind Flow</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Level up your dev skills daily. Track your progress, build consistency, and achieve your coding goals.
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>All systems operational</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Habit Tracking</li>
                <li>• Progress Analytics</li>
                <li>• Achievement System</li>
                <li>• Daily Commits</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Documentation</li>
                <li>• Support</li>
                <li>• Community</li>
                <li>• Updates</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-6 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              © 2024 Grind Flow. Built with passion for developers.
            </p>
            <div className="text-xs text-gray-500">
              Made with ❤️ for the coding community
            </div>
          </div>
        </div>
      </footer>

      <AddHabitModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addHabit}
      />

      <EditHabitModal
        open={!!editingHabit}
        habit={editingHabit}
        onClose={() => setEditingHabit(null)}
        onUpdate={updateHabit}
      />
    </div>
  );
};

export default Dashboard;
