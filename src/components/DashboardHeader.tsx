import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfile {
  full_name: string | null;
  email: string | null;
}

interface DashboardHeaderProps {
  userProfile: UserProfile | null;
  onAddHabit: () => void;
}

const DashboardHeader = ({ userProfile, onAddHabit }: DashboardHeaderProps) => {
  const { user, signOut } = useAuth();

  const getDisplayName = () => {
    return userProfile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/bfdabed2-e05a-4763-a368-dacd61ff3332.png" 
              alt="Grind Flow Logo" 
              className="w-8 h-8 object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Grind Flow</h1>
              <p className="text-sm text-gray-500">Level up your dev skills daily</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src="" alt={getDisplayName()} />
              <AvatarFallback className="bg-indigo-100 text-indigo-600 text-sm font-medium">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{getDisplayName()}</p>
              <p className="text-xs text-gray-500">Welcome back!</p>
            </div>
          </div>
          <Button 
            onClick={onAddHabit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Habit
          </Button>
          <Button variant="ghost" size="sm" onClick={signOut} className="text-gray-600">
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;