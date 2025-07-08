const DashboardFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/lovable-uploads/bfdabed2-e05a-4763-a368-dacd61ff3332.png" 
                alt="Grind Flow Logo" 
                className="w-6 h-6 object-contain"
              />
              <h3 className="text-lg font-bold text-gray-900">Grind Flow</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Level up your dev skills daily. Track your progress, build consistency, and achieve your coding goals.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>All systems operational</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Habit Tracking</li>
              <li>• Progress Analytics</li>
              <li>• Achievement System</li>
              <li>• Daily Commits</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Documentation</li>
              <li>• Support</li>
              <li>• Community</li>
              <li>• Updates</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            © 2024 Grind Flow. Built with passion for developers.
          </p>
          <div className="text-xs text-gray-500">
            Made with ❤️ for the coding community
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;