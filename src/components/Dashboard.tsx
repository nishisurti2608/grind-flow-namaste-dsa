
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, Settings } from "lucide-react";
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

  const updateHabitEntry = async (habitId: string, date: string, value: any, completed: boolean) => {
    try {
      const { data, error } = await supabase
        .from('habit_entries')
        .upsert({
          habit_id: habitId,
          date: date,
          value: value,
          completed: completed,
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
              ? { ...entry, value, completed }
              : entry
          );
        } else {
          return [...prev, {
            id: data.id,
            habit_id: habitId,
            date: date,
            value: value,
            completed: completed,
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-lg text-slate-600">Loading your habits...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg"></div>
              <h1 className="text-xl font-bold text-slate-800">HabitFlow Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">Welcome, {user?.email}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Habit
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
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
            <Card className="p-6 border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    {selectedHabit?.name || 'Select a habit'}
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Track your progress and build consistency
                  </p>
                </div>
              </div>

              {selectedHabit ? (
                <HeatmapCalendar
                  habit={selectedHabit}
                  entries={habitEntries.filter(entry => entry.habit_id === selectedHabit.id)}
                  onUpdateEntry={updateHabitEntry}
                />
              ) : habits.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-slate-400 mb-4 text-4xl">📝</div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">No habits yet</h3>
                  <p className="text-slate-600 mb-4">Create your first habit to start tracking your progress!</p>
                  <Button onClick={() => setShowAddModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Habit
                  </Button>
                </div>
              ) : null}
            </Card>
          </div>
        </div>
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
