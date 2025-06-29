
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, Calendar, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import HeatmapCalendar from './HeatmapCalendar';
import HabitList from './HabitList';
import AddHabitModal from './AddHabitModal';
import EditHabitModal from './EditHabitModal';

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

const Dashboard = ({ onBack }: { onBack: () => void }) => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitEntries, setHabitEntries] = useState<HabitEntry[]>([]);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchHabits();
      fetchHabitEntries();
      fetchSubtasks();
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

  const addHabit = async (habitData: Omit<Habit, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('habits')
        .insert([{
          name: habitData.name,
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
      toast({
        title: "Error creating habit",
        description: "Could not create your habit. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateHabit = async (habitId: string, updates: Partial<Habit>) => {
    try {
      const { error } = await supabase
        .from('habits')
        .update(updates)
        .eq('id', habitId);

      if (error) throw error;

      setHabits(habits.map(habit => 
        habit.id === habitId ? { ...habit, ...updates } : habit
      ));

      if (selectedHabit?.id === habitId) {
        setSelectedHabit({ ...selectedHabit, ...updates });
      }

      toast({
        title: "Habit updated!",
        description: "Your habit has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error updating habit",
        description: "Could not update your habit. Please try again.",
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

      setHabits(habits.filter(habit => habit.id !== habitId));
      
      if (selectedHabit?.id === habitId) {
        setSelectedHabit(habits.find(h => h.id !== habitId) || null);
      }

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
    try {
      const { data, error } = await supabase
        .from('subtasks')
        .insert([{
          habit_id: habitId,
          name: subtaskName,
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
      toast({
        title: "Error adding subtask",
        description: "Could not add subtask. Please try again.",
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

  const updateHabitEntry = async (habitId: string, date: string, completed: boolean, notes?: string) => {
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

      toast({
        title: completed ? "Great job!" : "Entry updated",
        description: completed ? "You've completed this habit!" : "Your entry has been saved.",
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
                <h1 className="text-xl font-bold text-gray-900">Grind Flow</h1>
                <p className="text-sm text-gray-500">Level up your dev skills daily</p>
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
