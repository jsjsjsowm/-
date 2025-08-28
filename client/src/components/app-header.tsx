import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AppHeaderProps {
  onToggleSound?: () => void;
  onOpenSettings?: () => void;
}

export function AppHeader({ onToggleSound, onOpenSettings }: AppHeaderProps) {
  const [particles] = useState(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }))
  );

  return (
    <header className="sticky top-0 z-50 glass border-b border-primary/20 relative overflow-hidden">
      {/* Animated particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-sparkle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>
      
      <div className="container max-w-md mx-auto px-4 py-3 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary via-blue-500 to-accent rounded-xl flex items-center justify-center animate-pulse-glow shadow-lg">
              <div className="text-lg animate-float">🎮</div>
            </div>
            <div>
              <h1 className="font-display font-bold text-xl neon-blue">CryptoQuest</h1>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">ONLINE</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggleSound}
              className="glass-card hover:bg-primary/20 transition-all duration-300 hover:scale-110"
              data-testid="button-toggle-sound"
            >
              <div className="text-primary animate-pulse">🔊</div>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onOpenSettings}
              className="glass-card hover:bg-accent/20 transition-all duration-300 hover:scale-110"
              data-testid="button-open-settings"
            >
              <div className="text-accent">⚙️</div>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
