import { AppHeader } from "@/components/app-header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTelegram } from "@/hooks/use-telegram";
import { useQuery } from "@tanstack/react-query";
import { type Player } from "@shared/schema";

interface ProfileProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export default function Profile({ activeTab, onNavigate }: ProfileProps) {
  const { user, isAuthenticated } = useTelegram();

  const { data: player } = useQuery<Player>({
    queryKey: ["/api/player", user?.id],
    enabled: !!user?.id && isAuthenticated,
  });

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-muted-foreground">Please authenticate with Telegram</p>
        </div>
      </div>
    );
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "??";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <AppHeader />

      <main className="container max-w-md mx-auto px-4 py-6 space-y-6 pb-20">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl" data-testid="text-profile-initials">
                  {getInitials(user.first_name, user.last_name)}
                </span>
              </div>
              <h1 className="text-2xl font-display font-bold mb-2" data-testid="text-profile-name">
                {user.first_name || user.username || "Anonymous"}
              </h1>
              {user.username && (
                <p className="text-muted-foreground mb-4">@{user.username}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {player && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Game Statistics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-display font-bold text-primary" data-testid="text-stat-level">
                    {player.level}
                  </div>
                  <div className="text-sm text-muted-foreground">Level</div>
                </div>
                <div className="text-center p-3 bg-accent/10 rounded-lg">
                  <div className="text-2xl font-display font-bold text-accent" data-testid="text-stat-coins">
                    {player.coins.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Coins</div>
                </div>
                <div className="text-center p-3 bg-secondary rounded-lg">
                  <div className="text-2xl font-display font-bold" data-testid="text-stat-games">
                    {player.gamesPlayed}
                  </div>
                  <div className="text-sm text-muted-foreground">Games</div>
                </div>
                <div className="text-center p-3 bg-secondary rounded-lg">
                  <div className="text-2xl font-display font-bold" data-testid="text-stat-score">
                    {player.totalScore.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" data-testid="button-sound-settings">
                <i className="fas fa-volume-up mr-3"></i>
                Sound Settings
              </Button>
              <Button variant="outline" className="w-full justify-start" data-testid="button-privacy-settings">
                <i className="fas fa-shield-alt mr-3"></i>
                Privacy Settings
              </Button>
              <Button variant="outline" className="w-full justify-start" data-testid="button-about">
                <i className="fas fa-info-circle mr-3"></i>
                About Game
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation
        activeTab={activeTab}
        onNavigate={onNavigate}
      />
    </div>
  );
}
