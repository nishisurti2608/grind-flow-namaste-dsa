
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Target, CheckCircle, Trophy, Star, Crown } from "lucide-react";
import { Habit, HabitEntry } from './Dashboard';

interface DashboardStatsProps {
  habits: Habit[];
  habitEntries: HabitEntry[];
}

const DashboardStats = ({ habits, habitEntries }: DashboardStatsProps) => {
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate daily streak
  const calculateDailyStreak = () => {
    const sortedDates = [...new Set(habitEntries.map(entry => entry.date))]
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    let streak = 0;
    let currentDate = new Date();
    
    for (const dateStr of sortedDates) {
      const date = new Date(dateStr);
      const diffDays = Math.floor((currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        const dayEntries = habitEntries.filter(entry => entry.date === dateStr && entry.completed);
        if (dayEntries.length > 0) {
          streak++;
        } else {
          break;
        }
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Calculate completed tasks today
  const todayCompletedTasks = habitEntries.filter(entry => 
    entry.date === today && entry.completed
  ).length;

  // Calculate total days with activity (for X/90 progress)
  const totalActiveDays = [...new Set(habitEntries.filter(entry => entry.completed).map(entry => entry.date))].length;

  const dailyStreak = calculateDailyStreak();

  // Badge logic for monthly streaks
  const getBadgeForStreak = (streak: number) => {
    if (streak >= 90) return { icon: Crown, label: "Legend", color: "bg-gradient-to-r from-yellow-400 to-orange-500" };
    if (streak >= 60) return { icon: Trophy, label: "Champion", color: "bg-gradient-to-r from-purple-500 to-pink-500" };
    if (streak >= 30) return { icon: Star, label: "Achiever", color: "bg-gradient-to-r from-blue-500 to-indigo-500" };
    if (streak >= 14) return { icon: Flame, label: "Fire", color: "bg-gradient-to-r from-red-500 to-orange-500" };
    return null;
  };

  const badge = getBadgeForStreak(dailyStreak);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Daily Streak */}
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <h3 className="font-semibold text-gray-900">Daily Streak</h3>
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {dailyStreak}
            </div>
            <p className="text-sm text-gray-600">Days in a row</p>
            {badge && (
              <div className="mt-3">
                <Badge className={`${badge.color} text-white border-0`}>
                  <badge.icon className="w-3 h-3 mr-1" />
                  {badge.label}
                </Badge>
              </div>
            )}
          </div>
          <div className="text-4xl">🔥</div>
        </div>
      </Card>

      {/* Progress Tracker */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-gray-900">Progress</h3>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              Day {totalActiveDays}/90
            </div>
            <p className="text-sm text-gray-600">Journey progress</p>
            <div className="mt-3 w-full bg-blue-100 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((totalActiveDays / 90) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="text-4xl">🎯</div>
        </div>
      </Card>

      {/* Completed Tasks Today */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-gray-900">Today's Tasks</h3>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {todayCompletedTasks}/{habits.length}
            </div>
            <p className="text-sm text-gray-600">Completed today</p>
            {todayCompletedTasks === habits.length && habits.length > 0 && (
              <div className="mt-3">
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                  Perfect Day! 🎉
                </Badge>
              </div>
            )}
          </div>
          <div className="text-4xl">✅</div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardStats;
