
import CalendarView from './CalendarView';
import { Habit, HabitEntry } from './Dashboard';

interface HeatmapCalendarProps {
  habit: Habit;
  entries: HabitEntry[];
  onUpdateEntry: (habitId: string, date: string, completed: boolean, notes?: string) => void;
}

const HeatmapCalendar = ({ habit, entries, onUpdateEntry }: HeatmapCalendarProps) => {
  return (
    <CalendarView
      habit={habit}
      entries={entries}
      onUpdateEntry={onUpdateEntry}
    />
  );
};

export default HeatmapCalendar;
