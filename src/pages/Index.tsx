import { useAuth } from "@/contexts/AuthContext";
import { lazy } from "react";
import CustomLoading from "@/components/customUi/loadingSpinner/CustomLoading";


const Dashboard = lazy(()=>import("@/components/Dashboard"))
const LandingPage = lazy(()=> import("./LandingPage"))

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
