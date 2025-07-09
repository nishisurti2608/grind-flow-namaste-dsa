import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import HeatmapCalendar from './HeatmapCalendar';
import HabitList from './HabitList';
import AddHabitModal from './AddHabitModal';
import EditHabitModal from './EditHabitModal';
import OverallProgressView from './OverallProgressView';
import DashboardStats from './DashboardStats';
import DailyHistory from './DailyHistory';
import TaskCommitTimeline from './TaskCommitTimeline';
import DashboardHeader from './DashboardHeader';
import DashboardFooter from './DashboardFooter';
import DayCompletionCelebration from './DayCompletionCelebration';
import { useHabits } from '@/hooks/useHabits';
import { useSubtasks } from '@/hooks/useSubtasks';
import { useHabitEntries } from '@/hooks/useHabitEntries';
import { useDailyArchive } from '@/hooks/useDailyArchive';
import { useUserProfile } from '@/hooks/useUserProfile';

// Export types for other components to use
export type { Habit } from '@/hooks/useHabits';
export type { HabitEntry } from '@/hooks/useHabitEntries';
export type { Subtask } from '@/hooks/useSubtasks';

const Dashboard = () => {
  const { habits, loading, addHabit, updateHabit, deleteHabit } = useHabits();
  const { subtasks, addSubtask, updateSubtask, deleteSubtask } = useSubtasks();
  const { habitEntries, updateHabitEntry } = useHabitEntries(habits);
  const { userProfile } = useUserProfile();
  
  // Initialize daily archive functionality
  useDailyArchive(habits);

  const [selectedHabit, setSelectedHabit] = useState<typeof habits[0] | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<typeof habits[0] | null>(null);
  const [viewMode, setViewMode] = useState<'individual' | 'overall' | 'history' | 'commits'>('individual');
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);

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

  // Calculate current streak
  useEffect(() => {
    const calculateStreak = async () => {
      if (habitEntries.length === 0) return;
      
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      // Group entries by date
      const dailyCompletions = habitEntries.reduce((acc, entry) => {
        if (!acc[entry.date]) acc[entry.date] = { total: 0, completed: 0 };
        acc[entry.date].total++;
        if (entry.completed) acc[entry.date].completed++;
        return acc;
      }, {} as Record<string, { total: number; completed: number }>);

      let streak = 0;
      let checkDate = dailyCompletions[today] ? today : yesterday;
      
      while (checkDate && dailyCompletions[checkDate]) {
        const dayData = dailyCompletions[checkDate];
        if (dayData.completed === dayData.total && dayData.total > 0) {
          streak++;
          const prevDate = new Date(checkDate);
          prevDate.setDate(prevDate.getDate() - 1);
          checkDate = prevDate.toISOString().split('T')[0];
        } else {
          break;
        }
      }
      
      setCurrentStreak(streak);
    };
    
    calculateStreak();
  }, [habitEntries]);

  const handleDayCompleted = () => {
    setShowCelebration(true);
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
      <DashboardHeader 
        userProfile={userProfile}
        onAddHabit={() => setShowAddModal(true)}
      />

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
              <TrendingUp className="w-4 h-4 mr-2" />
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
                        onUpdateEntry={(habitId, date, completed, notes) => 
                          updateHabitEntry(habitId, date, completed, notes, handleDayCompleted)
                        }
                      />
                    </div>
                  ) : viewMode === 'overall' ? (
                    <OverallProgressView
                      habits={habits}
                      habitEntries={habitEntries}
                      onUpdateEntry={(habitId, date, completed, notes) => 
                        updateHabitEntry(habitId, date, completed, notes, handleDayCompleted)
                      }
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

      <DashboardFooter />

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

      <DayCompletionCelebration
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        currentStreak={currentStreak}
      />
    </div>
  );
};

export default Dashboard;