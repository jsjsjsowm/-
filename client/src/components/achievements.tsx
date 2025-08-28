import { type Achievement } from "@shared/schema";
import { useState, useEffect } from "react";

interface AchievementsProps {
  achievements: Achievement[];
}

const achievementEmojis: Record<string, string> = {
  'sharpshooter': '🎯',
  'speed_demon': '⚡',
  'coin_collector': '💰',
  'level_up': '📈',
  'first_win': '🥇',
  'daily_player': '📅',
  'perfectionist': '💯',
};

const rarityColors: Record<string, string> = {
  'common': 'from-gray-500 to-gray-600',
  'rare': 'from-blue-500 to-blue-600', 
  'epic': 'from-purple-500 to-purple-600',
  'legendary': 'from-yellow-500 to-yellow-600',
};

export function Achievements({ achievements }: AchievementsProps) {
  const [showNewAchievement, setShowNewAchievement] = useState(false);
  const [celebratingAchievement, setCelebratingAchievement] = useState<Achievement | null>(null);

  const recentAchievements = achievements
    .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
    .slice(0, 3);

  useEffect(() => {
    if (recentAchievements.length > 0) {
      const newest = recentAchievements[0];
      const timeSinceUnlock = Date.now() - new Date(newest.unlockedAt).getTime();
      
      if (timeSinceUnlock < 5000) { // Show celebration for 5 seconds
        setCelebratingAchievement(newest);
        setShowNewAchievement(true);
        
        const timer = setTimeout(() => {
          setShowNewAchievement(false);
          setCelebratingAchievement(null);
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [achievements.length]);

  const getAchievementRarity = (reward: number): string => {
    if (reward >= 500) return 'legendary';
    if (reward >= 200) return 'epic';  
    if (reward >= 100) return 'rare';
    return 'common';
  };

  return (
    <div className="glass-card rounded-xl p-6 relative overflow-hidden">
      {/* Celebration effect */}
      {showNewAchievement && celebratingAchievement && (
        <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="text-center animate-bounce">
            <div className="text-6xl mb-4">{achievementEmojis[celebratingAchievement.type] || '🏆'}</div>
            <div className="text-xl font-bold text-accent mb-2">Achievement Unlocked!</div>
            <div className="text-lg text-primary">{celebratingAchievement.title}</div>
          </div>
          
          {/* Fireworks effect */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="absolute text-accent animate-sparkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  fontSize: '20px'
                }}
              >
                ✨
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-xl neon-blue flex items-center">
            <div className="text-2xl mr-3 animate-float">🏅</div>
            Recent Achievements
          </h3>
          <div className="bg-primary/20 px-3 py-1 rounded-full">
            <span className="text-xs text-primary font-medium">{achievements.length} Total</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {recentAchievements.length > 0 ? (
            recentAchievements.map((achievement, index) => {
              const rarity = getAchievementRarity(achievement.reward);
              const gradient = rarityColors[rarity];
              
              return (
                <div
                  key={achievement.id}
                  className={`relative flex items-center space-x-4 p-4 rounded-xl transition-all duration-500 hover:scale-105 ${
                    index === 0 ? 'animate-glow' : ''
                  }`}
                  style={{
                    background: `linear-gradient(135deg, rgba(${
                      rarity === 'legendary' ? '234, 179, 8' : 
                      rarity === 'epic' ? '147, 51, 234' :
                      rarity === 'rare' ? '59, 130, 246' : '107, 114, 128'
                    }, 0.2), rgba(${
                      rarity === 'legendary' ? '234, 179, 8' : 
                      rarity === 'epic' ? '147, 51, 234' :
                      rarity === 'rare' ? '59, 130, 246' : '107, 114, 128'
                    }, 0.05))`
                  }}
                  data-testid={`achievement-${achievement.type}`}
                >
                  {/* Rarity border */}
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${gradient} opacity-30 blur-sm`}></div>
                  
                  {/* Icon with animation */}
                  <div className="relative z-10">
                    <div className={`text-4xl p-3 rounded-full bg-gradient-to-br ${gradient} shadow-lg ${
                      index === 0 ? 'animate-bounce' : 'animate-float'
                    }`}>
                      {achievementEmojis[achievement.type] || '🏆'}
                    </div>
                    
                    {/* Rarity indicator */}
                    <div className="absolute -top-1 -right-1 text-xs">
                      {rarity === 'legendary' && '👑'}
                      {rarity === 'epic' && '⭐'}
                      {rarity === 'rare' && '💎'}
                    </div>
                  </div>
                  
                  {/* Achievement info */}
                  <div className="flex-1 relative z-10">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-display font-bold text-lg" data-testid="text-achievement-title">
                        {achievement.title}
                      </p>
                      <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                        rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400' :
                        rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
                        rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {rarity.toUpperCase()}
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2" data-testid="text-achievement-description">
                      {achievement.description}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {/* Reward display */}
                  <div className="text-right relative z-10">
                    <div className="glass-card p-3 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <div className="text-xl animate-bounce">🪙</div>
                        <div className="font-display font-bold text-accent text-xl">
                          +{achievement.reward}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">Coins</div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 animate-float">🏆</div>
              <h4 className="font-display font-bold text-xl mb-2">No Achievements Yet</h4>
              <p className="text-muted-foreground mb-4">Start playing to unlock amazing rewards!</p>
              
              {/* Preview achievements */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                {Object.entries(achievementEmojis).slice(0, 3).map(([type, emoji]) => (
                  <div key={type} className="glass-card p-3 rounded-xl opacity-50">
                    <div className="text-2xl mb-2">{emoji}</div>
                    <div className="text-xs text-muted-foreground">???</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Achievement progress bar */}
        {achievements.length > 0 && (
          <div className="mt-6 p-4 glass-card rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Achievement Hunter</span>
              <span className="text-sm text-muted-foreground">{achievements.length}/50</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(achievements.length / 50) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
