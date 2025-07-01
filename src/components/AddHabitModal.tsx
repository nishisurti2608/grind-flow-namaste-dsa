
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Habit } from './Dashboard';
import { validateHabitName, validateColor, sanitizeInput, ALLOWED_COLORS } from '@/utils/validation';
import { rateLimiter, RATE_LIMITS } from '@/utils/rateLimiter';
import { handleSecureError } from '@/utils/errorHandler';
import { useToast } from "@/hooks/use-toast";

interface AddHabitModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (habit: Omit<Habit, 'id'>) => void;
}

const AddHabitModal = ({ open, onClose, onAdd }: AddHabitModalProps) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('bg-indigo-500');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const colors = ALLOWED_COLORS.map(colorValue => ({
    name: colorValue.replace('bg-', '').replace('-500', '').charAt(0).toUpperCase() + 
          colorValue.replace('bg-', '').replace('-500', '').slice(1),
    value: colorValue
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Rate limiting check
    if (!rateLimiter.isAllowed('habit_create', 'user', RATE_LIMITS.HABIT_OPERATIONS.maxAttempts, RATE_LIMITS.HABIT_OPERATIONS.windowMs)) {
      const remainingTime = rateLimiter.getRemainingTime('habit_create', 'user');
      toast({
        title: "Too many requests",
        description: `Please wait ${remainingTime} seconds before creating another habit.`,
        variant: "destructive",
      });
      return;
    }
    
    // Validate input
    const nameValidation = validateHabitName(name);
    if (!nameValidation.isValid) {
      toast({
        title: "Invalid habit name",
        description: nameValidation.error,
        variant: "destructive",
      });
      return;
    }
    
    const colorValidation = validateColor(color);
    if (!colorValidation.isValid) {
      toast({
        title: "Invalid color",
        description: colorValidation.error,
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const sanitizedName = sanitizeInput(name);
      
      const habit: Omit<Habit, 'id'> = {
        name: sanitizedName,
        color,
      };

      await onAdd(habit);
      
      // Reset form
      setName('');
      setColor('bg-indigo-500');
      onClose();
    } catch (error) {
      const secureError = handleSecureError(error, 'AddHabitModal.handleSubmit');
      toast({
        title: "Error creating habit",
        description: secureError.userMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Prevent input beyond max length
    if (value.length <= 100) {
      setName(value);
    }
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
              onChange={handleNameChange}
              placeholder="e.g., Morning Exercise, Read for 30 minutes"
              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              required
              maxLength={100}
            />
            <div className="text-xs text-gray-500">
              {name.length}/100 characters
            </div>
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
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Habit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHabitModal;
