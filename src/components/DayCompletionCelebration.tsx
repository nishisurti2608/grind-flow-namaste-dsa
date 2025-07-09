import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Twitter, Linkedin, Copy, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DayCompletionCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  currentStreak: number;
}

const DayCompletionCelebration = ({ isOpen, onClose, currentStreak }: DayCompletionCelebrationProps) => {
  const { toast } = useToast();
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowAnimation(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const shareText = `🚀 Day completed! I just finished all my habits for today on Grind Flow! Currently on a ${currentStreak} day streak! 💪 #HabitTracking #Productivity`;

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText);
    toast({
      title: "Copied to clipboard!",
      description: "Share text has been copied to your clipboard.",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className={`p-8 w-full max-w-md mx-auto bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 transition-all duration-500 ${
        showAnimation ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute -top-2 -right-2 h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="text-center">
            {/* Animated Rocket */}
            <div className={`text-6xl mb-4 transition-all duration-1000 ${
              showAnimation ? 'animate-bounce' : ''
            }`}>
              🚀
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Day Completed!
            </h2>
            
            <p className="text-lg text-gray-700 mb-1">
              Amazing work! You've completed all your habits for today!
            </p>
            
            {currentStreak > 1 && (
              <p className="text-sm text-indigo-600 font-semibold mb-6">
                🔥 {currentStreak} day streak and counting!
              </p>
            )}

            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                Share your success:
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={shareOnTwitter}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Twitter className="w-4 h-4" />
                  <span>Share on Twitter</span>
                </Button>
                
                <Button
                  onClick={shareOnLinkedIn}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-700 hover:bg-blue-800 text-white"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>Share on LinkedIn</span>
                </Button>
                
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy to Clipboard</span>
                </Button>
              </div>
            </div>
            
            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full mt-6 text-gray-600 hover:text-gray-800"
            >
              Continue
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DayCompletionCelebration;