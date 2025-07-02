import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, TrendingUp, Calendar, BarChart3, Users, Shield, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Dashboard from "@/components/Dashboard";
import Auth from "./Auth";

const Index = () => {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  if (showAuth) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/bfdabed2-e05a-4763-a368-dacd61ff3332.png" 
                alt="Grind Flow Logo" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Grind Flow
                </h1>
                <p className="text-sm text-gray-600">Level up your dev skills daily</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => setShowAuth(true)}
                className="text-gray-700 hover:text-indigo-600"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => setShowAuth(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-6 bg-indigo-100 text-indigo-700 border-indigo-200">
              For Developer Productivity
            </Badge>
            <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Build Your Coding Skills
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                One Day at a Time
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Track your daily coding habits, master data structures & algorithms, 
              work on projects, and level up your development skills with our beautiful habit tracker.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => setShowAuth(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-1"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Excel
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Designed specifically for developers who want to build consistent coding habits and track their progress.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                Progress Tracking
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Visual heatmaps and detailed analytics help you see your coding journey unfold over time.
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                Daily Habits
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Build consistency with DSA practice, project work, core concepts, and mindful social media usage.
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                Smart Analytics
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Get insights into your coding patterns and celebrate your achievements with detailed statistics.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Simple. Effective. Powerful.
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start building better coding habits in just a few steps.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 items-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Set Your Goals</h4>
              <p className="text-gray-600">
                Define your daily coding habits: DSA practice, project work, learning new concepts.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Track Daily</h4>
              <p className="text-gray-600">
                Check off completed habits each day and add notes about your progress.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Level Up</h4>
              <p className="text-gray-600">
                Watch your coding skills improve as you build consistent daily habits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-built Habits Section */}
      <section className="px-6 py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Pre-built for Developers
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start immediately with habits designed specifically for coding skill development.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 border-0 shadow-lg bg-white">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <h4 className="font-semibold text-gray-900">DSA Practice</h4>
              </div>
              <p className="text-sm text-gray-600">
                Daily data structures and algorithms problem solving
              </p>
            </Card>
            
            <Card className="p-6 border-0 shadow-lg bg-white">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <h4 className="font-semibold text-gray-900">Project Work</h4>
              </div>
              <p className="text-sm text-gray-600">
                Consistent progress on personal or professional projects
              </p>
            </Card>
            
            <Card className="p-6 border-0 shadow-lg bg-white">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <h4 className="font-semibold text-gray-900">Core Learning</h4>
              </div>
              <p className="text-sm text-gray-600">
                Study fundamental programming concepts and new technologies
              </p>
            </Card>
            
            <Card className="p-6 border-0 shadow-lg bg-white">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                <h4 className="font-semibold text-gray-900">Focus Time</h4>
              </div>
              <p className="text-sm text-gray-600">
                Mindful social media usage and distraction management
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold text-white mb-6">
            Ready to Level Up Your Coding Skills?
          </h3>
          <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
            Join developers who are building better coding habits and accelerating their career growth.
          </p>
          <Button 
            size="lg" 
            onClick={() => setShowAuth(true)}
            className="bg-white text-indigo-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-1"
          >
            Start Your Free Journey
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-indigo-200 mt-4 text-sm">
            No credit card required • Set up in under 2 minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <img 
              src="/lovable-uploads/bfdabed2-e05a-4763-a368-dacd61ff3332.png" 
              alt="Grind Flow Logo" 
              className="w-10 h-10 object-contain"
            />
            <h3 className="text-2xl font-bold">Grind Flow</h3>
          </div>
          <div className="text-center text-gray-400">
            <p className="mb-4">
              Built for developers, by developers. Level up your coding skills one day at a time.
            </p>
            <p>&copy; 2025 Grind Flow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
