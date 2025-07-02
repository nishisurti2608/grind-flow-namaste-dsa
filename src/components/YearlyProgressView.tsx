
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Habit, HabitEntry } from './Dashboard';

interface YearlyProgressViewProps {
  habits: Habit[];
  habitEntries: HabitEntry[];
}

const YearlyProgressView = ({ habits, habitEntries }: YearlyProgressViewProps) => {
  const { user } = useAuth();
  const [signupDate, setSignupDate] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchSignupDate = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('created_at')
          .eq('id', user?.id)
          .single();

        if (error) {
          console.error('Error fetching signup date:', error);
          // Fallback to current date if no profile found
          setSignupDate(new Date());
        } else {
          setSignupDate(new Date(data.created_at));
        }
      } catch (error) {
        console.error('Error fetching signup date:', error);
        setSignupDate(new Date());
      }
    };

    if (user) {
      fetchSignupDate();
    }
  }, [user]);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getEntryForHabitAndDate = (habitId: string, date: string) => {
    return habitEntries.find(entry => entry.habit_id === habitId && entry.date === date);
  };

  if (!signupDate) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading your progress journey...</div>
      </div>
    );
  }

  const year = currentDate.getFullYear();
  const signupYear = signupDate.getFullYear();
  const signupMonth = signupDate.getMonth();
  const currentYear = new Date().getFullYear();
  
  // Don't allow navigation before signup year or after current year
  const canGoBack = year > signupYear;
  const canGoForward = year < currentYear;
  
  
  const habitStats = habits.map(habit => {
    const months = [];
    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(year, month, 1);
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      // If this is the signup year and month is before signup month, skip or show as inactive
      const isBeforeSignup = year === signupYear && month < signupMonth;
      
      let completedDays = 0;
      let validDays = daysInMonth;
      
      if (isBeforeSignup) {
        // For months before signup, set everything to 0
        completedDays = 0;
        validDays = 0;
      } else {
        // For valid months, count completed days
        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(year, month, day);
          
          // If this is signup month, only count days from signup date
          if (year === signupYear && month === signupMonth && day < signupDate.getDate()) {
            validDays--;
            continue;
          }
          
          const dateStr = formatDate(date);
          const entry = getEntryForHabitAndDate(habit.id, dateStr);
          if (entry?.completed) completedDays++;
        }
      }
      
      const completionRate = validDays > 0 ? (completedDays / validDays) * 100 : 0;
      
      months.push({
        name: monthDate.toLocaleDateString('en-US', { month: 'short' }),
        completionRate,
        completedDays,
        totalDays: validDays,
        isBeforeSignup,
        isSignupMonth: year === signupYear && month === signupMonth,
      });
    }
    
    return { habit, months };
  });

  return (
    <div className="space-y-6">
      {/* Header with signup info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Your Progress Journey</h3>
              <p className="text-sm text-gray-600">
                Started on {signupDate.toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {Math.floor((new Date().getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24))} days strong
          </Badge>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          disabled={!canGoBack}
          onClick={() => {
            if (canGoBack) {
              const newDate = new Date(currentDate);
              newDate.setFullYear(currentDate.getFullYear() - 1);
              setCurrentDate(newDate);
            }
          }}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold">{year}</h3>
          {year === signupYear && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Joined Year
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          disabled={!canGoForward}
          onClick={() => {
            if (canGoForward) {
              const newDate = new Date(currentDate);
              newDate.setFullYear(currentDate.getFullYear() + 1);
              setCurrentDate(newDate);
            }
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
              <div 
                key={index} 
                className={`text-center relative ${
                  month.isBeforeSignup 
                    ? 'opacity-30' 
                    : month.isSignupMonth 
                    ? 'ring-2 ring-green-300 rounded-lg p-2 bg-green-50' 
                    : ''
                }`}
              >
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <h5 className="font-medium">{month.name}</h5>
                  {month.isSignupMonth && (
                    <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                      Joined
                    </Badge>
                  )}
                </div>
                {!month.isBeforeSignup ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-gray-400 mb-1">-</div>
                    <div className="text-sm text-gray-400">Not joined</div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-100 rounded-full h-2"></div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default YearlyProgressView;
