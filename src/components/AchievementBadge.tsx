import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import badge images
import badgeEarth from "@/assets/badge-earth-7days.png";
import badgeWater from "@/assets/badge-water-21days.png";
import badgeFire from "@/assets/badge-fire-30days.png";
import badgeAir from "@/assets/badge-air-45days.png";
import badgeLightning from "@/assets/badge-lightning-60days.png";
import badgeAether from "@/assets/badge-aether-75days.png";
import badgeMaster from "@/assets/badge-master-90days.png";

export interface Achievement {
  id: string;
  user_id: string;
  milestone_days: number;
  element_type: string;
  badge_name: string;
  badge_description: string;
  badge_color: string;
  earned_at: string;
  created_at: string;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'small' | 'medium' | 'large';
  showShare?: boolean;
}

const badgeImages: Record<string, string> = {
  earth: badgeEarth,
  water: badgeWater,
  fire: badgeFire,
  air: badgeAir,
  lightning: badgeLightning,
  aether: badgeAether,
  master: badgeMaster,
};

const AchievementBadge = ({ achievement, size = 'medium', showShare = false }: AchievementBadgeProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
  };

  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  };

  const badgeImage = badgeImages[achievement.element_type] || badgeMaster;

  const shareText = `I just earned the "${achievement.badge_name}" badge on my habit tracking journey! 🎉 #HabitTracker #Consistency`;
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Achievement text copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const shareOnSocial = (platform: string) => {
    const encodedText = encodeURIComponent(shareText);
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}&quote=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.origin}&summary=${encodedText}`,
      reddit: `https://reddit.com/submit?title=${encodedText}&url=${window.location.origin}`,
    };
    
    if (urls[platform as keyof typeof urls]) {
      window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
    }
  };

  const BadgeContent = () => (
    <div className="flex flex-col items-center space-y-2">
      <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5`}>
        <img 
          src={badgeImage} 
          alt={achievement.badge_name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="text-center">
        <h4 className={`font-semibold text-foreground ${textSizeClasses[size]}`}>
          {achievement.badge_name}
        </h4>
        {size !== 'small' && (
          <p className="text-xs text-muted-foreground mt-1">
            {achievement.badge_description}
          </p>
        )}
        <Badge variant="outline" className="mt-2 text-xs">
          {new Date(achievement.earned_at).toLocaleDateString()}
        </Badge>
      </div>
    </div>
  );

  if (showShare) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow bg-card border-border">
            <BadgeContent />
          </Card>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">{achievement.badge_name}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5">
              <img 
                src={badgeImage} 
                alt={achievement.badge_name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <p className="text-muted-foreground mb-4">{achievement.badge_description}</p>
              <p className="text-sm text-muted-foreground">
                Earned on {new Date(achievement.earned_at).toLocaleDateString()}
              </p>
            </div>
            
            <div className="w-full space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex-1 p-3 bg-muted rounded-lg text-sm">
                  {shareText}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                  className="shrink-0"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => shareOnSocial('twitter')}
                  className="text-blue-600 hover:bg-blue-50"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  onClick={() => shareOnSocial('facebook')}
                  className="text-blue-800 hover:bg-blue-50"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  onClick={() => shareOnSocial('linkedin')}
                  className="text-blue-700 hover:bg-blue-50"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
                <Button
                  variant="outline"
                  onClick={() => shareOnSocial('reddit')}
                  className="text-orange-600 hover:bg-orange-50"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Reddit
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card className="p-4 bg-card border-border">
      <BadgeContent />
    </Card>
  );
};

export default AchievementBadge;