import { Button } from "@/components/ui/button";
import { type LeaderboardEntry, type User } from "@shared/schema";
import { useState, useEffect } from "react";

interface LeaderboardProps {
  leaderboard: (LeaderboardEntry & { user: User })[];
  onViewAll: () => void;
}

export function Leaderboard({ leaderboard, onViewAll }: LeaderboardProps) {
  const [animatedEntries, setAnimatedEntries] = useState<number[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimatedEntries(prev => {
        const newEntries = [...prev];
        if (newEntries.length < leaderboard.length) {
          newEntries.push(newEntries.length);
        } else {
          newEntries.shift();
          newEntries.push(Math.floor(Math.random() * leaderboard.length));
        }
        return newEntries;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [leaderboard.length]);

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 0: return "👑";
      case 1: return "🥈";
      case 2: return "🥉";
      default: return "🏅";
    }
  };

  const getRankGradient = (rank: number) => {
    switch (rank) {
      case 0: return "from-yellow-400 via-yellow-500 to-yellow-600";
      case 1: return "from-gray-400 via-gray-500 to-gray-600";
      case 2: return "from-amber-600 via-amber-700 to-amber-800";
      default: return "from-slate-600 via-slate-700 to-slate-800";
    }
  };

  return (
    <div className="glass-card rounded-xl p-6 relative overflow-hidden">
      {/* Animated crown particles for #1 */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-400/30 animate-float"
            style={{
              left: `${10 + i * 12}%`,
              top: `${10 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.5}s`,
              fontSize: '12px'
            }}
          >
            ✨
          </div>
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-xl neon-yellow flex items-center">
            <div className="text-2xl mr-3 animate-bounce">🏆</div>
            Leaderboard
          </h3>
          <div className="flex items-center space-x-2">
            <div className="bg-primary/20 px-3 py-1 rounded-full">
              <span className="text-xs text-primary font-medium">TOP 5</span>
            </div>
            <Button 
              variant="ghost"
              size="sm"
              className="glass-card hover:bg-accent/20 text-accent hover:text-accent text-sm"
              onClick={onViewAll}
              data-testid="button-view-leaderboard"
            >
              View All →
            </Button>
          </div>
        </div>
        
        <div className="space-y-3">
          {leaderboard.slice(0, 5).map((entry, index) => {
            const isAnimated = animatedEntries.includes(index);
            
            return (
              <div
                key={entry.id}
                className={`relative flex items-center justify-between p-4 rounded-xl transition-all duration-500 ${
                  index === 0
                    ? "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-2 border-yellow-500/50 shadow-2xl animate-glow"
                    : index === 1
                    ? "bg-gradient-to-r from-gray-400/20 to-slate-400/20 border border-gray-400/30"
                    : index === 2
                    ? "bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-600/30"
                    : "glass-card border-border/50"
                } ${isAnimated ? 'scale-105 animate-pulse-glow' : ''}`}
                data-testid={`leaderboard-entry-${index + 1}`}
              >
                {/* Rank indicator */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getRankGradient(index)} rounded-full flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-display font-bold">#{index + 1}</span>
                    </div>
                    <div className="absolute -top-1 -right-1 text-lg animate-bounce">
                      {getRankEmoji(index)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <p className={`font-bold text-lg ${
                        index === 0 ? "neon-yellow" : ""
                      }`} data-testid={`text-player-name-${index + 1}`}>
                        {entry.user.firstName || entry.user.username || "Anonymous"}
                      </p>
                      {index === 0 && (
                        <div className="bg-yellow-500/20 px-2 py-1 rounded-full">
                          <span className="text-xs font-bold text-yellow-400">CHAMPION</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <p className="text-muted-foreground text-sm">
                        Level {Math.floor(entry.score / 1000) + 1}
                      </p>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-400">ACTIVE</span>
                    </div>
                  </div>
                </div>
                
                {/* Score display */}
                <div className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <div className={`text-2xl font-display font-bold ${
                      index === 0 ? "neon-yellow animate-pulse" : 
                      index === 1 ? "text-gray-300" :
                      index === 2 ? "text-amber-400" : ""
                    }`} data-testid={`text-player-score-${index + 1}`}>
                      {entry.score.toLocaleString()}
                    </div>
                    <div className="text-lg">🔥</div>
                  </div>
                  <div className="flex items-center justify-end space-x-1 mt-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-muted-foreground text-xs">points</span>
                  </div>
                </div>

                {/* Special effects for #1 */}
                {index === 0 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 animate-pulse rounded-xl"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Competition status */}
        <div className="mt-6 glass-card p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl animate-pulse">⚔️</div>
              <div>
                <h4 className="font-semibold text-primary">Season 2024-Q1</h4>
                <p className="text-xs text-muted-foreground">Weekly rankings reset</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-primary font-bold">6d 12h left</div>
              <div className="text-xs text-muted-foreground">Season ends</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
