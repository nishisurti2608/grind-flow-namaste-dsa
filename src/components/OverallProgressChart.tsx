
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Habit, HabitEntry } from './Dashboard';

interface OverallProgressChartProps {
  habits: Habit[];
  habitEntries: HabitEntry[];
}

const OverallProgressChart = ({ habits, habitEntries }: OverallProgressChartProps) => {
  // Generate data for the last 90 days
  const generateChartData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 89; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
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
      
      data.push({
        date: dateStr,
        displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        completionRate: Math.round(completionRate),
        completedHabits,
        totalHabits
      });
    }
    
    return data;
  };

  const chartData = generateChartData();

  const chartConfig = {
    completionRate: {
      label: "Completion Rate",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Overall Progress Trend</h3>
          <p className="text-sm text-gray-600">
            Last 90 days completion rate across all habits
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
                formatter={(value, name, props) => [
                  `${value}% (${props.payload?.completedHabits}/${props.payload?.totalHabits} habits)`,
                  'Completion Rate'
                ]}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    const date = new Date(payload[0].payload.date);
                    return date.toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    });
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
            {Math.round(chartData.slice(-7).reduce((acc, day) => acc + day.completionRate, 0) / 7)}%
          </div>
          <div className="text-sm text-gray-600">7-day average</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(chartData.slice(-30).reduce((acc, day) => acc + day.completionRate, 0) / 30)}%
          </div>
          <div className="text-sm text-gray-600">30-day average</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">
            {chartData.filter(day => day.completionRate === 100).length}
          </div>
          <div className="text-sm text-gray-600">Perfect days</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">
            {chartData[chartData.length - 1]?.completionRate || 0}%
          </div>
          <div className="text-sm text-gray-600">Today</div>
        </div>
      </div>
    </div>
  );
};

export default OverallProgressChart;
