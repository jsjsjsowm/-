import { type Player, type User } from "@shared/schema";
import { useState, useEffect } from "react";

interface PlayerStatsProps {
  user: User | null;
  player: Player | null;
}

export function PlayerStats({ user, player }: PlayerStatsProps) {
  const [coinFlip, setCoinFlip] = useState(false);
  const [levelGlow, setLevelGlow] = useState(false);

  useEffect(() => {
    const coinInterval = setInterval(() => {
      setCoinFlip(prev => !prev);
    }, 2000);

    return () => clearInterval(coinInterval);
  }, []);

  useEffect(() => {
    if (player?.level && player.level > 1) {
      setLevelGlow(true);
      const timer = setTimeout(() => setLevelGlow(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [player?.level]);

  if (!user || !player) {
    return null;
  }

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "??";
  };

  const getExpProgress = () => {
    const currentLevelExp = (player.level - 1) * 1000;
    const nextLevelExp = player.level * 1000;
    const currentExp = player.experience - currentLevelExp;
    const maxExp = nextLevelExp - currentLevelExp;
    return {
      currentExp,
      maxExp,
      percentage: (currentExp / maxExp) * 100
    };
  };

  const expProgress = getExpProgress();

  return (
    <div className="glass-card rounded-xl p-6 relative overflow-hidden neon-border">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 animate-pulse"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-primary via-blue-500 to-accent rounded-full flex items-center justify-center shadow-2xl animate-glow">
                <span className="text-white font-bold text-xl neon-blue" data-testid="text-user-initials">
                  {getInitials(user.firstName, user.lastName)}
                </span>
              </div>
              {/* Floating rank indicator */}
              <div className={`absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-accent to-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-black shadow-lg ${levelGlow ? 'animate-pulse-glow' : 'animate-float'}`}>
                {player.level}
              </div>
            </div>
            <div>
              <h2 className="font-display font-bold text-xl neon-blue mb-1" data-testid="text-user-name">
                {user.firstName || user.username || "Anonymous"}
              </h2>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 bg-primary/20 px-2 py-1 rounded-full">
                  <div className="text-primary">⚡</div>
                  <span className="text-sm font-medium text-primary">Level</span>
                  <span className="text-sm font-bold text-primary" data-testid="text-player-level">{player.level}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end space-x-2 mb-1">
              <div className={`text-3xl ${coinFlip ? 'animate-coin-flip' : ''}`}>🪙</div>
              <p className="text-3xl font-display font-bold neon-yellow" data-testid="text-player-coins">
                {player.coins.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center justify-end space-x-1">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span className="text-accent text-sm font-medium">Coins</span>
            </div>
          </div>
        </div>
        
        {/* Enhanced XP Progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="text-primary">📈</div>
              <span className="text-sm font-medium text-muted-foreground">Experience Progress</span>
            </div>
            <div className="flex items-center space-x-1 bg-secondary/50 px-3 py-1 rounded-full">
              <span className="text-sm text-primary font-mono" data-testid="text-current-exp">{expProgress.currentExp}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-sm text-accent font-mono" data-testid="text-max-exp">{expProgress.maxExp}</span>
              <div className="text-xs">✨</div>
            </div>
          </div>
          
          <div className="relative">
            <div className="w-full bg-slate-800/50 rounded-full h-3 shadow-inner">
              <div 
                className="bg-gradient-to-r from-primary via-blue-400 to-accent h-3 rounded-full transition-all duration-1000 ease-out shadow-lg animate-pulse-glow relative overflow-hidden"
                style={{ width: `${expProgress.percentage}%` }}
                data-testid="progress-experience"
              >
                {/* Animated shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-pulse"></div>
              </div>
            </div>
            <div className="absolute right-2 top-0 text-xs text-white/90 font-bold mt-0.5">
              {Math.round(expProgress.percentage)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
