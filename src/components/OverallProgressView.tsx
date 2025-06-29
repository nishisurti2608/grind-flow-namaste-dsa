import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Circle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Habit, HabitEntry } from './Dashboard';
import OverallProgressChart from './OverallProgressChart';

interface OverallProgressViewProps {
  habits: Habit[];
  habitEntries: HabitEntry[];
  onUpdateEntry: (habitId: string, date: string, completed: boolean, notes?: string) => void;
}

const OverallProgressView = ({ habits, habitEntries, onUpdateEntry }: OverallProgressViewProps) => {
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

  // Weekly Overview
  const renderWeeklyOverview = () => {
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

  // Monthly Overview
  const renderMonthlyOverview = () => {
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
                
                return (
                  <div
                    key={dateStr}
                    className={`p-1 h-8 cursor-pointer rounded text-xs flex items-center justify-center transition-all hover:shadow-sm ${
                      isCompleted ? `${habit.color} text-white` : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                    onClick={() => toggleHabit(habit.id, dateStr)}
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

  // Yearly Stats
  const renderYearlyStats = () => {
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

  return (
    <div className="space-y-6">
      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chart">Progress Chart</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chart" className="mt-6">
          <OverallProgressChart habits={habits} habitEntries={habitEntries} />
        </TabsContent>
        
        <TabsContent value="weekly" className="mt-6">
          {renderWeeklyOverview()}
        </TabsContent>
        
        <TabsContent value="monthly" className="mt-6">
          {renderMonthlyOverview()}
        </TabsContent>
        
        <TabsContent value="yearly" className="mt-6">
          {renderYearlyStats()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OverallProgressView;
