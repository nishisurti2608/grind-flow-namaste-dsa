
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Habit, HabitEntry } from './Dashboard';

interface YearlyProgressViewProps {
  habits: Habit[];
  habitEntries: HabitEntry[];
}

const YearlyProgressView = ({ habits, habitEntries }: YearlyProgressViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getEntryForHabitAndDate = (habitId: string, date: string) => {
    return habitEntries.find(entry => entry.habit_id === habitId && entry.date === date);
  };

  const year = currentDate.getFullYear();
  
  const habitStats = habits.map(habit => {
    const months = [];
    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(year, month, 1);
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      let completedDays = 0;
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateStr = formatDate(date);
        const entry = getEntryForHabitAndDate(habit.id, dateStr);
        if (entry?.completed) completedDays++;
      }
      
      const completionRate = (completedDays / daysInMonth) * 100;
      
      months.push({
        name: monthDate.toLocaleDateString('en-US', { month: 'short' }),
        completionRate,
        completedDays,
        totalDays: daysInMonth,
      });
    }
    
    return { habit, months };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const newDate = new Date(currentDate);
            newDate.setFullYear(currentDate.getFullYear() - 1);
            setCurrentDate(newDate);
          }}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h3 className="text-lg font-semibold">{year}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const newDate = new Date(currentDate);
            newDate.setFullYear(currentDate.getFullYear() + 1);
            setCurrentDate(newDate);
          }}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      
      {habitStats.map(({ habit, months }) => (
        <Card key={habit.id} className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-4 h-4 rounded-full ${habit.color}`}></div>
            <h4 className="font-semibold text-gray-900">{habit.name}</h4>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {months.map((month, index) => (
              <div key={index} className="text-center">
                <h5 className="font-medium mb-2">{month.name}</h5>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {Math.round(month.completionRate)}%
                </div>
                <div className="text-sm text-gray-600">
                  {month.completedDays}/{month.totalDays}
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${habit.color}`}
                      style={{ width: `${month.completionRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default YearlyProgressView;
