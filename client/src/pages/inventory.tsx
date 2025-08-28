import { AppHeader } from "@/components/app-header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface InventoryProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export default function Inventory({ activeTab, onNavigate }: InventoryProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <AppHeader />

      <main className="container max-w-md mx-auto px-4 py-6 space-y-6 pb-20">
        <div className="text-center">
          <div className="text-6xl mb-4">🎒</div>
          <h1 className="text-2xl font-display font-bold mb-2">Inventory</h1>
          <p className="text-muted-foreground">Manage your items and power-ups</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">📦</div>
              <h2 className="text-xl font-semibold mb-2">Empty Inventory</h2>
              <p className="text-muted-foreground mb-4">
                You don't have any items yet. Play games and visit the shop to collect items!
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => onNavigate('home')} data-testid="button-play-games">
                  Play Games
                </Button>
                <Button variant="outline" onClick={() => onNavigate('shop')} data-testid="button-visit-shop">
                  Visit Shop
                </Button>
              </div>
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
