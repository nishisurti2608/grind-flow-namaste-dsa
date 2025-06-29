
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Habit } from './Dashboard';
import { CheckCircle, BarChart3, List } from "lucide-react";

interface HabitListProps {
  habits: Habit[];
  selectedHabit: Habit | null;
  onSelectHabit: (habit: Habit) => void;
}

const HabitList = ({ habits, selectedHabit, onSelectHabit }: HabitListProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'checkbox': return <CheckCircle className="w-4 h-4" />;
      case 'dropdown': return <List className="w-4 h-4" />;
      case 'range': return <BarChart3 className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'checkbox': return 'Yes/No';
      case 'dropdown': return 'Choice';
      case 'range': return 'Range';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'checkbox': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'dropdown': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'range': return 'text-purple-700 bg-purple-50 border-purple-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Your Habits</h3>
        <Badge variant="outline" className="text-gray-600 border-gray-300">
          {habits.length} total
        </Badge>
      </div>

      <div className="space-y-3">
        {habits.map((habit) => (
          <Card
            key={habit.id}
            className={`p-4 cursor-pointer transition-all duration-200 border ${
              selectedHabit?.id === habit.id 
                ? 'ring-2 ring-indigo-500 border-indigo-200 bg-indigo-50' 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
            onClick={() => onSelectHabit(habit)}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${habit.color} flex-shrink-0 mt-1`}></div>
                  <h4 className="font-medium text-gray-900 leading-tight">
                    {habit.name}
                  </h4>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium border ${getTypeColor(habit.type)}`}>
                  {getTypeIcon(habit.type)}
                  <span>{getTypeLabel(habit.type)}</span>
                </div>
                
                {habit.type === 'range' && habit.max_value && (
                  <span className="text-xs text-gray-500 font-medium">
                    0-{habit.max_value}
                  </span>
                )}
              </div>

              {habit.type === 'dropdown' && habit.options && (
                <div className="text-xs text-gray-500">
                  {habit.options.slice(0, 3).join(' • ')}
                  {habit.options.length > 3 && '...'}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HabitList;
