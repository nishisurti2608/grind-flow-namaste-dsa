
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Habit, Subtask } from './Dashboard';
import { CheckCircle, Circle, Edit2, Trash2, Plus, X } from "lucide-react";

interface HabitListProps {
  habits: Habit[];
  subtasks: Subtask[];
  selectedHabit: Habit | null;
  onSelectHabit: (habit: Habit) => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
  onAddSubtask: (habitId: string, subtaskName: string) => void;
  onUpdateSubtask: (subtaskId: string, completed: boolean) => void;
  onDeleteSubtask: (subtaskId: string) => void;
}

const HabitList = ({ 
  habits, 
  subtasks, 
  selectedHabit, 
  onSelectHabit, 
  onEditHabit, 
  onDeleteHabit,
  onAddSubtask,
  onUpdateSubtask,
  onDeleteSubtask
}: HabitListProps) => {
  const [addingSubtaskFor, setAddingSubtaskFor] = useState<string | null>(null);
  const [newSubtaskName, setNewSubtaskName] = useState('');

  const getSubtasksForHabit = (habitId: string) => {
    return subtasks.filter(subtask => subtask.habit_id === habitId);
  };

  const handleAddSubtask = (habitId: string) => {
    if (newSubtaskName.trim()) {
      onAddSubtask(habitId, newSubtaskName.trim());
      setNewSubtaskName('');
      setAddingSubtaskFor(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Your Dev Habits</h3>
        <Badge variant="outline" className="text-gray-600 border-gray-300">
          {habits.length} total
        </Badge>
      </div>

      <div className="space-y-3">
        {habits.map((habit) => {
          const habitSubtasks = getSubtasksForHabit(habit.id);
          const completedSubtasks = habitSubtasks.filter(s => s.completed).length;
          
          return (
            <Card
              key={habit.id}
              className={`p-4 transition-all duration-200 border ${
                selectedHabit?.id === habit.id 
                  ? 'ring-2 ring-indigo-500 border-indigo-200 bg-indigo-50' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div 
                    className="flex items-center space-x-3 cursor-pointer flex-1"
                    onClick={() => onSelectHabit(habit)}
                  >
                    <div className={`w-3 h-3 rounded-full ${habit.color} flex-shrink-0 mt-1`}></div>
                    <h4 className="font-medium text-gray-900 leading-tight">
                      {habit.name}
                    </h4>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditHabit(habit)}
                      className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteHabit(habit.id)}
                      className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Subtasks */}
                {habitSubtasks.length > 0 && (
                  <div className="space-y-2 pl-6">
                    {habitSubtasks.map((subtask) => (
                      <div key={subtask.id} className="flex items-center justify-between group">
                        <div 
                          className="flex items-center space-x-2 cursor-pointer flex-1"
                          onClick={() => onUpdateSubtask(subtask.id, !subtask.completed)}
                        >
                          {subtask.completed ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-400" />
                          )}
                          <span className={`text-sm ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                            {subtask.name}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteSubtask(subtask.id)}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    <div className="text-xs text-gray-500">
                      {completedSubtasks}/{habitSubtasks.length} completed
                    </div>
                  </div>
                )}

                {/* Add subtask */}
                <div className="pl-6">
                  {addingSubtaskFor === habit.id ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        value={newSubtaskName}
                        onChange={(e) => setNewSubtaskName(e.target.value)}
                        placeholder="Subtask name..."
                        className="text-sm h-8"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddSubtask(habit.id);
                          }
                        }}
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={() => handleAddSubtask(habit.id)}
                        className="h-8 px-2"
                      >
                        Add
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setAddingSubtaskFor(null);
                          setNewSubtaskName('');
                        }}
                        className="h-8 px-2"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAddingSubtaskFor(habit.id)}
                      className="h-8 px-2 text-gray-500 hover:text-gray-700"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add subtask
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default HabitList;
