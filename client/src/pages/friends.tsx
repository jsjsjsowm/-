import { AppHeader } from "@/components/app-header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FriendsProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export default function Friends({ activeTab, onNavigate }: FriendsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <AppHeader />

      <main className="container max-w-md mx-auto px-4 py-6 space-y-6 pb-20">
        <div className="text-center">
          <div className="text-6xl mb-4">👥</div>
          <h1 className="text-2xl font-display font-bold mb-2">Friends</h1>
          <p className="text-muted-foreground">Connect and compete with friends</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <h2 className="text-xl font-semibold mb-2">Invite Friends</h2>
              <p className="text-muted-foreground mb-4">
                Share the game with your Telegram friends and earn rewards together!
              </p>
              <Button className="w-full" data-testid="button-invite-friends">
                <i className="fas fa-share mr-2"></i>
                Share Game
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h2 className="text-xl font-semibold mb-2">Friends Leaderboard</h2>
              <p className="text-muted-foreground mb-4">
                Coming soon! See how you rank against your friends.
              </p>
              <Button variant="outline" onClick={() => onNavigate('home')} data-testid="button-back-home">
                Back to Home
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
