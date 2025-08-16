import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Plus, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { DropdownMenuContent, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

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
              <p className="text-sm text-gray-500 hidden sm:block">Level up your dev skills daily</p>
            </div>
          </div>
        </div>
        <div className="flex items-center sm:space-x-3 space-x-2">
          <Button
            size="sm"
            onClick={onAddHabit}
            className="bg-indigo-600 hover:bg-indigo-700 flex gap-2 text-white "
          >
            <Plus className="sm:size-4 size-2" />
            <span className="hidden sm:inline">
              Add Habit
            </span>

          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="flex items-center space-x-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="" alt={getDisplayName()} />
                  <AvatarFallback className="bg-indigo-100 text-indigo-600 text-sm font-medium">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 whitespace-nowrap w-20 overflow-hidden text-ellipsis">{getDisplayName()}ssssdsd</p>
                  <p className="text-xs text-gray-500">Welcome back!</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border bg-white px-4 py-2 rounded-lg w-40 grid gap-2">
              <Button variant="outline" size="sm" onClick={()=>{}} className="text-slate-800 w-full flex gap-2">
                <Settings className="size-4"/>
                Settings
              </Button>
              <Button variant="destructive" size="sm" onClick={signOut} className="text-white w-full flex gap-2">
                <LogOut className="size-4"/>
                Sign Out
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
    </header>
  );
};

export default DashboardHeader;