
import YearlyHeatmapCalendar from './YearlyHeatmapCalendar';
import { Habit, HabitEntry } from './Dashboard';

interface HeatmapCalendarProps {
  habit: Habit;
  entries: HabitEntry[];
  onUpdateEntry: (habitId: string, date: string, value: any, completed: boolean, notes?: string) => void;
}

const HeatmapCalendar = ({ habit, entries, onUpdateEntry }: HeatmapCalendarProps) => {
  return (
    <YearlyHeatmapCalendar
      habit={habit}
      entries={entries}
      onUpdateEntry={onUpdateEntry}
    />
  );
};

export default HeatmapCalendar;
