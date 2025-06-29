
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Habit } from './Dashboard';
import { CheckCircle } from "lucide-react";

interface HabitListProps {
  habits: Habit[];
  selectedHabit: Habit | null;
  onSelectHabit: (habit: Habit) => void;
}

const HabitList = ({ habits, selectedHabit, onSelectHabit }: HabitListProps) => {
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
                <div className="inline-flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium border text-emerald-700 bg-emerald-50 border-emerald-200">
                  <CheckCircle className="w-4 h-4" />
                  <span>Checkmark</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HabitList;
