
import { useState, useEffect } from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Habit, HabitEntry } from './Dashboard';

interface OverallProgressChartProps {
  habits: Habit[];
  habitEntries: HabitEntry[];
}

const OverallProgressChart = ({ habits, habitEntries }: OverallProgressChartProps) => {
  const { user } = useAuth();
  const [signupDate, setSignupDate] = useState<Date | null>(null);

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
  // Generate data from signup date to today
  const generateChartData = () => {
    if (!signupDate) return [];
    
    const data = [];
    const today = new Date();
    const startDate = new Date(signupDate);
    
    // Calculate total days since signup
    const totalDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const maxDaysToShow = Math.min(totalDays + 1, 365); // Show up to 1 year or since signup
    
    // Start from either signup date or 365 days ago, whichever is more recent
    const chartStartDate = new Date(today);
    chartStartDate.setDate(today.getDate() - (maxDaysToShow - 1));
    
    // Ensure we don't go before signup date
    const actualStartDate = chartStartDate > startDate ? chartStartDate : startDate;
    const daysToShow = Math.floor((today.getTime() - actualStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Skip dates before signup
      if (date < startDate) continue;
      
      // Calculate completion rate for this date
      let completedHabits = 0;
      let totalHabits = habits.length;
      
      habits.forEach(habit => {
        const entry = habitEntries.find(e => e.habit_id === habit.id && e.date === dateStr);
        if (entry?.completed) {
          completedHabits++;
        }
      });
      
      const completionRate = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;
      
      // Mark signup day
      const isSignupDay = dateStr === startDate.toISOString().split('T')[0];
      
      data.push({
        date: dateStr,
        displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        completionRate: Math.round(completionRate),
        completedHabits,
        totalHabits,
        isSignupDay
      });
    }
    
    return data;
  };

  if (!signupDate) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading your progress journey...</div>
      </div>
    );
  }

  const chartData = generateChartData();
  const daysSinceSignup = Math.floor((new Date().getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24));

  const chartConfig = {
    completionRate: {
      label: "Completion Rate",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <div className="space-y-4">
      {/* Header with signup info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Your Progress Journey</h3>
              <p className="text-sm text-gray-600">
                Tracking your progress since {signupDate.toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              Day {daysSinceSignup + 1}
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {chartData.length} days of data
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">Daily Completion Trend</h4>
          <p className="text-sm text-gray-600">
            Your habit completion rate over time
          </p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
            <span className="text-gray-600">Completion Rate</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="completionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="displayDate"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              interval="preserveStartEnd"
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip 
              content={<ChartTooltipContent 
                formatter={(value, name, props) => {
                  const signupIndicator = props.payload?.isSignupDay ? ' 🚀 Signup Day!' : '';
                  return [
                    `${value}% (${props.payload?.completedHabits}/${props.payload?.totalHabits} habits)${signupIndicator}`,
                    'Completion Rate'
                  ];
                }}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    const date = new Date(payload[0].payload.date);
                    const signupIndicator = payload[0].payload.isSignupDay ? ' - Your Journey Began!' : '';
                    return date.toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    }) + signupIndicator;
                  }
                  return label;
                }}
              />} 
            />
            <Area
              type="monotone"
              dataKey="completionRate"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#completionGradient)"
            />
          </AreaChart>
        </ChartContainer>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">
            {chartData.length >= 7 
              ? Math.round(chartData.slice(-7).reduce((acc, day) => acc + day.completionRate, 0) / 7)
              : chartData.length > 0 
              ? Math.round(chartData.reduce((acc, day) => acc + day.completionRate, 0) / chartData.length)
              : 0}%
          </div>
          <div className="text-sm text-gray-600">
            {chartData.length >= 7 ? '7-day average' : `${chartData.length}-day average`}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">
            {chartData.length >= 30 
              ? Math.round(chartData.slice(-30).reduce((acc, day) => acc + day.completionRate, 0) / 30)
              : chartData.length > 0 
              ? Math.round(chartData.reduce((acc, day) => acc + day.completionRate, 0) / chartData.length)
              : 0}%
          </div>
          <div className="text-sm text-gray-600">
            {chartData.length >= 30 ? '30-day average' : 'Overall average'}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">
            {chartData.filter(day => day.completionRate === 100).length}
          </div>
          <div className="text-sm text-gray-600">Perfect days</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">
            {daysSinceSignup + 1}
          </div>
          <div className="text-sm text-gray-600">Days on journey</div>
        </div>
      </div>
    </div>
  );
};

export default OverallProgressChart;
