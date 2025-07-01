import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";

interface DailyHistoryData {
  id: string;
  date: string;
  completed_tasks: number;
  total_tasks: number;
  completion_rate: number;
  habits_data: any[];
  entries_data: any[];
}

const DailyHistory = () => {
  const { user } = useAuth();
  const [historyData, setHistoryData] = useState<DailyHistoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDailyHistory();
    }
  }, [user]);

  const fetchDailyHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_history')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false });

      if (error) throw error;

      // Transform the data to ensure proper typing
      const transformedData: DailyHistoryData[] = (data || []).map(item => ({
        id: item.id,
        date: item.date,
        completed_tasks: item.completed_tasks,
        total_tasks: item.total_tasks,
        completion_rate: item.completion_rate,
        habits_data: Array.isArray(item.habits_data) ? item.habits_data : [],
        entries_data: Array.isArray(item.entries_data) ? item.entries_data : []
      }));

      setHistoryData(transformedData);
    } catch (error) {
      console.error('Error fetching daily history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return 'bg-green-500';
    if (rate >= 60) return 'bg-yellow-500';
    if (rate >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getCompletionText = (rate: number) => {
    if (rate >= 80) return 'Excellent';
    if (rate >= 60) return 'Good';
    if (rate >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-600">Loading history...</div>
      </div>
    );
  }

  if (historyData.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No History Yet</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Complete some habits to start building your daily completion history.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-6">
        <Calendar className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Daily Completion History</h3>
      </div>

      <div className="grid gap-4">
        {historyData.map((day) => (
          <Card key={day.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getCompletionColor(day.completion_rate)}`}></div>
                  <h4 className="font-semibold text-gray-900">
                    {format(new Date(day.date), 'EEEE, MMMM d, yyyy')}
                  </h4>
                </div>
                <Badge variant="outline" className="text-xs">
                  {getCompletionText(day.completion_rate)}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">{day.completed_tasks}</span>
                </div>
                <div className="flex items-center space-x-2 text-red-600">
                  <XCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">{day.total_tasks - day.completed_tasks}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {Math.round(day.completion_rate)}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {day.completed_tasks}/{day.total_tasks} completed
                  </div>
                </div>
              </div>
            </div>

            {/* Habit breakdown */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {day.habits_data.map((habit: any) => {
                  const entry = day.entries_data.find((e: any) => e.habit_id === habit.id);
                  const isCompleted = entry?.completed || false;
                  
                  return (
                    <div 
                      key={habit.id}
                      className={`flex items-center space-x-2 p-2 rounded-lg ${
                        isCompleted ? 'bg-green-50' : 'bg-red-50'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${habit.color}`}></div>
                      <span className={`text-xs truncate ${
                        isCompleted ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {habit.name}
                      </span>
                      {isCompleted ? (
                        <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-3 h-3 text-red-600 flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DailyHistory;
