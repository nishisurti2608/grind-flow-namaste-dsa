import { useAuth } from "@/contexts/AuthContext";
import Dashboard from "@/components/Dashboard";
import LandingPage from "./LandingPage";
import CustomLoading from "@/components/customUi/loadingSpinner/CustomLoading";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <CustomLoading/>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  return (
    <LandingPage/>
  );
};

export default Index;
