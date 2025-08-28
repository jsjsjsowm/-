import { Button } from "@/components/ui/button";
import { useState } from "react";

interface GameModesProps {
  onStartQuickPlay: () => void;
  onJoinTournament: () => void;
  onStartChallenge: () => void;
}

export function GameModes({ onStartQuickPlay, onJoinTournament, onStartChallenge }: GameModesProps) {
  const [hoveredMode, setHoveredMode] = useState<string | null>(null);

  const gameModes = [
    {
      id: 'quick-play',
      title: 'Quick Play',
      description: 'Fast 3-minute rounds',
      emoji: '⚡',
      reward: '+10-50 coins',
      gradient: 'from-primary via-blue-500 to-blue-600',
      hoverGradient: 'from-primary/90 via-blue-500/90 to-blue-600/90',
      onClick: onStartQuickPlay,
      testId: 'button-quick-play',
      status: 'ACTIVE',
      players: '1,247 online'
    },
    {
      id: 'tournament',
      title: 'Tournament',
      description: 'Compete with others',
      emoji: '🏆',
      reward: '+100-1000 coins',
      gradient: 'from-accent via-orange-500 to-yellow-500',
      hoverGradient: 'from-accent/90 via-orange-500/90 to-yellow-500/90',
      onClick: onJoinTournament,
      testId: 'button-tournament',
      status: 'STARTING SOON',
      players: '64/128 players'
    },
    {
      id: 'challenge',
      title: 'Daily Challenge',
      description: 'Special objectives',
      emoji: '💎',
      reward: '+50-200 coins',
      gradient: 'from-purple-600 via-pink-500 to-purple-700',
      hoverGradient: 'from-purple-600/90 via-pink-500/90 to-purple-700/90',
      onClick: onStartChallenge,
      testId: 'button-challenge',
      status: '6H LEFT',
      players: 'Solo mission'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-xl neon-blue flex items-center">
          <div className="text-2xl mr-3 animate-float">🎮</div>
          Game Modes
        </h3>
        <div className="flex items-center space-x-1 bg-green-500/20 px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-400 font-medium">LIVE</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {gameModes.map((mode) => (
          <div
            key={mode.id}
            className="glass-card rounded-xl p-1 relative overflow-hidden"
            onMouseEnter={() => setHoveredMode(mode.id)}
            onMouseLeave={() => setHoveredMode(null)}
          >
            {/* Animated border effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${mode.gradient} opacity-75 rounded-xl transition-opacity duration-300 ${hoveredMode === mode.id ? 'opacity-100' : 'opacity-50'}`}></div>
            
            <Button
              className="w-full h-auto bg-transparent hover:bg-transparent p-6 relative z-10"
              onClick={mode.onClick}
              data-testid={mode.testId}
            >
              <div className="flex items-center justify-between w-full text-left">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className={`text-4xl transition-transform duration-300 ${hoveredMode === mode.id ? 'scale-125 animate-bounce' : 'animate-float'}`}>
                      {mode.emoji}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xl text-white mb-1">{mode.title}</h4>
                    <p className="text-white/90 text-sm mb-2">{mode.description}</p>
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 px-2 py-1 rounded-full">
                        <span className="text-xs font-medium text-white">{mode.status}</span>
                      </div>
                      <div className="text-xs text-white/80">{mode.players}</div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-white/20 px-3 py-2 rounded-xl backdrop-blur-sm">
                    <div className="text-sm font-bold text-white mb-1">{mode.reward}</div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                      <span className="text-xs text-white/80">Reward</span>
                    </div>
                  </div>
                </div>
              </div>
            </Button>
          </div>
        ))}
      </div>
      
      {/* Special Event Banner */}
      <div className="glass-card rounded-xl p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl animate-pulse">🌟</div>
            <div>
              <h4 className="font-semibold text-purple-300">Weekend Event</h4>
              <p className="text-xs text-purple-400">Double rewards for all modes!</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-purple-300">Ends in</div>
            <div className="text-sm font-bold text-purple-200">2d 15h</div>
          </div>
        </div>
      </div>
    </div>
  );
}
