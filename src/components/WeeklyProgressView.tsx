
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { CheckCircle, Circle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Habit, HabitEntry } from './Dashboard';

interface WeeklyProgressViewProps {
  habits: Habit[];
  habitEntries: HabitEntry[];
  onUpdateEntry: (habitId: string, date: string, completed: boolean, notes?: string) => void;
}

const WeeklyProgressView = ({ habits, habitEntries, onUpdateEntry }: WeeklyProgressViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getEntryForHabitAndDate = (habitId: string, date: string) => {
    return habitEntries.find(entry => entry.habit_id === habitId && entry.date === date);
  };

  const toggleHabit = (habitId: string, date: string) => {
    const entry = getEntryForHabitAndDate(habitId, date);
    const newCompleted = !entry?.completed;
    onUpdateEntry(habitId, date, newCompleted);
  };

  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const newDate = new Date(currentDate);
            newDate.setDate(currentDate.getDate() - 7);
            setCurrentDate(newDate);
          }}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h3 className="text-lg font-semibold">
          Week of {startOfWeek.toLocaleDateString()}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const newDate = new Date(currentDate);
            newDate.setDate(currentDate.getDate() + 7);
            setCurrentDate(newDate);
          }}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        {/* Date headers */}
        <div className="grid grid-cols-8 gap-2">
          <div className="text-sm font-medium text-gray-500 p-2">Habit</div>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
              {day}
            </div>
          ))}
        </div>

        {/* Habit rows */}
        {habits.map(habit => (
          <div key={habit.id} className="grid grid-cols-8 gap-2 items-center">
            <div className="flex items-center space-x-2 p-2">
              <div className={`w-3 h-3 rounded-full ${habit.color}`}></div>
              <span className="text-sm font-medium text-gray-900 truncate">
                {habit.name}
              </span>
            </div>
            {weekDates.map(date => {
              const dateStr = formatDate(date);
              const entry = getEntryForHabitAndDate(habit.id, dateStr);
              const isCompleted = entry?.completed || false;
              
              return (
                <Card
                  key={`${habit.id}-${dateStr}`}
                  className={`p-2 cursor-pointer transition-all hover:shadow-md ${
                    isCompleted ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => toggleHabit(habit.id, dateStr)}
                >
                  <div className="text-center">
                    <div className="text-xs mb-1">{date.getDate()}</div>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-400 mx-auto" />
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyProgressView;
