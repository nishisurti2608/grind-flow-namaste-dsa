
import { useState } from 'react';
import { Habit, HabitEntry } from './Dashboard';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { X, Calendar, Target, Zap } from "lucide-react";

interface YearlyHeatmapCalendarProps {
  habit: Habit;
  entries: HabitEntry[];
  onUpdateEntry: (habitId: string, date: string, value: any, completed: boolean, notes?: string) => void;
}

const YearlyHeatmapCalendar = ({ habit, entries, onUpdateEntry }: YearlyHeatmapCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedNotes, setSelectedNotes] = useState('');

  // Generate all dates for the current year
  const generateYearDates = () => {
    const year = new Date().getFullYear();
    const dates = [];
    
    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        dates.push({
          date: date.toISOString().split('T')[0],
          month: month,
          dayOfWeek: date.getDay(), // 0 = Sunday, 1 = Monday, etc.
          day: day
        });
      }
    }
    
    return dates;
  };

  const yearDates = generateYearDates();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEntryForDate = (date: string) => {
    return entries.find(entry => entry.date === date);
  };

  const getIntensityClass = (date: string) => {
    const entry = getEntryForDate(date);
    if (!entry || !entry.completed) {
      return 'bg-gray-100 hover:bg-gray-200 border border-gray-200';
    }

    if (habit.type === 'checkbox') {
      return `${habit.color} opacity-90 hover:opacity-100 border border-transparent`;
    } else if (habit.type === 'range') {
      const value = entry.value as number;
      const max = habit.max_value || 10;
      const min = habit.min_value || 0;
      const range = max - min;
      const normalizedValue = (value - min) / range;
      
      // Higher values should be darker
      if (normalizedValue >= 0.8) return `${habit.color} opacity-100 border border-transparent`;
      if (normalizedValue >= 0.6) return `${habit.color} opacity-80 border border-transparent`;
      if (normalizedValue >= 0.4) return `${habit.color} opacity-60 border border-transparent`;
      if (normalizedValue >= 0.2) return `${habit.color} opacity-40 border border-transparent`;
      return `${habit.color} opacity-20 border border-transparent`;
    } else if (habit.type === 'dropdown') {
      const selectedOption = entry.value as string;
      const optionColor = habit.option_colors?.[selectedOption] || habit.color;
      return `${optionColor} opacity-90 hover:opacity-100 border border-transparent`;
    }

    return 'bg-gray-100 border border-gray-200';
  };

  const handleCellClick = (date: string) => {
    setSelectedDate(date);
    const entry = getEntryForDate(date);
    setSelectedNotes(entry?.notes || '');
  };

  const handleValueUpdate = (value: any, notes?: string) => {
    if (!selectedDate) return;
    
    let completed = false;
    if (habit.type === 'checkbox') {
      completed = value;
    } else if (habit.type === 'range') {
      completed = value > (habit.min_value || 0);
    } else if (habit.type === 'dropdown') {
      completed = value !== '';
    }

    onUpdateEntry(habit.id, selectedDate, value, completed, notes || selectedNotes);
  };

  const selectedEntry = selectedDate ? getEntryForDate(selectedDate) : null;

  // Calculate stats
  const completedDays = entries.filter(e => e.completed).length;
  const totalDaysInYear = 365;
  const completionRate = Math.round((completedDays / totalDaysInYear) * 100);
  
  // Calculate current streak
  const currentStreak = (() => {
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const entry = entries.find(e => e.date === dateStr);
      if (entry && entry.completed) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  })();

  // Create a 2D grid: [dayOfWeek][weeks in year]
  const createYearGrid = () => {
    const grid: Array<Array<{date: string, day: number} | null>> = Array(7).fill(null).map(() => []);
    
    // Group dates by month and arrange in weekly grid
    for (let month = 0; month < 12; month++) {
      const monthDates = yearDates.filter(d => d.month === month);
      const firstDay = monthDates[0];
      const startWeek = grid[0].length;
      
      // Add empty cells for alignment
      if (month === 0) {
        for (let day = 0; day < firstDay.dayOfWeek; day++) {
          grid[day].push(null);
        }
      }
      
      // Add month dates
      monthDates.forEach(dateObj => {
        const weekOffset = Math.floor((dateObj.day - 1 + firstDay.dayOfWeek) / 7);
        const targetWeek = startWeek + weekOffset;
        
        // Ensure grid is large enough
        while (grid[dateObj.dayOfWeek].length <= targetWeek) {
          for (let day = 0; day < 7; day++) {
            if (grid[day].length <= targetWeek) {
              grid[day].push(null);
            }
          }
        }
        
        grid[dateObj.dayOfWeek][targetWeek] = {
          date: dateObj.date,
          day: dateObj.day
        };
      });
    }
    
    return grid;
  };

  const yearGrid = createYearGrid();
  const maxWeeks = Math.max(...yearGrid.map(row => row.length));

  return (
    <div className="space-y-8 font-sans">
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

      {/* Yearly Heatmap */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Yearly Overview</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Less</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-gray-100 rounded border border-gray-200"></div>
              <div className={`w-3 h-3 ${habit.color} opacity-20 rounded`}></div>
              <div className={`w-3 h-3 ${habit.color} opacity-60 rounded`}></div>
              <div className={`w-3 h-3 ${habit.color} opacity-100 rounded`}></div>
            </div>
            <span>More</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 overflow-x-auto">
          {/* Month headers */}
          <div className="flex mb-2">
            <div className="w-8"></div> {/* Space for day labels */}
            <div className="flex-1 grid gap-1" style={{gridTemplateColumns: `repeat(${maxWeeks}, 1fr)`}}>
              {Array.from({ length: maxWeeks }, (_, weekIndex) => {
                // Find which month this week belongs to
                const monthForWeek = Math.floor(weekIndex / 4.33); // Approximate weeks per month
                return (
                  <div key={weekIndex} className="text-xs text-gray-500 text-center">
                    {weekIndex % 4 === 0 ? monthNames[Math.min(monthForWeek, 11)] : ''}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Calendar grid */}
          {yearGrid.map((week, dayIndex) => (
            <div key={dayIndex} className="flex items-center mb-1">
              <div className="w-8 text-xs text-gray-500 pr-2">{dayNames[dayIndex]}</div>
              <div className="flex-1 grid gap-1" style={{gridTemplateColumns: `repeat(${maxWeeks}, 1fr)`}}>
                {week.map((cell, weekIndex) => (
                  <div
                    key={weekIndex}
                    className={`w-3 h-3 rounded cursor-pointer transition-all duration-200 ${
                      cell ? getIntensityClass(cell.date) : 'bg-transparent'
                    } ${
                      selectedDate === cell?.date ? 'ring-2 ring-indigo-400 ring-offset-1' : ''
                    }`}
                    onClick={() => cell && handleCellClick(cell.date)}
                    title={cell ? `${cell.date} - ${getEntryForDate(cell.date)?.completed ? 'Completed' : 'Not completed'}` : ''}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Input for Selected Date */}
      {selectedDate && (
        <Card className="p-6 border border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-gray-900">
                Update for {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { 
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
                    value={[selectedEntry?.value as number || habit.min_value || 0]}
                    onValueChange={(value) => handleValueUpdate(value[0])}
                    max={habit.max_value || 10}
                    min={habit.min_value || 0}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-center">
                    <span className="text-2xl font-bold text-gray-900">
                      {selectedEntry?.value || habit.min_value || 0}
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
                  <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                    <SelectItem value="">None</SelectItem>
                    {habit.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded ${habit.option_colors?.[option] || habit.color}`}></div>
                          <span>{option}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Notes section */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Notes (optional)</label>
                <Textarea
                  value={selectedNotes}
                  onChange={(e) => setSelectedNotes(e.target.value)}
                  placeholder="Add a note for this day..."
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  rows={3}
                />
                <Button
                  onClick={() => handleValueUpdate(selectedEntry?.value, selectedNotes)}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  Save Notes
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default YearlyHeatmapCalendar;
