
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Habit, HabitEntry } from './Dashboard';

interface MonthlyProgressViewProps {
  habits: Habit[];
  habitEntries: HabitEntry[];
  onUpdateEntry: (habitId: string, date: string, completed: boolean, notes?: string) => void;
}

const MonthlyProgressView = ({ habits, habitEntries, onUpdateEntry }: MonthlyProgressViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isFutureDate = (date: string) => {
    const today = new Date().toISOString().split('T')[0];
    return date > today;
  };

  const getEntryForHabitAndDate = (habitId: string, date: string) => {
    return habitEntries.find(entry => entry.habit_id === habitId && entry.date === date);
  };

  const toggleHabit = (habitId: string, date: string) => {
    // Prevent interaction with future dates
    if (isFutureDate(date)) {
      return;
    }

    const entry = getEntryForHabitAndDate(habitId, date);
    const newCompleted = !entry?.completed;
    onUpdateEntry(habitId, date, newCompleted);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const monthDates = [];
  
  // Add empty cells for days before the first day
  for (let i = 0; i < startingDayOfWeek; i++) {
    monthDates.push(null);
  }
  
  // Add all days in the month
  for (let day = 1; day <= daysInMonth; day++) {
    monthDates.push(new Date(year, month, day));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const newDate = new Date(currentDate);
            newDate.setMonth(currentDate.getMonth() - 1);
            setCurrentDate(newDate);
          }}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h3 className="text-lg font-semibold">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const newDate = new Date(currentDate);
            newDate.setMonth(currentDate.getMonth() + 1);
            setCurrentDate(newDate);
          }}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {habits.map(habit => (
        <Card key={habit.id} className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-4 h-4 rounded-full ${habit.color}`}></div>
            <h4 className="font-semibold text-gray-900">{habit.name}</h4>
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 p-1">
                {day}
              </div>
            ))}
            {monthDates.map((date, index) => {
              if (!date) {
                return <div key={index} className="p-1 h-8"></div>;
              }
              
              const dateStr = formatDate(date);
              const entry = getEntryForHabitAndDate(habit.id, dateStr);
              const isCompleted = entry?.completed || false;
              const isFuture = isFutureDate(dateStr);
              
              return (
                <div
                  key={dateStr}
                  className={`p-1 h-8 rounded text-xs flex items-center justify-center transition-all ${
                    isFuture 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                      : `cursor-pointer hover:shadow-sm ${
                          isCompleted ? `${habit.color} text-white` : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                        }`
                  }`}
                  onClick={() => !isFuture && toggleHabit(habit.id, dateStr)}
                >
                  {date.getDate()}
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MonthlyProgressView;
