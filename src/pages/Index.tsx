
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, CheckCircle, TrendingUp, Users, Zap, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Dashboard from '../components/Dashboard';

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  // If user is logged in, show dashboard option
  if (user && showDashboard) {
    return <Dashboard onBack={() => setShowDashboard(false)} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">HabitFlow</h1>
          </div>
          <div className="space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 hidden sm:block">Welcome back!</span>
                <Button
                  onClick={() => setShowDashboard(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Go to Dashboard
                </Button>
                <Button variant="ghost" onClick={signOut} className="text-gray-600 hover:text-gray-900">
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="text-gray-600 hover:text-gray-900"
                  onClick={() => navigate('/auth')}
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={() => navigate('/auth')}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Build Better Habits,
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Track Your Progress
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            Transform your daily routines with our beautiful habit tracker. 
            Visualize your consistency, celebrate your wins, and build lasting change.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Button 
                size="lg" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-lg rounded-lg"
                onClick={() => setShowDashboard(true)}
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-lg rounded-lg"
                  onClick={() => navigate('/auth')}
                >
                  Start Free Trial
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-8 py-4 text-lg border-gray-300 hover:bg-gray-50 rounded-lg"
                  onClick={() => setShowDashboard(true)}
                >
                  Try Demo
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to succeed
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform makes habit building intuitive, visual, and rewarding
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300 bg-white">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Visual Heatmap</h4>
              <p className="text-gray-600">See your progress at a glance with our beautiful heatmap visualization</p>
            </Card>

            <Card className="p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300 bg-white">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Multiple Habit Types</h4>
              <p className="text-gray-600">Checkboxes, dropdowns, and ranges - track any type of habit</p>
            </Card>

            <Card className="p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300 bg-white">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Progress Analytics</h4>
              <p className="text-gray-600">Understand your patterns and celebrate your consistency</p>
            </Card>

            <Card className="p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300 bg-white">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Streak Tracking</h4>
              <p className="text-gray-600">Stay motivated with streak counters and achievement milestones</p>
            </Card>

            <Card className="p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300 bg-white">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Goal Setting</h4>
              <p className="text-gray-600">Set meaningful targets and track your progress towards them</p>
            </Card>

            <Card className="p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300 bg-white">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-cyan-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Community Support</h4>
              <p className="text-gray-600">Join others on their habit-building journey for motivation</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to build better habits?
          </h3>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already transforming their lives, one habit at a time.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-indigo-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-lg"
            onClick={() => navigate('/auth')}
          >
            Start Your Journey Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded flex items-center justify-center">
              <Calendar className="w-3 h-3 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">HabitFlow</span>
          </div>
          <p className="text-gray-600">Building better habits, one day at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
