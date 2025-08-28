import { useQuery } from "@tanstack/react-query";
import { AppHeader } from "@/components/app-header";
import { PlayerStats } from "@/components/player-stats";
import { DailyRewards } from "@/components/daily-rewards";
import { GameModes } from "@/components/game-modes";
import { Leaderboard } from "@/components/leaderboard";
import { Achievements } from "@/components/achievements";
import { BottomNavigation } from "@/components/bottom-navigation";
import { useTelegram } from "@/hooks/use-telegram";
import { useToast } from "@/hooks/use-toast";
import { type Player, type DailyReward, type Achievement, type LeaderboardEntry, type User } from "@shared/schema";

interface HomeProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export default function Home({ activeTab, onNavigate }: HomeProps) {
  const { user, isAuthenticated } = useTelegram();
  const { toast } = useToast();

  const { data: player, isLoading: playerLoading } = useQuery<Player>({
    queryKey: ["/api/player", user?.id],
    enabled: !!user?.id && isAuthenticated,
  });

  const { data: dailyRewards = [], isLoading: rewardsLoading } = useQuery<DailyReward[]>({
    queryKey: ["/api/daily-rewards", user?.id],
    enabled: !!user?.id && isAuthenticated,
  });

  const { data: achievements = [], isLoading: achievementsLoading } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements", user?.id],
    enabled: !!user?.id && isAuthenticated,
  });

  const { data: leaderboard = [], isLoading: leaderboardLoading } = useQuery<(LeaderboardEntry & { user: User })[]>({
    queryKey: ["/api/leaderboard"],
    enabled: isAuthenticated,
  });

  const handleStartQuickPlay = () => {
    toast({
      title: "Quick Play",
      description: "Quick play mode coming soon!",
    });
  };

  const handleJoinTournament = () => {
    toast({
      title: "Tournament",
      description: "Tournament mode coming soon!",
    });
  };

  const handleStartChallenge = () => {
    toast({
      title: "Daily Challenge",
      description: "Daily challenge mode coming soon!",
    });
  };

  const handleViewLeaderboard = () => {
    toast({
      title: "Leaderboard",
      description: "Full leaderboard coming soon!",
    });
  };

  const handleToggleSound = () => {
    toast({
      title: "Sound",
      description: "Sound settings coming soon!",
    });
  };

  const handleOpenSettings = () => {
    toast({
      title: "Settings",
      description: "Settings page coming soon!",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🎮</div>
          <h1 className="text-2xl font-display font-bold mb-2">Welcome to CryptoQuest</h1>
          <p className="text-muted-foreground">Please open this game in Telegram</p>
        </div>
      </div>
    );
  }

  const isLoading = playerLoading || rewardsLoading || achievementsLoading || leaderboardLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-primary/20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              fontSize: `${8 + Math.random() * 6}px`
            }}
          >
            ✨
          </div>
        ))}
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        ></div>
        
        {/* Gradient orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <AppHeader 
        onToggleSound={handleToggleSound}
        onOpenSettings={handleOpenSettings}
      />

      <main className="container max-w-md mx-auto px-4 py-6 space-y-6 pb-20">
        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <PlayerStats 
              user={user ? {
                id: user.id.toString(),
                telegramId: user.id.toString(),
                username: user.username || null,
                firstName: user.first_name || null,
                lastName: user.last_name || null,
                photoUrl: user.photo_url || null,
                createdAt: new Date(),
              } : null}
              player={player || null}
            />

            {dailyRewards.length > 0 && user && (
              <DailyRewards 
                userId={user.id.toString()}
                rewards={dailyRewards}
              />
            )}

            <GameModes
              onStartQuickPlay={handleStartQuickPlay}
              onJoinTournament={handleJoinTournament}
              onStartChallenge={handleStartChallenge}
            />

            <Leaderboard
              leaderboard={leaderboard}
              onViewAll={handleViewLeaderboard}
            />

            <Achievements achievements={achievements} />
          </>
        )}
      </main>

      <BottomNavigation
        activeTab={activeTab}
        onNavigate={onNavigate}
      />
    </div>
  );
}
