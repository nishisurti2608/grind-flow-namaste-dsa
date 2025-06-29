
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Habit } from './Dashboard';
import { CheckCircle, List, BarChart3, X, Palette } from "lucide-react";

interface AddHabitModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (habit: Omit<Habit, 'id'>) => void;
}

const AddHabitModal = ({ open, onClose, onAdd }: AddHabitModalProps) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'checkbox' | 'dropdown' | 'range'>('checkbox');
  const [options, setOptions] = useState<string[]>([]);
  const [optionColors, setOptionColors] = useState<{ [key: string]: string }>({});
  const [newOption, setNewOption] = useState('');
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(10);
  const [color, setColor] = useState('bg-indigo-500');

  const colors = [
    { name: 'Indigo', value: 'bg-indigo-500' },
    { name: 'Blue', value: 'bg-blue-500' },
    { name: 'Emerald', value: 'bg-emerald-500' },
    { name: 'Purple', value: 'bg-purple-500' },
    { name: 'Pink', value: 'bg-pink-500' },
    { name: 'Orange', value: 'bg-orange-500' },
    { name: 'Red', value: 'bg-red-500' },
    { name: 'Cyan', value: 'bg-cyan-500' },
    { name: 'Yellow', value: 'bg-yellow-500' },
    { name: 'Green', value: 'bg-green-500' },
  ];

  const habitTypes = [
    { value: 'checkbox', label: 'Yes/No', icon: CheckCircle, desc: 'Simple completion tracking' },
    { value: 'dropdown', label: 'Multiple Choice', icon: List, desc: 'Choose from predefined options' },
    { value: 'range', label: 'Number Range', icon: BarChart3, desc: 'Track quantities or ratings' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    const habit: Omit<Habit, 'id'> = {
      name: name.trim(),
      type,
      color,
    };

    if (type === 'dropdown') {
      habit.options = options;
      habit.option_colors = optionColors;
    }

    if (type === 'range') {
      habit.min_value = minValue;
      habit.max_value = maxValue;
    }

    onAdd(habit);
    
    // Reset form
    setName('');
    setType('checkbox');
    setOptions([]);
    setOptionColors({});
    setNewOption('');
    setMinValue(0);
    setMaxValue(10);
    setColor('bg-indigo-500');
    onClose();
  };

  const addOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      const option = newOption.trim();
      setOptions([...options, option]);
      setOptionColors({ ...optionColors, [option]: 'bg-blue-500' });
      setNewOption('');
    }
  };

  const removeOption = (optionToRemove: string) => {
    setOptions(options.filter(option => option !== optionToRemove));
    const newOptionColors = { ...optionColors };
    delete newOptionColors[optionToRemove];
    setOptionColors(newOptionColors);
  };

  const updateOptionColor = (option: string, color: string) => {
    setOptionColors({ ...optionColors, [option]: color });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg font-sans">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Create New Habit
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Habit Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Morning Exercise, Read for 30 minutes"
              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Tracking Type</Label>
            <div className="grid gap-3">
              {habitTypes.map((habitType) => {
                const Icon = habitType.icon;
                return (
                  <div
                    key={habitType.value}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      type === habitType.value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setType(habitType.value as any)}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-5 h-5 ${type === habitType.value ? 'text-indigo-600' : 'text-gray-500'}`} />
                      <div>
                        <div className={`font-medium ${type === habitType.value ? 'text-indigo-900' : 'text-gray-900'}`}>
                          {habitType.label}
                        </div>
                        <div className={`text-sm ${type === habitType.value ? 'text-indigo-700' : 'text-gray-500'}`}>
                          {habitType.desc}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {type === 'dropdown' && (
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Options</Label>
              <div className="flex space-x-2">
                <Input
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="Add an option"
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOption())}
                />
                <Button 
                  type="button" 
                  onClick={addOption} 
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-50"
                >
                  Add
                </Button>
              </div>
              {options.length > 0 && (
                <div className="space-y-3">
                  {options.map((option) => (
                    <div key={option} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded ${optionColors[option] || 'bg-gray-300'}`}></div>
                        <span className="font-medium text-gray-900">{option}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          {colors.slice(0, 6).map((colorOption) => (
                            <div
                              key={colorOption.value}
                              className={`w-6 h-6 rounded cursor-pointer transition-all ${colorOption.value} ${
                                optionColors[option] === colorOption.value ? 'ring-2 ring-gray-400 ring-offset-1' : 'hover:scale-110'
                              }`}
                              onClick={() => updateOptionColor(option, colorOption.value)}
                              title={colorOption.name}
                            />
                          ))}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(option)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {type === 'range' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min" className="text-sm font-medium text-gray-700">
                  Minimum
                </Label>
                <Input
                  id="min"
                  type="number"
                  value={minValue}
                  onChange={(e) => setMinValue(Number(e.target.value))}
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max" className="text-sm font-medium text-gray-700">
                  Maximum
                </Label>
                <Input
                  id="max"
                  type="number"
                  value={maxValue}
                  onChange={(e) => setMaxValue(Number(e.target.value))}
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Color</Label>
            <div className="flex flex-wrap gap-2">
              {colors.map((colorOption) => (
                <div
                  key={colorOption.value}
                  className={`w-10 h-10 rounded-lg cursor-pointer transition-all ${colorOption.value} ${
                    color === colorOption.value ? 'ring-2 ring-gray-400 ring-offset-2' : 'hover:scale-110'
                  }`}
                  onClick={() => setColor(colorOption.value)}
                  title={colorOption.name}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Create Habit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHabitModal;
