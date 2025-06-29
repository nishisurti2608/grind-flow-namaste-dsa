
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, Settings } from "lucide-react";
import HeatmapCalendar from './HeatmapCalendar';
import HabitList from './HabitList';
import AddHabitModal from './AddHabitModal';

export interface Habit {
  id: string;
  name: string;
  type: 'checkbox' | 'dropdown' | 'range';
  options?: string[];
  min?: number;
  max?: number;
  color: string;
}

export interface HabitEntry {
  habitId: string;
  date: string;
  value: boolean | string | number;
  completed: boolean;
}

const Dashboard = ({ onBack }: { onBack: () => void }) => {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      name: 'Morning Exercise',
      type: 'checkbox',
      color: 'bg-blue-500'
    },
    {
      id: '2',
      name: 'Water Intake',
      type: 'range',
      min: 0,
      max: 10,
      color: 'bg-cyan-500'
    },
    {
      id: '3',
      name: 'Mood',
      type: 'dropdown',
      options: ['Great', 'Good', 'Okay', 'Poor'],
      color: 'bg-green-500'
    }
  ]);

  const [habitEntries, setHabitEntries] = useState<HabitEntry[]>([
    // Sample data for demo
    { habitId: '1', date: '2024-01-15', value: true, completed: true },
    { habitId: '1', date: '2024-01-16', value: true, completed: true },
    { habitId: '2', date: '2024-01-15', value: 8, completed: true },
    { habitId: '3', date: '2024-01-15', value: 'Great', completed: true },
  ]);

  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(habits[0]);
  const [showAddModal, setShowAddModal] = useState(false);

  const addHabit = (habit: Omit<Habit, 'id'>) => {
    const newHabit = {
      ...habit,
      id: Date.now().toString()
    };
    setHabits([...habits, newHabit]);
  };

  const updateHabitEntry = (habitId: string, date: string, value: any, completed: boolean) => {
    const existingEntryIndex = habitEntries.findIndex(
      entry => entry.habitId === habitId && entry.date === date
    );

    if (existingEntryIndex >= 0) {
      const updatedEntries = [...habitEntries];
      updatedEntries[existingEntryIndex] = { habitId, date, value, completed };
      setHabitEntries(updatedEntries);
    } else {
      setHabitEntries([...habitEntries, { habitId, date, value, completed }]);
    }
  };

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
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Habit
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
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

              {selectedHabit && (
                <HeatmapCalendar
                  habit={selectedHabit}
                  entries={habitEntries.filter(entry => entry.habitId === selectedHabit.id)}
                  onUpdateEntry={updateHabitEntry}
                />
              )}
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
