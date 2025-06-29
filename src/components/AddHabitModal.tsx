
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Habit } from './Dashboard';

interface AddHabitModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (habit: Omit<Habit, 'id'>) => void;
}

const AddHabitModal = ({ open, onClose, onAdd }: AddHabitModalProps) => {
  const [name, setName] = useState('');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    const habit: Omit<Habit, 'id'> = {
      name: name.trim(),
      color,
    };

    onAdd(habit);
    
    // Reset form
    setName('');
    setColor('bg-indigo-500');
    onClose();
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
