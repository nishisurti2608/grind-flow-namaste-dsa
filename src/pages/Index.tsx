import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, TrendingUp, Target, Zap, CheckCircle, BarChart3, List, ArrowRight, Star, Users, Shield, Code, Database, Smartphone, Share2 } from "lucide-react";
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
                  Grind Flow
                </h1>
                <p className="text-sm text-gray-600">Level up your dev skills daily</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Grinding
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
                Master Your Dev Journey,
                <br />
                One Habit at a Time
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                The ultimate habit tracker designed for developers. Track DSA practice, projects, 
                core skills, and social media presence to accelerate your coding career.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => navigate('/auth')}
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg px-8 py-4 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
              >
                Start Your Grind
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full border-2 border-white"></div>
                  ))}
                </div>
                <span className="text-sm">Join 10,000+ developers leveling up</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Dev Habits Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              The 4 Pillars of Dev Growth
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Master these essential areas to accelerate your development career
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">DSA Practice</h3>
                <p className="text-gray-600 leading-relaxed">
                  Master data structures and algorithms. Track your daily problem-solving progress.
                </p>
              </div>
            </Card>

            <Card className="p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Projects</h3>
                <p className="text-gray-600 leading-relaxed">
                  Build and ship projects. Track your development work and portfolio growth.
                </p>
              </div>
            </Card>

            <Card className="p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Core Skills</h3>
                <p className="text-gray-600 leading-relaxed">
                  Learn new technologies, frameworks, and deepen your technical knowledge.
                </p>
              </div>
            </Card>

            <Card className="p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-orange-50 to-red-50">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                  <Share2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Social Media</h3>
                <p className="text-gray-600 leading-relaxed">
                  Build your developer brand. Share your journey and connect with the community.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Built for Developers, By Developers
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to accelerate your coding journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Progress Tracking</h3>
                <p className="text-gray-600 leading-relaxed">
                  Beautiful weekly, monthly, and yearly views to visualize your consistency and growth over time.
                </p>
              </div>
            </Card>

            <Card className="p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Subtask Management</h3>
                <p className="text-gray-600 leading-relaxed">
                  Break down complex habits into manageable subtasks. Perfect for tracking specific learning goals.
                </p>
              </div>
            </Card>

            <Card className="p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Career Growth</h3>
                <p className="text-gray-600 leading-relaxed">
                  Focus on the habits that matter most for your development career and professional growth.
                </p>
              </div>
            </Card>
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
              Ready to Level Up Your Dev Career?
            </h2>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Join thousands of developers who are building better coding habits and accelerating their careers.
            </p>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={() => navigate('/auth')}
              size="lg"
              className="bg-white text-indigo-600 hover:bg-gray-50 text-lg px-8 py-4 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
            >
              Start Your Grind Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-indigo-200 text-sm">Free forever • No credit card required</p>
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
            <h3 className="text-2xl font-bold">Grind Flow</h3>
          </div>
          <div className="text-center text-gray-400">
            <p>&copy; 2024 Grind Flow. All rights reserved. Built with ❤️ for developers who never stop grinding.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
