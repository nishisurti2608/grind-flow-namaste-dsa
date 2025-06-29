
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Habit } from './Dashboard';

interface HabitListProps {
  habits: Habit[];
  selectedHabit: Habit | null;
  onSelectHabit: (habit: Habit) => void;
}

const HabitList = ({ habits, selectedHabit, onSelectHabit }: HabitListProps) => {
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
      case 'checkbox': return 'bg-blue-100 text-blue-800';
      case 'dropdown': return 'bg-green-100 text-green-800';
      case 'range': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800">Your Habits</h3>
        <Badge variant="outline" className="text-slate-600">
          {habits.length} total
        </Badge>
      </div>

      <div className="space-y-3">
        {habits.map((habit) => (
          <Card
            key={habit.id}
            className={`p-4 cursor-pointer transition-all duration-200 border-slate-200 hover:shadow-md ${
              selectedHabit?.id === habit.id 
                ? 'ring-2 ring-blue-400 bg-blue-50' 
                : 'hover:bg-slate-50'
            }`}
            onClick={() => onSelectHabit(habit)}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h4 className="font-medium text-slate-800 leading-tight">
                  {habit.name}
                </h4>
                <div className={`w-3 h-3 rounded-full ${habit.color} flex-shrink-0 mt-1`}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getTypeColor(habit.type)}`}
                >
                  {getTypeLabel(habit.type)}
                </Badge>
                
                {habit.type === 'range' && habit.max_value && (
                  <span className="text-xs text-slate-500">
                    0-{habit.max_value}
                  </span>
                )}
              </div>

              {habit.type === 'dropdown' && habit.options && (
                <div className="text-xs text-slate-500 truncate">
                  Options: {habit.options.slice(0, 2).join(', ')}
                  {habit.options.length > 2 && '...'}
                </div>
              )}
            </div>
          </Card>
        ))}

        {habits.length === 0 && (
          <Card className="p-8 text-center border-slate-200 border-dashed">
            <div className="text-slate-400 mb-2">📝</div>
            <p className="text-slate-600 text-sm">
              No habits yet. Add your first habit to get started!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HabitList;
