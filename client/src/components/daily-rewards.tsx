import { Button } from "@/components/ui/button";
import { type DailyReward } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface DailyRewardsProps {
  userId: string;
  rewards: DailyReward[];
}

const rewardValues = [100, 150, 200, 250, 300, 400, 500];
const rewardEmojis = ["🪙", "💰", "💎", "🌟", "⭐", "🏆", "👑"];
const rewardRarity = ["Common", "Common", "Rare", "Common", "Epic", "Rare", "Legendary"];

export function DailyRewards({ userId, rewards }: DailyRewardsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let newSeconds = prev.seconds - 1;
        let newMinutes = prev.minutes;
        let newHours = prev.hours;

        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
        }
        if (newMinutes < 0) {
          newMinutes = 59;
          newHours -= 1;
        }
        if (newHours < 0) {
          newHours = 23;
          newMinutes = 59;
          newSeconds = 59;
        }

        return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const claimRewardMutation = useMutation({
    mutationFn: async (day: number) => {
      const response = await apiRequest("POST", `/api/daily-rewards/${userId}/claim`, { day });
      return response.json();
    },
    onSuccess: (data) => {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
      
      toast({
        title: "🎉 Reward Claimed!",
        description: `You earned ${data.coinsEarned} coins!`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/daily-rewards", userId] });
      queryClient.invalidateQueries({ queryKey: ["/api/player", userId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const canClaimAny = rewards.some(reward => !reward.claimed);
  const nextReward = rewards.find(reward => !reward.claimed);
  const claimedCount = rewards.filter(r => r.claimed).length;

  return (
    <div className="glass-card rounded-xl p-6 relative overflow-hidden">
      {/* Celebration effect */}
      {showCelebration && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="text-6xl animate-bounce">🎉</div>
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display font-bold text-xl neon-yellow flex items-center">
            <div className="text-2xl mr-3 animate-float">🎁</div>
            Daily Rewards
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            <div className="bg-accent/20 px-2 py-1 rounded-full">
              <span className="text-xs text-accent font-medium">{claimedCount}/7 Claimed</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="bg-primary/20 px-3 py-2 rounded-xl neon-border">
            <div className="flex items-center text-primary text-sm font-mono">
              <div className="text-lg mr-2">⏰</div>
              <div>
                <div className="text-xs text-muted-foreground">Resets in</div>
                <div data-testid="text-time-left" className="font-bold">
                  {String(timeLeft.hours).padStart(2, '0')}:
                  {String(timeLeft.minutes).padStart(2, '0')}:
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reward Grid */}
      <div className="grid grid-cols-7 gap-3 mb-6">
        {rewards.map((reward, index) => {
          const isClaimable = !reward.claimed && (index === 0 || rewards[index - 1]?.claimed);
          const rarity = rewardRarity[index];
          
          return (
            <div
              key={reward.id}
              className={`relative flex flex-col items-center p-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                reward.claimed
                  ? "glass-card border-primary/50 animate-pulse-glow"
                  : isClaimable
                  ? `animate-glow cursor-pointer ${
                      rarity === "Legendary" ? "bg-gradient-to-br from-purple-500 to-pink-500" :
                      rarity === "Epic" ? "bg-gradient-to-br from-accent to-orange-500" :
                      rarity === "Rare" ? "bg-gradient-to-br from-blue-500 to-cyan-500" :
                      "bg-gradient-to-br from-primary to-blue-600"
                    }`
                  : "glass-card opacity-60"
              }`}
              data-testid={`reward-day-${reward.day}`}
            >
              {/* Rarity indicator */}
              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center ${
                rarity === "Legendary" ? "bg-purple-500 animate-pulse" :
                rarity === "Epic" ? "bg-orange-500 animate-pulse" :
                rarity === "Rare" ? "bg-blue-500" :
                "bg-gray-500"
              }`}>
                {rarity === "Legendary" ? "👑" : 
                 rarity === "Epic" ? "⭐" :
                 rarity === "Rare" ? "💎" : ""}
              </div>
              
              <div className="text-2xl mb-2 animate-float">
                {rewardEmojis[index]}
              </div>
              
              <div className="text-center">
                <div className={`text-sm font-bold mb-1 ${
                  reward.claimed ? "text-primary" : 
                  isClaimable ? "text-white" : "text-muted-foreground"
                }`}>
                  {rewardValues[index]}
                </div>
                <div className={`text-xs ${
                  reward.claimed ? "text-primary/80" : 
                  isClaimable ? "text-white/80" : "text-muted-foreground"
                }`}>
                  Day {reward.day}
                </div>
              </div>
              
              {reward.claimed && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-primary/90 rounded-full flex items-center justify-center animate-pulse">
                    <div className="text-white text-lg">✓</div>
                  </div>
                </div>
              )}
              
              {isClaimable && !reward.claimed && (
                <div className="absolute -inset-1 bg-gradient-to-r from-accent via-primary to-accent rounded-xl opacity-75 animate-pulse"></div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Claim Button */}
      <Button 
        className={`w-full h-14 text-lg font-bold transition-all duration-300 transform ${
          canClaimAny 
            ? "animate-rainbow hover:scale-105 shadow-2xl" 
            : "bg-gray-600 cursor-not-allowed"
        }`}
        onClick={() => nextReward && claimRewardMutation.mutate(nextReward.day)}
        disabled={!canClaimAny || claimRewardMutation.isPending}
        data-testid="button-claim-daily-reward"
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="text-2xl">
            {claimRewardMutation.isPending ? "⏳" : canClaimAny ? "🎁" : "⏰"}
          </div>
          <span>
            {claimRewardMutation.isPending 
              ? "Claiming Reward..." 
              : canClaimAny 
              ? `Claim Day ${nextReward?.day} Reward!` 
              : "Come Back Tomorrow!"}
          </span>
        </div>
      </Button>
    </div>
  );
}
