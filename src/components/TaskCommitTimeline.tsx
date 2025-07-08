import { useState, useEffect } from 'react';
import { format, parseISO, isToday, isYesterday } from 'date-fns';
import { GitCommit, Check, Calendar, Clock, User, Hash } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Habit, HabitEntry } from './Dashboard';

interface TaskCommitTimelineProps {
  habits: Habit[];
  habitEntries: HabitEntry[];
}

interface CommitEntry {
  date: string;
  completedHabits: Array<{
    habit: Habit;
    entry: HabitEntry;
  }>;
  totalHabits: number;
  completionRate: number;
}

const TaskCommitTimeline = ({ habits, habitEntries }: TaskCommitTimelineProps) => {
  const [commits, setCommits] = useState<CommitEntry[]>([]);

  useEffect(() => {
    generateCommitTimeline();
  }, [habits, habitEntries]);

  const generateCommitTimeline = () => {
    // Group entries by date
    const entriesByDate = habitEntries.reduce((acc, entry) => {
      if (!acc[entry.date]) {
        acc[entry.date] = [];
      }
      acc[entry.date].push(entry);
      return acc;
    }, {} as Record<string, HabitEntry[]>);

    // Create commit entries for dates with completed habits
    const commitData: CommitEntry[] = [];
    
    Object.entries(entriesByDate).forEach(([date, entries]) => {
      const completedEntries = entries.filter(entry => entry.completed);
      
      if (completedEntries.length > 0) {
        const completedHabits = completedEntries.map(entry => {
          const habit = habits.find(h => h.id === entry.habit_id);
          return habit ? { habit, entry } : null;
        }).filter(Boolean) as Array<{ habit: Habit; entry: HabitEntry }>;

        const totalHabitsAtTime = habits.length; // Simplified - could be improved to show actual habits count at that date
        const completionRate = totalHabitsAtTime > 0 ? (completedHabits.length / totalHabitsAtTime) * 100 : 0;

        commitData.push({
          date,
          completedHabits,
          totalHabits: totalHabitsAtTime,
          completionRate
        });
      }
    });

    // Sort by date (newest first)
    commitData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setCommits(commitData.slice(0, 50)); // Show last 50 commits
  };

  const formatCommitDate = (dateString: string) => {
    const date = parseISO(dateString);
    
    if (isToday(date)) {
      return 'Today';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };

  const getCommitHash = (date: string) => {
    // Generate a pseudo-hash based on the date
    const hash = date.replace(/-/g, '').slice(2, 8);
    return hash.padStart(6, '0');
  };

  const getCommitMessage = (commit: CommitEntry) => {
    const { completedHabits, completionRate } = commit;
    
    if (completionRate === 100) {
      return `feat: Perfect day! Completed all ${completedHabits.length} habits ✨`;
    } else if (completionRate >= 80) {
      return `feat: Strong progress with ${completedHabits.length} habits completed 💪`;
    } else if (completionRate >= 50) {
      return `fix: Steady progress with ${completedHabits.length} habits done 📈`;
    } else {
      return `chore: Small steps with ${completedHabits.length} habits ⚡`;
    }
  };

  if (commits.length === 0) {
    return (
      <div className="text-center py-16">
        <GitCommit className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No commits yet</h3>
        <p className="text-gray-600">
          Complete your first habit to see your progress commits here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <GitCommit className="w-6 h-6 text-indigo-600" />
        <div>
          <h2 className="text-xl font-bold text-gray-900">Task Commits</h2>
          <p className="text-gray-600">Your daily progress commits</p>
        </div>
      </div>

      <div className="space-y-4">
        {commits.map((commit, index) => (
          <Card key={commit.date} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              {/* Commit Avatar */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
              </div>

              {/* Commit Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      {getCommitMessage(commit)}
                    </h3>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        commit.completionRate === 100 
                          ? 'border-green-200 text-green-700 bg-green-50' 
                          : commit.completionRate >= 80
                          ? 'border-blue-200 text-blue-700 bg-blue-50'
                          : 'border-gray-200 text-gray-700 bg-gray-50'
                      }`}
                    >
                      {Math.round(commit.completionRate)}%
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Hash className="w-3 h-3" />
                    <code className="font-mono">{getCommitHash(commit.date)}</code>
                  </div>
                </div>

                {/* Commit Details */}
                <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatCommitDate(commit.date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Check className="w-3 h-3" />
                    <span>{commit.completedHabits.length} habits completed</span>
                  </div>
                </div>

                {/* Completed Habits */}
                <div className="space-y-2">
                  {commit.completedHabits.map(({ habit, entry }) => (
                    <div key={entry.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-md">
                      <div className={`w-2 h-2 rounded-full ${habit.color}`}></div>
                      <span className="text-sm text-gray-700 flex-1">{habit.name}</span>
                      {entry.notes && (
                        <span className="text-xs text-gray-500 italic">"{entry.notes}"</span>
                      )}
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {commits.length >= 50 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            Showing your most recent 50 commits
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskCommitTimeline;