
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, TrendingUp, Target, Zap, CheckCircle, BarChart3, List, ArrowRight, Star, Users, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Dashboard from "@/components/Dashboard";
import ProfileSettings from "@/components/ProfileSettings";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'profile'>('landing');

  if (user && currentView === 'dashboard') {
    return <Dashboard onBack={() => setCurrentView('landing')} />;
  }

  if (user && currentView === 'profile') {
    return <ProfileSettings onBack={() => setCurrentView('dashboard')} />;
  }

  if (user) {
    setCurrentView('dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  HabitFlow
                </h1>
                <p className="text-sm text-gray-600">Transform your life, one habit at a time</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl transform -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                Build Better Habits,
                <br />
                Track Your Progress
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                The most intuitive habit tracker designed to help you build consistency, 
                visualize your progress, and achieve your goals with beautiful insights.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => navigate('/auth')}
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg px-8 py-4 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full border-2 border-white"></div>
                  ))}
                </div>
                <span className="text-sm">Join 10,000+ users building better habits</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make habit tracking effortless and engaging
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Visual Progress Tracking</h3>
                <p className="text-gray-600 leading-relaxed">
                  Beautiful yearly heatmaps that show your consistency at a glance. Watch your streaks grow and stay motivated.
                </p>
              </div>
            </Card>

            <Card className="p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Flexible Habit Types</h3>
                <p className="text-gray-600 leading-relaxed">
                  Track simple yes/no habits, rate your mood, or log quantities. Customize colors and options to fit your needs.
                </p>
              </div>
            </Card>

            <Card className="p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-emerald-50 to-green-50">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Smart Analytics</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get insights into your habits with completion rates, streak tracking, and detailed notes for reflection.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Habit Types Showcase */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Three Powerful Ways to Track
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the tracking method that works best for each of your habits
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">Yes/No Tracking</h3>
                <p className="text-gray-600">Perfect for simple habits like "Did I exercise today?" or "Did I read?"</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-lg">
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((day, i) => (
                    <div key={day} className={`w-6 h-6 rounded ${i < 5 ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">5/7 days completed</p>
              </div>
            </div>

            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto">
                <List className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">Multiple Choice</h3>
                <p className="text-gray-600">Track mood, energy levels, or any categorical data with custom colors</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-lg">
                <div className="flex justify-center space-x-2">
                  {['bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-gray-200', 'bg-gray-200'].map((color, i) => (
                    <div key={i} className={`w-6 h-6 rounded ${color}`}></div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">Mood tracking</p>
              </div>
            </div>

            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                <BarChart3 className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">Range Tracking</h3>
                <p className="text-gray-600">Log quantities like glasses of water, hours studied, or workout intensity</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-lg">
                <div className="flex justify-center space-x-2">
                  {[0.9, 0.7, 0.5, 0.8, 0.6, 0.3, 0.4].map((opacity, i) => (
                    <div key={i} className="w-6 h-6 rounded bg-purple-500" style={{opacity}}></div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">Water intake (1-10 glasses)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Trusted by Thousands
              </h2>
              <p className="text-xl text-gray-600">Join the community of successful habit builders</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex items-center justify-center space-x-4 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
                <Users className="w-12 h-12 text-indigo-600" />
                <div>
                  <div className="text-3xl font-bold text-gray-900">10,000+</div>
                  <div className="text-gray-600">Active Users</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-4 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl">
                <Star className="w-12 h-12 text-emerald-600" />
                <div>
                  <div className="text-3xl font-bold text-gray-900">4.9/5</div>
                  <div className="text-gray-600">User Rating</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-4 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
                <Shield className="w-12 h-12 text-purple-600" />
                <div>
                  <div className="text-3xl font-bold text-gray-900">100%</div>
                  <div className="text-gray-600">Privacy Safe</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to Transform Your Life?
            </h2>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Start building better habits today. It's free, easy to use, and takes less than 2 minutes to set up.
            </p>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={() => navigate('/auth')}
              size="lg"
              className="bg-white text-indigo-600 hover:bg-gray-50 text-lg px-8 py-4 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
            >
              Start Your Free Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-indigo-200 text-sm">No credit card required • Start in seconds</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold">HabitFlow</h3>
          </div>
          <div className="text-center text-gray-400">
            <p>&copy; 2024 HabitFlow. All rights reserved. Built with ❤️ for habit builders everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
