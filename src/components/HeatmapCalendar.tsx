
import { useState } from 'react';
import { Habit, HabitEntry } from './Dashboard';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { X, Calendar, Target, Zap } from "lucide-react";

interface HeatmapCalendarProps {
  habit: Habit;
  entries: HabitEntry[];
  onUpdateEntry: (habitId: string, date: string, value: any, completed: boolean) => void;
}

const HeatmapCalendar = ({ habit, entries, onUpdateEntry }: HeatmapCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Generate dates for the last 12 weeks (84 days)
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 83; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const dates = generateDates();
  
  // Group dates by week
  const weeks = [];
  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7));
  }

  const getEntryForDate = (date: string) => {
    return entries.find(entry => entry.date === date);
  };

  const getIntensityClass = (date: string) => {
    const entry = getEntryForDate(date);
    if (!entry || !entry.completed) {
      return 'bg-gray-100 hover:bg-gray-200 border border-gray-200';
    }

    // Different intensity based on habit type and value
    if (habit.type === 'checkbox') {
      return `${habit.color} opacity-90 hover:opacity-100 border border-transparent`;
    } else if (habit.type === 'range') {
      const value = entry.value as number;
      const max = habit.max_value || 10;
      const intensity = value / max;
      if (intensity > 0.75) return `${habit.color} opacity-90 hover:opacity-100 border border-transparent`;
      if (intensity > 0.5) return `${habit.color} opacity-70 hover:opacity-80 border border-transparent`;
      if (intensity > 0.25) return `${habit.color} opacity-50 hover:opacity-60 border border-transparent`;
      return `${habit.color} opacity-30 hover:opacity-40 border border-transparent`;
    } else if (habit.type === 'dropdown') {
      return `${habit.color} opacity-90 hover:opacity-100 border border-transparent`;
    }

    return 'bg-gray-100 border border-gray-200';
  };

  const handleCellClick = (date: string) => {
    setSelectedDate(date);
  };

  const handleValueUpdate = (value: any) => {
    if (!selectedDate) return;
    
    let completed = false;
    if (habit.type === 'checkbox') {
      completed = value;
    } else if (habit.type === 'range') {
      completed = value > 0;
    } else if (habit.type === 'dropdown') {
      completed = value !== '';
    }

    onUpdateEntry(habit.id, selectedDate, value, completed);
  };

  const selectedEntry = selectedDate ? getEntryForDate(selectedDate) : null;

  // Calculate stats
  const completedDays = entries.filter(e => e.completed).length;
  const completionRate = Math.round((completedDays / 84) * 100);
  
  // Calculate current streak
  const currentStreak = (() => {
    const sortedEntries = [...entries]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    let currentDate = today;
    
    for (let i = 0; i < 84; i++) {
      const entry = sortedEntries.find(e => e.date === currentDate);
      if (entry && entry.completed) {
        streak++;
      } else {
        break;
      }
      
      const date = new Date(currentDate);
      date.setDate(date.getDate() - 1);
      currentDate = date.toISOString().split('T')[0];
    }
    
    return streak;
  })();

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{completedDays}</div>
              <div className="text-sm text-gray-600">Days Completed</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{completionRate}%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{currentStreak}</div>
              <div className="text-sm text-gray-600">Current Streak</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Heatmap Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Activity Overview</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Less</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-gray-100 rounded border border-gray-200"></div>
              <div className={`w-3 h-3 ${habit.color} opacity-30 rounded`}></div>
              <div className={`w-3 h-3 ${habit.color} opacity-60 rounded`}></div>
              <div className={`w-3 h-3 ${habit.color} opacity-90 rounded`}></div>
            </div>
            <span>More</span>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <div className="grid grid-cols-12 gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="space-y-1">
                {week.map((date) => (
                  <div
                    key={date}
                    className={`w-3 h-3 rounded cursor-pointer transition-all duration-200 ${getIntensityClass(date)} ${
                      selectedDate === date ? 'ring-2 ring-indigo-400 ring-offset-1' : ''
                    }`}
                    onClick={() => handleCellClick(date)}
                    title={`${date} - ${getEntryForDate(date)?.completed ? 'Completed' : 'Not completed'}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Input for Selected Date */}
      {selectedDate && (
        <Card className="p-6 border border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-gray-900">
                Update for {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h4>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedDate(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {habit.type === 'checkbox' && (
                <div className="flex items-center space-x-3">
                  <Button
                    variant={selectedEntry?.completed ? "default" : "outline"}
                    onClick={() => handleValueUpdate(!selectedEntry?.completed)}
                    className={`transition-all duration-200 ${
                      selectedEntry?.completed 
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {selectedEntry?.completed ? '✓ Completed' : 'Mark Complete'}
                  </Button>
                </div>
              )}

              {habit.type === 'range' && (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{habit.min_value || 0}</span>
                    <span>{habit.max_value || 10}</span>
                  </div>
                  <Slider
                    value={[selectedEntry?.value as number || 0]}
                    onValueChange={(value) => handleValueUpdate(value[0])}
                    max={habit.max_value || 10}
                    min={habit.min_value || 0}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-center">
                    <span className="text-2xl font-bold text-gray-900">
                      {selectedEntry?.value || 0}
                    </span>
                  </div>
                </div>
              )}

              {habit.type === 'dropdown' && (
                <Select
                  value={selectedEntry?.value as string || ''}
                  onValueChange={handleValueUpdate}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {habit.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default HeatmapCalendar;
