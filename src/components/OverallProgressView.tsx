
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Habit, HabitEntry } from './Dashboard';
import OverallProgressChart from './OverallProgressChart';
import WeeklyProgressView from './WeeklyProgressView';
import MonthlyProgressView from './MonthlyProgressView';
import YearlyProgressView from './YearlyProgressView';

interface OverallProgressViewProps {
  habits: Habit[];
  habitEntries: HabitEntry[];
  onUpdateEntry: (habitId: string, date: string, completed: boolean, notes?: string) => void;
}

const OverallProgressView = ({ habits, habitEntries, onUpdateEntry }: OverallProgressViewProps) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chart">Progress Chart</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chart" className="mt-6">
          <OverallProgressChart habits={habits} habitEntries={habitEntries} />
        </TabsContent>
        
        <TabsContent value="weekly" className="mt-6">
          <WeeklyProgressView 
            habits={habits} 
            habitEntries={habitEntries} 
            onUpdateEntry={onUpdateEntry} 
          />
        </TabsContent>
        
        <TabsContent value="monthly" className="mt-6">
          <MonthlyProgressView 
            habits={habits} 
            habitEntries={habitEntries} 
            onUpdateEntry={onUpdateEntry} 
          />
        </TabsContent>
        
        <TabsContent value="yearly" className="mt-6">
          <YearlyProgressView 
            habits={habits} 
            habitEntries={habitEntries} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OverallProgressView;
