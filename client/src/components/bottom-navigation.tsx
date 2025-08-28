import { Button } from "@/components/ui/button";

interface BottomNavigationProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
}

const tabs = [
  { id: 'home', emoji: '🏠', label: 'Home', color: 'text-blue-400' },
  { id: 'shop', emoji: '🛒', label: 'Shop', color: 'text-green-400' },
  { id: 'inventory', emoji: '🎒', label: 'Items', color: 'text-purple-400' },
  { id: 'friends', emoji: '👥', label: 'Friends', color: 'text-pink-400' },
  { id: 'profile', emoji: '👤', label: 'Profile', color: 'text-orange-400' },
];

export function BottomNavigation({ activeTab, onNavigate }: BottomNavigationProps) {
  return (
    <nav className="sticky bottom-0 glass border-t border-primary/20 relative">
      {/* Navigation glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none"></div>
      
      <div className="container max-w-md mx-auto px-2 py-3 relative z-10">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                variant="ghost"
                className={`flex flex-col items-center p-3 h-auto min-w-0 relative transition-all duration-300 ${
                  isActive
                    ? "scale-110"
                    : "hover:scale-105"
                }`}
                onClick={() => onNavigate(tab.id)}
                data-testid={`button-navigate-${tab.id}`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse-glow"></div>
                )}
                
                {/* Icon with glow effect */}
                <div className={`relative mb-1 transition-all duration-300 ${
                  isActive ? 'animate-bounce' : 'animate-float'
                }`}>
                  <div className={`text-2xl ${
                    isActive ? 'animate-pulse-glow' : ''
                  }`}>
                    {tab.emoji}
                  </div>
                  
                  {/* Notification dot for some tabs */}
                  {tab.id === 'shop' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse">
                      <div className="absolute inset-0 bg-red-400 rounded-full animate-ping"></div>
                    </div>
                  )}
                  
                  {tab.id === 'friends' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse flex items-center justify-center">
                      <span className="text-xs font-bold text-white">2</span>
                    </div>
                  )}
                </div>
                
                {/* Label with color effect */}
                <span className={`text-xs font-medium transition-all duration-300 ${
                  isActive
                    ? "text-primary font-bold neon-blue"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}>
                  {tab.label}
                </span>
                
                {/* Background glow for active tab */}
                {isActive && (
                  <div className="absolute inset-0 bg-primary/10 rounded-xl -z-10 animate-pulse"></div>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
