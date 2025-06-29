
import { useState } from 'react';
import { Habit, HabitEntry } from './Dashboard';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";

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
      return 'bg-slate-100 hover:bg-slate-200';
    }

    // Different intensity based on habit type and value
    if (habit.type === 'checkbox') {
      return `${habit.color} opacity-80 hover:opacity-100`;
    } else if (habit.type === 'range') {
      const value = entry.value as number;
      const max = habit.max || 10;
      const intensity = value / max;
      if (intensity > 0.75) return `${habit.color} opacity-90 hover:opacity-100`;
      if (intensity > 0.5) return `${habit.color} opacity-70 hover:opacity-80`;
      if (intensity > 0.25) return `${habit.color} opacity-50 hover:opacity-60`;
      return `${habit.color} opacity-30 hover:opacity-40`;
    } else if (habit.type === 'dropdown') {
      return `${habit.color} opacity-80 hover:opacity-100`;
    }

    return 'bg-slate-100';
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

  return (
    <div className="space-y-6">
      {/* Heatmap Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">Activity Heatmap</h3>
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <span>Less</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-slate-100 rounded-sm"></div>
              <div className={`w-3 h-3 ${habit.color} opacity-30 rounded-sm`}></div>
              <div className={`w-3 h-3 ${habit.color} opacity-60 rounded-sm`}></div>
              <div className={`w-3 h-3 ${habit.color} opacity-90 rounded-sm`}></div>
            </div>
            <span>More</span>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-1 p-4 bg-white rounded-lg border border-slate-200">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="space-y-1">
              {week.map((date, dayIndex) => (
                <div
                  key={date}
                  className={`w-3 h-3 rounded-sm cursor-pointer transition-all duration-200 ${getIntensityClass(date)} ${
                    selectedDate === date ? 'ring-2 ring-blue-400 ring-offset-1' : ''
                  }`}
                  onClick={() => handleCellClick(date)}
                  title={`${date} - ${selectedEntry?.completed ? 'Completed' : 'Not completed'}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Input for Selected Date */}
      {selectedDate && (
        <Card className="p-4 border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-slate-800">
                Update for {new Date(selectedDate).toLocaleDateString()}
              </h4>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedDate(null)}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-3">
              {habit.type === 'checkbox' && (
                <div className="flex items-center space-x-3">
                  <Button
                    variant={selectedEntry?.completed ? "default" : "outline"}
                    onClick={() => handleValueUpdate(!selectedEntry?.completed)}
                    className="transition-all duration-200"
                  >
                    {selectedEntry?.completed ? '✓ Completed' : 'Mark Complete'}
                  </Button>
                </div>
              )}

              {habit.type === 'range' && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>{habit.min || 0}</span>
                    <span>{habit.max || 10}</span>
                  </div>
                  <Slider
                    value={[selectedEntry?.value as number || 0]}
                    onValueChange={(value) => handleValueUpdate(value[0])}
                    max={habit.max || 10}
                    min={habit.min || 0}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-center">
                    <span className="text-lg font-semibold text-slate-800">
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
                  <SelectTrigger>
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

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center border-slate-200">
          <div className="text-2xl font-bold text-blue-600">
            {entries.filter(e => e.completed).length}
          </div>
          <div className="text-sm text-slate-600">Days Completed</div>
        </Card>
        <Card className="p-4 text-center border-slate-200">
          <div className="text-2xl font-bold text-green-600">
            {Math.round((entries.filter(e => e.completed).length / 84) * 100)}%
          </div>
          <div className="text-sm text-slate-600">Completion Rate</div>
        </Card>
        <Card className="p-4 text-center border-slate-200">
          <div className="text-2xl font-bold text-purple-600">
            {Math.max(...entries.map(e => e.completed ? 1 : 0).reduce((acc: number[], curr, i) => {
              if (curr) acc.push((acc[acc.length - 1] || 0) + 1);
              else acc.push(0);
              return acc;
            }, []), 0)}
          </div>
          <div className="text-sm text-slate-600">Current Streak</div>
        </Card>
      </div>
    </div>
  );
};

export default HeatmapCalendar;
