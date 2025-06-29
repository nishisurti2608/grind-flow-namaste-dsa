
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, Settings, Calendar, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import HeatmapCalendar from './HeatmapCalendar';
import HabitList from './HabitList';
import AddHabitModal from './AddHabitModal';

export interface Habit {
  id: string;
  name: string;
  type: 'checkbox' | 'dropdown' | 'range';
  options?: string[];
  option_colors?: { [key: string]: string };
  min_value?: number;
  max_value?: number;
  color: string;
}

export interface HabitEntry {
  id: string;
  habit_id: string;
  date: string;
  value: any;
  completed: boolean;
  notes?: string;
}

const Dashboard = ({ onBack }: { onBack: () => void }) => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitEntries, setHabitEntries] = useState<HabitEntry[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchHabits();
      fetchHabitEntries();
    }
  }, [user]);

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
        type: habit.type as 'checkbox' | 'dropdown' | 'range',
        options: habit.options as string[],
        option_colors: habit.option_colors as { [key: string]: string },
        min_value: habit.min_value,
        max_value: habit.max_value,
        color: habit.color,
      }));

      setHabits(formattedHabits);
      if (formattedHabits.length > 0 && !selectedHabit) {
        setSelectedHabit(formattedHabits[0]);
      }
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

  const addHabit = async (habitData: Omit<Habit, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('habits')
        .insert([{
          name: habitData.name,
          type: habitData.type,
          options: habitData.options,
          option_colors: habitData.option_colors,
          min_value: habitData.min_value,
          max_value: habitData.max_value,
          color: habitData.color,
          user_id: user?.id,
        }])
        .select()
        .single();

      if (error) throw error;

      const newHabit = {
        id: data.id,
        name: data.name,
        type: data.type as 'checkbox' | 'dropdown' | 'range',
        options: data.options as string[],
        option_colors: data.option_colors as { [key: string]: string },
        min_value: data.min_value,
        max_value: data.max_value,
        color: data.color,
      };

      setHabits([newHabit, ...habits]);
      
      toast({
        title: "Habit created!",
        description: `${habitData.name} has been added to your habits.`,
      });
    } catch (error) {
      toast({
        title: "Error creating habit",
        description: "Could not create your habit. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateHabitEntry = async (habitId: string, date: string, value: any, completed: boolean, notes?: string) => {
    try {
      const { data, error } = await supabase
        .from('habit_entries')
        .upsert({
          habit_id: habitId,
          date: date,
          value: value,
          completed: completed,
          notes: notes || null,
          user_id: user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setHabitEntries(prev => {
        const existing = prev.find(entry => entry.habit_id === habitId && entry.date === date);
        if (existing) {
          return prev.map(entry => 
            entry.habit_id === habitId && entry.date === date 
              ? { ...entry, value, completed, notes }
              : entry
          );
        } else {
          return [...prev, {
            id: data.id,
            habit_id: habitId,
            date: date,
            value: value,
            completed: completed,
            notes: notes,
          }];
        }
      });

      toast({
        title: completed ? "Great job!" : "Entry updated",
        description: completed ? "You've completed this habit for today!" : "Your entry has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error saving entry",
        description: "Could not save your habit entry. Please try again.",
        variant: "destructive",
      });
    }
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
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">HabitFlow</h1>
                <p className="text-sm text-gray-500">Track your daily habits</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600 hidden sm:block">
              {user?.email}
            </span>
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
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <HabitList 
                habits={habits}
                selectedHabit={selectedHabit}
                onSelectHabit={setSelectedHabit}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {selectedHabit ? (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${selectedHabit.color}`}></div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {selectedHabit.name}
                        </h2>
                        <p className="text-gray-600">
                          Track your progress and build consistency
                        </p>
                      </div>
                    </div>
                  </div>

                  <HeatmapCalendar
                    habit={selectedHabit}
                    entries={habitEntries.filter(entry => entry.habit_id === selectedHabit.id)}
                    onUpdateEntry={updateHabitEntry}
                  />
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>

      <AddHabitModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addHabit}
      />
    </div>
  );
};

export default Dashboard;
