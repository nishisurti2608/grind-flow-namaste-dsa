
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, CheckCircle, TrendingUp, Users } from "lucide-react";
import Dashboard from '../components/Dashboard';

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    return <Dashboard onBack={() => setShowDashboard(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg"></div>
            <h1 className="text-xl font-bold text-slate-800">HabitFlow</h1>
          </div>
          <div className="space-x-4">
            <Button variant="ghost" className="text-slate-600 hover:text-slate-800">
              Sign In
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-slate-800 mb-6 leading-tight">
            Build Better Habits,
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              {" "}Track Your Progress
            </span>
          </h2>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Transform your daily routines with our beautiful habit tracker. 
            Visualize your consistency, celebrate your wins, and build lasting change.
          </p>
          <div className="space-x-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-8 py-6 text-lg"
              onClick={() => setShowDashboard(true)}
            >
              Try Demo Dashboard
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-slate-300">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-slate-800 mb-4">
            Everything you need to succeed
          </h3>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our platform makes habit building intuitive, visual, and rewarding
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="p-6 border-slate-200 hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-slate-800 mb-2">Visual Heatmap</h4>
            <p className="text-slate-600">See your progress at a glance with our beautiful heatmap visualization</p>
          </Card>

          <Card className="p-6 border-slate-200 hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-slate-800 mb-2">Multiple Habit Types</h4>
            <p className="text-slate-600">Checkboxes, dropdowns, and ranges - track any type of habit</p>
          </Card>

          <Card className="p-6 border-slate-200 hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
            <h4 className="text-lg font-semibold text-slate-800 mb-2">Progress Analytics</h4>
            <p className="text-slate-600">Understand your patterns and celebrate your consistency</p>
          </Card>

          <Card className="p-6 border-slate-200 hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="text-lg font-semibold text-slate-800 mb-2">Community Support</h4>
            <p className="text-slate-600">Join others on their habit-building journey for motivation</p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-500 to-green-500 py-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to build better habits?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already transforming their lives, one habit at a time.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-slate-50 px-8 py-6 text-lg font-semibold"
          >
            Start Your Journey Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded"></div>
            <span className="text-lg font-semibold text-slate-800">HabitFlow</span>
          </div>
          <p className="text-slate-600">Building better habits, one day at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
