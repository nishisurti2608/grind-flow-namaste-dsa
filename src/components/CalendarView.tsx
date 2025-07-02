import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Circle, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Habit, HabitEntry } from './Dashboard';

interface CalendarViewProps {
  habit: Habit;
  entries: HabitEntry[];
  onUpdateEntry: (habitId: string, date: string, completed: boolean, notes?: string) => void;
}

const CalendarView = ({ habit, entries, onUpdateEntry }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const getEntryForDate = (date: string) => {
    return entries.find(entry => entry.date === date);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isFutureDate = (date: string) => {
    const today = new Date().toISOString().split('T')[0];
    return date > today;
  };

  const isPastDate = (date: string) => {
    const today = new Date().toISOString().split('T')[0];
    return date < today;
  };

  const toggleHabit = (date: string) => {
    // Prevent interaction with future dates and past dates (past dates are view-only)
    if (isFutureDate(date) || isPastDate(date)) {
      return;
    }

    const entry = getEntryForDate(date);
    const newCompleted = !entry?.completed;
    onUpdateEntry(habit.id, date, newCompleted);
  };

  // Weekly View
  const renderWeeklyView = () => {
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
        
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
              {day}
            </div>
          ))}
          {weekDates.map(date => {
            const dateStr = formatDate(date);
            const entry = getEntryForDate(dateStr);
            const isCompleted = entry?.completed || false;
            const isFuture = isFutureDate(dateStr);
            const isPast = isPastDate(dateStr);
            const isToday = !isFuture && !isPast;
            
            return (
              <Card
                key={dateStr}
                className={`p-4 transition-all ${
                  isFuture 
                    ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                    : isPast
                    ? `${isCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50'} cursor-default`
                    : `cursor-pointer hover:shadow-md ${
                        isCompleted ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'
                      }`
                }`}
                onClick={() => isToday && toggleHabit(dateStr)}
              >
                <div className="text-center">
                  <div className="text-sm font-medium mb-2">{date.getDate()}</div>
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-green-600 mx-auto" />
                  ) : (
                    <Circle className={`w-6 h-6 mx-auto ${isFuture ? 'text-gray-300' : 'text-gray-400'}`} />
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  // Monthly View
  const renderMonthlyView = () => {
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
      <div className="space-y-4">
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
        
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
              {day}
            </div>
          ))}
          {monthDates.map((date, index) => {
            if (!date) {
              return <div key={index} className="p-4"></div>;
            }
            
            const dateStr = formatDate(date);
            const entry = getEntryForDate(dateStr);
            const isCompleted = entry?.completed || false;
            const isFuture = isFutureDate(dateStr);
            const isPast = isPastDate(dateStr);
            const isToday = !isFuture && !isPast;
            
            return (
              <Card
                key={dateStr}
                className={`p-2 transition-all ${
                  isFuture 
                    ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                    : isPast
                    ? `${isCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50'} cursor-default`
                    : `cursor-pointer hover:shadow-md ${
                        isCompleted ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'
                      }`
                }`}
                onClick={() => isToday && toggleHabit(dateStr)}
              >
                <div className="text-center">
                  <div className="text-sm font-medium mb-1">{date.getDate()}</div>
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                  ) : (
                    <Circle className={`w-4 h-4 mx-auto ${isFuture ? 'text-gray-300' : 'text-gray-400'}`} />
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  // Yearly View (simplified heatmap)
  const renderYearlyView = () => {
    const year = currentDate.getFullYear();
    const months = [];
    
    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(year, month, 1);
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      let completedDays = 0;
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateStr = formatDate(date);
        const entry = getEntryForDate(dateStr);
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

    return (
      <div className="space-y-4">
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
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {months.map((month, index) => (
            <Card key={index} className="p-4">
              <div className="text-center">
                <h4 className="font-medium mb-2">{month.name}</h4>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {Math.round(month.completionRate)}%
                </div>
                <div className="text-sm text-gray-600">
                  {month.completedDays}/{month.totalDays} days
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
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
        
        <TabsContent value="weekly" className="mt-6">
          {renderWeeklyView()}
        </TabsContent>
        
        <TabsContent value="monthly" className="mt-6">
          {renderMonthlyView()}
        </TabsContent>
        
        <TabsContent value="yearly" className="mt-6">
          {renderYearlyView()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CalendarView;
