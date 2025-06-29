
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Habit } from './Dashboard';

interface AddHabitModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (habit: Omit<Habit, 'id'>) => void;
}

const AddHabitModal = ({ open, onClose, onAdd }: AddHabitModalProps) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'checkbox' | 'dropdown' | 'range'>('checkbox');
  const [options, setOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState('');
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(10);
  const [color, setColor] = useState('bg-blue-500');

  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-cyan-500',
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
    setNewOption('');
    setMinValue(0);
    setMaxValue(10);
    setColor('bg-blue-500');
    onClose();
  };

  const addOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      setOptions([...options, newOption.trim()]);
      setNewOption('');
    }
  };

  const removeOption = (optionToRemove: string) => {
    setOptions(options.filter(option => option !== optionToRemove));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Habit</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Habit Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Morning Exercise"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tracking Type</Label>
            <Select value={type} onValueChange={(value: any) => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checkbox">Yes/No (Checkbox)</SelectItem>
                <SelectItem value="dropdown">Multiple Choice</SelectItem>
                <SelectItem value="range">Number Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === 'dropdown' && (
            <div className="space-y-3">
              <Label>Options</Label>
              <div className="flex space-x-2">
                <Input
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="Add an option"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOption())}
                />
                <Button type="button" onClick={addOption} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {options.map((option) => (
                  <Badge
                    key={option}
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100"
                    onClick={() => removeOption(option)}
                  >
                    {option} ×
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {type === 'range' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min">Minimum</Label>
                <Input
                  id="min"
                  type="number"
                  value={minValue}
                  onChange={(e) => setMinValue(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max">Maximum</Label>
                <Input
                  id="max"
                  type="number"
                  value={maxValue}
                  onChange={(e) => setMaxValue(Number(e.target.value))}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex space-x-2">
              {colors.map((colorOption) => (
                <div
                  key={colorOption}
                  className={`w-8 h-8 rounded-full cursor-pointer transition-all ${colorOption} ${
                    color === colorOption ? 'ring-2 ring-slate-400 ring-offset-2' : ''
                  }`}
                  onClick={() => setColor(colorOption)}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-600">
              Add Habit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHabitModal;
