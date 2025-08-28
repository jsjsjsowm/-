import { AppHeader } from "@/components/app-header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ShopProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export default function Shop({ activeTab, onNavigate }: ShopProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <AppHeader />

      <main className="container max-w-md mx-auto px-4 py-6 space-y-6 pb-20">
        <div className="text-center">
          <div className="text-6xl mb-4">🛍️</div>
          <h1 className="text-2xl font-display font-bold mb-2">Shop</h1>
          <p className="text-muted-foreground">Purchase power-ups and cosmetics</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🚧</div>
              <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
              <p className="text-muted-foreground mb-4">
                The shop feature is currently under development. Check back soon for awesome items!
              </p>
              <Button onClick={() => onNavigate('home')} data-testid="button-back-home">
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
